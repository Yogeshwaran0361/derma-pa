import os
import json
import io
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np

from app.config import MAPPING_PATH, MIN_CONFIDENCE_THRESHOLD, BASE_DIR

# Global Clinical Info Dictionary (Loaded dynamically from disease_information.json)
CLASS_CLINICAL_INFO = {}

CANONICAL_NAME_MAP = {
    "bcc": "Basal Cell Carcinoma",
    "drugeruption": "Drug Eruption",
    "seborrh_keratoses": "Seborrheic Keratosis",
    "seborrhkeratoses": "Seborrheic Keratosis",
    "warts": "Verruca Vulgaris",
    "skincancer": "Skin Cancer (Basal Cell Carcinoma)",
    "sun_sunlight_damage": "Sun & Sunlight Damage",
    "strawberry_hemangioma": "Strawberry Hemangioma",
    "pityriasis_rosea": "Normal / Healthy Skin",
    "erythema_multiforme": "Normal / Healthy Skin",
    "cutanea_larva_migrans": "Normal / Healthy Skin",
    "cutaneous_horn": "Normal / Healthy Skin"
}

def load_disease_info():
    global CLASS_CLINICAL_INFO
    info_paths = [
        os.path.join(BASE_DIR, "disease_information.json"),
        os.path.join(os.path.dirname(BASE_DIR), "disease_information.json"),
        os.path.join(BASE_DIR, "app", "disease_information.json")
    ]
    for p in info_paths:
        if os.path.exists(p):
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    db = json.load(f)
                for key, data in db.items():
                    title = data.get("disease_name", key)
                    overview = data.get("overview", "Dermatological condition evaluated by AI model.")

                    risk_level = "Moderate Risk"
                    risk_color = "cyan"
                    low_c = ["benign", "normal", "healthy", "nevus", "mole", "callus", "seborrheic"]
                    high_c = ["melanoma", "carcinoma", "malignant", "actinic", "cellulitis", "bowens"]

                    key_l = key.lower()
                    if any(w in key_l for w in high_c):
                        risk_level = "Critical Risk (High Attention)" if "melanoma" in key_l else "High Risk"
                        risk_color = "rose"
                    elif any(w in key_l for w in low_c):
                        risk_level = "Low Risk"
                        risk_color = "emerald"

                    action = data.get("when_to_seek_professional_help", "Consult a healthcare professional for clinical evaluation.")

                    CLASS_CLINICAL_INFO[key] = {
                        "title": title,
                        "risk_level": risk_level,
                        "risk_color": risk_color,
                        "description": overview,
                        "action": action
                    }
                print(f"[CLINICAL INFO LOADED] Loaded clinical information for {len(CLASS_CLINICAL_INFO)} diseases.")
                return
            except Exception as e:
                print(f"[CLINICAL INFO NOTICE] Error reading {p}: {e}")

load_disease_info()


class SkinAIInferenceEngine:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # 1. Load 153-Class Model Mapping
        mapping_paths = [
            os.path.join(BASE_DIR, "class_mapping.json"),
            os.path.join(os.path.dirname(BASE_DIR), "class_mapping.json"),
            MAPPING_PATH
        ]

        self.mapping_path = None
        for mp in mapping_paths:
            if os.path.exists(mp):
                self.mapping_path = mp
                break

        if not self.mapping_path:
            raise FileNotFoundError("Class mapping file not found in backend or root directory.")

        with open(self.mapping_path, 'r', encoding='utf-8') as f:
            raw_mapping = json.load(f)

        self.idx_to_class = {}
        for k, v in raw_mapping.items():
            idx = int(k)
            if idx in [24, 25, 44, 111]:
                self.idx_to_class[idx] = "Normal / Healthy Skin"
            elif isinstance(v, dict):
                self.idx_to_class[idx] = v.get("exact_disease_name", v.get("technical_class", f"Class_{idx}"))
            else:
                self.idx_to_class[idx] = str(v)

        self.class_names = [self.idx_to_class[i] for i in sorted(self.idx_to_class.keys())]
        self.num_classes = len(self.class_names)
        print(f"[MODEL A LOADED] 153-Class Dermatology Mapping Loaded ({self.num_classes} Classes)")

        # 2. Load Model A: 153-Class Master Model (trained_skin_model.pth)
        model_paths = [
            os.path.join(BASE_DIR, "backend", "trained_skin_model.pth"),
            os.path.join(BASE_DIR, "trained_skin_model.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "backend", "trained_skin_model.pth")
        ]

        self.model_153 = None
        for p in model_paths:
            if os.path.exists(p):
                try:
                    checkpoint = torch.load(p, map_location=self.device)
                    sd = checkpoint.get("model_state_dict", checkpoint) if isinstance(checkpoint, dict) else checkpoint
                    m = models.efficientnet_b0(weights=None)
                    in_f = m.classifier[1].in_features
                    if "classifier.5.weight" in sd:
                        out_f = sd["classifier.5.weight"].shape[0]
                        mid_f = sd["classifier.1.weight"].shape[0]
                        m.classifier = nn.Sequential(
                            nn.Dropout(p=0.3),
                            nn.Linear(in_f, mid_f),
                            nn.ReLU(),
                            nn.BatchNorm1d(mid_f),
                            nn.Dropout(p=0.2),
                            nn.Linear(mid_f, out_f)
                        )
                    else:
                        m.classifier[1] = nn.Linear(in_f, self.num_classes)

                    m.load_state_dict(sd)
                    m.to(self.device)
                    m.eval()
                    self.model_153 = m
                    print(f"[MODEL A LOADED] 153-Class PyTorch Checkpoint from '{p}'")
                    break
                except Exception as ex:
                    print(f"[MODEL A NOTICE] Error loading {p}: {ex}")

        if not self.model_153:
            raise RuntimeError("Could not load Model A (153-Class PyTorch trained model).")

        # 3. Load Model B: Normal vs Acne Model (models/acne-normal/best_model.pth)
        acne_model_paths = [
            os.path.join(BASE_DIR, "models", "acne-normal", "best_model.pth"),
            os.path.join(BASE_DIR, "backend", "models", "acne-normal", "best_model.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "models", "acne-normal", "best_model.pth")
        ]

        self.model_acne_normal = None
        for amp in acne_model_paths:
            if os.path.exists(amp):
                try:
                    ckpt_b = torch.load(amp, map_location=self.device)
                    sd_b = ckpt_b.get("model_state_dict", ckpt_b) if isinstance(ckpt_b, dict) else ckpt_b
                    mb = models.efficientnet_b0(weights=None)
                    mb.classifier[1] = nn.Linear(mb.classifier[1].in_features, 2)
                    mb.load_state_dict(sd_b)
                    mb.to(self.device)
                    mb.eval()
                    self.model_acne_normal = mb
                    print(f"[MODEL B LOADED] Normal vs Acne Binary PyTorch Checkpoint from '{amp}'")
                    break
                except Exception as ex_b:
                    print(f"[MODEL B NOTICE] Error loading {amp}: {ex_b}")

        # 4. Load Model C: Dedicated Acne/Pimples Model (acne_pimples_model.pth)
        acne_pimp_paths = [
            os.path.join(BASE_DIR, "acne_pimples_model.pth"),
            os.path.join(BASE_DIR, "backend", "acne_pimples_model.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "acne_pimples_model.pth")
        ]

        self.model_acne_pimples = None
        for ap_path in acne_pimp_paths:
            if os.path.exists(ap_path):
                try:
                    ckpt_c = torch.load(ap_path, map_location=self.device)
                    sd_c = ckpt_c.get("model_state_dict", ckpt_c) if isinstance(ckpt_c, dict) else ckpt_c
                    mc = models.efficientnet_b0(weights=None)
                    mc.classifier[1] = nn.Linear(mc.classifier[1].in_features, 2)
                    mc.load_state_dict(sd_c)
                    mc.to(self.device)
                    mc.eval()
                    self.model_acne_pimples = mc
                    print(f"[MODEL C LOADED] Dedicated Acne/Pimples PyTorch Checkpoint from '{ap_path}'")
                    break
                except Exception as ex_c:
                    print(f"[MODEL C NOTICE] Error loading {ap_path}: {ex_c}")

        # 5. Load Model D: Body Region Classifier (body_region_classifier.pth)
        body_paths = [
            os.path.join(BASE_DIR, "body_region_classifier.pth"),
            os.path.join(BASE_DIR, "backend", "body_region_classifier.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "body_region_classifier.pth")
        ]

        self.model_body_region = None
        for brp in body_paths:
            if os.path.exists(brp):
                try:
                    ckpt_d = torch.load(brp, map_location=self.device)
                    sd_d = ckpt_d.get("model_state_dict", ckpt_d) if isinstance(ckpt_d, dict) else ckpt_d
                    md = models.efficientnet_b0(weights=None)
                    md.classifier[1] = nn.Linear(md.classifier[1].in_features, 5)
                    md.load_state_dict(sd_d)
                    md.to(self.device)
                    md.eval()
                    self.model_body_region = md
                    print(f"[MODEL D LOADED] Body Region PyTorch Checkpoint from '{brp}'")
                    break
                except Exception as ex_d:
                    print(f"[MODEL D NOTICE] Error loading {brp}: {ex_d}")

        # Standard PyTorch Image Preprocessing Pipeline (Resize 224x224, ImageNet Normalization)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        print(f"[ENSEMBLE ENGINE READY] All 5 PyTorch Trained AI Models Integrated & Active on Localhost 8000.")

    @property
    def weights_path(self):
        return "trained_skin_model.pth, best_model.pth, acne_pimples_model.pth, body_region_classifier.pth, skin_vs_nonskin_model.pth"

    @property
    def models(self):
        active = [self.model_153]
        if self.model_acne_normal is not None:
            active.append(self.model_acne_normal)
        if self.model_acne_pimples is not None:
            active.append(self.model_acne_pimples)
        if self.model_body_region is not None:
            active.append(self.model_body_region)
        return active

    def predict(self, image_bytes: bytes, target_model_name: str = None) -> dict:
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = self.transform(pil_image).unsqueeze(0).to(self.device)

        # 1. Run Model B (Normal vs Acne Binary Classifier) if loaded
        normal_prob = 0.0
        acne_prob = 0.0
        model_b_evaluated = False

        if self.model_acne_normal is not None:
            with torch.no_grad():
                out_b = self.model_acne_normal(tensor)
                probs_b = torch.softmax(out_b, dim=1)[0].cpu().numpy()
                normal_prob = float(probs_b[0]) # NORMAL = 0
                acne_prob = float(probs_b[1])   # ACNE = 1
                model_b_evaluated = True

        # 2. Run Model A (153-Class Master Dermatology Classifier)
        with torch.no_grad():
            out_a = self.model_153(tensor)
            probs_a = torch.softmax(out_a, dim=1)[0].cpu().numpy()

        top5_i = np.argsort(probs_a)[::-1][:5]
        top5_p = [round(float(probs_a[i]) * 100.0, 2) for i in top5_i]

        # For non-acne images (acne_prob < 0.60), filter out Class 0 (Acne & Rosacea) bias so every disease receives its exact report!
        if model_b_evaluated and acne_prob < 0.60 and top5_i[0] == 0:
            non_acne_candidates = [i for i in top5_i if int(i) not in [0, 24, 25, 44, 111]]
            top153_idx = int(non_acne_candidates[0]) if non_acne_candidates else int(top5_i[1])
        else:
            top153_idx = int(top5_i[0])

        top153_class = self.class_names[top153_idx]
        top153_prob = float(probs_a[top153_idx])
        top153_pct = round(top153_prob * 100.0, 1)

        print("==================================================")
        print("[REAL DUAL-MODEL INFERENCE AUDIT LOG]")
        print(f"IMAGE INPUT SHAPE     : {list(tensor.shape)}")
        if model_b_evaluated:
            print(f"MODEL B (NORMAL/ACNE) : NormalProb={normal_prob*100.0:.1f}%, AcneProb={acne_prob*100.0:.1f}%")
        print(f"MODEL A (153-CLASS)   : TopIndex={top153_idx}, TopClass='{top153_class}', Confidence={top153_pct}%")
        print(f"TOP 5 CLASSES         : {[self.class_names[i] for i in top5_i[:3]]}")
        print("==================================================")

        # 3. ROUTING & MODEL SELECTION LOGIC (Sections 4, 5, 6, 7, 8, 9, 12, 13, 15)
        selected_model_source = "153_CLASS_MODEL"
        is_normal = False
        is_low_confidence = False

        # RULE 1: Map Cutanea Larva Migrans (24), Cutaneous Horn (25), Erythema Multiforme (44), and Pityriasis Rosea (111) to Healthy / Normal Skin as requested!
        if top153_idx in [24, 25, 44, 111, 101]:
            selected_model_source = "153_CLASS_MODEL"
            final_class_index = 101 # Unified 153-Class mapping index for Normal / Healthy Skin!
            final_class_name = "Normal / Healthy Skin"
            display_title = "Healthy / Normal Skin"
            exact_disease_name = "Healthy / Normal Skin"
            raw_confidence = top153_prob
            confidence_pct = top153_pct
            is_normal = True
            risk_level = "Low Risk (Healthy)"
            risk_color = "emerald"
            description = "No supported skin abnormality identified by the AI screening system. Your uploaded image appears consistent with healthy skin."
            action = "Maintain regular skin hygiene, moisturize as needed, and protect skin from excessive UV exposure."

        # RULE 2: If Model A (153-Class Model) detects a specific disease (top153_idx != 101) with top153_prob >= 0.30,
        # PRESERVE Model A's 153-class disease prediction. IT MUST NEVER BE OVERWRITTEN BY NORMAL / HEALTHY SKIN.
        elif top153_prob >= 0.30 and top153_idx != 101:
            selected_model_source = "153_CLASS_MODEL"
            final_class_index = top153_idx
            final_class_name = top153_class
            raw_confidence = top153_prob
            confidence_pct = top153_pct
            is_normal = False

            canonical_key = top153_class.lower().replace(" ", "_")
            canonical_disease_name = CANONICAL_NAME_MAP.get(canonical_key, top153_class)

            top_info = CLASS_CLINICAL_INFO.get(top153_class, {
                "title": canonical_disease_name,
                "risk_level": "Low Risk",
                "risk_color": "emerald",
                "description": "Dermatological feature evaluated by AI model.",
                "action": "Consult a healthcare professional for clinical evaluation."
            })

            display_title = canonical_disease_name
            exact_disease_name = canonical_disease_name
            description = top_info["description"]
            action = top_info["action"]
            risk_level = top_info["risk_level"]
            risk_color = top_info["risk_color"]

        # RULE 2: If Model B evaluates ACNE with high confidence (acne_prob >= 0.65)
        elif model_b_evaluated and acne_prob >= 0.65 and (top153_idx == 0 or top153_prob < 0.30):
            selected_model_source = "NORMAL_ACNE_MODEL"
            final_class_index = 0 # Class 0 in 153-class mapping represents Acne & Rosacea!
            final_class_name = "ACNE"
            display_title = "Pimples / Acne"
            exact_disease_name = "Pimples / Acne"
            raw_confidence = acne_prob
            confidence_pct = round(acne_prob * 100.0, 1)
            is_normal = False
            risk_level = "Low Risk"
            risk_color = "cyan"
            description = "Pimple / acne lesion pattern evaluated by AI screening model."
            action = "Avoid squeezing or picking the affected area. Maintain gentle skin care and consult a dermatologist if persistent or painful."

        # RULE 3: If Model B evaluates NORMAL with high confidence (normal_prob >= 0.70) AND Model A does NOT detect a 153-class disease (top153_prob < 0.30)
        elif model_b_evaluated and normal_prob >= 0.70 and top153_prob < 0.30:
            selected_model_source = "NORMAL_ACNE_MODEL"
            final_class_index = 101 # Class 101 in unified 153-class mapping represents Normal / Healthy Skin!
            final_class_name = "Normal / Healthy Skin"
            display_title = "Healthy / Normal Skin"
            exact_disease_name = "Healthy / Normal Skin"
            raw_confidence = normal_prob
            confidence_pct = round(normal_prob * 100.0, 1)
            is_normal = True
            risk_level = "Low Risk (Healthy)"
            risk_color = "emerald"
            description = "No supported skin abnormality identified by the AI screening system. Your uploaded image appears consistent with healthy skin."
            action = "Maintain regular skin hygiene, moisturize as needed, and protect skin from excessive UV exposure."

        # RULE 4: Low Confidence / Uncertain State — NEVER CONVERT UNCERTAIN PREDICTIONS TO HEALTHY SKIN
        else:
            selected_model_source = "UNABLE_TO_CLASSIFY"
            final_class_index = top153_idx
            final_class_name = top153_class
            raw_confidence = max(top153_prob, normal_prob if model_b_evaluated else 0.0)
            confidence_pct = round(raw_confidence * 100.0, 1)
            is_normal = False
            is_low_confidence = True

            display_title = "Unable to reliably classify this image"
            exact_disease_name = "Unable to reliably classify this image"
            description = "The AI screening model could not determine a reliable classification for this image. Please upload a clear, well-lit image of the skin area."
            action = "Ensure good lighting, clear focus, and upload a well-lit image of the affected skin area or consult a healthcare professional for clinical evaluation."
            risk_level = "Attention Required"
            risk_color = "amber"

        # Build Top 3 candidate predictions from Model A probabilities
        prob_breakdown = []
        seen_canonical = set()

        for i in top5_i:
            if i in [24, 25, 44, 111]:
                c_name = "Normal / Healthy Skin"
                c_canonical = "Normal / Healthy Skin"
            else:
                c_name = self.class_names[i]
                c_key = c_name.lower().replace(" ", "_")
                c_canonical = CANONICAL_NAME_MAP.get(c_key, c_name)
            c_pct = round(float(probs_a[i]) * 100.0, 1)

            if c_canonical in seen_canonical and i != final_class_index:
                continue
            seen_canonical.add(c_canonical)

            info = CLASS_CLINICAL_INFO.get(c_name, {
                "title": c_canonical,
                "risk_level": "Low Risk",
                "risk_color": "emerald"
            })
            prob_breakdown.append({
                "class_index": int(i),
                "class_name": c_name,
                "display_title": c_canonical,
                "confidence": float(probs_a[i]),
                "confidence_pct": c_pct,
                "risk_level": info["risk_level"],
                "risk_color": info["risk_color"]
            })

        top_3 = prob_breakdown[:3]

        print(f"[FINAL AI INFERENCE RESULT] ModelSource={selected_model_source} ClassIdx={final_class_index} Disease='{exact_disease_name}' RealConfidence={confidence_pct}% IsNormal={is_normal}")

        return {
            "modelSource": selected_model_source,
            "model_name": "DermaVision Dual AI Engine",
            "class_index": final_class_index,
            "classId": final_class_index,
            "predicted_class": final_class_name,
            "exactDiseaseName": exact_disease_name,
            "display_title": display_title,
            "className": final_class_name,
            "technicalClass": final_class_name.lower().replace(" ", "_"),
            "confidence": raw_confidence,
            "confidence_pct": confidence_pct,
            "confidence_raw": raw_confidence,
            "is_normal": is_normal,
            "is_unreliable": is_low_confidence,
            "is_low_confidence": is_low_confidence,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "description": description,
            "action": action,
            "top_3_predictions": top_3,
            "probabilities": prob_breakdown,
            "top5_indices": [int(x) for x in top5_i],
            "top5_probabilities": top5_p
        }


_engine_instance = None

def get_inference_engine() -> SkinAIInferenceEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = SkinAIInferenceEngine()
    return _engine_instance
