const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5001/api/compress';
const INPUT_IMAGE = path.join(__dirname, '../client/src/assets/hero-bg.png');

async function testConversion() {
    console.log('Testing PNG to WebP conversion...\n');

    try {
        const buffer = fs.readFileSync(INPUT_IMAGE);
        const blob = new Blob([buffer], { type: 'image/png' });

        const form = new FormData();
        form.append('format', 'webp');
        form.append('image', blob, 'test-image.png');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = await response.json();

        console.log('✅ Conversion successful!');
        console.log('\nResponse:');
        console.log('- Input format:', data.input.type);
        console.log('- Output format:', data.output.type);
        console.log('- Download URL:', data.output.url);
        console.log('- Original size:', (data.input.size / 1024).toFixed(2), 'KB');
        console.log('- Converted size:', (data.output.size / 1024).toFixed(2), 'KB');
        console.log('- Saved:', data.stats.saved_percent + '%');

        // Check if filename has correct extension
        const filename = data.output.url.split('?name=')[1];
        if (filename) {
            console.log('- Download filename:', decodeURIComponent(filename));
            if (filename.endsWith('.webp')) {
                console.log('\n✅ Filename has correct .webp extension!');
            } else {
                console.log('\n❌ Warning: Filename does not have .webp extension');
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testConversion();
