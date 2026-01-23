/**
 * Usage Resource
 * Get usage statistics
 */
class Usage {
    constructor(transport) {
        this.transport = transport;
    }

    /**
     * Get current usage stats
     */
    async getStats() {
        const result = await this.transport.get('/usage/stats');
        return {
            ...result.data,
            rateLimit: result.rateLimit
        };
    }
}

module.exports = Usage;
