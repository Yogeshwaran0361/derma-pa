import sys
import os
import json
import argparse
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

def load_trained_model(model_path, num_classes=10):
    sd = torch.load(model_path, map_location='cpu')
    model = models.resnet50(weights=None)
    
    if "fc.3.weight" in sd:
        out_f = sd["fc.3.weight"].shape[0]
        mid_f = sd["fc.1.weight"].shape[0]
        in_f = sd["fc.1.weight"].shape[1]
        model.fc = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(in_f, mid_f),
            nn.ReLU(),
            nn.Linear(mid_f, out_f)
        )
    elif "fc.4.weight" in sd:
        out_f = sd["fc.4.weight"].shape[0]
        mid_f = sd["fc.1.weight"].shape[0]
        in_f = sd["fc.1.weight"].shape[1]
        model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_f, mid_f),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(mid_f, out_f)
        )

    elif "fc.1.weight" in sd:
        out_f = sd["fc.1.weight"].shape[0]
        in_f = sd["fc.1.weight"].shape[1]
        model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_f, out_f)
        )
    elif "fc.weight" in sd:
        out_f = sd["fc.weight"].shape[0]
        in_f = sd["fc.weight"].shape[1]
        model.fc = nn.Linear(in_f, out_f)
    else:
        model.fc = nn.Sequential(nn.Dropout(0.4), nn.Linear(2048, num_classes))

    model.load_state_dict(sd)
    model.eval()
    return model

def main():
    parser = argparse.ArgumentParser(description="Standalone PyTorch Model Inference Test")
    parser.add_argument("image_path", type=str, nargs="?", help="Path to input skin image")
    parser.add_argument("--model", type=str, default=r"c:\Users\yoges\Downloads\techno\trained_skin_resnet50.pth", help="Path to trained .pth model file")
    parser.add_argument("--mapping", type=str, default=r"c:\Users\yoges\Downloads\techno\class_mapping.json", help="Path to class mapping JSON")
    args = parser.parse_args()

    if not args.image_path:
        default_img = r"C:\Users\yoges\.gemini\antigravity\brain\56d6a50b-d761-49ef-a2a7-b9ec32a6764a\healthy_skin_arm_1786453192537.jpg"
        if os.path.exists(default_img):
            args.image_path = default_img
        else:
            print("[ERROR] Please provide a valid skin image path.")
            sys.exit(1)

    print("==================================================")
    print("[AI TEST] STANDALONE PYTORCH MODEL INFERENCE TEST")

    print("==================================================")
    print(f"IMAGE: {args.image_path}")
    print(f"MODEL: {args.model}")

    if not os.path.exists(args.model):
        print(f"[ERROR] Model file not found: {args.model}")
        sys.exit(1)

    # 1. Load Class Mapping
    with open(args.mapping, 'r', encoding='utf-8') as f:
        raw_map = json.load(f)
    class_mapping = {int(k): v for k, v in raw_map.items()}
    print(f"CLASS MAPPING LOADED: {len(class_mapping)} Classes")

    # 2. Load PyTorch Model
    model = load_trained_model(args.model, len(class_mapping))
    print("[AI TEST] Model loaded successfully.")

    # 3. Exact Training Preprocessing Pipeline
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # 4. Load Image & Preprocess
    pil_img = Image.open(args.image_path).convert("RGB")
    tensor = transform(pil_img).unsqueeze(0)

    # 5. Forward Pass / Inference
    with torch.no_grad():
        logits = model(tensor)[0]
        probs = torch.softmax(logits, dim=0).numpy()

    top_idx = int(probs.argmax())
    top_class = class_mapping.get(top_idx, f"class_{top_idx}")
    confidence = float(probs[top_idx])

    print("\n--------------------------------------------------")
    print(f"PREDICTED CLASS : {top_class}")
    print(f"CLASS INDEX     : {top_idx}")
    print(f"CONFIDENCE      : {confidence * 100:.2f}%")
    print("--------------------------------------------------")
    print("ALL CLASS PROBABILITIES:")
    for idx in range(len(class_mapping)):
        c_name = class_mapping.get(idx, f"class_{idx}")
        c_prob = float(probs[idx]) * 100
        print(f"  [{idx:2d}] {c_name:<24}: {c_prob:6.2f}%")

if __name__ == '__main__':
    main()
