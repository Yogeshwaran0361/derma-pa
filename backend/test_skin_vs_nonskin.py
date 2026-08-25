import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageDraw
import numpy as np

# Load 2-class skin vs non-skin model
model_path = "backend/skin_vs_nonskin_model.pth"
sd = torch.load(model_path, map_location="cpu")

model = models.efficientnet_b0(weights=None)
model.classifier = nn.Sequential(
    nn.Dropout(0.2),
    nn.Linear(1280, 1024),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(1024, 2)
)

# Check state dict structure
state = sd.get("model_state_dict", sd) if isinstance(sd, dict) else sd
try:
    model.load_state_dict(state)
    print("[SKIN VS NON-SKIN MODEL] Loaded successfully!")
except Exception as e:
    print("[SKIN VS NON-SKIN MODEL] Error loading state_dict:", e)

model.eval()

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
    
    print(f"=== {label} ===")
    print(f"  Non-Skin (Class 0): {probs[0]*100:6.2f}%")
    print(f"  Skin     (Class 1): {probs[1]*100:6.2f}%")

# 1. Plain Smooth Skin
img_normal = Image.new("RGB", (300, 300), color=(220, 180, 150))
evaluate_img(img_normal, "Plain Normal Skin")

# 2. Non-Skin (Blue)
img_blue = Image.new("RGB", (300, 300), color=(20, 40, 180))
evaluate_img(img_blue, "Non-Skin (Blue)")
