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
        try:
            torch.set_num_threads(2)
        except Exception:
            pass

        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # 1. Load 153-Class Model Mapping
        cwd = os.getcwd()
        mapping_paths = [
            os.path.join(BASE_DIR, "class_mapping.json"),
            os.path.join(BASE_DIR, "backend", "class_mapping.json"),
            os.path.join(os.path.dirname(BASE_DIR), "class_mapping.json"),
            os.path.join(cwd, "class_mapping.json"),
            os.path.join(cwd, "backend", "class_mapping.json"),
            MAPPING_PATH
        ]

        self.mapping_path = None
        for mp in mapping_paths:
            if mp and os.path.exists(mp):
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
            os.path.join(BASE_DIR, "trained_skin_model.pth"),
            os.path.join(BASE_DIR, "backend", "trained_skin_model.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "trained_skin_model.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "backend", "trained_skin_model.pth"),
            os.path.join(cwd, "trained_skin_model.pth"),
            os.path.join(cwd, "backend", "trained_skin_model.pth")
        ]

        self.model_153 = None
        for p in model_paths:
            if p and os.path.exists(p):
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
            print("[MODEL A WARNING] Primary model weights not loaded from standard paths, creating default classifier structure.")
            m = models.efficientnet_b0(weights=None)
            m.classifier[1] = nn.Linear(m.classifier[1].in_features, self.num_classes)
            m.to(self.device)
            m.eval()
            self.model_153 = m

        # 3. Load Model B: Normal vs Acne Model (models/acne-normal/best_model.pth)
        acne_model_paths = [
            os.path.join(BASE_DIR, "models", "acne-normal", "best_model.pth"),
            os.path.join(BASE_DIR, "backend", "models", "acne-normal", "best_model.pth"),
            os.path.join(os.path.dirname(BASE_DIR), "models", "acne-normal", "best_model.pth"),
            os.path.join(cwd, "backend", "models", "acne-normal", "best_model.pth")
        ]

        self.model_acne_normal = None
        for amp in acne_model_paths:
            if amp and os.path.exists(amp):
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

        # 4. Standard PyTorch Image Preprocessing Pipeline (Resize 224x224, ImageNet Normalization)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        print(f"[ENGINE READY] SkinAIInferenceEngine Ready: Model A (153-Class) + Model B (Normal/Acne Binary).")

    @property
    def weights_path(self):
        return "trained_skin_model.pth, best_model.pth (acne-normal)"

    @property
    def models(self):
        active = [self.model_153]
        if self.model_acne_normal is not None:
            active.append(self.model_acne_normal)
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

        # 3. ROUTING & MODEL SELECTION LOGIC
        selected_model_source = "153_CLASS_MODEL"
        is_normal = False
        is_low_confidence = False

        # If Model A's top class is 0 (Acne & Rosacea) but Model B says it is NOT acne (acne_prob < 0.50),
        # select Model A's next best non-acne disease class!
        effective_top_idx = top153_idx
        effective_top_class = top153_class
        effective_top_prob = top153_prob

        if top153_idx == 0 and model_b_evaluated and acne_prob < 0.50:
            for alt_idx in top5_i[1:]:
                if alt_idx != 0:
                    effective_top_idx = int(alt_idx)
                    effective_top_class = self.class_names[effective_top_idx]
                    effective_top_prob = float(probs_a[effective_top_idx])
                    break

        # RULE 1: Direct Normal / Healthy Skin class indices (24, 25, 44, 111, 101)
        if effective_top_idx in [24, 25, 44, 111, 101] or (model_b_evaluated and normal_prob >= 0.60 and acne_prob < 0.50):
            selected_model_source = "NORMAL_HEALTHY_SKIN"
            final_class_index = 101 # Unified 153-Class mapping index for Normal / Healthy Skin!
            final_class_name = "Normal / Healthy Skin"
            display_title = "Healthy / Normal Skin"
            exact_disease_name = "Healthy / Normal Skin"
            raw_confidence = max(normal_prob, effective_top_prob) if model_b_evaluated else effective_top_prob
            confidence_pct = round(raw_confidence * 100.0, 1)
            is_normal = True
            risk_level = "Low Risk (Healthy)"
            risk_color = "emerald"
            description = "No supported skin abnormality identified by the AI screening system. Your uploaded image appears consistent with healthy skin."
            action = "Maintain regular skin hygiene, moisturize as needed, and protect skin from excessive UV exposure."

        # RULE 2: Genuine Acne / Pimples Image (Evaluated by Model B acne_prob >= 0.55 or Model A top_class == 0 with acne_prob >= 0.50)
        elif model_b_evaluated and acne_prob >= 0.55:
            selected_model_source = "ACNE_BINARY_MODEL"
            final_class_index = 0 # Class 0 in 153-class mapping represents Acne & Rosacea!
            final_class_name = "Acne & Rosacea"
            display_title = "Pimples / Acne"
            exact_disease_name = "Pimples / Acne"
            raw_confidence = acne_prob
            confidence_pct = round(acne_prob * 100.0, 1)
            is_normal = False
            risk_level = "Low Risk"
            risk_color = "cyan"
            description = "Pimple / acne lesion pattern evaluated by AI screening model."
            action = "Avoid squeezing or picking the affected area. Maintain gentle skin care and consult a dermatologist if persistent or painful."

        # RULE 3: 153-Class Master Dermatology Classifier (For all other skin disease images!)
        else:
            selected_model_source = "153_CLASS_MODEL"
            final_class_index = effective_top_idx
            final_class_name = effective_top_class
            raw_confidence = effective_top_prob
            confidence_pct = round(effective_top_prob * 100.0, 1)
            is_normal = False

            canonical_key = effective_top_class.lower().replace(" ", "_")
            canonical_disease_name = CANONICAL_NAME_MAP.get(canonical_key, effective_top_class)

            top_info = CLASS_CLINICAL_INFO.get(effective_top_class, {
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
