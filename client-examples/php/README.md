# SmartCompress PHP Client

Official PHP client for the SmartCompress API.

## Installation

```bash
composer require smartcompress/client
```

## Usage

```php
require_once 'vendor/autoload.php';

use SmartCompress\Client;

$client = new Client('YOUR_API_KEY');

try {
    $client->fromFile('input.png', 'output.png', [
        'width' => 500,
        'quality' => 80
    ]);
    echo "Done!";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
```
