# Shrinkix Python SDK

Official Python client for the [Shrinkix Image Compression API](https://shrinkix.com).

## Installation

```bash
pip install shrinkix
```
*(Coming soon to PyPI)*

## Usage

### 1. Initialize

```python
from shrinkix import Client

client = Client('YOUR_API_KEY')
```

### 2. Compress an Image

```python
try:
    client.compress('photo.jpg', {
        'quality': 80,
        'to_file': 'compressed.jpg' # Save directly
    })
    print("Done!")
except Exception as e:
    print(e)
```

### 3. Convert Format

```python
client.convert('logo.png', 'webp', {
    'to_file': 'logo.webp',
    'quality': 90
})
```

### 4. Check Account

```python
usage = client.account()
print(f"Remaining: {usage['remaining']}")
```

## API Reference

### `compress(image_path, options)`
- **image_path**: `str`
- **options**: `dict`
    - `quality`: `int` (1-100)
    - `width`: `int`
    - `height`: `int`
    - `format`: `str` ('webp', 'avif', etc)
    - `preserveMetadata`: `bool`
    - `to_file`: `str` (output path)

## Error Handling

- `ShrinkixAuthError`: Invalid Key (401)
- `ShrinkixLimitError`: Quota Exceeded (429)
- `ShrinkixError`: General API errors
