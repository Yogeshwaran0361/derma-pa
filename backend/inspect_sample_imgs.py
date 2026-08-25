import os
import sys
import io
import numpy as np
from PIL import Image

sample_dir = r"C:\Users\yoges\Downloads\sample img"

files = [f for f in os.listdir(sample_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

print(f"==================================================")
print(f"INSPECTING ALL {len(files)} SAMPLE IMAGES IN {sample_dir}:")
print(f"==================================================")

for fname in files:
    fpath = os.path.join(sample_dir, fname)
    img = Image.open(fpath).convert("RGB")
    w, h = img.size
    arr = np.array(img.resize((200, 200)), dtype=np.float32)
    r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
    
    skin_mask = (r > 35.0) & (g > 25.0) & (b > 15.0) & (r >= (g - 15.0)) & (r >= (b - 15.0))
    skin_ratio = float(np.mean(skin_mask))
    
    m_acne1 = r > (g + 55.0)
    m_acne2 = r > (b + 55.0)
    m_acne3 = r > 140.0
    acne_spot_mask = skin_mask & m_acne1 & m_acne2 & m_acne3
    acne_spot_count = int(np.sum(acne_spot_mask))
    
    m_dark1 = r < 50.0
    m_dark2 = g < 40.0
    m_dark3 = b < 35.0
    lesion_dark_mask = skin_mask & m_dark1 & m_dark2 & m_dark3
    lesion_dark_count = int(np.sum(lesion_dark_mask))
    
    m_red1 = r > (g + 60.0)
    m_red2 = g > (b + 20.0)
    lesion_red_mask = skin_mask & m_red1 & m_red2
    lesion_red_count = int(np.sum(lesion_red_mask))
    
    print(f"File: {fname:<45} | Size: {w:4d}x{h:4d} | SkinRatio: {skin_ratio:.2f} | AcneSpots: {acne_spot_count:4d} | DarkSpots: {lesion_dark_count:4d} | RedSpots: {lesion_red_count:4d}")
