const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class Shrinkix {
    /**
     * Initialize Shrinkix Client
     * @param {string} apiKey - Your Shrinkix API Key
     * @param {Object} options - Optional config { baseUrl: '...' }
     */
    constructor(apiKey, options = {}) {
        if (!apiKey) {
            throw new Error('API Key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = options.baseUrl || 'https://api.shrinkix.com';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'X-API-Key': this.apiKey
            }
        });
    }

    /**
     * Get account usage and limits
     * @returns {Promise<Object>} Account details
     */
    async account() {
        try {
            const response = await this.client.get('/api/check-limit');
            return response.data;
        } catch (error) {
            this._handleError(error);
        }
    }

    /**
     * Compress an image
     * @param {string|Buffer} image - File path or Buffer
     * @param {Object} options - Compression options
     * @param {number} options.quality - Quality (1-100)
     * @param {number} options.width - Resize width
     * @param {number} options.height - Resize height
     * @param {boolean} options.preserveMetadata - Keep metadata
     * @param {string} options.toFile - Path to save output (optional)
     * @returns {Promise<Buffer>} Compressed image buffer
     */
    async compress(image, options = {}) {
        return this._processImage(image, options, 'compress');
    }

    /**
     * Convert an image format
     * @param {string|Buffer} image - File path or Buffer
     * @param {string} format - Target format (webp, avif, png, jpg)
     * @param {Object} options - Additional options
     * @returns {Promise<Buffer>} Converted image buffer
     */
    async convert(image, format, options = {}) {
        if (!format) throw new Error('Format is required');
        return this._processImage(image, { ...options, format }, 'compress');
    }

    /**
     * Internal method to process image requests
     * @private
     */
    async _processImage(image, options, endpoint) {
        try {
            const form = new FormData();

            // Handle Image Input
            if (typeof image === 'string') {
                if (!fs.existsSync(image)) throw new Error(`File not found: ${image}`);
                form.append('image', fs.createReadStream(image));
            } else if (Buffer.isBuffer(image)) {
                form.append('image', image, { filename: 'image.jpg' });
            } else {
                throw new Error('Image must be a file path string or Buffer');
            }

            // Handle Options
            if (options.quality) form.append('quality', String(options.quality));
            if (options.width) form.append('width', String(options.width));
            if (options.height) form.append('height', String(options.height));
            if (options.format) form.append('format', String(options.format));
            if (options.preserveMetadata) form.append('preserveMetadata', 'true');

            const response = await this.client.post(`/api/${endpoint}`, form, {
                headers: {
                    ...form.getHeaders()
                },
                responseType: 'arraybuffer'
            });

            // Handle Output File
            if (options.toFile) {
                fs.writeFileSync(options.toFile, response.data);
            }

            return response.data;

        } catch (error) {
            this._handleError(error);
        }
    }

    _handleError(error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || error.message;

            if (status === 401) throw new Error(`Shrinkix Auth Error: ${message}`);
            if (status === 429) throw new Error(`Shrinkix Limit Error: ${message}`);
            throw new Error(`Shrinkix API Error (${status}): ${message}`);
        }
        throw error;
    }
}

module.exports = Shrinkix;
