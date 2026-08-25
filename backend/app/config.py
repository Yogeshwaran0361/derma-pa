import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
WORKSPACE_DIR = BASE_DIR

# Model Paths — Prioritize trained_skin_model.pth and class_mapping.json
weights_candidates = [
    BASE_DIR / "trained_skin_model.pth",
    BASE_DIR / "backend" / "trained_skin_model.pth",
    BASE_DIR / "skin_classifier (2).pth",
    BASE_DIR / "skin_classifier.pth",
    BASE_DIR.parent / "trained_skin_model.pth",
    BASE_DIR.parent / "skin_classifier.pth"
]
WEIGHTS_PATH = next((str(p) for p in weights_candidates if p.exists()), str(BASE_DIR / "trained_skin_model.pth"))

mapping_candidates = [
    BASE_DIR / "class_mapping.json",
    BASE_DIR / "backend" / "class_mapping.json",
    BASE_DIR / "class_mapping (2).json",
    BASE_DIR.parent / "class_mapping.json"
]
MAPPING_PATH = next((str(p) for p in mapping_candidates if p.exists()), str(BASE_DIR / "class_mapping.json"))

# Quality Check Thresholds — Realistically tuned for all valid skin photos and close-ups
MIN_RESOLUTION_WIDTH = 50
MIN_RESOLUTION_HEIGHT = 50
LAPLACIAN_BLUR_THRESHOLD = 5.0     # Below 5.0 is unreadable noise
MIN_BRIGHTNESS_THRESHOLD = 5.0      # Below 5.0 is pure black
MAX_BRIGHTNESS_THRESHOLD = 250.0    # Above 250.0 is pure white

# Confidence Thresholding
MIN_CONFIDENCE_THRESHOLD = 5.0      # 5% confidence reporting threshold

# Server Settings
HOST = "0.0.0.0"
PORT = 8000
