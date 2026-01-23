# Shrinkix PHP SDK

Official PHP SDK for the Shrinkix Image Optimization API.

## Installation

Install via Composer:

```bash
composer require shrinkix/shrinkix-php
```

## Quick Start

```php
<?php

require 'vendor/autoload.php';

use Shrinkix\Client;

$client = new Client(getenv('SHRINKIX_API_KEY'));

// Optimize an image
$result = $client->optimize->optimize(
    file: 'photo.jpg',
    quality: 80,
    format: 'webp'
);

echo "Saved {$result['savings']['percent']}%";
```

## Usage

### Initialize Client

```php
use Shrinkix\Client;

$client = new Client(
    apiKey: 'YOUR_API_KEY',
    sandbox: false  // Set to true for testing
);
```

### Optimize Image

```php
$result = $client->optimize->optimize(
    file: 'photo.jpg',  // or resource
    resize: ['width' => 1200, 'height' => 800, 'fit' => 'contain'],
    format: 'webp',
    quality: 80,
    metadata: 'strip'
);

print_r($result['savings']);
print_r($result['operations']);
print_r($result['usage']);
print_r($result['rate_limit']);
```

### Get Usage Stats

```php
$stats = $client->usage->getStats();

echo "Used: {$stats['usage']['used']}/{$stats['usage']['total']}\n";
echo "Remaining: {$stats['usage']['remaining']}\n";
echo "Plan: {$stats['plan']['name']}\n";
echo "Resets in: {$stats['cycle']['days_until_reset']} days\n";
```

### Get Plan Limits

```php
$limits = $client->limits->get();

echo "Plan: {$limits['plan']}\n";
echo "Max file size: {$limits['max_file_size_mb']}MB\n";
echo "Max operations: {$limits['max_operations']}\n";
print_r($limits['formats']);
```

### Validate Before Upload

```php
$validation = $client->validate->validate(
    fileSize: 5000000,
    format: 'jpg',
    width: 2000,
    height: 1500
);

if (!$validation['valid']) {
    foreach ($validation['warnings'] as $warning) {
        echo "Warning: {$warning['message']}\n";
    }
}
```

## Sandbox Mode

Test without consuming quota:

```php
$client = new Client(
    apiKey: 'YOUR_API_KEY',
    sandbox: true
);

// This won't count against your quota
$result = $client->optimize->optimize(file: 'test.jpg', quality: 80);
```

## Error Handling

```php
use Shrinkix\Client;
use Shrinkix\Errors\ApiException;
use Shrinkix\Errors\NetworkException;

try {
    $result = $client->optimize->optimize(file: 'photo.jpg');
} catch (ApiException $e) {
    echo "API Error: {$e->getErrorCode()}\n";
    echo "Message: {$e->getMessage()}\n";
    echo "Request ID: {$e->getRequestId()}\n";
    print_r($e->getDetails());
    echo "Docs: {$e->getDocsUrl()}\n";
    
    // Rate limit info
    print_r($e->getRateLimit());
    
    // Retry after (for 429 errors)
    if ($e->getRetryAfter()) {
        echo "Retry after: {$e->getRetryAfter()} seconds\n";
    }
} catch (NetworkException $e) {
    echo "Network error: {$e->getMessage()}\n";
}
```

## Laravel Integration

In your Laravel app:

```php
// config/services.php
return [
    'shrinkix' => [
        'api_key' => env('SHRINKIX_API_KEY'),
    ],
];

// app/Services/ImageOptimizer.php
namespace App\Services;

use Shrinkix\Client;

class ImageOptimizer
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client(
            apiKey: config('services.shrinkix.api_key')
        );
    }

    public function optimize(string $filePath): array
    {
        return $this->client->optimize->optimize(
            file: $filePath,
            quality: 80,
            format: 'webp'
        );
    }
}
```

## Rate Limiting

All responses include rate limit information:

```php
$result = $client->optimize->optimize(file: 'photo.jpg');

print_r($result['rate_limit']);
// Array
// (
//     [limit] => 2
//     [remaining] => 1
//     [reset] => 1700000000
//     [request_id] => req_abc123
// )
```

## Requirements

- PHP >= 7.4
- Guzzle HTTP ^7.0

## API Reference

See full documentation at: https://docs.shrinkix.com

## Support

- Documentation: https://docs.shrinkix.com
- Email: support@shrinkix.com
- GitHub: https://github.com/shrinkix/shrinkix-php

## License

MIT
