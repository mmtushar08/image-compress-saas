/**
 * Limits Resource
 * Get plan limits
 */
class Limits {
    constructor(transport) {
        this.transport = transport;
    }

    /**
     * Get plan limits
     */
    async get() {
        const result = await this.transport.get('/limits');
        return {
            ...result.data,
            rateLimit: result.rateLimit
        };
    }
}

module.exports = Limits;
