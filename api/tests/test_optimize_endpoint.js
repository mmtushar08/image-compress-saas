/**
 * Test Suite for /api/v1/optimize endpoint
 * Tests operation counting, rate limits, sandbox mode, and responses
 */

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/v1/optimize';
const TEST_IMAGE = path.join(__dirname, 'test-image.jpg');
const API_KEY = 'sk_test_b4eb8968065c578f25722b10'; // Test key

console.log('🧪 Testing /api/v1/optimize endpoint\n');

// Test 1: Basic compression (1 operation)
async function testBasicCompression() {
    console.log('=== Test 1: Basic Compression (1 operation) ===');

    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(TEST_IMAGE));
        formData.append('quality', '80');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        console.log('Status:', response.status);
        console.log('Headers:');
        console.log('  X-RateLimit-Limit:', response.headers.get('X-RateLimit-Limit'));
        console.log('  X-RateLimit-Remaining:', response.headers.get('X-RateLimit-Remaining'));
        console.log('  X-Request-ID:', response.headers.get('X-Request-ID'));
        console.log('  X-Operations:', response.headers.get('X-Operations'));

        if (response.ok) {
            console.log('✓ Basic compression works\n');
        } else {
            const error = await response.json();
            console.log('✗ Error:', error);
        }
    } catch (err) {
        console.log('✗ Request failed:', err.message);
    }
}

// Test 2: Compression + Resize (2 operations)
async function testCompressionWithResize() {
    console.log('=== Test 2: Compression + Resize (2 operations) ===');

    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(TEST_IMAGE));
        formData.append('resize', JSON.stringify({ width: 1200, height: 800, fit: 'contain' }));
        formData.append('quality', '80');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        console.log('Status:', response.status);
        console.log('Operations:', response.headers.get('X-Operations'));

        if (response.ok) {
            console.log('✓ Resize works\n');
        } else {
            const error = await response.json();
            console.log('✗ Error:', error);
        }
    } catch (err) {
        console.log('✗ Request failed:', err.message);
    }
}

// Test 3: Sandbox mode
async function testSandboxMode() {
    console.log('=== Test 3: Sandbox Mode ===');

    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(TEST_IMAGE));
        formData.append('quality', '80');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'X-Mode': 'sandbox',
                ...formData.getHeaders()
            },
            body: formData
        });

        console.log('Status:', response.status);
        console.log('Sandbox Mode:', response.headers.get('X-Sandbox-Mode'));

        if (response.ok) {
            console.log('✓ Sandbox mode works\n');
        } else {
            const error = await response.json();
            console.log('✗ Error:', error);
        }
    } catch (err) {
        console.log('✗ Request failed:', err.message);
    }
}

// Test 4: Operation limit exceeded
async function testOperationLimit() {
    console.log('=== Test 4: Operation Limit Exceeded ===');

    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(TEST_IMAGE));
        formData.append('resize', JSON.stringify({ width: 1200, height: 800 }));
        formData.append('crop', JSON.stringify({ mode: 'center', ratio: '1:1' }));
        formData.append('format', 'webp');
        formData.append('metadata', 'keep');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                ...formData.getHeaders()
            },
            body: formData
        });

        console.log('Status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.log('Error:', error.error);
            console.log('Message:', error.message);
            console.log('✓ Operation limit enforced\n');
        } else {
            console.log('✗ Should have failed\n');
        }
    } catch (err) {
        console.log('✗ Request failed:', err.message);
    }
}

// Run all tests
async function runTests() {
    // Check if test image exists
    if (!fs.existsSync(TEST_IMAGE)) {
        console.log('⚠️  Test image not found. Please create test-image.jpg in api directory\n');
        console.log('You can use any JPG image for testing.\n');
        return;
    }

    await testBasicCompression();
    await testCompressionWithResize();
    await testSandboxMode();
    await testOperationLimit();

    console.log('✅ All tests complete!\n');
}

// Check if running as main module
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests };
