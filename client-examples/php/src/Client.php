<?php

namespace SmartCompress;

class Client {
    private $apiKey;
    private $apiUrl = 'https://shrinkix.com/api/compress';

    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    public function fromFile($inputPath, $outputPath, $options = []) {
        if (!file_exists($inputPath)) {
            throw new \Exception("File not found: " . $inputPath);
        }

        $ch = curl_init();
        
        $fields = [
            'image' => new \CURLFile($inputPath)
        ];

        // Add options
        if (isset($options['quality'])) $fields['quality'] = $options['quality'];
        if (isset($options['width'])) $fields['width'] = $options['width'];
        if (isset($options['height'])) $fields['height'] = $options['height'];
        if (isset($options['format'])) $fields['format'] = $options['format'];

        curl_setopt($ch, CURLOPT_URL, $this->apiUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: ' . $this->apiKey]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new \Exception('Curl Error: ' . curl_error($ch));
        }
        
        curl_close($ch);

        if ($statusCode === 200) {
            file_put_contents($outputPath, $result);
            return true;
        } else {
            throw new \Exception("Compression failed with status $statusCode: " . $result);
        }
    }
}
