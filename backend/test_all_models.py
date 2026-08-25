import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageDraw
import numpy as np

# Audit the 11-class skin_classifier.pth model
model_11_path = r"C:\Users\yoges\Downloads\derma\ai-service\models\skin_classifier.pth"
if os.path.exists(model_11_path):
    sd = torch.load(model_11_path, map_location="cpu")
    print("[MODEL 11-CLASS] Found checkpoint:", model_11_path)
    if isinstance(sd, dict):
        print("Keys in sd:", list(sd.keys()))
        state = sd.get("model_state_dict", sd)
    else:
        state = sd
    
    # Check output shape
    for k, v in state.items():
        if "fc" in k or "classifier" in k:
            print(f"  {k}: {v.shape}")

# Let's inspect class names associated with 11-class model or dataset in derma
labels_file = r"C:\Users\yoges\Downloads\derma\ai-service\models\class_names.json"
if os.path.exists(labels_file):
    with open(labels_file, "r") as f:
        print("Class names in derma:", json.load(f))
else:
    print("No class_names.json in derma/models, searching for json/txt in derma folder...")
    for root, dirs, files in os.walk(r"C:\Users\yoges\Downloads\derma"):
        for file in files:
            if file.endswith(".json") or file.endswith(".txt"):
                p = os.path.join(root, file)
                if "class" in file.lower() or "label" in file.lower() or "mapping" in file.lower():
                    print("Found file:", p)
