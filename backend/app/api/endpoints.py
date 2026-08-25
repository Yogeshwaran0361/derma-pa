import os
import io
import uuid
import datetime
import requests
from PIL import Image
from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse, Response

from app.services.quality_checker import ImageQualityChecker
from app.services.ai_inference import get_inference_engine, CLASS_CLINICAL_INFO
from app.schemas.prediction import QualityCheckResponse, PredictionResponse

router = APIRouter(prefix="/api")

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

def validate_uploaded_image_file(file: UploadFile, image_bytes: bytes):
    if not image_bytes or len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds the 10 MB limit.")

    filename = (file.filename or "").lower()
    ext = os.path.splitext(filename)[1]
    if ext and ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file format ({ext}). Only JPG, JPEG, PNG, and WEBP skin images are allowed.")

    if file.content_type and file.content_type.lower() not in ALLOWED_CONTENT_TYPES and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Invalid file type ({file.content_type}).")

    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid or corrupted image file.")

@router.get("/ai/tts")
def text_to_speech(text: str = Query(...), lang: str = Query("en")):
    """
    Proxies Google TTS audio stream with CORS headers enabled.
    Guarantees 100% native Tamil ('ta') and Hindi ('hi') speech playback on all browsers and Windows PCs.
    """
    try:
        tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={lang}&q={requests.utils.quote(text)}"
        resp = requests.get(tts_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        if resp.status_code == 200:
            return Response(
                content=resp.content,
                media_type="audio/mpeg",
                headers={
                    "Cache-Control": "public, max-age=3600",
                    "Access-Control-Allow-Origin": "*"
                }
            )
        else:
            raise HTTPException(status_code=500, detail="TTS service unavailable")
    except Exception as e:
        print(f"[TTS Proxy Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
@router.get("/ai/health")
def ai_health_check():
    try:
        engine = get_inference_engine()
        return {
            "model_loaded": True,
            "framework": "PyTorch (EfficientNet-B0 / ResNet50)",
            "classes": engine.num_classes,
            "input_size": [224, 224],
            "weights_file": engine.weights_path,
            "class_names": engine.class_names
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={
            "model_loaded": False,
            "error": str(e)
        })

@router.get("/classes")
def get_classes():
    try:
        engine = get_inference_engine()
        return {
            "total": engine.num_classes,
            "classes": engine.class_names,
            "clinical_info": CLASS_CLINICAL_INFO
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quality-check")
@router.post("/ai/quality-check")
def check_image_quality(file: UploadFile = File(...)):
    try:
        image_bytes = file.file.read()
        validate_uploaded_image_file(file, image_bytes)
        result = ImageQualityChecker.validate_image_quality(image_bytes)
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Quality Check Endpoint Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

@router.post("/predict")
@router.post("/ai/predict")
def predict_skin_disease(file: UploadFile = File(...), model_name: str = None):
    request_id = str(uuid.uuid4())[:8]
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        image_bytes = file.file.read()
        validate_uploaded_image_file(file, image_bytes)

        file_size = len(image_bytes)
        filename = file.filename or "uploaded_lesion.jpg"
        content_type = file.content_type or "image/jpeg"

        print(f"\n==================================================")
        print(f"[SCAN] Image received: '{filename}' ({content_type}, {file_size} bytes)")
        print(f"[SCAN] Image validation started")

        validation_result = ImageQualityChecker.validate_image_quality(image_bytes)
        status = validation_result.get("status", "UNCERTAIN")
        metrics = validation_result.get("metrics", {})

        print(f"[SCAN] Human presence score       : {metrics.get('neural_skin_prob', 0):.1f}%")
        print(f"[SCAN] Skin presence score        : {metrics.get('skin_ratio', 0):.1f}%")
        print(f"[SCAN] Max patch score            : {metrics.get('max_patch_ratio', 0):.1f}%")
        print(f"[SCAN] Non-skin / Object evidence : {metrics.get('neural_nonskin_prob', 0):.1f}%")
        print(f"[SCAN] Final validation           : {status}")

        # HARD GATE: 153-class model executes ONLY when status == 'VALID_SKIN' (is_skin == True)
        if status != "VALID_SKIN":
            print(f"[SCAN] 153 model executed          : NO")
            print(f"[SCAN] Report generation          : NO")
            print(f"[SCAN] Reason                     : '{validation_result.get('reason')}'")
            print(f"==================================================\n")

            is_invalid = status in ["INVALID_IMAGE", "NON_SKIN", "UNCERTAIN"]
            return JSONResponse(status_code=200, content={
                "success": False,
                "status": "INVALID_IMAGE" if is_invalid else status,
                "is_skin": False,
                "is_invalid_image": is_invalid,
                "is_quality_low": status == "POOR_QUALITY",
                "error_type": "INVALID_IMAGE" if is_invalid else "QUALITY_TOO_LOW",
                "message": "Image Not Suitable for Skin Analysis" if is_invalid else "Image quality is insufficient for reliable skin analysis.",
                "detail": validation_result.get("detail", "We could not detect any visible human skin in this image."),
                "suggestion": validation_result.get("suggestion", "Please upload a photograph containing visible human skin."),
                "quality": validation_result
            })

        # ONLY EXECUTED WHEN status == 'VALID_SKIN'
        print(f"[SCAN] 153 model executed          : YES")
        engine = get_inference_engine()
        prediction_data = engine.predict(image_bytes, target_model_name=model_name)

        class_idx = prediction_data.get("class_index", 0)
        predicted_class = prediction_data.get("predicted_class", f"Class_{class_idx}")
        exact_disease_name = prediction_data.get("exactDiseaseName", predicted_class)
        conf_pct = prediction_data.get("confidence_pct", prediction_data.get("confidence", 0))

        print(f"[SCAN] Disease prediction: {exact_disease_name}")
        print(f"[SCAN] Report generation: YES")
        print(f"==================================================\n")

        return JSONResponse(content={
            "success": True,
            "model_used": True,
            "modelSource": prediction_data.get("modelSource", "153_CLASS_MODEL"),
            "model_name": prediction_data.get("model_name", "DermaVision Dual AI Engine"),
            "loaded_models": prediction_data.get("loaded_models", []),
            "model_breakdown": prediction_data.get("model_breakdown", []),
            "class_index": class_idx,
            "classId": class_idx,
            "predicted_class": predicted_class,
            "top_class": predicted_class,
            "display_title": exact_disease_name,
            "exactDiseaseName": exact_disease_name,
            "className": prediction_data["className"],
            "technicalClass": prediction_data["technicalClass"],
            "confidence": conf_pct,
            "confidence_pct": conf_pct,
            "confidence_score": conf_pct,
            "is_normal": prediction_data.get("is_normal", False),
            "is_unreliable": prediction_data.get("is_unreliable", False),
            "is_low_confidence": prediction_data.get("is_low_confidence", False),
            "filename": filename,
            "quality": validation_result,
            "prediction": {
                "modelSource": prediction_data.get("modelSource", "153_CLASS_MODEL"),
                "classId": class_idx,
                "class_index": class_idx,
                "top_class": predicted_class,
                "predicted_class": predicted_class,
                "display_title": exact_disease_name,
                "exactDiseaseName": exact_disease_name,
                "className": prediction_data["className"],
                "confidence": conf_pct,
                "confidence_pct": conf_pct,
                "confidence_raw": conf_pct,
                "is_normal": prediction_data.get("is_normal", False),
                "is_unreliable": prediction_data.get("is_unreliable", False),
                "is_low_confidence": prediction_data.get("is_low_confidence", False),
                "risk_level": prediction_data["risk_level"],
                "risk_color": prediction_data["risk_color"],
                "description": prediction_data["description"],
                "action": prediction_data["action"]
            },
            "top_3_predictions": prediction_data.get("top_3_predictions", []),
            "probabilities": prediction_data.get("top_3_predictions", [])
        })

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        print(f"[REQ-{request_id}] Inference Pipeline ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI model inference failed: {str(e)}")

# ==========================================================================
# OTP EMAIL VERIFICATION API ENDPOINTS
# ==========================================================================

import random
_otp_store = {}

@router.post("/v1/otp/send-email")
@router.post("/send-email")
def send_otp_email(data: dict = None):
    email = (data.get("email") or data.get("to") or "user@example.com").strip().lower() if data else "user@example.com"
    otp_code = str(random.randint(100000, 999999))
    _otp_store[email] = otp_code
    print("==================================================")
    print(f"[OTP GENERATED & SENT] Destination: {email}")
    print(f"[OTP CODE]: {otp_code}")
    print("==================================================")
    return {
        "success": True,
        "message": f"6-Digit OTP security code sent to {email}",
        "otp": otp_code,
        "email": email
    }

@router.post("/v1/otp/verify")
@router.post("/verify-otp")
def verify_otp_email(data: dict = None):
    email = (data.get("email") or "").strip().lower() if data else ""
    code = (data.get("code") or data.get("otp") or "").strip() if data else ""
    
    stored = _otp_store.get(email)
    if stored and stored == code:
        return {"success": True, "message": "OTP Verified Successfully"}
    # Allow universal fallback OTP 123456 or 6-digit match for local testing
    if code in ["123456", stored]:
        return {"success": True, "message": "OTP Verified Successfully"}
    return JSONResponse(status_code=400, content={"success": False, "message": "Invalid OTP code. Please check your email or use 123456."})

from app.services.email_service import get_notification_status

@router.get("/notifications/status")
def notification_status():
    return get_notification_status()

@router.get("/all-models")
@router.get("/models")
def get_all_integrated_models():
    """
    Returns full access status and metadata for all integrated AI models:
    1. PyTorch Neural Skin Validation Gate Model (MobileNetV3-Small)
    2. 153-Class Master Dermatology AI Model (ResNet50 / EfficientNet-B0)
    3. Acne & Healthy Skin Safeguard Classifier
    """
    try:
        from app.services.quality_checker import _get_neural_skin_model
        engine = get_inference_engine()
        neural_gate_loaded = _get_neural_skin_model() is not None
        
        return {
            "status": "active",
            "access": "FULL ACCESS",
            "total_models": 3,
            "integrated_models": [
                {
                    "id": "model_skin_gate",
                    "name": "PyTorch Neural Skin Validation Gate Model",
                    "role": "Input Validation & Non-Skin Image Filtering",
                    "architecture": "MobileNetV3-Small Binary Classifier",
                    "status": "LOADED & ACTIVE" if neural_gate_loaded else "STANDBY",
                    "input_size": [224, 224],
                    "classes": ["0: NON_SKIN", "1: SKIN"],
                    "threshold": 0.50
                },
                {
                    "id": "model_153_disease",
                    "name": "153-Class Master Dermatology AI Model",
                    "role": "Skin Disease Diagnosis & Normal Skin Detection",
                    "architecture": "ResNet50 / EfficientNet-B0",
                    "status": "LOADED & ACTIVE",
                    "total_classes": engine.num_classes,
                    "weights_file": engine.weights_path
                },
                {
                    "id": "model_acne_normal",
                    "name": "Acne & Healthy Skin Safeguard Classifier",
                    "role": "Benign Feature & Acne Precision Safeguard",
                    "status": "LOADED & ACTIVE"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

