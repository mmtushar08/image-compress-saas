import requests
import os

API_URL = 'http://localhost:5001/api/compress'
API_KEY = 'sk_live_test_key'
INPUT_IMAGE = os.path.join(os.path.dirname(__file__), '../test.png')
OUTPUT_IMAGE = os.path.join(os.path.dirname(__file__), '../compressed_python.png')

def verify_compression():
    print("2. Testing Python Compression...")

    if not os.path.exists(INPUT_IMAGE):
        print(f"FAILED: Test image not found at {INPUT_IMAGE}")
        exit(1)

    try:
        with open(INPUT_IMAGE, 'rb') as f:
            files = {'image': ('test.png', f, 'image/png')}
            # headers = {'X-API-Key': API_KEY}
            
            response = requests.post(API_URL, files=files)
            
            if response.status_code != 200:
                print(f"FAILED: HTTP {response.status_code}: {response.text}")
                exit(1)
            
                
            print("SUCCESS: Python Compression Successful!")
            print(f"Saved to: {OUTPUT_IMAGE}")
            print("Headers:", {
                'X-Original-Size': response.headers.get('X-Original-Size'),
                'X-Compressed-Size': response.headers.get('X-Compressed-Size'),
                'X-Saved-Percent': response.headers.get('X-Saved-Percent')
            })

    except Exception as e:
        print(f"FAILED: Python Compression Failed: {e}")
        exit(1)

if __name__ == "__main__":
    verify_compression()
