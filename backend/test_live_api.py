import urllib.request
import json
import io
import os
from PIL import Image

def test_api(img, label):
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(b'Content-Disposition: form-data; name="file"; filename="test.jpg"')
    body.append(b'Content-Type: image/jpeg')
    body.append(b'')
    body.append(img_bytes)
    body.append(f'--{boundary}--'.encode())
    body.append(b'')

    payload = b'\r\n'.join(body)

    req = urllib.request.Request("http://localhost:8000/api/predict", data=payload)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"\n=== API TEST: {label} ===")
            print(f"  Exact Disease : {data.get('exactDiseaseName')}")
            print(f"  Display Title : {data.get('display_title')}")
            print(f"  Confidence    : {data.get('confidence')}%")
            print(f"  Is Normal     : {data.get('is_normal')}")
            print(f"  Risk Level    : {data.get('risk_level')}")
            return data
    except Exception as e:
        print(f"API Request Error on {label}: {e}")
        return None

# Load actual user palm image from screenshot
user_img_path = r"C:\Users\yoges\.gemini\antigravity\brain\4d19b3d5-1fd6-4198-b28b-fdb011ec37c7\.user_uploaded\media_1787366309895.png"
if os.path.exists(user_img_path):
    full_img = Image.open(user_img_path).convert("RGB")
    w, h = full_img.size
    hand_crop = full_img.crop((int(w * 0.38), int(h * 0.27), int(w * 0.58), int(h * 0.67)))
    test_api(hand_crop, "Actual User Palm Image from Screenshot")
