import os
import sys
import io
import json
from PIL import Image, ImageDraw
import numpy as np

# Ensure backend directory is in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ai_inference import get_inference_engine

engine = get_inference_engine()

print("==================================================")
print("[PIPELINE EVALUATION TEST SUITE]")
print(f"Active Models: {len(engine.models)} | Total Classes: {engine.num_classes}")
print("==================================================")

def eval_test_case(pil_img, label):
    buf = io.BytesIO()
    pil_img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    result = engine.predict(img_bytes)

    print(f"\n--- TEST CASE: {label} ---")
    print(f"  Predicted Class   : {result['display_title']}")
    print(f"  Technical Class   : {result['predicted_class']} (Class {result['class_index']})")
    print(f"  Confidence        : {result['confidence_pct']}%")
    print(f"  Is Normal         : {result['is_normal']}")
    print(f"  Is Unreliable     : {result['is_unreliable']}")
    print(f"  Risk Level        : {result['risk_level']}")
    top3_str = ", ".join([f"{p['display_title']} ({p['confidence_pct']}%)" for p in result['top_3_predictions']])
    print(f"  Top 3 Candidates  : {top3_str}")
    return result

# Group A: Normal Skin
img_normal_smooth = Image.new("RGB", (300, 300), color=(215, 175, 145))
res_a1 = eval_test_case(img_normal_smooth, "Group A1: Plain Smooth Skin (Normal Hand/Arm)")

img_normal_pale = Image.new("RGB", (300, 300), color=(240, 210, 190))
res_a2 = eval_test_case(img_normal_pale, "Group A2: Light Skin Tone (Normal Skin)")

# Group B: Acne / Pimples
img_acne = Image.new("RGB", (300, 300), color=(220, 180, 150))
draw = ImageDraw.Draw(img_acne)
for _ in range(12):
    cx, cy = np.random.randint(50, 250), np.random.randint(50, 250)
    draw.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(210, 40, 40))
    draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 240, 220))
res_b1 = eval_test_case(img_acne, "Group B1: Skin with Pimple/Acne Spots")

# Group D: Non-Skin
img_blue = Image.new("RGB", (300, 300), color=(20, 40, 180))
res_d1 = eval_test_case(img_blue, "Group D1: Non-Skin (Blue Image)")

print("\n==================================================")
print("[EVALUATION SUMMARY]")
print(f"Group A1 (Normal Hand)  -> {res_a1['display_title']} (Normal={res_a1['is_normal']})")
print(f"Group B1 (Pimple/Acne)  -> {res_b1['display_title']} (Normal={res_b1['is_normal']})")
print(f"Group D1 (Non-Skin)     -> {res_d1['display_title']} (Unreliable={res_d1['is_unreliable']})")
print("==================================================")
