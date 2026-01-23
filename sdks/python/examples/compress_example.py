import sys
import os

# Add parent dir to path to import 'shrinkix' without installing
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from shrinkix import Client, ShrinkixError

# Initialize (Local Server) - Use empty key for Anonymous/Guest testing
client = Client('', base_url='http://localhost:5000')

TEST_IMAGE = os.path.join(os.path.dirname(__file__), '../../../test_quality_90.jpg')

try:
    print("1. Checking Account...")
    usage = client.account()
    print(f"   Success: {usage['remaining']} credits remaining\n")

    print("2. Compressing Image...")
    client.compress(TEST_IMAGE, {
        'quality': 50,
        'to_file': 'python_sdk_out.jpg'
    })
    print("   Success: Saved to python_sdk_out.jpg\n")

    print("3. Converting to WebP...")
    client.convert(TEST_IMAGE, 'webp', {
        'to_file': 'python_sdk_out.webp'
    })
    print("   Success: Saved to python_sdk_out.webp\n")

except ShrinkixError as e:
    print(f"SDK Error: {e}")
except Exception as e:
    print(f"Unexpected Error: {e}")
