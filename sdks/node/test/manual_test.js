const shrinkix = require('../src/index')('YOUR_API_KEY', {
    baseUrl: 'http://localhost:5000'
});
const path = require('path');

// Test Config
const TEST_IMAGE = path.join(__dirname, '../../test_quality_90.jpg');

async function testSDK() {
    console.log('Testing SDK...');

    try {
        // 1. Account Check
        console.log('1. Checking Account...');
        const account = await shrinkix.account();
        console.log('   Success:', account);

        // 2. Compress Image
        console.log('\n2. Compressing Image...');
        await shrinkix.compress(TEST_IMAGE, {
            quality: 50,
            toFile: 'sdk_output.jpg'
        });
        console.log('   Success: Saved to sdk_output.jpg');

        // 3. Convert Image
        console.log('\n3. Converting to WebP...');
        await shrinkix.convert(TEST_IMAGE, 'webp', {
            toFile: 'sdk_output.webp'
        });
        console.log('   Success: Saved to sdk_output.webp');

    } catch (error) {
        console.error('SDK Test Failed:', error);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

testSDK();
