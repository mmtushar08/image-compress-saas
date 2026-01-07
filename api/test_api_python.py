import requests
import os

# Ensure test.png exists
if not os.path.exists('test.png'):
    print("Error: test.png not found")
    exit(1)

print("Testing Free Tier...")
# Free tier
with open('test.png', 'rb') as f:
    response = requests.post(
        'http://localhost:5000/api/compress',
        files={'image': f}
    )

if response.status_code == 200:
    print("Free tier success")
    with open('compressed_python_free.png', 'wb') as f:
        f.write(response.content)
else:
    print(f"Free tier failed: {response.status_code} - {response.text}")

print("\nTesting Pro Tier...")
# Pro tier
with open('test.png', 'rb') as f:
    response = requests.post(
        'http://localhost:5000/api/compress',
        headers={'X-API-Key': 'tr_f23ffe0e410f940a26b1354f7a134ea1'},
        files={'image': ('test.png', f, 'image/png')}
    )

if response.status_code == 200:
    print("Pro tier success")
    with open('compressed_python_pro.png', 'wb') as f:
        f.write(response.content)
    
    print(f"Original: {response.headers.get('X-Original-Size')} bytes")
    print(f"Compressed: {response.headers.get('X-Compressed-Size')} bytes")
    print(f"Saved: {response.headers.get('X-Saved-Percent')}%")
else:
    print(f"Pro tier failed: {response.status_code} - {response.text}")
