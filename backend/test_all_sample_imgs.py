import os
import sys
import io
import json
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ai_inference import get_inference_engine
from app.services.quality_checker import ImageQualityChecker

engine = get_inference_engine()

sample_dir = r"C:\Users\yoges\Downloads\sample img"

files = [f for f in os.listdir(sample_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

print("==================================================")
print(f"[TESTING ALL {len(files)} IMAGES IN 'sample img' FOLDER]")
print("==================================================")

results = []

for idx, fname in enumerate(files, 1):
    fpath = os.path.join(sample_dir, fname)
    with open(fpath, "rb") as f:
        img_bytes = f.read()
    
    pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    width, height = pil_img.size
    
    # 1. Image Quality Check
    q_res = ImageQualityChecker.validate_image_quality(img_bytes)
    
    # 2. AI Inference Engine Prediction
    pred = engine.predict(img_bytes)
    
    res_entry = {
        "index": idx,
        "filename": fname,
        "dimensions": f"{width}x{height}",
        "quality_passed": q_res["passed"],
        "exact_disease_name": pred["exactDiseaseName"],
        "display_title": pred["display_title"],
        "confidence_pct": pred["confidence_pct"],
        "risk_level": pred["risk_level"],
        "is_normal": pred["is_normal"],
        "is_unreliable": pred["is_unreliable"],
        "top_3": [f"{p['display_title']} ({p['confidence_pct']}%)" for p in pred["top_3_predictions"]]
    }
    results.append(res_entry)
    
    print(f"\n--- IMAGE {idx}/{len(files)}: {fname} ---")
    print(f"  Dimensions    : {width}x{height}")
    print(f"  Quality Check : {'PASSED' if q_res['passed'] else 'REJECTED (' + q_res.get('reason', '') + ')'}")
    print(f"  Predicted Title: {pred['display_title']}")
    print(f"  Exact Disease : {pred['exactDiseaseName']}")
    print(f"  Confidence %  : {pred['confidence_pct']}%")
    print(f"  Risk Level    : {pred['risk_level']}")
    print(f"  Is Normal     : {pred['is_normal']}")
    print(f"  Is Unreliable : {pred['is_unreliable']}")
    print(f"  Top 3         : {', '.join(res_entry['top_3'])}")

print("\n==================================================")
print("[FINAL SUMMARY OF ALL SAMPLE IMAGES]")
print("==================================================")
for r in results:
    status_tag = "[HEALTHY NORMAL]" if r['is_normal'] else (f"[{r['risk_level'].upper()}]" if not r['is_unreliable'] else "[UNRELIABLE]")
    print(f"{r['index']:2d}. {r['filename']:<42} -> {r['display_title']:<28} {status_tag}")
