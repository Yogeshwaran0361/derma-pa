import urllib.request
import json
import io
import os

sample_dir = r"C:\Users\yoges\Downloads\sample img"
files = [f for f in os.listdir(sample_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif'))]

print(f"==================================================")
print(f"TESTING LIVE FASTAPI API (http://localhost:8000/api/predict)")
print(f"FOR ALL {len(files)} IMAGES IN '{sample_dir}':")
print(f"==================================================")

for idx, fname in enumerate(files, 1):
    fpath = os.path.join(sample_dir, fname)
    with open(fpath, "rb") as f:
        img_bytes = f.read()

    ext = os.path.splitext(fname)[1].lower().strip('.')
    mime_type = "image/jpeg" if ext in ["jpg", "jpeg"] else (f"image/{ext}" if ext in ["png", "webp"] else "application/octet-stream")

    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="file"; filename="{fname}"'.encode())
    body.append(f'Content-Type: {mime_type}'.encode())
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
            print(f"{idx:2d}. {fname:<44} -> {data.get('display_title'):<30} Conf: {data.get('confidence'):>5.1f}% [{data.get('risk_level')}]")
    except Exception as e:
        print(f"{idx:2d}. {fname:<44} -> API Error: {e}")
