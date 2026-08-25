import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

model_path = r"C:\Users\yoges\Downloads\derma\ai-service\models\skin_classifier.pth"
sd = torch.load(model_path, map_location="cpu")
state = sd.get("model_state_dict", sd) if isinstance(sd, dict) else sd

model = models.resnet50(weights=None)
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(2048, 11)
)
model.load_state_dict(state)
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

def eval_dir(dir_path, expected_name):
    if not os.path.exists(dir_path):
        print(f"Dir not found: {dir_path}")
        return
    files = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if f.endswith(('.jpg', '.png', '.jpeg'))][:5]
    print(f"\n--- EVALUATING REAL IMAGES FROM {expected_name} ---")
    for f in files:
        pil_img = Image.open(f).convert("RGB")
        tensor = transform(pil_img).unsqueeze(0)
        with torch.no_grad():
            out = torch.softmax(model(tensor), dim=1)[0].numpy()
        top_i = int(out.argmax())
        print(f"  File: {os.path.basename(f):<30} -> Predicted: [{top_i:2d}] {class_names[top_i]:<22} ({out[top_i]*100:6.2f}%)")

eval_dir(r"C:\Users\yoges\Downloads\derma\ai-service\data\processed\images\acne_rosacea", "ACNE ROSACEA")
eval_dir(r"C:\Users\yoges\Downloads\derma\ai-service\data\processed\images\benign_other", "BENIGN OTHER")
eval_dir(r"C:\Users\yoges\Downloads\derma\ai-service\data\processed\images\melanoma", "MELANOMA")
