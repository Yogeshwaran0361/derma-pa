import os
import sys
import io
import torch
import numpy as np
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ai_inference import get_inference_engine

engine = get_inference_engine()

sample_dir = r"C:\Users\yoges\Downloads\sample img"
files = [f for f in os.listdir(sample_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif'))]

print(f"==================================================")
print(f"RAW MODEL PREDICTION AUDIT FOR ALL {len(files)} IMAGES:")
print(f"==================================================")

for fname in files:
    fpath = os.path.join(sample_dir, fname)
    try:
        with open(fpath, "rb") as f:
            img_bytes = f.read()
        pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        tensor = engine.transform(pil_img).unsqueeze(0).to(engine.device)
        
        with torch.no_grad():
            out = engine.models[0](tensor)
            probs = torch.softmax(out, dim=1)[0].cpu().numpy()[:engine.num_classes]
        
        top_i = int(probs.argmax())
        top_prob = float(probs[top_i]) * 100.0
        top_class_name = engine.class_names[top_i] if top_i < len(engine.class_names) else f"Class_{top_i}"
        
        # Sort top 5 predictions
        sorted_indices = np.argsort(probs)[::-1][:5]
        top_5_str = ", ".join([f"{engine.class_names[i]}: {probs[i]*100:.1f}%" for i in sorted_indices])

        print(f"File: {fname:<44} | Raw Top Class: {top_class_name:<30} ({top_prob:.1f}%) | Top5: {top_5_str}")
    except Exception as ex:
        print(f"File: {fname:<44} | ERROR: {ex}")
