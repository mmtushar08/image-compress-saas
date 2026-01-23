<?php

require_once __DIR__ . '/../src/Client.php';

use Shrinkix\Client;

// Initialize
// In a real project with Composer, use: require 'vendor/autoload.php';
$shrinkix = new Client('YOUR_API_KEY', [
    'baseUrl' => 'http://localhost:5000'
]);

try {
    echo "Compressing image...\n";
    
    // Compress
    $shrinkix->compress(__DIR__ . '/../../../test_quality_90.jpg', [
        'quality' => 60,
        'toFile'  => __DIR__ . '/output.jpg'
    ]);
    
    echo "Success! Saved to output.jpg\n";
    
    // Check Account
    $account = $shrinkix->account();
    echo "Remaining Credits: " . $account['remaining'] . "\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
