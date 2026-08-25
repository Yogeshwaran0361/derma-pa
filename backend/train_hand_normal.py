import os
import sys
import io
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = r"C:\Users\yoges\Downloads\techno"
DATASET_DIR = r"C:\Users\yoges\Downloads\derma\ai-service\data\processed\images"
SAMPLE_DIR = r"C:\Users\yoges\Downloads\sample img"

print("[TrainHand] Starting high-speed model fine-tuning for Normal / Healthy Skin...", flush=True)

sample_files = [f for f in os.listdir(SAMPLE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif'))]
images_list = []
labels_list = []

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

for fname in sample_files:
    fpath = os.path.join(SAMPLE_DIR, fname)
    try:
        img = Image.open(fpath).convert("RGB")
        img_t = transform(img)
        images_list.append(img_t)
        labels_list.append(101) # Class 101 = Normal / Healthy Skin
        
        img_h = transform(img.transpose(Image.FLIP_LEFT_RIGHT))
        images_list.append(img_h)
        labels_list.append(101)
        
        img_v = transform(img.transpose(Image.FLIP_TOP_BOTTOM))
        images_list.append(img_v)
        labels_list.append(101)
    except Exception as e:
        print(f"Error loading {fname}: {e}", flush=True)

print(f"[TrainHand] Prepared {len(images_list)} normal skin training tensors.", flush=True)

class TensorDataset(Dataset):
    def __init__(self, tensors, labels):
        self.tensors = torch.stack(tensors)
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.tensors)

    def __getitem__(self, idx):
        return self.tensors[idx], self.labels[idx]

train_ds = TensorDataset(images_list, labels_list)
train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[TrainHand] Training on device: {device}", flush=True)

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
        print("[TrainHand] Loaded existing trained_skin_model.pth checkpoint.", flush=True)
    except Exception as ex:
        print(f"[TrainHand] Notice checkpoint: {ex}", flush=True)

model = model.to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=5e-4)

model.train()
for epoch in range(5):
    running_loss = 0.0
    correct = 0
    total = 0
    for imgs, lbls in train_loader:
        imgs, lbls = imgs.to(device), lbls.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, lbls)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * imgs.size(0)
        _, preds = torch.max(outputs, 1)
        total += lbls.size(0)
        correct += (preds == lbls).sum().item()

    acc = correct / total
    print(f"Epoch {epoch+1}/5 -> Loss: {running_loss/total:.4f} | Acc: {acc*100:.2f}%", flush=True)

torch.save(model.state_dict(), ckpt_path)
print(f"[TrainHand] SUCCESS! Saved fine-tuned PyTorch model weights to {ckpt_path}!", flush=True)
