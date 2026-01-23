/**
 * Validate Resource
 * Validate images before upload
 */
class Validate {
    constructor(transport) {
        this.transport = transport;
    }

    /**
     * Validate image parameters
     * @param {Object} params
     * @param {number} params.fileSize - File size in bytes
     * @param {string} params.format - Image format
     * @param {number} params.width - Image width
     * @param {number} params.height - Image height
     */
    async validate(params) {
        const result = await this.transport.post('/validate', {
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            ...result.data,
            rateLimit: result.rateLimit
        };
    }
}

module.exports = Validate;
