# Shrinkix Node.js SDK

Official Node.js SDK for the Shrinkix Image Optimization API.

## Installation

```bash
npm install shrinkix
```

## Quick Start

```javascript
const { Shrinkix } = require('shrinkix');

const client = new Shrinkix({
  apiKey: process.env.SHRINKIX_API_KEY
});

// Optimize an image
const result = await client.optimize.optimize({
  file: 'photo.jpg',
  quality: 80,
  format: 'webp'
});

console.log(`Saved ${result.savings.percent}%`);
```

## Usage

### Initialize Client

```javascript
const client = new Shrinkix({
  apiKey: 'YOUR_API_KEY',
  sandbox: false  // Set to true for testing
});
```

### Optimize Image

```javascript
const result = await client.optimize.optimize({
  file: 'photo.jpg',  // or Buffer or Stream
  resize: {
    width: 1200,
    height: 800,
    fit: 'contain'  // or 'cover'
  },
  format: 'webp',
  quality: 80,
  metadata: 'strip'  // or 'keep'
});

console.log(result);
// {
//   data: <optimized image buffer>,
//   savings: { bytes: 156444, percent: 63.7 },
//   operations: ['compress', 'resize', 'convert'],
//   usage: { used: 135, limit: 5000, remaining: 4865 },
//   rateLimit: { limit: 2, remaining: 1, reset: 1700000000 }
// }
```

### Get Usage Stats

```javascript
const stats = await client.usage.getStats();
console.log(stats);
// {
//   usage: { used: 245, remaining: 4755, total: 5000 },
//   plan: { id: 'api-pro', name: 'Api Pro' },
//   cycle: { reset_at: '2026-02-01T00:00:00Z', days_until_reset: 10 }
// }
```

### Get Plan Limits

```javascript
const limits = await client.limits.get();
console.log(limits);
// {
//   plan: 'api-pro',
//   max_file_size_mb: '10',
//   max_operations: 2,
//   formats: ['jpg', 'png', 'webp']
// }
```

### Validate Before Upload

```javascript
const validation = await client.validate.validate({
  fileSize: 5000000,
  format: 'jpg',
  width: 2000,
  height: 1500
});

if (!validation.valid) {
  console.log('Validation failed:', validation.warnings);
}
```

## Sandbox Mode

Test without consuming quota:

```javascript
const client = new Shrinkix({
  apiKey: 'YOUR_API_KEY',
  sandbox: true
});

// This won't count against your quota
const result = await client.optimize.optimize({
  file: 'test.jpg',
  quality: 80
});
```

## Error Handling

```javascript
const { ApiError, NetworkError } = require('shrinkix');

try {
  await client.optimize.optimize({ file: 'photo.jpg' });
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.code);
    console.log('Request ID:', error.requestId);
    console.log('Details:', error.details);
    console.log('Docs:', error.docsUrl);
    
    // Rate limit info
    console.log('Rate Limit:', error.rateLimit);
    
    // Retry after (for 429 errors)
    if (error.retryAfter) {
      console.log('Retry after:', error.retryAfter, 'seconds');
    }
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  }
}
```

## Rate Limiting

All responses include rate limit information:

```javascript
const result = await client.optimize.optimize({ file: 'photo.jpg' });

console.log(result.rateLimit);
// {
//   limit: 2,
//   remaining: 1,
//   reset: 1700000000,
//   requestId: 'req_abc123'
// }
```

## TypeScript Support

TypeScript definitions are included:

```typescript
import { Shrinkix, ApiError } from 'shrinkix';

const client = new Shrinkix({
  apiKey: process.env.SHRINKIX_API_KEY!
});
```

## API Reference

See full documentation at: https://docs.shrinkix.com

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- GitHub: https://github.com/shrinkix/shrinkix-node

## License

MIT
