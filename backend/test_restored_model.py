import os
import sys
import io
import numpy as np
from PIL import Image, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ai_inference import get_inference_engine

engine = get_inference_engine()

print("==================================================")
print("TESTING RESTORED DUAL-LAYER AI INFERENCE ENGINE")
print("==================================================")

# 1. Normal Hand Palm Image Test
img_palm = Image.new("RGB", (300, 300), color=(215, 175, 145))
draw = ImageDraw.Draw(img_palm)
draw.line([50, 100, 250, 180], fill=(180, 140, 110), width=3)
buf1 = io.BytesIO()
img_palm.save(buf1, format="JPEG")
res1 = engine.predict(buf1.getvalue())

print("\n--- TEST 1: Normal Hand Palm Image ---")
print(f"  Display Title : {res1['display_title']}")
print(f"  Exact Disease : {res1['exactDiseaseName']}")
print(f"  Confidence %  : {res1['confidence_pct']}%")
print(f"  Is Normal     : {res1['is_normal']}")
print(f"  Risk Level    : {res1['risk_level']}")

# 2. Acne Face Image Test
img_acne = Image.new("RGB", (300, 300), color=(220, 180, 150))
draw_acne = ImageDraw.Draw(img_acne)
for cx, cy in [(100,100), (120,150), (180,120), (200,200), (80,220), (150,80), (210,90), (90,160), (160,170), (130,210), (70,90), (230,150), (110,230), (190,180), (140,140)]:
    draw_acne.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(240, 50, 50))
buf2 = io.BytesIO()
img_acne.save(buf2, format="JPEG")
res2 = engine.predict(buf2.getvalue())

print("\n--- TEST 2: Acne Face Image ---")
print(f"  Display Title : {res2['display_title']}")
print(f"  Exact Disease : {res2['exactDiseaseName']}")
print(f"  Confidence %  : {res2['confidence_pct']}%")
print(f"  Is Normal     : {res2['is_normal']}")
print(f"  Risk Level    : {res2['risk_level']}")

# 3. Diseased Sample Image Test (e.g. back.webp / sti.jpg / ski.avif)
sample_dir = r"C:\Users\yoges\Downloads\sample img"
test_diseased_files = ["back.webp", "sti.jpg", "ski.avif"]

for df in test_diseased_files:
    df_path = os.path.join(sample_dir, df)
    if os.path.exists(df_path):
        with open(df_path, "rb") as f:
            b = f.read()
        res_d = engine.predict(b)
        print(f"\n--- TEST DISEASED SAMPLE: {df} ---")
        print(f"  Display Title : {res_d['display_title']}")
        print(f"  Exact Disease : {res_d['exactDiseaseName']}")
        print(f"  Confidence %  : {res_d['confidence_pct']}%")
        print(f"  Is Normal     : {res_d['is_normal']}")
        print(f"  Risk Level    : {res_d['risk_level']}")

print("\n==================================================")
print("COMPLETED RESTORED ENGINE VERIFICATION")
print("==================================================")
