<?php

namespace Shrinkix;

use Exception;
use CURLFile;

class Client
{
    private $apiKey;
    private $baseUrl;

    /**
     * Initialize Shrinkix Client
     *
     * @param string $apiKey Your API Key
     * @param array $options Optional configuration ['baseUrl' => '...']
     */
    public function __construct($apiKey, $options = [])
    {
        if (empty($apiKey)) {
            throw new Exception("API Key is required");
        }
        $this->apiKey = $apiKey;
        $this->baseUrl = isset($options['baseUrl']) ? $options['baseUrl'] : 'https://api.shrinkix.com';

        if (!extension_loaded('curl')) {
            throw new Exception("Shrinkix SDK requires the cURL PHP extension.");
        }
    }

    /**
     * Get account usage and limits
     *
     * @return array Account details
     * @throws Exception
     */
    public function account()
    {
        return $this->request('GET', '/api/check-limit');
    }

    /**
     * Compress an image
     *
     * @param string $imagePath Path to the image file
     * @param array $options Compression options
     *                       ['quality' => 80, 'width' => ..., 'toFile' => '...']
     * @return string|bool Binary image data or true if saved to file
     * @throws Exception
     */
    public function compress($imagePath, $options = [])
    {
        return $this->processImage($imagePath, $options);
    }

    /**
     * Convert an image format
     *
     * @param string $imagePath Path to the image file
     * @param string $format Target format ('webp', 'avif', 'png', 'jpg')
     * @param array $options Additional options
     * @return string|bool Binary image data or true if saved to file
     * @throws Exception
     */
    public function convert($imagePath, $format, $options = [])
    {
        $options['format'] = $format;
        return $this->processImage($imagePath, $options);
    }

    /**
     * Internal method to handle image processing
     */
    private function processImage($imagePath, $options)
    {
        if (!file_exists($imagePath)) {
            throw new Exception("File not found: " . $imagePath);
        }

        $postFields = [
            'image' => new CURLFile($imagePath)
        ];

        // Add options
        if (isset($options['quality'])) $postFields['quality'] = $options['quality'];
        if (isset($options['width'])) $postFields['width'] = $options['width'];
        if (isset($options['height'])) $postFields['height'] = $options['height'];
        if (isset($options['format'])) $postFields['format'] = $options['format'];
        if (isset($options['preserveMetadata']) && $options['preserveMetadata']) {
            $postFields['preserveMetadata'] = 'true';
        }

        $result = $this->request('POST', '/api/compress', $postFields, true);

        // Handle saving to file
        if (isset($options['toFile'])) {
            if (file_put_contents($options['toFile'], $result) === false) {
                throw new Exception("Failed to write output to file: " . $options['toFile']);
            }
            return true;
        }

        return $result;
    }

    /**
     * Make HTTP Request
     */
    private function request($method, $endpoint, $data = [], $isBinary = false)
    {
        $url = $this->baseUrl . $endpoint;
        $ch = curl_init();

        $headers = [
            'X-API-Key: ' . $this->apiKey,
            'Accept: application/json'
        ];

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        
        if (curl_errno($ch)) {
            throw new Exception('cURL Error: ' . curl_error($ch));
        }
        
        curl_close($ch);

        // Handle Errors (4xx, 5xx)
        if ($httpCode >= 400) {
            $errorMsg = "API Request Failed ($httpCode)";
            
            // Try to parse JSON error message
            $json = json_decode($response, true);
            if (isset($json['message'])) {
                $errorMsg .= ": " . $json['message'];
            } elseif (isset($json['error'])) {
                $errorMsg .= ": " . $json['error'];
            }
            
            throw new Exception($errorMsg, $httpCode);
        }

        // Return raw binary if expected (image)
        if ($isBinary && strpos($contentType, 'image/') !== false) {
            return $response;
        }
        
        // Parse JSON for other endpoints
        return json_decode($response, true);
    }
}
