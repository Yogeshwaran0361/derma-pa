import os
import sys
import io
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.services.ai_inference import get_inference_engine

engine = get_inference_engine()

# Load user screenshot image
user_img_path = r"C:\Users\yoges\.gemini\antigravity\brain\4d19b3d5-1fd6-4198-b28b-fdb011ec37c7\.user_uploaded\media_1787366309895.png"

if os.path.exists(user_img_path):
    full_img = Image.open(user_img_path).convert("RGB")
    w, h = full_img.size
    
    # Crop the scanned image preview from the screenshot
    # In the screenshot, the hand preview is in the center
    hand_crop = full_img.crop((int(w * 0.38), int(h * 0.27), int(w * 0.58), int(h * 0.67)))
    
    buf = io.BytesIO()
    hand_crop.save(buf, format="JPEG")

    res = engine.predict(buf.getvalue())
    print("\n==========================================")
    print("USER PALM IMAGE PREDICTION TEST RESULT:")
    print(f"  Exact Disease Name : {res['exactDiseaseName']}")
    print(f"  Display Title      : {res['display_title']}")
    print(f"  Class Index        : {res['class_index']}")
    print(f"  Confidence %       : {res['confidence_pct']}%")
    print(f"  Is Normal          : {res['is_normal']}")
    print(f"  Risk Level         : {res['risk_level']}")
    print("==========================================")
else:
    print("User screenshot image file not found.")
