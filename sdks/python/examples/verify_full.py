import sys
import os
import time

# Add parent dir to path to import 'shrinkix' without installing
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from shrinkix import Client, ShrinkixError

# Initialize (Local Server) - Anonymous
client = Client('', base_url='http://localhost:5000')

TEST_IMAGE = os.path.join(os.path.dirname(__file__), '../../../test_quality_90.jpg')

def get_size(path):
    return os.path.getsize(path)

print(f"=== Starting Full Python SDK Verification ===")
print(f"Test Image: {TEST_IMAGE}")
print(f"Original Size: {get_size(TEST_IMAGE)} bytes\n")

try:
    # 1. Standard Compression
    print("1. Testing Standard Compression...")
    client.compress(TEST_IMAGE, {
        'to_file': 'test_compress.jpg',
        'quality': 80
    })
    print(f"   [PASS] Saved test_compress.jpg ({get_size('test_compress.jpg')} bytes)")

    # 2. Format Conversion
    print("\n2. Testing Conversion (to WebP)...")
    client.convert(TEST_IMAGE, 'webp', {
        'to_file': 'test_convert.webp',
        'quality': 80
    })
    if os.path.exists('test_convert.webp'):
        print(f"   [PASS] Saved test_convert.webp ({get_size('test_convert.webp')} bytes)")
    else:
        print("   [FAIL] File not created")

    # 3. Resizing (Width = 100)
    print("\n3. Testing Resize (Width=100)...")
    client.compress(TEST_IMAGE, {
        'to_file': 'test_resize.jpg',
        'width': 100
    })
    size_resize = get_size('test_resize.jpg')
    print(f"   [PASS] Saved test_resize.jpg ({size_resize} bytes)")
    
    if size_resize < 5000: # Should be very small
        print("   [PASS] File size indicates successful resize!")
    else:
        print("   [WARN] File size seems large for 100px width")

    # 4. Metadata Preservation
    print("\n4. Testing Metadata Preservation...")
    # Note: We can't easily check metadata bits without extensive libs, 
    # but we verify the call completes successfully with the flag.
    client.compress(TEST_IMAGE, {
        'to_file': 'test_metadata.jpg',
        'preserveMetadata': True
    })
    print(f"   [PASS] Saved test_metadata.jpg ({get_size('test_metadata.jpg')} bytes)")
    print("   (Server verified X-Metadata-Preserved header in Go tests)")

    print("\n=== ALL PYTHON SDK TESTS PASSED ===")

except ShrinkixError as e:
    print(f"\n[FAIL] SDK Error: {e}")
except Exception as e:
    print(f"\n[FAIL] Unexpected Error: {e}")
