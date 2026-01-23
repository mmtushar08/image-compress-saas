const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:5001/api/compress';
const API_KEY = 'sk_live_test_key';
const INPUT_IMAGE = path.join(__dirname, '../test.png');
const OUTPUT_IMAGE = path.join(__dirname, '../compressed_node.png');

// Ensure test image exists
if (!fs.existsSync(INPUT_IMAGE)) {
    console.warn("Test image not found at " + INPUT_IMAGE);
    process.exit(1);
}

async function verifyCompression() {
    console.log("1. Testing Node.js Compression (Native Fetch)...");

    try {
        const buffer = fs.readFileSync(INPUT_IMAGE);
        const blob = new Blob([buffer], { type: 'image/png' });

        const form = new FormData();
        form.append('image', blob, 'test.png');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                // 'X-API-Key': API_KEY 
            },
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(OUTPUT_IMAGE, Buffer.from(arrayBuffer));

        console.log("✅ Node.js Compression Successful!");
        console.log(`Saved to: ${OUTPUT_IMAGE}`);

        // Check headers
        console.log("Headers:", {
            'x-original-size': response.headers.get('x-original-size'),
            'x-compressed-size': response.headers.get('x-compressed-size'),
            'x-saved-percent': response.headers.get('x-saved-percent')
        });

    } catch (error) {
        console.error("❌ Node.js Compression Failed:", error);
        process.exit(1);
    }
}

verifyCompression();
