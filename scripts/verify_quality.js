const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'http://localhost:5001/api/compress';
const INPUT_IMAGE = path.join(__dirname, '../client/src/assets/hero-bg.png');
const OUTPUT_LOW = path.join(__dirname, '../test_quality_10.jpg');
const OUTPUT_HIGH = path.join(__dirname, '../test_quality_90.jpg');

// Ensure test image exists
if (!fs.existsSync(INPUT_IMAGE)) {
    console.warn("Test image not found at " + INPUT_IMAGE);
    // Create dummy image if needed, or just exit
    process.exit(1);
}

async function compressWithQuality(quality, outputPath) {
    try {
        const buffer = fs.readFileSync(INPUT_IMAGE);
        const blob = new Blob([buffer], { type: 'image/png' });

        const form = new FormData();
        form.append('format', 'jpg');
        form.append('quality', quality.toString());
        form.append('image', blob, 'test.png');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'X-Forwarded-For': `10.0.0.${quality}` // Different IP for each request
            },
            body: form
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
        console.log(`✅ Quality ${quality} saved to: ${outputPath}`);
        return fs.statSync(outputPath).size;

    } catch (error) {
        console.error(`❌ Compression (Q=${quality}) Failed:`, error);
        return -1;
    }
}

async function verifyQuality() {
    console.log("Testing Quality Parameter (10 vs 90)...");

    const sizeLow = await compressWithQuality(10, OUTPUT_LOW);
    const sizeHigh = await compressWithQuality(90, OUTPUT_HIGH);

    if (sizeLow > 0 && sizeHigh > 0) {
        console.log(`\nResults:`);
        console.log(`Quality 10 Size: ${(sizeLow / 1024).toFixed(2)} KB`);
        console.log(`Quality 90 Size: ${(sizeHigh / 1024).toFixed(2)} KB`);

        if (sizeLow < sizeHigh) {
            console.log("✅ Verification Passed: Low quality produces smaller file.");
        } else {
            console.error("❌ Verification Failed: File sizes are unexpected.");
        }
    }
}

verifyQuality();
