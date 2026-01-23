<?php
/**
 * Test Script for Shrinkix API
 * 
 * Usage: php test-api-connection.php [API_KEY] [IMAGE_PATH]
 */

$api_key = isset($argv[1]) ? $argv[1] : '';
$image_path = isset($argv[2]) ? $argv[2] : 'test.png';
$api_url = 'http://localhost:5000/api'; // Change to production URL if needed

if (empty($api_key)) {
    echo "Usage: php test-api-connection.php [API_KEY] [IMAGE_PATH]\n";
    exit(1);
}

if (!file_exists($image_path)) {
    // Create a dummy image if not exists
    $im = imagecreatetruecolor(100, 100);
    imagepng($im, $image_path);
    imagedestroy($im);
    echo "Created dummy image: $image_path\n";
}

echo "Testing connection to $api_url...\n";

// 1. Check Rate Limit / Auth
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url . '/check-limit');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-API-Key: ' . $api_key));
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Check Limit Response (HTTP $http_code): $response\n";

if ($http_code !== 200) {
    echo "Auth failed or API down.\n";
    exit(1);
}

// 2. Compress Image
echo "Testing compression...\n";
$ch = curl_init();
$cfile = new CURLFile($image_path, mime_content_type($image_path), basename($image_path));
$data = array('image' => $cfile);

curl_setopt($ch, CURLOPT_URL, $api_url . '/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-API-Key: ' . $api_key));
curl_setopt($ch, CURLOPT_HEADER, true); // Get headers for stats

$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    echo "Compression Successful!\n";
    
    // Parse headers for stats
    $headers = explode("\r\n", $header);
    foreach ($headers as $line) {
        if (strpos($line, 'X-Original-Size') === 0 || 
            strpos($line, 'X-Compressed-Size') === 0 || 
            strpos($line, 'X-Saved-Percent') === 0) {
            echo "$line\n";
        }
    }
    
    file_put_contents('test-optimized.img', $body);
    echo "Saved optimized file to test-optimized.img\n";
} else {
    echo "Compression Failed (HTTP $http_code)\n";
    // echo $body;
}
