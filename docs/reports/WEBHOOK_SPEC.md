# Webhook Specification

Webhooks enable asynchronous processing for large files, batch operations, and long-running tasks.

## Overview

Instead of waiting for synchronous responses, webhooks allow you to:
- Process large files (>50MB)
- Handle batch operations
- Receive notifications when processing completes
- Avoid timeout issues

---

## Webhook Events

### `optimization.completed`

Fired when image optimization completes successfully.

**Payload:**
```json
{
  "event": "optimization.completed",
  "timestamp": "2026-01-21T00:25:00Z",
  "request_id": "req_abc123",
  "data": {
    "job_id": "job_xyz789",
    "original": {
      "size": 5245678,
      "format": "jpg",
      "width": 4000,
      "height": 3000
    },
    "optimized": {
      "size": 1289234,
      "format": "webp",
      "width": 2000,
      "height": 1500,
      "url": "https://cdn.shrinkix.com/optimized/abc123.webp"
    },
    "savings": {
      "bytes": 3956444,
      "percent": 75.4
    },
    "operations": ["compress", "resize", "convert"],
    "processing_time_ms": 2340
  }
}
```

### `optimization.failed`

Fired when optimization fails.

**Payload:**
```json
{
  "event": "optimization.failed",
  "timestamp": "2026-01-21T00:25:00Z",
  "request_id": "req_abc123",
  "data": {
    "job_id": "job_xyz789",
    "error": {
      "code": "FILE_TOO_LARGE",
      "message": "File size exceeds plan limit",
      "details": {
        "file_size": 60000000,
        "max_allowed": 50000000
      }
    }
  }
}
```

### `batch.completed`

Fired when batch processing completes.

**Payload:**
```json
{
  "event": "batch.completed",
  "timestamp": "2026-01-21T00:30:00Z",
  "request_id": "req_abc123",
  "data": {
    "batch_id": "batch_xyz789",
    "total_images": 100,
    "successful": 98,
    "failed": 2,
    "total_savings_bytes": 45000000,
    "processing_time_ms": 45000,
    "results_url": "https://api.shrinkix.com/v1/batch/xyz789/results"
  }
}
```

### `quota.warning`

Fired when quota reaches 80% usage.

**Payload:**
```json
{
  "event": "quota.warning",
  "timestamp": "2026-01-21T00:25:00Z",
  "data": {
    "usage": {
      "used": 4000,
      "limit": 5000,
      "remaining": 1000,
      "percentage": 80.0
    },
    "cycle": {
      "reset_at": "2026-02-01T00:00:00Z",
      "days_until_reset": 10
    }
  }
}
```

### `quota.exceeded`

Fired when quota limit is reached.

**Payload:**
```json
{
  "event": "quota.exceeded",
  "timestamp": "2026-01-21T00:25:00Z",
  "data": {
    "usage": {
      "used": 5000,
      "limit": 5000,
      "remaining": 0
    },
    "cycle": {
      "reset_at": "2026-02-01T00:00:00Z"
    }
  }
}
```

---

## Webhook Configuration

### Register Webhook Endpoint

```bash
curl -X POST https://api.shrinkix.com/v1/webhooks \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/webhooks/shrinkix",
    "events": [
      "optimization.completed",
      "optimization.failed",
      "quota.warning"
    ],
    "secret": "your_webhook_secret"
  }'
```

**Response:**
```json
{
  "id": "webhook_abc123",
  "url": "https://your-site.com/webhooks/shrinkix",
  "events": ["optimization.completed", "optimization.failed", "quota.warning"],
  "created_at": "2026-01-21T00:25:00Z",
  "status": "active"
}
```

### List Webhooks

```bash
curl https://api.shrinkix.com/v1/webhooks \
  -H "Authorization: Bearer $SHRINKIX_API_KEY"
```

### Delete Webhook

```bash
curl -X DELETE https://api.shrinkix.com/v1/webhooks/webhook_abc123 \
  -H "Authorization: Bearer $SHRINKIX_API_KEY"
```

---

## Webhook Security

### Signature Verification

All webhook requests include a signature header:

```
X-Shrinkix-Signature: sha256=abc123...
```

**Verify signature (Node.js):**
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

app.post('/webhooks/shrinkix', (req, res) => {
  const signature = req.headers['x-shrinkix-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifyWebhook(payload, signature, WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook
  const event = req.body;
  console.log('Received event:', event.event);
  
  res.status(200).send('OK');
});
```

**Verify signature (Python):**
```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    digest = 'sha256=' + hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, digest)

@app.route('/webhooks/shrinkix', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Shrinkix-Signature')
    payload = request.get_data(as_text=True)
    
    if not verify_webhook(payload, signature, WEBHOOK_SECRET):
        return 'Invalid signature', 401
    
    event = request.json
    print(f"Received event: {event['event']}")
    
    return 'OK', 200
```

---

## Async Optimization

### Submit Job

```bash
curl -X POST https://api.shrinkix.com/v1/optimize/async \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -F "image=@large_file.jpg" \
  -F "quality=80" \
  -F "webhook_url=https://your-site.com/webhooks/shrinkix"
```

**Response:**
```json
{
  "job_id": "job_xyz789",
  "status": "processing",
  "created_at": "2026-01-21T00:25:00Z",
  "estimated_completion": "2026-01-21T00:27:00Z"
}
```

### Check Job Status

```bash
curl https://api.shrinkix.com/v1/jobs/job_xyz789 \
  -H "Authorization: Bearer $SHRINKIX_API_KEY"
```

**Response:**
```json
{
  "job_id": "job_xyz789",
  "status": "completed",
  "result_url": "https://cdn.shrinkix.com/optimized/abc123.webp",
  "completed_at": "2026-01-21T00:26:30Z"
}
```

---

## Batch Processing

### Submit Batch

```bash
curl -X POST https://api.shrinkix.com/v1/batch \
  -H "Authorization: Bearer $SHRINKIX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg"
    ],
    "operations": {
      "quality": 80,
      "format": "webp",
      "resize": {"width": 1200}
    },
    "webhook_url": "https://your-site.com/webhooks/shrinkix"
  }'
```

**Response:**
```json
{
  "batch_id": "batch_xyz789",
  "status": "processing",
  "total_images": 3,
  "created_at": "2026-01-21T00:25:00Z"
}
```

---

## Retry Policy

Shrinkix will retry failed webhook deliveries:

- **Retry attempts**: 3
- **Retry intervals**: 1m, 5m, 15m
- **Timeout**: 30 seconds per attempt

If all retries fail, the webhook is marked as failed and you'll receive an email notification.

---

## Best Practices

1. **Always verify signatures** to ensure authenticity
2. **Respond quickly** (within 30 seconds)
3. **Process asynchronously** - acknowledge receipt immediately, process later
4. **Handle idempotency** - same event may be delivered multiple times
5. **Log webhook events** for debugging
6. **Use HTTPS** for webhook URLs
7. **Monitor webhook failures** in your dashboard

---

## Testing Webhooks

Use webhook testing tools:
- [webhook.site](https://webhook.site)
- [ngrok](https://ngrok.com) for local development
- Postman webhook simulator

**Example with ngrok:**
```bash
# Start ngrok
ngrok http 3000

# Use ngrok URL as webhook endpoint
https://abc123.ngrok.io/webhooks/shrinkix
```

---

## Support

- Documentation: https://docs.shrinkix.com/webhooks
- Email: support@shrinkix.com
- Webhook logs: https://dashboard.shrinkix.com/webhooks
