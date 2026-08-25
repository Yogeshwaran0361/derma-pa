import os
import sys
import io
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ai_inference import get_inference_engine
from app.services.quality_checker import ImageQualityChecker

engine = get_inference_engine()

sample_dir = r"C:\Users\yoges\Downloads\sample img"
files = [f for f in os.listdir(sample_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif'))]

print(f"==================================================")
print(f"AI SCREENING PREDICTION RESULTS FOR ALL {len(files)} IMAGES:")
print(f"==================================================")

results = []

for idx, fname in enumerate(files, 1):
    fpath = os.path.join(sample_dir, fname)
    with open(fpath, "rb") as f:
        img_bytes = f.read()
    
    pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    width, height = pil_img.size
    
    pred = engine.predict(img_bytes)
    
    status_str = "HEALTHY NORMAL" if pred['is_normal'] else f"{pred['risk_level'].upper()}"
    
    results.append({
        "index": idx,
        "filename": fname,
        "dimensions": f"{width}x{height}",
        "title": pred["display_title"],
        "confidence": pred["confidence_pct"],
        "is_normal": pred["is_normal"],
        "risk_level": pred["risk_level"],
        "status": status_str
    })
    
    print(f"{idx:2d}. {fname:<44} -> {pred['display_title']:<30} Conf: {pred['confidence_pct']:>5.1f}% [{status_str}]")

print("\n==================================================")
print("COMPLETED TESTING ALL IMAGES IN 'sample img'")
print("==================================================")
