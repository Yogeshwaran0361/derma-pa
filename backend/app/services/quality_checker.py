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
            m_path = os.path.join(BASE_DIR, "skin_vs_nonskin_model.pth")
            if not os.path.exists(m_path):
                m_path = os.path.join(os.path.dirname(BASE_DIR), "skin_vs_nonskin_model.pth")
            if os.path.exists(m_path):
                model = models.mobilenet_v3_small(weights=None)
                in_features = model.classifier[3].in_features
                model.classifier[3] = nn.Linear(in_features, 2)
                model.load_state_dict(torch.load(m_path, map_location='cpu'))
                model.eval()
                _neural_skin_model = model
                print(f"[NEURAL SKIN GATE] Loaded PyTorch Neural Skin Classifier from {m_path}")
        except Exception as e:
            print(f"[NEURAL SKIN GATE NOTICE] {e}")
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
    def _detect_human_skin(pil_image: Image.Image) -> tuple[bool, str, dict]:
        """
        Validates whether the uploaded image contains valid human skin region.
        Rejects non-skin images (laptops, keyboards, computer screens, ceilings, blinds, books, documents, plants, animals, objects, landscapes).
        """
        metrics = {}

        # 1. PyTorch Neural Skin Gate Model Evaluation
        neural_model = _get_neural_skin_model()
        if neural_model is not None:
            try:
                t_transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])
                t_tensor = t_transform(pil_image).unsqueeze(0)
                with torch.no_grad():
                    logits = neural_model(t_tensor)
                    probs = torch.softmax(logits, dim=1)[0]
                    neural_nonskin_prob = float(probs[0]) * 100.0
                    neural_skin_prob = float(probs[1]) * 100.0

                metrics["neural_skin_prob"] = round(neural_skin_prob, 2)
                metrics["neural_nonskin_prob"] = round(neural_nonskin_prob, 2)

                if neural_nonskin_prob > 60.0 or neural_skin_prob < 40.0:
                    return False, f"Identified as a non-skin object (ceiling, wall, object, background) by PyTorch Neural Gate ({neural_nonskin_prob:.1f}% non-skin score).", metrics
            except Exception as e:
                print(f"[NEURAL GATE EVAL ERROR]: {e}")

        if not HAS_OPENCV:
            return True, "Color skin verification bypassed (OpenCV not available).", metrics

        try:
            img_np = np.array(pil_image)
            if img_np.ndim != 3 or img_np.shape[2] != 3:
                return False, "Image must be a 3-channel RGB image.", metrics

            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
            h, w, _ = img_bgr.shape
            total_pixels = float(h * w)

            img_ycbr = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
            img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
            img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)

            Cr = img_ycbr[:, :, 1]
            Cb = img_ycbr[:, :, 2]

            H = img_hsv[:, :, 0]
            S = img_hsv[:, :, 1]
            V = img_hsv[:, :, 2]

            A = img_lab[:, :, 1]
            B = img_lab[:, :, 2]

            # Skin color bounds (supports Fitzpatrick skin tones + inflamed/erythematous lesions)
            mask_ycbr = (Cb >= 75) & (Cb <= 135) & (Cr >= 130) & (Cr <= 220)
            mask_hsv = ((H <= 30) | (H >= 150)) & (S >= 15) & (S <= 230) & (V >= 30)
            mask_lab = (A >= 126) & (B >= 124)

            skin_mask = mask_ycbr & mask_hsv & mask_lab
            skin_pixels = np.count_nonzero(skin_mask)
            skin_ratio = skin_pixels / total_pixels

            # Non-skin object detection signatures:
            green_mask = (H >= 35) & (H <= 85) & (S >= 40)
            green_ratio = np.count_nonzero(green_mask) / total_pixels

            blue_mask = (H >= 95) & (H <= 135) & (S >= 40)
            blue_ratio = np.count_nonzero(blue_mask) / total_pixels

            mono_mask = (S < 12) & (V > 25) & (V < 240)
            mono_ratio = np.count_nonzero(mono_mask) / total_pixels

            paper_mask = (V > 245) & (S < 12)
            paper_ratio = np.count_nonzero(paper_mask) / total_pixels

            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 80, 180)
            edge_density = np.count_nonzero(edges) / total_pixels

            metrics.update({
                "skin_ratio": round(skin_ratio * 100, 2),
                "green_ratio": round(green_ratio * 100, 2),
                "blue_ratio": round(blue_ratio * 100, 2),
                "mono_ratio": round(mono_ratio * 100, 2),
                "paper_ratio": round(paper_ratio * 100, 2),
                "edge_density": round(edge_density * 100, 2)
            })

            if green_ratio > 0.20:
                return False, "The uploaded image appears to contain foliage or plants rather than human skin.", metrics

            if blue_ratio > 0.35:
                return False, "The uploaded image appears to contain sky, water, or blue screen elements.", metrics

            if mono_ratio > 0.60 and skin_ratio < 0.25:
                return False, "The uploaded image appears to contain electronic equipment, laptop, or keyboard surfaces.", metrics

            if paper_ratio > 0.65:
                return False, "The uploaded image appears to be a document or book page rather than human skin.", metrics

            if edge_density > 0.22 and skin_ratio < 0.25:
                return False, "The image contains artificial high-density grid lines or text (e.g. keyboard/screen).", metrics

            if skin_ratio < 0.15:
                return False, "The uploaded image does not appear to contain a valid human skin region.", metrics

            return True, "Valid human skin image verified.", metrics
        except Exception as e:
            return False, f"Skin detection analysis error: {str(e)}", metrics

    @staticmethod
    def validate_image_quality(image_bytes: bytes) -> dict:
        try:
            if not image_bytes or len(image_bytes) < 10:
                return {
                    "passed": False,
                    "is_invalid_image": True,
                    "reason": "INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE",
                    "detail": "Uploaded file is empty or corrupted.",
                    "suggestion": "Please upload a valid skin image file.",
                    "metrics": {}
                }

            pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            width, height = pil_image.size

            # 1. Resolution Check
            if width < MIN_RESOLUTION_WIDTH or height < MIN_RESOLUTION_HEIGHT:
                return {
                    "passed": False,
                    "is_quality_low": True,
                    "reason": "IMAGE QUALITY TOO LOW",
                    "detail": f"Image resolution ({width}x{height}) is too low. Minimum required is {MIN_RESOLUTION_WIDTH}x{MIN_RESOLUTION_HEIGHT}.",
                    "suggestion": "Please capture or upload a higher resolution photo.",
                    "metrics": {"width": width, "height": height}
                }

            # 2. NON-SKIN IMAGE VALIDATION GATE (PyTorch Neural Gate + Color Pattern Analysis)
            is_skin, skin_msg, skin_metrics = ImageQualityChecker._detect_human_skin(pil_image)
            if not is_skin:
                return {
                    "passed": False,
                    "is_invalid_image": True,
                    "reason": "INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE",
                    "detail": f"The uploaded image does not appear to contain a valid human skin region. {skin_msg}",
                    "suggestion": "Please upload a clear, well-lit image of the affected or normal skin area.",
                    "metrics": skin_metrics
                }

            # Convert to Grayscale for Blur & Exposure
            gray = np.array(pil_image.convert("L"))

            # 3. Blur / Focus Check
            blur_var = ImageQualityChecker._compute_blur_variance(gray)
            if blur_var < LAPLACIAN_BLUR_THRESHOLD:
                return {
                    "passed": False,
                    "is_quality_low": True,
                    "reason": "IMAGE QUALITY TOO LOW",
                    "detail": "The photo appears severely out of focus or blurry.",
                    "suggestion": "Please upload a clear, well-lit image of the skin area.",
                    "metrics": {
                        "blur_score": round(blur_var, 2),
                        "blur_threshold": LAPLACIAN_BLUR_THRESHOLD,
                        **skin_metrics
                    }
                }

            # 4. Brightness / Exposure Check
            mean_brightness = float(np.mean(gray))

            if mean_brightness < MIN_BRIGHTNESS_THRESHOLD:
                return {
                    "passed": False,
                    "is_quality_low": True,
                    "reason": "IMAGE QUALITY TOO LOW",
                    "detail": "The photo is pitch dark.",
                    "suggestion": "Please upload a clear, well-lit image of the skin area.",
                    "metrics": {
                        "brightness": round(mean_brightness, 2),
                        "min_required": MIN_BRIGHTNESS_THRESHOLD,
                        **skin_metrics
                    }
                }

            if mean_brightness > MAX_BRIGHTNESS_THRESHOLD:
                return {
                    "passed": False,
                    "is_quality_low": True,
                    "reason": "IMAGE QUALITY TOO LOW",
                    "detail": "The photo is overexposed or has extreme glare.",
                    "suggestion": "Please upload a clear, well-lit image of the skin area.",
                    "metrics": {
                        "brightness": round(mean_brightness, 2),
                        "max_allowed": MAX_BRIGHTNESS_THRESHOLD,
                        **skin_metrics
                    }
                }

            # 5. Feature Variance Check
            std_dev = float(np.std(gray))
            if std_dev < 1.0:
                return {
                    "passed": False,
                    "is_quality_low": True,
                    "reason": "IMAGE QUALITY TOO LOW",
                    "detail": "Image contains a solid blank color without visible skin features.",
                    "suggestion": "Please upload a clear, well-lit image of the skin area.",
                    "metrics": {"std_dev": round(std_dev, 2), **skin_metrics}
                }

            # All checks passed cleanly!
            return {
                "passed": True,
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
            return {
                "passed": False,
                "is_invalid_image": True,
                "reason": "INVALID IMAGE — PLEASE UPLOAD A SKIN IMAGE",
                "detail": f"Corrupted or invalid image file format: {str(e)}",
                "suggestion": "Please upload a valid JPEG, PNG, or WEBP skin photo.",
                "metrics": {}
            }
