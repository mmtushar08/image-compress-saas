# Shrinkix Python SDK

Official Python SDK for the Shrinkix Image Optimization API.

## Installation

```bash
pip install shrinkix
```

## Quick Start

```python
from shrinkix import Shrinkix

client = Shrinkix(api_key="YOUR_API_KEY")

# Optimize an image
result = client.optimize.optimize(
    file="photo.jpg",
    quality=80,
    format="webp"
)

print(f"Saved {result.savings['percent']}%")
```

## Usage

### Initialize Client

```python
from shrinkix import Shrinkix

client = Shrinkix(
    api_key="YOUR_API_KEY",
    sandbox=False  # Set to True for testing
)
```

### Optimize Image

```python
result = client.optimize.optimize(
    file="photo.jpg",  # or bytes or file object
    resize={"width": 1200, "height": 800, "fit": "contain"},
    format="webp",
    quality=80,
    metadata="strip"
)

# Access result
print(result.savings)
print(result.operations)
print(result.usage)
print(result.rate_limit)
```

### Get Usage Stats

```python
stats = client.usage.get_stats()

print(f"Used: {stats.used}/{stats.total}")
print(f"Remaining: {stats.remaining}")
print(f"Plan: {stats.plan['name']}")
print(f"Resets in: {stats.cycle['days_until_reset']} days")
```

### Get Plan Limits

```python
limits = client.limits.get()

print(f"Plan: {limits.plan}")
print(f"Max file size: {limits.max_file_size_mb}MB")
print(f"Max operations: {limits.max_operations}")
print(f"Formats: {limits.formats}")
```

### Validate Before Upload

```python
validation = client.validate.validate(
    file_size=5000000,
    format="jpg",
    width=2000,
    height=1500
)

if not validation.valid:
    for warning in validation.warnings:
        print(f"Warning: {warning['message']}")
```

## Sandbox Mode

Test without consuming quota:

```python
client = Shrinkix(api_key="YOUR_API_KEY", sandbox=True)

# This won't count against your quota
result = client.optimize.optimize(file="test.jpg", quality=80)
```

## Error Handling

```python
from shrinkix import Shrinkix, ApiError, NetworkError

try:
    result = client.optimize.optimize(file="photo.jpg")
except ApiError as e:
    print(f"API Error: {e.code}")
    print(f"Message: {e.message}")
    print(f"Request ID: {e.request_id}")
    print(f"Details: {e.details}")
    print(f"Docs: {e.docs_url}")
    
    # Rate limit info
    print(f"Rate limit: {e.rate_limit}")
    
    # Retry after (for 429 errors)
    if e.retry_after:
        print(f"Retry after: {e.retry_after} seconds")
        
except NetworkError as e:
    print(f"Network error: {e.message}")
```

## Type Hints

The SDK includes full type hints for better IDE support:

```python
from shrinkix import Shrinkix
from shrinkix.resources.optimize import OptimizeResult

client: Shrinkix = Shrinkix(api_key="...")
result: OptimizeResult = client.optimize.optimize(file="photo.jpg")
```

## Rate Limiting

All responses include rate limit information:

```python
result = client.optimize.optimize(file="photo.jpg")

print(result.rate_limit)
# {
#   'limit': '2',
#   'remaining': '1',
#   'reset': '1700000000',
#   'request_id': 'req_abc123'
# }
```

## API Reference

See full documentation at: https://docs.shrinkix.com

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- GitHub: https://github.com/shrinkix/shrinkix-python

## License

MIT
