import os
import shutil
import numpy as np
from PIL import Image, ImageEnhance

sample_dir = r"C:\Users\yoges\Downloads\sample img"
target_dir = r"C:\Users\yoges\Downloads\derma\ai-service\data\processed\images\benign_other"

os.makedirs(target_dir, exist_ok=True)

files = [f for f in os.listdir(sample_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif'))]

print(f"==================================================")
print(f"ADDING {len(files)} NORMAL HAND/SKIN IMAGES TO TRAINING DATASET:")
print(f"==================================================")

added_count = 0
for fname in files:
    src_path = os.path.join(sample_dir, fname)
    try:
        img = Image.open(src_path).convert("RGB")
        
        # 1. Save original to target dataset
        base_name = os.path.splitext(fname)[0]
        out_orig = os.path.join(target_dir, f"sample_normal_{base_name}.jpg")
        img.save(out_orig, "JPEG", quality=95)
        added_count += 1
        
        # 2. Save horizontal flip
        img_hflip = img.transpose(Image.FLIP_LEFT_RIGHT)
        out_hflip = os.path.join(target_dir, f"sample_normal_{base_name}_hflip.jpg")
        img_hflip.save(out_hflip, "JPEG", quality=95)
        added_count += 1
        
        # 3. Save vertical flip
        img_vflip = img.transpose(Image.FLIP_TOP_BOTTOM)
        out_vflip = os.path.join(target_dir, f"sample_normal_{base_name}_vflip.jpg")
        img_vflip.save(out_vflip, "JPEG", quality=95)
        added_count += 1
        
        # 4. Save rotated 90
        img_r90 = img.rotate(90, expand=True)
        out_r90 = os.path.join(target_dir, f"sample_normal_{base_name}_r90.jpg")
        img_r90.save(out_r90, "JPEG", quality=95)
        added_count += 1

        # 5. Save brightness variation
        enhancer = ImageEnhance.Brightness(img)
        img_bright = enhancer.enhance(1.15)
        out_bright = os.path.join(target_dir, f"sample_normal_{base_name}_bright.jpg")
        img_bright.save(out_bright, "JPEG", quality=95)
        added_count += 1

        print(f"Added: {fname} (+ 4 augmented variants)")
    except Exception as ex:
        print(f"Failed to process {fname}: {ex}")

print(f"\nSuccessfully added {added_count} total normal skin images to dataset!")
