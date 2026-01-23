const fs = require('fs');
const path = require('path');

class SmartCompress {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.shrinkix.com/compress';
    }

    /**
     * Compress an image from a file path
     * @param {string} inputPath 
     * @param {string} outputPath 
     * @param {object} options { quality, width, height, format }
     */
    async fromFile(inputPath, outputPath, options = {}) {
        try {
            if (!fs.existsSync(inputPath)) {
                throw new Error(`File not found: ${inputPath}`);
            }

            // Node.js 18+ fetch and FormData
            const fileBuffer = fs.readFileSync(inputPath);
            const fileBlob = new Blob([fileBuffer]);

            const formData = new FormData();
            formData.append('image', fileBlob, path.basename(inputPath));

            if (options.quality) formData.append('quality', options.quality.toString());
            if (options.width) formData.append('width', options.width.toString());
            if (options.height) formData.append('height', options.height.toString());
            if (options.format) formData.append('format', options.format);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'X-API-Key': this.apiKey
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Compression failed: ${await response.text()}`);
            }

            const buffer = await response.arrayBuffer();
            fs.writeFileSync(outputPath, Buffer.from(buffer));

            return {
                success: true,
                path: outputPath
            };

        } catch (error) {
            throw error;
        }
    }
}

module.exports = SmartCompress;
