const fs = require('fs');
const { openAsBlob } = fs;

async function testWebP() {
    if (!openAsBlob) {
        console.error("This script requires Node.js v20+ with fs.openAsBlob");
        return;
    }

    try {
        console.log("Starting WebP Test...");

        // 1. Test PNG -> WebP Conversion
        console.log("\n1. Testing PNG -> WebP conversion...");
        const blob = await openAsBlob('test.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', blob, 'test.png');
        // Add format=webp to body
        formData.append('format', 'webp');

        let response = await fetch('http://localhost:5000/api/compress', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log("PNG -> WebP success");
            const buffer = await response.arrayBuffer();
            fs.writeFileSync('output_test.webp', Buffer.from(buffer));
            console.log("Saved output_test.webp");
        } else {
            console.error("PNG -> WebP failed:", response.status, await response.text());
            return; // Stop if failed
        }

        // 2. Test WebP Input Support
        console.log("\n2. Testing WebP Input support...");
        const webpBlob = await openAsBlob('output_test.webp', { type: 'image/webp' });
        const formDataWebP = new FormData();
        formDataWebP.append('image', webpBlob, 'output_test.webp');
        // We ensure it accepts webp and can output (defaulting to input format or specified)
        // Let's output to png to verify conversion back
        formDataWebP.append('format', 'png');

        response = await fetch('http://localhost:5000/api/compress', {
            method: 'POST',
            body: formDataWebP
        });

        if (response.ok) {
            console.log("WebP -> PNG success");
            const buffer = await response.arrayBuffer();
            fs.writeFileSync('output_test_back.png', Buffer.from(buffer));
            console.log("Saved output_test_back.png");
        } else {
            console.error("WebP -> PNG failed:", response.status, await response.text());
        }

    } catch (e) {
        console.error("Test error:", e);
    }
}

testWebP();
