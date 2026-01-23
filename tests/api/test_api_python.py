import requests
import os

API_URL = 'http://localhost:5000'
TEST_IMAGE = 'test_quality_90.jpg'

def test_check_limit():
    print('\n=== Testing Check Limit Endpoint ===')
    try:
        response = requests.get(f'{API_URL}/api/check-limit')
        response.raise_for_status()
        print('[PASS] Check Limit Response:', response.json())
        return True
    except Exception as e:
        print(f'[FAIL] Check Limit Failed: {e}')
        return False

def test_compress_image():
    print('\n=== Testing Image Compression ===')
    try:
        with open(TEST_IMAGE, 'rb') as f:
            response = requests.post(
                f'{API_URL}/api/compress',
                files={'image': f},
                data={'quality': 80, 'format': 'webp'}
            )
        
        response.raise_for_status()
        
        # Save compressed image
        with open('compressed_python_test.webp', 'wb') as f:
            f.write(response.content)
        
        print('[PASS] Compression successful!')
        print(f"  Original Size: {response.headers.get('X-Original-Size')}")
        print(f"  Compressed Size: {response.headers.get('X-Compressed-Size')}")
        print(f"  Saved: {response.headers.get('X-Saved-Percent')}%")
        print('  Output file: compressed_python_test.webp')
        
        return True
    except Exception as e:
        print(f'[FAIL] Compression Failed: {e}')
        return False

def test_batch_compression():
    print('\n=== Testing Batch Compression ===')
    try:
        files = [
            ('images[]', open('test_quality_90.jpg', 'rb')),
            ('images[]', open('test_quality_10.jpg', 'rb'))
        ]
        
        response = requests.post(
            f'{API_URL}/api/compress/batch',
            files=files
        )
        
        response.raise_for_status()
        
        # Save ZIP file
        with open('compressed_batch_python_test.zip', 'wb') as f:
            f.write(response.content)
        
        print('[PASS] Batch compression successful!')
        print('  Output file: compressed_batch_python_test.zip')
        
        # Close file handles
        for _, file_obj in files:
            file_obj.close()
        
        return True
    except Exception as e:
        print(f'[FAIL] Batch Compression Failed: {e}')
        return False

def test_format_conversion():
    print('\n=== Testing Format Conversion (WebP) ===')
    try:
        with open(TEST_IMAGE, 'rb') as f:
            response = requests.post(
                f'{API_URL}/api/compress',
                files={'image': f},
                data={'format': 'webp'}
            )
        
        response.raise_for_status()
        
        # Save converted image
        with open('converted_python_test.webp', 'wb') as f:
            f.write(response.content)
        
        content_type = response.headers.get('Content-Type')
        if content_type == 'image/webp':
            print('[PASS] Format conversion successful!')
            print(f'  Content-Type: {content_type}')
            print('  Output file: converted_python_test.webp')
            return True
        else:
            print(f'[FAIL] Wrong Content-Type: {content_type}')
            return False
    except Exception as e:
        print(f'[FAIL] Format Conversion Failed: {e}')
        return False

def test_resize():
    print('\n=== Testing Image Resize ===')
    try:
        with open(TEST_IMAGE, 'rb') as f:
            response = requests.post(
                f'{API_URL}/api/compress',
                files={'image': f},
                data={'width': 100}
            )
        
        response.raise_for_status()
        
        # Save resized image
        with open('resized_python_test.jpg', 'wb') as f:
            f.write(response.content)
        
        file_size = len(response.content)
        print('[PASS] Resize successful!')
        print(f'  Output Size: {file_size} bytes')
        print('  Output file: resized_python_test.jpg')
        
        # Verify it's smaller than 5KB
        if file_size < 5000:
            print('  [PASS] Size verification passed (< 5KB)')
            return True
        else:
            print('  [FAIL] Size verification failed (>= 5KB)')
            return False
    except Exception as e:
        print(f'[FAIL] Resize Failed: {e}')
        return False

def test_metadata_preservation():
    print('\n=== Testing Metadata Preservation ===')
    try:
        with open(TEST_IMAGE, 'rb') as f:
            response = requests.post(
                f'{API_URL}/api/compress',
                files={'image': f},
                data={'preserveMetadata': 'true'}
            )
        
        response.raise_for_status()
        
        # Save image with metadata
        with open('metadata_python_test.jpg', 'wb') as f:
            f.write(response.content)
        
        metadata_preserved = response.headers.get('X-Metadata-Preserved')
        if metadata_preserved == 'true':
            print('[PASS] Metadata preservation successful!')
            print(f'  X-Metadata-Preserved: {metadata_preserved}')
            print('  Output file: metadata_python_test.jpg')
            return True
        else:
            print(f'[FAIL] Metadata header missing or false: {metadata_preserved}')
            return False
    except Exception as e:
        print(f'[FAIL] Metadata Preservation Failed: {e}')
        return False

def run_tests():
    print('Starting API Tests with Python...\n')
    print(f'API URL: {API_URL}')
    print(f'Test Image: {TEST_IMAGE}')
    
    results = {
        'checkLimit': test_check_limit(),
        'compress': test_compress_image(),
        'batch': test_batch_compression(),
        'convert': test_format_conversion(),
        'resize': test_resize(),
        'metadata': test_metadata_preservation()
    }
    
    print('\n=== Test Results Summary ===')
    print(f"Check Limit: {'[PASS]' if results['checkLimit'] else '[FAIL]'}")
    print(f"Compress Image: {'[PASS]' if results['compress'] else '[FAIL]'}")
    print(f"Batch Compression: {'[PASS]' if results['batch'] else '[FAIL]'}")
    print(f"Format Conversion: {'[PASS]' if results['convert'] else '[FAIL]'}")
    print(f"Image Resize: {'[PASS]' if results['resize'] else '[FAIL]'}")
    print(f"Metadata Preservation: {'[PASS]' if results['metadata'] else '[FAIL]'}")
    
    all_passed = all(results.values())
    print(f"\nOverall: {'ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    
    return 0 if all_passed else 1

if __name__ == '__main__':
    exit(run_tests())
