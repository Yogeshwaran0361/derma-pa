import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageDraw
import numpy as np

# Load 11-class model
model_path = r"C:\Users\yoges\Downloads\derma\ai-service\models\skin_classifier.pth"
sd = torch.load(model_path, map_location="cpu")

model = models.resnet50(weights=None)
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(2048, 11)
)

model.load_state_dict(sd)
model.eval()

class_names = [
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

def evaluate_img(img, label):
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1)[0].numpy()
    
    top_idx = int(probs.argmax())
    print(f"\n=== 11-CLASS MODEL TEST: {label} ===")
    print(f"PREDICTED: [{top_idx}] {class_names[top_idx]} ({probs[top_idx]*100:.2f}%)")
    for i, name in enumerate(class_names):
        print(f"  [{i:2d}] {name:<25}: {probs[i]*100:6.2f}%")

# 1. Plain Smooth Skin
img_normal = Image.new("RGB", (300, 300), color=(220, 180, 150))
evaluate_img(img_normal, "Plain Normal Skin")

# 2. Acne Pimple Skin
img_acne = Image.new("RGB", (300, 300), color=(220, 180, 150))
draw = ImageDraw.Draw(img_acne)
for _ in range(15):
    cx, cy = np.random.randint(50, 250), np.random.randint(50, 250)
    draw.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(210, 40, 40))
    draw.ellipse([cx-3, cy-3, cx+3, cy+3], fill=(255, 240, 220))
evaluate_img(img_acne, "Skin with Pimple/Acne Spots")

# 3. Non-Skin (Blue)
img_blue = Image.new("RGB", (300, 300), color=(20, 40, 180))
evaluate_img(img_blue, "Non-Skin (Blue)")
