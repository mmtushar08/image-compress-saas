# SmartCompress Python Client

Official Python client for the SmartCompress API.

## Installation

```bash
pip install smartcompress
```

## Usage

```python
from smartcompress import SmartCompress

client = SmartCompress("YOUR_API_KEY")

try:
    client.from_file("input.png", "output.png", {
        "width": 500,
        "quality": 80
    })
    print("Done!")
except Exception as e:
    print(e)
```
