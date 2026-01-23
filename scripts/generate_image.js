const fs = require('fs');
const path = require('path');

const width = 800;
const height = 600;
const buffer = Buffer.alloc(width * height * 3);

// Generate random noise
for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
}

// Add a P6 PPM header (simple binary format)
const header = `P6\n${width} ${height}\n255\n`;
const ppmBuffer = Buffer.concat([Buffer.from(header), buffer]);

// Save as .ppm which sharp can read/convert or we can try to upload directly if supported?
// Better: use sharp if available to save as PNG.
// Assuming we are in project root, try to require sharp from api/node_modules

try {
    const sharp = require('./api/node_modules/sharp');
    sharp(buffer, { raw: { width, height, channels: 3 } })
        .png()
        .toFile('test_large.png')
        .then(() => console.log('Created test_large.png'))
        .catch(err => console.error(err));
} catch (e) {
    console.log("Sharp not found in standard path, trying to create a simple BMP instead.");
    // Fallback or just tell user? 
    // Let's just blindly try to use the PPM, but the API might not support PPM input (it supports upload content validation).
    // Let's create a BMP manually.
}
