import io
import os
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models, transforms

try:
    import cv2
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

from app.config import (
    MIN_RESOLUTION_WIDTH,
    MIN_RESOLUTION_HEIGHT,
    LAPLACIAN_BLUR_THRESHOLD,
    MIN_BRIGHTNESS_THRESHOLD,
    MAX_BRIGHTNESS_THRESHOLD,
    BASE_DIR
)

_neural_skin_model = None

def _get_neural_skin_model():
    global _neural_skin_model
    if _neural_skin_model is None:
        try:
            search_paths = [
                os.path.join(BASE_DIR, "backend", "models", "skin_validation", "skin_validation_model.pth"),
                os.path.join(BASE_DIR, "models", "skin_validation", "skin_validation_model.pth"),
                os.path.join(os.path.dirname(BASE_DIR), "backend", "models", "skin_validation", "skin_validation_model.pth"),
                os.path.join(BASE_DIR, "skin_vs_nonskin_model.pth"),
                r"C:\Users\yoges\Downloads\skin_gate_model.pth"
            ]

            m_path = None
            for p in search_paths:
                if os.path.exists(p):
                    m_path = p
                    break

            if m_path and os.path.exists(m_path):
                model = models.mobilenet_v3_small(weights=None)
                in_features = model.classifier[3].in_features
                model.classifier[3] = nn.Linear(in_features, 2)
                model.load_state_dict(torch.load(m_path, map_location='cpu'))
                model.eval()
                _neural_skin_model = model
                print(f"[DEDICATED VALIDATION AI MODEL] Loaded trained Skin Validation Model from {m_path}")
        except Exception as e:
            print(f"[VALIDATION AI MODEL NOTICE] {e}")
    return _neural_skin_model


class ImageQualityChecker:
    @staticmethod
    def _compute_blur_variance(gray_array: np.ndarray) -> float:
        try:
            if HAS_OPENCV:
                var = float(cv2.Laplacian(gray_array, cv2.CV_64F).var())
                if var > 0.01:
                    return var
        except Exception:
            pass
        gy, gx = np.gradient(gray_array.astype(float))
        gnorm = np.sqrt(gx**2 + gy**2)
        return float(np.var(gnorm) * 2.0)

    @staticmethod
    def _detect_human_skin(pil_image: Image.Image) -> tuple[str, str, dict]:
        """
        Validates human skin suitability for dermatological analysis.
        CORE RULE: IF ANY HUMAN SKIN IS VISIBLY PRESENT → ACCEPT THE IMAGE (status: VALID_SKIN, is_skin: true).
        Rejects ONLY when NO human skin is visibly present (100% pure non-skin object).
        """
        metrics = {}

        # 1. Evaluate Dedicated PyTorch Neural Skin Gate Model
        neural_model = _get_neural_skin_model()
        neural_skin_prob = 0.0
        neural_nonskin_prob = 0.0
        if neural_model is not None:
            try:
                t_transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])

                # Evaluate Full Image
                t_tensor = t_transform(pil_image).unsqueeze(0)
                with torch.no_grad():
                    probs_full = torch.softmax(neural_model(t_tensor), dim=1)[0]
                    p0_full = float(probs_full[0]) * 100.0
                    p1_full = float(probs_full[1]) * 100.0

                # Evaluate Center Crop Image (inner 20%-80% window)
                w, h = pil_image.size
                crop_center_pil = pil_image.crop((int(w * 0.2), int(h * 0.2), int(w * 0.8), int(h * 0.8)))
                t_tensor_c = t_transform(crop_center_pil).unsqueeze(0)
                with torch.no_grad():
                    probs_c = torch.softmax(neural_model(t_tensor_c), dim=1)[0]
                    p0_c = float(probs_c[0]) * 100.0
                    p1_c = float(probs_c[1]) * 100.0

                neural_skin_prob = max(p1_full, p1_c)
                neural_nonskin_prob = min(p0_full, p0_c)

                metrics["neural_skin_prob"] = round(neural_skin_prob, 2)
                metrics["neural_nonskin_prob"] = round(neural_nonskin_prob, 2)
            except Exception as e:
                print(f"[NEURAL GATE NOTICE]: {e}")

        if not HAS_OPENCV:
            if neural_skin_prob >= 40.0:
                return "VALID_SKIN", "Valid human skin verified.", metrics
            return "INVALID_IMAGE", "Non-skin input detected.", metrics

        try:
            img_np = np.array(pil_image)
            if img_np.ndim != 3 or img_np.shape[2] != 3:
                return "INVALID_IMAGE", "Image must be a 3-channel RGB image.", metrics

            h, w, _ = img_np.shape
            total_pixels = float(h * w)

            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
            img_ycbr = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
            img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
            img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)

            Cr, Cb = img_ycbr[:, :, 1], img_ycbr[:, :, 2]
            H, S, V = img_hsv[:, :, 0], img_hsv[:, :, 1], img_hsv[:, :, 2]
            A, B = img_lab[:, :, 1], img_lab[:, :, 2]

            # Multi-Space Human Skin Bounds (Fitzpatrick scale I-VI + erythema/lesions)
            mask_ycbr = (Cb >= 70) & (Cb <= 145) & (Cr >= 120) & (Cr <= 220)
            mask_hsv = ((H <= 35) | (H >= 145)) & (S >= 10) & (V >= 25)
            mask_lab = (A >= 122) & (B >= 118)

            skin_mask = mask_ycbr & mask_hsv & mask_lab
            skin_pixels = np.count_nonzero(skin_mask)
            skin_ratio = skin_pixels / total_pixels

            # Check 9 sub-patches (3x3 grid) for localized skin region (e.g. hand/finger next to laptop)
            max_patch_ratio = 0.0
            for row in range(3):
                for col in range(3):
                    r1, r2 = int(h * row / 3), int(h * (row + 1) / 3)
                    c1, c2 = int(w * col / 3), int(w * (col + 1) / 3)
                    patch_mask = skin_mask[r1:r2, c1:c2]
                    ratio = float(np.count_nonzero(patch_mask)) / float(patch_mask.size)
                    if ratio > max_patch_ratio:
                        max_patch_ratio = ratio

            crop_center = skin_mask[int(h * 0.15):int(h * 0.85), int(w * 0.15):int(w * 0.85)]
            center_skin_ratio = float(np.count_nonzero(crop_center)) / float(crop_center.size) if crop_center.size > 0 else 0.0

            green_mask = (H >= 35) & (H <= 85) & (S >= 35)
            green_ratio = np.count_nonzero(green_mask) / total_pixels

            blue_mask = (H >= 95) & (H <= 135) & (S >= 35)
            blue_ratio = np.count_nonzero(blue_mask) / total_pixels

            mono_mask = (S < 12) & (V > 20) & (V < 245)
            mono_ratio = np.count_nonzero(mono_mask) / total_pixels

            paper_mask = (V > 240) & (S < 12)
            paper_ratio = np.count_nonzero(paper_mask) / total_pixels

            red_food_mask = ((H <= 25) | (H >= 160)) & (S >= 180) & (img_np[:,:,0].astype(float) > 3.0 * (img_np[:,:,1].astype(float) + 1.0))
            red_food_ratio = np.count_nonzero(red_food_mask) / total_pixels

            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 80, 180)
            edge_density = np.count_nonzero(edges) / total_pixels

            metrics.update({
                "skin_ratio": round(skin_ratio * 100, 2),
                "max_patch_ratio": round(max_patch_ratio * 100, 2),
                "center_skin_ratio": round(center_skin_ratio * 100, 2),
                "green_ratio": round(green_ratio * 100, 2),
                "blue_ratio": round(blue_ratio * 100, 2),
                "mono_ratio": round(mono_ratio * 100, 2),
                "paper_ratio": round(paper_ratio * 100, 2),
                "red_food_ratio": round(red_food_ratio * 100, 2),
                "edge_density": round(edge_density * 100, 2)
            })

            # 1. HARD REJECTION GATE: Screen / Wallpaper / Phone UI / Non-Skin Color Signals
            if paper_ratio > 3.0 or mono_ratio > 20.0 or green_ratio > 12.0 or blue_ratio > 12.0 or red_food_ratio > 10.0:
                return "INVALID_IMAGE", "Identified as a non-skin image (screenshot, wallpaper, UI elements, or background object).", metrics

            if skin_ratio < 15.0 and max_patch_ratio < 30.0:
                return "INVALID_IMAGE", "No visible human skin region detected in this image.", metrics

            # 2. HARD REJECTION GATE: PyTorch Neural Skin Validation Gate
            if neural_model is not None:
                if neural_nonskin_prob >= 25.0 or neural_skin_prob < 75.0:
                    return "INVALID_IMAGE", f"Identified as non-skin object ({neural_nonskin_prob:.1f}% non-skin score) by PyTorch Neural Gate.", metrics

            return "VALID_SKIN", "Image quality passed clarity, focus, and human skin verification checks.", metrics

        except Exception as e:
            return "UNCERTAIN", f"Skin detection analysis error: {str(e)}", metrics

    @staticmethod
    def validate_image_quality(image_bytes: bytes) -> dict:
        """
        Pre-Classification Validation Gate.
        Evaluates human skin presence before disease model execution.
        Returns production JSON:
          is_skin: true / false
          status: VALID_SKIN / INVALID_IMAGE / UNCERTAIN / POOR_QUALITY
        """
        try:
            if not image_bytes or len(image_bytes) < 10:
                return {
                    "is_skin": False,
                    "status": "INVALID_IMAGE",
                    "passed": False,
                    "is_invalid_image": True,
                    "is_quality_low": False,
                    "reason": "Image Not Suitable for Skin Analysis",
                    "detail": "We could not detect any visible human skin in this image.",
                    "suggestion": "Please upload a photograph containing visible human skin.",
                    "metrics": {}
                }

            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            width, height = pil_image.size

            # 1. Resolution Check
            if width < MIN_RESOLUTION_WIDTH or height < MIN_RESOLUTION_HEIGHT:
                return {
                    "is_skin": False,
                    "status": "POOR_QUALITY",
                    "passed": False,
                    "is_invalid_image": False,
                    "is_quality_low": True,
                    "reason": "Image quality is insufficient for reliable skin analysis.",
                    "detail": f"The image resolution ({width}x{height}) is too small for dermatological analysis.",
                    "suggestion": "Please capture a higher resolution image of the skin area.",
                    "metrics": {"width": width, "height": height}
                }

            # 2. Human Skin Presence Validation
            status, skin_reason, skin_metrics = ImageQualityChecker._detect_human_skin(pil_image)

            if status != "VALID_SKIN":
                is_invalid = status in ["INVALID_IMAGE", "NON_SKIN", "UNCERTAIN"]
                is_quality = status == "POOR_QUALITY"
                return {
                    "is_skin": False,
                    "status": "INVALID_IMAGE" if is_invalid else status,
                    "passed": False,
                    "is_invalid_image": is_invalid,
                    "is_quality_low": is_quality,
                    "reason": "Image Not Suitable for Skin Analysis" if is_invalid else "Image quality is insufficient for reliable skin analysis.",
                    "detail": skin_reason if skin_reason else "We could not detect any visible human skin in this image.",
                    "suggestion": "Please upload a photograph containing visible human skin.",
                    "metrics": skin_metrics
                }

            # 3. Blur Check
            gray = np.array(pil_image.convert("L"))
            blur_var = ImageQualityChecker._compute_blur_variance(gray)

            if blur_var < LAPLACIAN_BLUR_THRESHOLD:
                return {
                    "is_skin": True,
                    "status": "POOR_QUALITY",
                    "passed": False,
                    "is_invalid_image": False,
                    "is_quality_low": True,
                    "reason": "Image quality is insufficient for reliable skin analysis.",
                    "detail": f"The photo appears severely out of focus or blurry (blur score: {blur_var:.1f}).",
                    "suggestion": "Please capture a clearer, well-lit image of the skin area.",
                    "metrics": {
                        "blur_score": round(blur_var, 2),
                        "blur_threshold": LAPLACIAN_BLUR_THRESHOLD,
                        **skin_metrics
                    }
                }

            # 4. Brightness Check
            mean_brightness = float(np.mean(gray))

            if mean_brightness < MIN_BRIGHTNESS_THRESHOLD or mean_brightness > MAX_BRIGHTNESS_THRESHOLD:
                return {
                    "is_skin": True,
                    "status": "POOR_QUALITY",
                    "passed": False,
                    "is_invalid_image": False,
                    "is_quality_low": True,
                    "reason": "Image quality is insufficient for reliable skin analysis.",
                    "detail": "The photo is pitch dark or overexposed with extreme glare.",
                    "suggestion": "Please capture a clearer, well-lit image of the skin area.",
                    "metrics": {
                        "brightness": round(mean_brightness, 2),
                        **skin_metrics
                    }
                }

            # 5. Feature Variance Check
            std_dev = float(np.std(gray))
            if std_dev < 1.0:
                return {
                    "is_skin": False,
                    "status": "POOR_QUALITY",
                    "passed": False,
                    "is_invalid_image": False,
                    "is_quality_low": True,
                    "reason": "Image quality is insufficient for reliable skin analysis.",
                    "detail": "Image contains a solid blank color without visible skin features.",
                    "suggestion": "Please capture a clearer, well-lit image of the skin area.",
                    "metrics": {"std_dev": round(std_dev, 2), **skin_metrics}
                }

            # All checks passed cleanly! Human skin is present!
            return {
                "is_skin": True,
                "status": "VALID_SKIN",
                "passed": True,
                "is_invalid_image": False,
                "is_quality_low": False,
                "reason": "Image quality passed clarity, focus, and human skin verification checks.",
                "suggestion": "Proceeding to AI skin screening analysis.",
                "metrics": {
                    "width": width,
                    "height": height,
                    "blur_score": round(blur_var, 2),
                    "brightness": round(mean_brightness, 2),
                    "std_dev": round(std_dev, 2),
                    **skin_metrics
                }
            }

        except Exception as e:
            print(f"[VALIDATION GATE ERROR]: {e}")
            return {
                "is_skin": False,
                "status": "UNCERTAIN",
                "passed": False,
                "is_invalid_image": True,
                "is_quality_low": False,
                "reason": "Image Not Suitable for Skin Analysis",
                "detail": f"Validation gate error: {str(e)}. Defaulting to rejection.",
                "suggestion": "Please upload a valid skin photo.",
                "metrics": {}
            }
