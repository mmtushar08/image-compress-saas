const Transport = require('./transport');
const Optimize = require('./resources/optimize');
const Usage = require('./resources/usage');
const Limits = require('./resources/limits');
const Validate = require('./resources/validate');

/**
 * Shrinkix Client
 * Main SDK entry point
 */
class Shrinkix {
    /**
     * Create a new Shrinkix client
     * @param {Object} config
     * @param {string} config.apiKey - Your API key
     * @param {string} config.baseUrl - API base URL (optional)
     * @param {boolean} config.sandbox - Enable sandbox mode (optional)
     */
    constructor(config) {
        if (!config || !config.apiKey) {
            throw new Error('API key is required');
        }

        this.config = config;
        this.transport = new Transport(config);

        // Initialize resources
        this.optimize = new Optimize(this.transport);
        this.usage = new Usage(this.transport);
        this.limits = new Limits(this.transport);
        this.validate = new Validate(this.transport);
    }
}

module.exports = Shrinkix;
