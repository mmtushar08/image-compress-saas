<?php
/**
 * Shrinkix API Test Script for PHP
 * 
 * This script tests the Shrinkix API endpoints to verify the PHP code examples
 * in the API documentation work correctly.
 * 
 * Requirements: PHP 7.4+ with cURL extension enabled
 * 
 * Usage: php test_api_php.php
 */

define('API_URL', 'http://localhost:5000');
define('TEST_IMAGE', 'test_quality_90.jpg');

// ANSI color codes for terminal output
define('GREEN', "\033[32m");
define('RED', "\033[31m");
define('YELLOW', "\033[33m");
define('RESET', "\033[0m");

function printHeader($text) {
    echo "\n" . YELLOW . "=== $text ===" . RESET . "\n";
}

function printSuccess($text) {
    echo GREEN . "[PASS] $text" . RESET . "\n";
}

function printError($text) {
    echo RED . "[FAIL] $text" . RESET . "\n";
}

/**
 * Test 1: Check Limit Endpoint
 */
function testCheckLimit() {
    printHeader('Testing Check Limit Endpoint');
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/api/check-limit');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: sk_test_b4eb8968065c578f25722b10']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        printSuccess('Check Limit Response: ' . json_encode($data, JSON_PRETTY_PRINT));
        return true;
    } else {
        printError("Check Limit Failed: HTTP $httpCode");
        return false;
    }
}

/**
 * Test 2: Compress Image
 */
function testCompressImage() {
    printHeader('Testing Image Compression');
    
    if (!file_exists(TEST_IMAGE)) {
        printError('Test image not found: ' . TEST_IMAGE);
        return false;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/api/compress');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: sk_test_b4eb8968065c578f25722b10']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'image' => new CURLFile(TEST_IMAGE),
        'quality' => 80,
        'format' => 'webp'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        // Extract custom headers
        preg_match('/X-Original-Size: (\d+)/', $headers, $originalSize);
        preg_match('/X-Compressed-Size: (\d+)/', $headers, $compressedSize);
        preg_match('/X-Saved-Percent: ([\d.]+)/', $headers, $savedPercent);
        
        // Save compressed image
        file_put_contents('compressed_php_test.webp', $body);
        
        printSuccess('Compression successful!');
        echo "  Original Size: " . ($originalSize[1] ?? 'N/A') . " bytes\n";
        echo "  Compressed Size: " . ($compressedSize[1] ?? 'N/A') . " bytes\n";
        echo "  Saved: " . ($savedPercent[1] ?? 'N/A') . "%\n";
        echo "  Output file: compressed_php_test.webp\n";
        
        return true;
    } else {
        printError("Compression Failed: HTTP $httpCode");
        return false;
    }
}

/**
 * Test 3: Batch Compression
 */
function testBatchCompression() {
    printHeader('Testing Batch Compression');
    
    if (!file_exists('test_quality_90.jpg') || !file_exists('test_quality_10.jpg')) {
        printError('Test images not found');
        return false;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/api/compress/batch');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: sk_test_b4eb8968065c578f25722b10']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'images[0]' => new CURLFile('test_quality_90.jpg'),
        'images[1]' => new CURLFile('test_quality_10.jpg')
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        file_put_contents('compressed_batch_php_test.zip', $response);
        printSuccess('Batch compression successful!');
        echo "  Output file: compressed_batch_php_test.zip\n";
        return true;
    } else {
        printError("Batch Compression Failed: HTTP $httpCode");
        return false;
    }
}

/**
 * Test 4: Format Conversion
 */
function testFormatConversion() {
    printHeader('Testing Format Conversion (WebP)');
    
    if (!file_exists(TEST_IMAGE)) {
        printError('Test image not found: ' . TEST_IMAGE);
        return false;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/api/compress');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: sk_test_b4eb8968065c578f25722b10']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'image' => new CURLFile(TEST_IMAGE),
        'format' => 'webp'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        // Save converted image
        file_put_contents('converted_php_test.webp', $body);
        
        // Check Content-Type
        if (preg_match('/Content-Type: image\/webp/i', $headers)) {
            printSuccess('Format conversion successful!');
            echo "  Content-Type: image/webp\n";
            echo "  Output file: converted_php_test.webp\n";
            return true;
        } else {
            printError('Wrong Content-Type');
            return false;
        }
    } else {
        printError("Format Conversion Failed: HTTP $httpCode");
        return false;
    }
}

/**
 * Test 5: Image Resize
 */
function testResize() {
    printHeader('Testing Image Resize');
    
    if (!file_exists(TEST_IMAGE)) {
        printError('Test image not found: ' . TEST_IMAGE);
        return false;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/api/compress');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: sk_test_b4eb8968065c578f25722b10']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'image' => new CURLFile(TEST_IMAGE),
        'width' => 100
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        file_put_contents('resized_php_test.jpg', $response);
        $fileSize = strlen($response);
        
        printSuccess('Resize successful!');
        echo "  Output Size: $fileSize bytes\n";
        echo "  Output file: resized_php_test.jpg\n";
        
        // Verify it's smaller than 5KB
        if ($fileSize < 5000) {
            printSuccess('Size verification passed (< 5KB)');
            return true;
        } else {
            printError('Size verification failed (>= 5KB)');
            return false;
        }
    } else {
        printError("Resize Failed: HTTP $httpCode");
        return false;
    }
}

/**
 * Test 6: Metadata Preservation
 */
function testMetadataPreservation() {
    printHeader('Testing Metadata Preservation');
    
    if (!file_exists(TEST_IMAGE)) {
        printError('Test image not found: ' . TEST_IMAGE);
        return false;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, API_URL . '/api/compress');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-API-Key: sk_test_b4eb8968065c578f25722b10']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'image' => new CURLFile(TEST_IMAGE),
        'preserveMetadata' => 'true'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $headers = substr($response, 0, $headerSize);
        $body = substr($response, $headerSize);
        
        // Save image with metadata
        file_put_contents('metadata_php_test.jpg', $body);
        
        // Check metadata header
        if (preg_match('/X-Metadata-Preserved: true/i', $headers)) {
            printSuccess('Metadata preservation successful!');
            echo "  X-Metadata-Preserved: true\n";
            echo "  Output file: metadata_php_test.jpg\n";
            return true;
        } else {
            printError('Metadata header missing or false');
            return false;
        }
    } else {
        printError("Metadata Preservation Failed: HTTP $httpCode");
        return false;
    }
}

/**
 * Run all tests
 */
function runTests() {
    echo "\nStarting API Tests with PHP...\n";
    echo "API URL: " . API_URL . "\n";
    echo "Test Image: " . TEST_IMAGE . "\n";
    
    $results = [
        'checkLimit' => testCheckLimit(),
        'compress' => testCompressImage(),
        'batch' => testBatchCompression(),
        'convert' => testFormatConversion(),
        'resize' => testResize(),
        'metadata' => testMetadataPreservation()
    ];
    
    printHeader('Test Results Summary');
    echo "Check Limit: " . ($results['checkLimit'] ? GREEN . '[PASS]' : RED . '[FAIL]') . RESET . "\n";
    echo "Compress Image: " . ($results['compress'] ? GREEN . '[PASS]' : RED . '[FAIL]') . RESET . "\n";
    echo "Batch Compression: " . ($results['batch'] ? GREEN . '[PASS]' : RED . '[FAIL]') . RESET . "\n";
    echo "Format Conversion: " . ($results['convert'] ? GREEN . '[PASS]' : RED . '[FAIL]') . RESET . "\n";
    echo "Image Resize: " . ($results['resize'] ? GREEN . '[PASS]' : RED . '[FAIL]') . RESET . "\n";
    echo "Metadata Preservation: " . ($results['metadata'] ? GREEN . '[PASS]' : RED . '[FAIL]') . RESET . "\n";
    
    $allPassed = !in_array(false, $results, true);
    echo "\nOverall: " . ($allPassed ? GREEN . 'ALL TESTS PASSED' : RED . 'SOME TESTS FAILED') . RESET . "\n\n";
    
    exit($allPassed ? 0 : 1);
}

// Run tests
runTests();
