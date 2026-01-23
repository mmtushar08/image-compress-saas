# Shrinkix API Documentation

## Authentication

Pro users can authenticate using API keys sent in the request headers.

### API Key Header
```
X-API-Key: your_api_key_here
```

## Endpoints

### 1. Compress Image

**Endpoint:** `POST /api/compress`

**Description:** Compress a PNG, JPG, or WebP image

**Headers:**
- `X-API-Key` (optional): Your Pro API key for unlimited access

**Body (multipart/form-data):**
- `image`: The image file to compress

**Query Parameters:**
- `format` (optional): Output format (`png`, `jpg`, `jpeg`, `webp`)

**Response Headers:**
- `X-Original-Size`: Original file size in bytes
- `X-Compressed-Size`: Compressed file size in bytes
- `X-Saved-Percent`: Percentage saved

**Response:** Compressed image file

**Example (cURL):**
```bash
# Free tier (20 images/day)
curl -X POST http://localhost:5000/api/compress \
  -F "image=@photo.jpg"

# Pro tier (unlimited)
curl -X POST http://localhost:5000/api/compress \
  -H "X-API-Key: sk_live_your_api_key" \
  -F "image=@photo.jpg"

# Convert to WebP
curl -X POST "http://localhost:5000/api/compress?format=webp" \
  -H "X-API-Key: sk_live_your_api_key" \
  -F "image=@photo.png" \
  -o compressed.webp
```

**Example (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:5000/api/compress', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_live_your_api_key' // Optional for Pro users
  },
  body: formData
});

const blob = await response.blob();
const originalSize = response.headers.get('X-Original-Size');
const compressedSize = response.headers.get('X-Compressed-Size');
const savedPercent = response.headers.get('X-Saved-Percent');

console.log(`Saved ${savedPercent}% (${originalSize} → ${compressedSize} bytes)`);
```

**Example (Python):**
```python
import requests

# Free tier
with open('photo.jpg', 'rb') as f:
    # Explicitly set filename and MIME type
    response = requests.post(
        'http://localhost:5000/api/compress',
        files={'image': ('photo.jpg', f, 'image/jpeg')}
    )

# Pro tier
with open('photo.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:5000/api/compress',
        headers={'X-API-Key': 'sk_live_your_api_key'},
        files={'image': ('photo.jpg', f, 'image/jpeg')}
    )

with open('compressed.jpg', 'wb') as f:
    f.write(response.content)

print(f"Original: {response.headers['X-Original-Size']} bytes")
print(f"Compressed: {response.headers['X-Compressed-Size']} bytes")
print(f"Saved: {response.headers['X-Saved-Percent']}%")
```

**Example (PHP):**
```php
<?php
$ch = curl_init();

// Create a CURLFile object
$cfile = new CURLFile('photo.jpg', 'image/jpeg', 'photo.jpg');
$data = ['image' => $cfile];

curl_setopt($ch, CURLOPT_URL, 'http://localhost:5000/api/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// For Pro tier headers
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: sk_live_your_api_key'
]);

// Include headers in the output to get the stats
curl_setopt($ch, CURLOPT_HEADER, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    
    // Save compressed file
    file_put_contents('compressed.jpg', $body);
    
    echo "Compression complete!";
}

curl_close($ch);
?>
```

---

### 2. Check Rate Limit

**Endpoint:** `GET /api/check-limit`

**Description:** Check remaining compressions for the current day

**Headers:**
- `X-API-Key` (optional): Your Pro API key

**Response:**
```json
{
  "remaining": 15,
  "plan": "free"
}
```

For Pro users:
```json
{
  "remaining": -1,
  "plan": "pro"
}
```
*Note: `-1` means unlimited*

**Example:**
```bash
# Check free tier limit
curl http://localhost:5000/api/check-limit

# Check Pro tier limit
curl -H "X-API-Key: sk_live_your_api_key" \
  http://localhost:5000/api/check-limit
```

---

## Rate Limits

### Free Tier
- **Limit:** 20 compressions per day
- **Max file size:** 10 MB
- **Resets:** Daily at midnight UTC

### Pro Tier ($5/mo)
- **Limit:** Unlimited compressions
- **Max file size:** 25 MB
- **API Access:** Yes
- **Requires:** Valid API key

### Ultra Tier ($15/mo)
- **Limit:** Unlimited compressions
- **Max file size:** 100 MB
- **API Access:** Yes
- **Priority:** Fast-lane processing
- **Analytics:** Usage statistics

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "No image uploaded"
}
```

### 429 Too Many Requests
```json
{
  "error": "Daily limit reached. Please upgrade to Pro."
}
```

### 500 Internal Server Error
```json
{
  "error": "Compression failed",
  "details": "Engine did not create output file"
}
```

---

## Supported Formats

- **Input:** PNG, JPG, JPEG, WebP
- **Output:** PNG, JPG, JPEG, WebP (specify with `?format=` parameter)

---

## Getting Your API Key

1. Sign up for a Pro or Ultra plan
2. Your API key will be sent to your email
3. Keep your API key secure - treat it like a password
4. Include it in the `X-API-Key` header for all requests

---

## Best Practices

1. **Store API keys securely** - Use environment variables, never commit to git
2. **Handle errors gracefully** - Check response status codes
3. **Respect rate limits** - Cache compressed images when possible
4. **Use appropriate formats** - WebP for web, PNG for transparency, JPG for photos
5. **Batch processing** - Compress multiple images in parallel for better performance
