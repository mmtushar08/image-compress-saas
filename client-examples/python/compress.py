import requests

def compress_image():
    try:
        response = requests.post(
            "https://api.shrinkix.com/compress",
            files={"image": open("input.png", "rb")},
            headers={"X-API-Key": "YOUR_API_KEY"}
        )

        if response.status_code == 200:
            with open("output.png", "wb") as f:
                f.write(response.content)
            print("Compression successful!")
        else:
            print(f"Compression failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    compress_image()
