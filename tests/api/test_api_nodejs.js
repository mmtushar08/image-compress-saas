const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const API_URL = 'http://localhost:5000';
const TEST_IMAGE = 'test_quality_90.jpg';

async function testCheckLimit() {
    console.log('\n=== Testing Check Limit Endpoint ===');
    try {
        const response = await axios.get(`${API_URL}/api/check-limit`);
        console.log('✓ Check Limit Response:', response.data);
        return true;
    } catch (error) {
        console.error('✗ Check Limit Failed:', error.message);
        return false;
    }
}

async function testCompressImage() {
    console.log('\n=== Testing Image Compression ===');
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(TEST_IMAGE));
        form.append('quality', '80');
        form.append('format', 'webp');

        const response = await axios.post(`${API_URL}/api/compress`, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Save compressed image
        fs.writeFileSync('compressed_nodejs_test.webp', response.data);

        console.log('✓ Compression successful!');
        console.log('  Original Size:', response.headers['x-original-size']);
        console.log('  Compressed Size:', response.headers['x-compressed-size']);
        console.log('  Saved:', response.headers['x-saved-percent'] + '%');
        console.log('  Output file: compressed_nodejs_test.webp');

        return true;
    } catch (error) {
        console.error('✗ Compression Failed:', error.response?.data || error.message);
        return false;
    }
}

async function testBatchCompression() {
    console.log('\n=== Testing Batch Compression ===');
    try {
        const form = new FormData();
        form.append('images[]', fs.createReadStream('test_quality_90.jpg'));
        form.append('images[]', fs.createReadStream('test_quality_10.jpg'));

        const response = await axios.post(`${API_URL}/api/compress/batch`, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Save ZIP file
        fs.writeFileSync('compressed_batch_nodejs_test.zip', response.data);

        console.log('✓ Batch compression successful!');
        console.log('  Output file: compressed_batch_nodejs_test.zip');

        return true;
    } catch (error) {
        console.error('✗ Batch Compression Failed:', error.response?.data || error.message);
        return false;
    }
}

async function testFormatConversion() {
    console.log('\n=== Testing Format Conversion (WebP) ===');
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(TEST_IMAGE));
        form.append('format', 'webp');

        const response = await axios.post(`${API_URL}/api/compress`, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Save converted image
        fs.writeFileSync('converted_nodejs_test.webp', response.data);

        const contentType = response.headers['content-type'];
        if (contentType === 'image/webp') {
            console.log('✓ Format conversion successful!');
            console.log('  Content-Type:', contentType);
            console.log('  Output file: converted_nodejs_test.webp');
            return true;
        } else {
            console.error('✗ Wrong Content-Type:', contentType);
            return false;
        }
    } catch (error) {
        console.error('✗ Format Conversion Failed:', error.response?.data || error.message);
        return false;
    }
}

async function testResize() {
    console.log('\n=== Testing Image Resize ===');
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(TEST_IMAGE));
        form.append('width', '100');

        const response = await axios.post(`${API_URL}/api/compress`, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Save resized image
        fs.writeFileSync('resized_nodejs_test.jpg', response.data);

        const fileSize = response.data.length;
        console.log('✓ Resize successful!');
        console.log('  Output Size:', fileSize, 'bytes');
        console.log('  Output file: resized_nodejs_test.jpg');

        // Verify it's smaller than 5KB (indicating resize worked)
        if (fileSize < 5000) {
            console.log('  ✓ Size verification passed (< 5KB)');
            return true;
        } else {
            console.error('  ✗ Size verification failed (>= 5KB)');
            return false;
        }
    } catch (error) {
        console.error('✗ Resize Failed:', error.response?.data || error.message);
        return false;
    }
}

async function testMetadataPreservation() {
    console.log('\n=== Testing Metadata Preservation ===');
    try {
        const form = new FormData();
        form.append('image', fs.createReadStream(TEST_IMAGE));
        form.append('preserveMetadata', 'true');

        const response = await axios.post(`${API_URL}/api/compress`, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Save image with metadata
        fs.writeFileSync('metadata_nodejs_test.jpg', response.data);

        const metadataPreserved = response.headers['x-metadata-preserved'];
        if (metadataPreserved === 'true') {
            console.log('✓ Metadata preservation successful!');
            console.log('  X-Metadata-Preserved:', metadataPreserved);
            console.log('  Output file: metadata_nodejs_test.jpg');
            return true;
        } else {
            console.error('✗ Metadata header missing or false:', metadataPreserved);
            return false;
        }
    } catch (error) {
        console.error('✗ Metadata Preservation Failed:', error.response?.data || error.message);
        return false;
    }
}

async function runTests() {
    console.log('Starting API Tests with Node.js...\n');
    console.log('API URL:', API_URL);
    console.log('Test Image:', TEST_IMAGE);

    const results = {
        checkLimit: await testCheckLimit(),
        compress: await testCompressImage(),
        batch: await testBatchCompression(),
        convert: await testFormatConversion(),
        resize: await testResize(),
        metadata: await testMetadataPreservation()
    };

    console.log('\n=== Test Results Summary ===');
    console.log('Check Limit:', results.checkLimit ? '✓ PASS' : '✗ FAIL');
    console.log('Compress Image:', results.compress ? '✓ PASS' : '✗ FAIL');
    console.log('Batch Compression:', results.batch ? '✓ PASS' : '✗ FAIL');
    console.log('Format Conversion:', results.convert ? '✓ PASS' : '✗ FAIL');
    console.log('Image Resize:', results.resize ? '✓ PASS' : '✗ FAIL');
    console.log('Metadata Preservation:', results.metadata ? '✓ PASS' : '✗ FAIL');

    const allPassed = Object.values(results).every(r => r === true);
    console.log('\nOverall:', allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED');

    process.exit(allPassed ? 0 : 1);
}

runTests();
