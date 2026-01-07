const fs = require('fs');
const { openAsBlob } = fs;

async function test() {
    if (!openAsBlob) {
        console.error("This script requires Node.js v20+ with fs.openAsBlob");
        return;
    }

    try {
        const blob = await openAsBlob('test.png', { type: 'image/png' });

        // Test Free Tier
        console.log("Testing Free Tier (JS/Fetch)...");
        const formData = new FormData();
        formData.append('image', blob, 'test.png');

        let response = await fetch('http://localhost:5000/api/compress', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log("Free tier success");
            const buffer = await response.arrayBuffer();
            fs.writeFileSync('compressed_js_free.png', Buffer.from(buffer));
        } else {
            console.log("Free tier failed:", response.status, await response.text());
        }

        // Test Pro Tier
        console.log("\nTesting Pro Tier (JS/Fetch)...");
        const formDataPro = new FormData();
        formDataPro.append('image', blob, 'test.png');

        response = await fetch('http://localhost:5000/api/compress', {
            method: 'POST',
            headers: {
                'X-API-Key': 'tr_f23ffe0e410f940a26b1354f7a134ea1'
            },
            body: formDataPro
        });

        if (response.ok) {
            console.log("Pro tier success");
            const buffer = await response.arrayBuffer();
            fs.writeFileSync('compressed_js_pro.png', Buffer.from(buffer));

            const originalSize = response.headers.get('X-Original-Size');
            const compressedSize = response.headers.get('X-Compressed-Size');
            const savedPercent = response.headers.get('X-Saved-Percent');

            console.log(`Saved ${savedPercent}% (${originalSize} -> ${compressedSize} bytes)`);
        } else {
            console.log("Pro tier failed:", response.status, await response.text());
        }

    } catch (e) {
        console.error("Test error:", e);
    }
}

test();
