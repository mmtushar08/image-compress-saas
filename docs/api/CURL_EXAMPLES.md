# cURL API Examples

Complete cURL examples for the Shrinkix Image Optimization API.

## Authentication

All requests require an API key:

```bash
export SHRINKIX_API_KEY="sk_live_your_api_key_here"
```

---

## 1. Basic Optimization

Compress an image with default settings:

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -o optimized.jpg
```

---

## 2. With Quality Control

Set custom quality (1-100):

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -F "quality=80" \
  -o optimized.jpg
```

---

## 3. Resize Image

Resize to specific dimensions:

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -F 'resize={"width":1200,"height":800,"fit":"contain"}' \
  -o resized.jpg
```

**Fit options:**
- `contain` - Fit within dimensions (maintains aspect ratio)
- `cover` - Fill dimensions (may crop)

---

## 4. Format Conversion

Convert to WebP:

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -F "format=webp" \
  -F "quality=80" \
  -o photo.webp
```

**Supported formats:**
- `jpg` / `jpeg`
- `png`
- `webp`
- `avif` (Pro+ only)

---

## 5. Multiple Operations

Resize + Convert + Compress:

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -F 'resize={"width":1200,"height":800}' \
  -F "format=webp" \
  -F "quality=80" \
  -o optimized.webp
```

---

## 6. Crop Image

Crop to specific ratio:

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -F 'crop={"mode":"center","ratio":"16:9"}' \
  -o cropped.jpg
```

**Supported ratios:**
- `1:1` (square)
- `4:3`
- `16:9`
- `3:4` (portrait)

---

## 7. Preserve Metadata

Keep EXIF data (Business plan only):

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -F "metadata=keep" \
  -o photo_with_metadata.jpg
```

---

## 8. Sandbox Mode

Test without consuming quota:

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -H "X-Mode: sandbox" \
  -F "image=@test.jpg" \
  -o test_output.jpg
```

---

## 9. Get Plan Limits

Check your plan capabilities:

```bash
curl https://api.shrinkix.com/v1/limits \
  -H "Authorization: Bearer $SHRINKIX_API_KEY"
```

**Response:**
```json
{
  "plan": "api-pro",
  "max_file_size_mb": "10",
  "max_pixels": 36000000,
  "max_operations": 2,
  "formats": ["jpg", "png", "webp"],
  "features": ["compress", "resize"],
  "rate_limit": 2
}
```

---

## 10. Validate Before Upload

Pre-validate image parameters:

```bash
curl -X POST https://api.shrinkix.com/v1/validate \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "fileSize": 5000000,
    "format": "jpg",
    "width": 2000,
    "height": 1500
  }'
```

**Response:**
```json
{
  "valid": true,
  "warnings": [],
  "plan": "api-pro",
  "limits": {
    "max_file_size_mb": "10",
    "max_pixels": 36000000,
    "allowed_formats": ["jpg", "png", "webp"]
  }
}
```

---

## 11. Get Usage Statistics

Check current usage:

```bash
curl https://api.shrinkix.com/usage/stats \
  -H "Authorization: Bearer $SHRINKIX_API_KEY"
```

**Response:**
```json
{
  "usage": {
    "used": 245,
    "remaining": 4755,
    "total": 5000,
    "percentage": 4.9
  },
  "plan": {
    "id": "api-pro",
    "name": "Api Pro",
    "base_limit": 5000
  },
  "cycle": {
    "reset_at": "2026-02-01T00:00:00Z",
    "days_until_reset": 10
  }
}
```

---

## 12. View Response Headers

See rate limit info:

```bash
curl -i -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg" \
  -o optimized.jpg
```

**Headers:**
```
X-RateLimit-Limit: 2
X-RateLimit-Remaining: 1
X-RateLimit-Reset: 1700000000
X-Request-ID: req_abc123
X-Original-Size: 245678
X-Optimized-Size: 89234
X-Savings-Percent: 63.7
X-Operations: compress,resize,convert
```

---

## Error Handling

### 429 - Rate Limit Exceeded

```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@photo.jpg"
```

**Response:**
```json
{
  "error": "PLAN_LIMIT_REACHED",
  "message": "Monthly limit of 5000 images exceeded",
  "request_id": "req_abc123",
  "details": {
    "used": 5000,
    "limit": 5000,
    "reset_at": "2026-02-01T00:00:00Z"
  },
  "docs_url": "https://docs.shrinkix.com/errors/PLAN_LIMIT_REACHED"
}
```

**Headers:**
```
Retry-After: 950400
```

### 400 - Operation Limit Exceeded

```json
{
  "error": "OPERATION_LIMIT_EXCEEDED",
  "message": "Too many operations. api-pro plan allows max 2 operations",
  "request_id": "req_abc123",
  "details": {
    "requested_operations": 3,
    "allowed_operations": 2,
    "your_plan": "api-pro",
    "operations": ["compress", "resize", "convert"]
  }
}
```

---

## Batch Processing

Process multiple images:

```bash
#!/bin/bash

for file in *.jpg; do
  echo "Optimizing $file..."
  curl -X POST https://api.shrinkix.com/v1/optimize \
    -H "Authorization: Bearer $SHRINKIX_API_KEY" \
    -F "image=@$file" \
    -F "quality=80" \
    -F "format=webp" \
    -o "optimized/${file%.jpg}.webp"
  sleep 1  # Respect rate limits
done
```

---

## Tips

1. **Always check rate limit headers** to avoid hitting limits
2. **Use sandbox mode** for testing
3. **Validate before upload** to save quota
4. **Handle 429 errors** with exponential backoff
5. **Store request_id** for support inquiries

---

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- Status: https://status.shrinkix.com
