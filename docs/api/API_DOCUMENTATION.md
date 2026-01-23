# API Documentation - Shrinkix v1

## Base URL
```
https://api.shrinkix.com/v1
```

## Authentication
All requests require an API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

---

## Endpoints

### POST /optimize
Single, powerful optimization endpoint for image processing.

**Request** (multipart/form-data):
```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@photo.jpg" \
  -F 'resize={"width":1200,"height":800,"fit":"contain"}' \
  -F "format=webp" \
  -F "quality=80"
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | file | Yes | JPG, PNG, WebP, or AVIF image |
| resize | JSON | No | `{"width": 1200, "height": 800, "fit": "contain\|cover"}` |
| crop | JSON | No | `{"mode": "center", "ratio": "16:9"}` |
| format | string | No | Output format: `jpg`, `png`, `webp`, `avif` |
| quality | number | No | 1-100 (default: 80) |
| metadata | string | No | `strip` or `keep` (Business only) |

**Response** (200 OK):
```json
{
  "success": true,
  "original": {
    "size": 245678,
    "format": "jpg",
    "width": 3000,
    "height": 2000
  },
  "optimized": {
    "size": 89234,
    "format": "webp",
    "width": 1200,
    "height": 800
  },
  "savings": {
    "bytes": 156444,
    "percent": 63.7
  },
  "operations": ["compress", "resize", "convert"],
  "usage": {
    "used": 135,
    "limit": 5000,
    "remaining": 4865
  }
}
```

**Operation Limits**:
- Free: 1 operation
- Starter/API Pro: 2 operations
- Pro/API Ultra: 3 operations
- Business: 4 operations

**Operation Counting**:
- Compression always counts as 1
- Resize = +1
- Crop = +1
- Format conversion = +1
- Metadata preservation = +1

---

### GET /limits
Get plan limits for your API key.

**Request**:
```bash
curl https://api.shrinkix.com/v1/limits \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response**:
```json
{
  "plan": "api-pro",
  "max_file_size_mb": "10",
  "max_pixels": 36000000,
  "max_operations": 2,
  "formats": ["jpg", "jpeg", "png", "webp"],
  "features": ["compress", "resize"],
  "rate_limit": 2
}
```

---

### POST /validate
Validate image before upload to avoid wasted requests.

**Request**:
```bash
curl -X POST https://api.shrinkix.com/v1/validate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "fileSize": 5000000,
    "format": "jpg",
    "width": 2000,
    "height": 1500
  }'
```

**Response**:
```json
{
  "valid": true,
  "warnings": [],
  "plan": "api-pro",
  "limits": {
    "max_file_size_mb": "10",
    "max_pixels": 36000000,
    "allowed_formats": ["jpg", "jpeg", "png", "webp"]
  }
}
```

---

### GET /usage/stats
Get current usage statistics (requires authentication).

**Request**:
```bash
curl https://api.shrinkix.com/usage/stats \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response**:
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
  "addons": {
    "current_credits": 0,
    "purchase_history": []
  },
  "cycle": {
    "reset_at": "2026-02-01T00:00:00Z",
    "days_until_reset": 10
  }
}
```

---

## Rate Limiting

All responses include rate limit headers:
```
X-RateLimit-Limit: 2
X-RateLimit-Remaining: 1
X-RateLimit-Reset: 1700000000
X-Request-ID: req_abc123
```

When rate limit is exceeded (429):
```
Retry-After: 3600
```

---

## Sandbox Mode

Test without consuming quota:
```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Mode: sandbox" \
  -F "image=@test.jpg"
```

**Sandbox Limits**:
- Max file size: 1MB
- Max operations: 2
- Max resolution: 2000x2000
- Does NOT count against quota

---

## Error Responses

All errors follow this format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "request_id": "req_abc123",
  "details": { ... },
  "docs_url": "https://docs.shrinkix.com/errors/ERROR_CODE"
}
```

### Common Errors

**429 - Plan Limit Reached**:
```json
{
  "error": "PLAN_LIMIT_REACHED",
  "message": "Monthly limit of 5000 images exceeded",
  "request_id": "req_abc123",
  "details": {
    "used": 5000,
    "limit": 5000,
    "reset_at": "2026-02-01T00:00:00Z"
  }
}
```

**400 - Operation Limit Exceeded**:
```json
{
  "error": "OPERATION_LIMIT_EXCEEDED",
  "message": "Too many operations. api-pro plan allows max 2 operations",
  "details": {
    "requested_operations": 3,
    "allowed_operations": 2,
    "your_plan": "api-pro",
    "operations": ["compress", "resize", "convert"]
  }
}
```

**413 - Image Size Exceeded**:
```json
{
  "error": "IMAGE_SIZE_EXCEEDED",
  "message": "File size exceeds plan limit"
}
```

**415 - Unsupported Format**:
```json
{
  "error": "UNSUPPORTED_FORMAT",
  "message": "Format 'gif' is not supported on your plan"
}
```

---

## Code Examples

### Node.js
```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

const formData = new FormData();
formData.append('image', fs.createReadStream('photo.jpg'));
formData.append('resize', JSON.stringify({ width: 1200, height: 800 }));
formData.append('format', 'webp');
formData.append('quality', '80');

const response = await fetch('https://api.shrinkix.com/v1/optimize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    ...formData.getHeaders()
  },
  body: formData
});

const result = await response.json();
console.log('Saved:', result.savings.percent + '%');
```

### Python
```python
import requests

files = {'image': open('photo.jpg', 'rb')}
data = {
    'resize': '{"width": 1200, "height": 800}',
    'format': 'webp',
    'quality': 80
}
headers = {'Authorization': 'Bearer YOUR_API_KEY'}

response = requests.post(
    'https://api.shrinkix.com/v1/optimize',
    files=files,
    data=data,
    headers=headers
)

result = response.json()
print(f"Saved: {result['savings']['percent']}%")
```

### cURL
```bash
curl -X POST https://api.shrinkix.com/v1/optimize \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@photo.jpg" \
  -F 'resize={"width":1200,"height":800}' \
  -F "format=webp" \
  -F "quality=80"
```

---

## Best Practices

1. **Always validate before upload** using `/validate`
2. **Use sandbox mode** for testing
3. **Monitor rate limit headers** to avoid throttling
4. **Handle errors gracefully** with retry logic
5. **Cache results** when possible
6. **Use webhooks** for async processing (coming soon)

---

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- Status: https://status.shrinkix.com
