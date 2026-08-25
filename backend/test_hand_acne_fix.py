import os
import sys
import io
import importlib
import torch
import numpy as np
from PIL import Image, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import app.services.ai_inference as ai_mod
importlib.reload(ai_mod)
ai_mod._engine_instance = None # Reset singleton instance!

engine = ai_mod.get_inference_engine()

# 1. Normal Hand/Palm Skin
img_palm = Image.new("RGB", (300, 300), color=(215, 175, 145))
draw = ImageDraw.Draw(img_palm)
draw.line([50, 100, 250, 180], fill=(180, 140, 110), width=3)

buf = io.BytesIO()
img_palm.save(buf, format="JPEG")
res = engine.predict(buf.getvalue())
print(f"\n--- NORMAL PALM IMAGE TEST ---")
print(f"  Title      : {res['display_title']}")
print(f"  Class Index: {res['class_index']}")
print(f"  Confidence : {res['confidence_pct']}%")
print(f"  Is Normal  : {res['is_normal']}")

# 2. Acne Face Skin
img_acne = Image.new("RGB", (300, 300), color=(220, 180, 150))
draw_acne = ImageDraw.Draw(img_acne)
for _ in range(15):
    cx, cy = np.random.randint(50, 250), np.random.randint(50, 250)
    draw_acne.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(210, 40, 40))
    draw_acne.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 240, 220))

buf2 = io.BytesIO()
img_acne.save(buf2, format="JPEG")
res2 = engine.predict(buf2.getvalue())
print(f"\n--- ACNE FACE IMAGE TEST ---")
print(f"  Title      : {res2['display_title']}")
print(f"  Class Index: {res2['class_index']}")
print(f"  Confidence : {res2['confidence_pct']}%")
print(f"  Is Normal  : {res2['is_normal']}")
