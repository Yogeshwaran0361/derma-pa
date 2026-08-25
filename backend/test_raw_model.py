import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageDraw
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Load Class Mapping
with open(os.path.join(BASE_DIR, "class_mapping.json"), "r", encoding="utf-8") as f:
    raw_map = json.load(f)

idx_to_class = {}
for k, v in raw_map.items():
    idx = int(k)
    if isinstance(v, dict):
        idx_to_class[idx] = v.get("exact_disease_name", v.get("technical_class", f"Class_{idx}"))
    else:
        idx_to_class[idx] = str(v)

class_names = [idx_to_class[i] for i in sorted(idx_to_class.keys())]

print(f"[AUDIT] Loaded {len(class_names)} classes.")
print(f"Class 0: {class_names[0]}")
print(f"Class 101: {class_names[101] if len(class_names) > 101 else 'N/A'}")

# 2. Load PyTorch Checkpoint
pth_path = os.path.join(BASE_DIR, "trained_skin_model.pth")
sd = torch.load(pth_path, map_location="cpu")
if isinstance(sd, dict) and "model_state_dict" in sd:
    sd = sd["model_state_dict"]

model = models.efficientnet_b0(weights=None)
in_features = model.classifier[1].in_features
out_f = sd["classifier.5.weight"].shape[0]
mid_f = sd["classifier.1.weight"].shape[0]

model.classifier = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(in_features, mid_f),
    nn.ReLU(),
    nn.BatchNorm1d(mid_f),
    nn.Dropout(p=0.2),
    nn.Linear(mid_f, out_f)
)

model.load_state_dict(sd)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def test_image(img, label=""):
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        out = model(tensor)
        probs = torch.softmax(out, dim=1)[0].numpy()
    
    top_5_idx = probs.argsort()[::-1][:5]
    print(f"\n--- TEST: {label} ---")
    for rank, idx in enumerate(top_5_idx):
        print(f"  #{rank+1}: [{idx:3d}] {class_names[idx]:<40} : {probs[idx]*100:6.2f}%")

# Create synthetic images to test raw model response:
# 1. Plain smooth skin color (Normal skin test)
img_normal = Image.new("RGB", (300, 300), color=(220, 180, 150))
test_image(img_normal, "Plain Smooth Skin (Normal)")

# 2. Smooth skin with red pimple dots (Acne test)
img_acne = Image.new("RGB", (300, 300), color=(220, 180, 150))
draw = ImageDraw.Draw(img_acne)
for _ in range(15):
    cx, cy = np.random.randint(50, 250), np.random.randint(50, 250)
    draw.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(210, 40, 40))
    draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 240, 220))
test_image(img_acne, "Skin with Pimple/Acne Spots")

# 3. Non-skin image (Blue background)
img_nonskin = Image.new("RGB", (300, 300), color=(20, 40, 180))
test_image(img_nonskin, "Non-Skin (Blue)")
