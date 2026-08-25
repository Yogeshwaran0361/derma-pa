import os
import sys
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = r"C:\Users\yoges\Downloads\techno"
DATASET_DIR = r"C:\Users\yoges\Downloads\derma\ai-service\data\processed\images"

print("[FineTune] Starting fine-tuning PyTorch AI skin model on updated dataset...")

class_names = sorted(os.listdir(DATASET_DIR))
class_to_idx = {name: i for i, name in enumerate(class_names)}

image_paths = []
labels = []

for c_name in class_names:
    c_dir = os.path.join(DATASET_DIR, c_name)
    if os.path.isdir(c_dir):
        for f in os.listdir(c_dir):
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif')):
                image_paths.append(os.path.join(c_dir, f))
                labels.append(class_to_idx[c_name])

print(f"[FineTune] Found {len(image_paths)} images across {len(class_names)} classes.")

class LocalSkinDataset(Dataset):
    def __init__(self, paths, labels, transform=None):
        self.paths = paths
        self.labels = labels
        self.transform = transform

    def __len__(self):
        return len(self.paths)

    def __getitem__(self, idx):
        img_path = self.paths[idx]
        img = Image.open(img_path).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, self.labels[idx]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

dataset = LocalSkinDataset(image_paths, labels, transform=transform)
loader = DataLoader(dataset, batch_size=16, shuffle=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[FineTune] Device: {device}")

ckpt_path = os.path.join(MODELS_DIR, "trained_skin_model.pth")

model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
in_features = model.classifier[1].in_features
model.classifier = nn.Sequential(
    nn.Dropout(0.2),
    nn.Linear(in_features, 153)
)

if os.path.exists(ckpt_path):
    try:
        sd = torch.load(ckpt_path, map_location=device)
        model.load_state_dict(sd, strict=False)
        print("[FineTune] Successfully loaded existing trained_skin_model.pth checkpoint.")
    except Exception as ex:
        print(f"[FineTune] Notice loading checkpoint: {ex}")

model = model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-4)

epochs = 3
print("[FineTune] Training epochs starting...")
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    for images, lbls in loader:
        images, lbls = images.to(device), lbls.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, lbls)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        total += lbls.size(0)
        correct += (preds == lbls).sum().item()

    acc = correct / total
    print(f"Epoch {epoch+1}/{epochs} -> Loss: {running_loss/total:.4f} | Acc: {acc*100:.2f}%")

torch.save(model.state_dict(), ckpt_path)
print(f"[FineTune] Saved retrained model weights to {ckpt_path}!")
