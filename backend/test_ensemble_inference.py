import os
import sys
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageDraw
import numpy as np

# Load 153-class model
m153_path = "backend/trained_skin_model.pth"
sd153 = torch.load(m153_path, map_location="cpu")
state153 = sd153.get("model_state_dict", sd153) if isinstance(sd153, dict) else sd153

model153 = models.efficientnet_b0(weights=None)
in_f153 = model153.classifier[1].in_features
out_f153 = state153["classifier.5.weight"].shape[0]
mid_f153 = state153["classifier.1.weight"].shape[0]

model153.classifier = nn.Sequential(
    nn.Dropout(p=0.3),
    nn.Linear(in_f153, mid_f153),
    nn.ReLU(),
    nn.BatchNorm1d(mid_f153),
    nn.Dropout(p=0.2),
    nn.Linear(mid_f153, out_f153)
)
model153.load_state_dict(state153)
model153.eval()

# Load 11-class model
m11_path = r"C:\Users\yoges\Downloads\derma\ai-service\models\skin_classifier.pth"
sd11 = torch.load(m11_path, map_location="cpu")
state11 = sd11.get("model_state_dict", sd11) if isinstance(sd11, dict) else sd11

model11 = models.resnet50(weights=None)
model11.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(2048, 11)
)
model11.load_state_dict(state11)
model11.eval()

# 11-class mapping:
map11 = [
    "melanoma",
    "basal_cell_carcinoma",
    "actinic_keratosis",
    "nevus_mole",
    "seborrheic_keratosis",
    "eczema_dermatitis",
    "psoriasis",
    "acne_rosacea",
    "tinea_fungal",
    "vascular_lesion",
    "benign_other"
]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def evaluate_multi(img, label):
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        out153 = torch.softmax(model153(tensor), dim=1)[0].numpy()
        out11 = torch.softmax(model11(tensor), dim=1)[0].numpy()

    top153 = int(out153.argmax())
    top11 = int(out11.argmax())

    print(f"\n==========================================")
    print(f"TEST IMAGE: {label}")
    print(f"153-Class Model Top: [{top153}] (Score: {out153[top153]*100:.2f}%) | Normal (101): {out153[101]*100:.2f}% | Acne (0): {out153[0]*100:.2f}%")
    print(f" 11-Class Model Top: [{top11}] {map11[top11]} ({out11[top11]*100:.2f}%) | Acne (7): {out11[7]*100:.2f}% | Normal (10): {out11[10]*100:.2f}%")

img_normal = Image.new("RGB", (300, 300), color=(215, 175, 145))
evaluate_multi(img_normal, "Plain Smooth Skin")

img_acne = Image.new("RGB", (300, 300), color=(220, 180, 150))
draw = ImageDraw.Draw(img_acne)
for _ in range(15):
    cx, cy = np.random.randint(50, 250), np.random.randint(50, 250)
    draw.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(210, 40, 40))
    draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 240, 220))
evaluate_multi(img_acne, "Pimple / Acne Skin")
