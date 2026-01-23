<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.shrinkix.com/compress');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: YOUR_API_KEY']);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'image' => new CURLFile('input.png')
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($statusCode == 200) {
        file_put_contents('output.png', $result);
        echo "Compression successful!";
    } else {
        echo "Compression failed. Status: " . $statusCode;
    }
}
curl_close($ch);
?>
