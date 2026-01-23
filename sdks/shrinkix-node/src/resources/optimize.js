const FormData = require('form-data');
const fs = require('fs');

/**
 * Optimize Resource
 * Handles image optimization operations
 */
class Optimize {
    constructor(transport) {
        this.transport = transport;
    }

    /**
     * Optimize an image
     * @param {Object} params
     * @param {string|Buffer|Stream} params.file - File path, buffer, or stream
     * @param {Object} params.resize - {width, height, fit}
     * @param {Object} params.crop - {mode, ratio}
     * @param {string} params.format - Output format (jpg|png|webp|avif)
     * @param {number} params.quality - 1-100
     * @param {string} params.metadata - strip|keep
     */
    async optimize(params) {
        const formData = new FormData();

        // Handle file input
        if (typeof params.file === 'string') {
            formData.append('image', fs.createReadStream(params.file));
        } else {
            formData.append('image', params.file);
        }

        // Add optional parameters
        if (params.resize) {
            formData.append('resize', JSON.stringify(params.resize));
        }
        if (params.crop) {
            formData.append('crop', JSON.stringify(params.crop));
        }
        if (params.format) {
            formData.append('format', params.format);
        }
        if (params.quality) {
            formData.append('quality', params.quality.toString());
        }
        if (params.metadata) {
            formData.append('metadata', params.metadata);
        }

        const result = await this.transport.post('/optimize', {
            body: formData,
            headers: formData.getHeaders(),
            returnRaw: true
        });

        return {
            data: result.data,
            rateLimit: result.rateLimit,
            requestId: result.rateLimit.requestId
        };
    }
}

module.exports = Optimize;
