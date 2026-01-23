const fetch = require('node-fetch');
const ApiError = require('./errors/ApiError');
const NetworkError = require('./errors/NetworkError');

/**
 * HTTP Transport Layer
 * Handles all API communication
 */
class Transport {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || 'https://api.shrinkix.com/v1';
        this.sandbox = config.sandbox || false;
    }

    /**
     * Make HTTP request
     */
    async request(method, endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            ...options.headers
        };

        // Add sandbox mode header
        if (this.sandbox) {
            headers['X-Mode'] = 'sandbox';
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: options.body
            });

            // Extract rate limit headers
            const rateLimitInfo = {
                limit: response.headers.get('x-ratelimit-limit'),
                remaining: response.headers.get('x-ratelimit-remaining'),
                reset: response.headers.get('x-ratelimit-reset'),
                requestId: response.headers.get('x-request-id')
            };

            // Handle errors
            if (!response.ok) {
                const body = await response.json();
                throw new ApiError(response, body);
            }

            // Return response with metadata
            return {
                data: options.returnRaw ? response : await response.json(),
                rateLimit: rateLimitInfo,
                headers: response.headers
            };

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new NetworkError('Network request failed', error);
        }
    }

    /**
     * GET request
     */
    async get(endpoint, options) {
        return this.request('GET', endpoint, options);
    }

    /**
     * POST request
     */
    async post(endpoint, options) {
        return this.request('POST', endpoint, options);
    }
}

module.exports = Transport;
