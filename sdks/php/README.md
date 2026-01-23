# Shrinkix PHP SDK

Official PHP client for the [Shrinkix Image Compression API](https://shrinkix.com).

## Requirements

- PHP 7.4 or higher
- cURL extension (`ext-curl`)
- JSON extension (`ext-json`)

## Installation

Install via Composer:

```bash
composer require shrinkix/php-sdk
```

## Usage

### 1. Initialize

```php
require 'vendor/autoload.php';

use Shrinkix\Client;

$shrinkix = new Client('YOUR_API_KEY');
```

### 2. Compress an Image

```php
try {
    $shrinkix->compress('photo.jpg', [
        'quality' => 80,
        'toFile'  => 'compressed.jpg'
    ]);
    echo "Done!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
```

### 3. Convert Format

Convert images to WebP, AVIF, PNG, or JPG.

```php
$shrinkix->convert('photo.png', 'webp', [
    'quality' => 90,
    'toFile'  => 'photo.webp'
]);
```

### 4. Check Account Status

```php
$usage = $shrinkix->account();
echo "Remaining: " . $usage['remaining'];
```

## API Reference

### `compress($path, $options)`
- **$path**: String path to file.
- **$options**:
  - `quality`: Int (1-100)
  - `width`: Int (resize)
  - `height`: Int (resize)
  - `preserveMetadata`: Bool
  - `toFile`: String (output path)

### `convert($path, $format, $options)`
Shortcut for `compress` with format set.

## Error Handling

The SDK throws standard PHP `Exception` for all errors (Auth, Network, API).

```php
try {
    $shrinkix->account();
} catch (Exception $e) {
    if ($e->getCode() === 401) {
        echo "Check your API Key!";
    }
}
```
