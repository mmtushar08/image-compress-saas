const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:5001/api/compress';
const INPUT_IMAGE = path.join(__dirname, '../test.png');
const OUTPUT_IMAGE = path.join(__dirname, '../test_converted.webp');

// Ensure test image exists
if (!fs.existsSync(INPUT_IMAGE)) {
    console.warn("Test image not found at " + INPUT_IMAGE);
    process.exit(1);
}

async function verifyConversion() {
    console.log("Testing Anonymous Conversion (PNG -> WebP)...");

    try {
        const buffer = fs.readFileSync(INPUT_IMAGE);
        const blob = new Blob([buffer], { type: 'image/png' });

        const form = new FormData();
        form.append('image', blob, 'test.png');
        form.append('format', 'webp'); // Request conversion

        // No API Key = Anonymous/Guest
        const response = await fetch(API_URL, {
            method: 'POST',
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(OUTPUT_IMAGE, Buffer.from(arrayBuffer));

        console.log("✅ Conversion Successful!");
        console.log(`Saved to: ${OUTPUT_IMAGE}`);

        // Verify output file header (RIFF.....WEBP)
        const header = fs.readFileSync(OUTPUT_IMAGE, { length: 12 });
        const headerStr = header.toString('ascii');
        if (headerStr.includes('WEBP')) {
            console.log("✅ File verified as WebP");
        } else {
            console.error("❌ File header does not look like WebP:", headerStr);
        }

    } catch (error) {
        console.error("❌ Conversion Failed:", error);
        process.exit(1);
    }
}

verifyConversion();
