/**
 * API Error
 * Thrown when API returns an error response
 */
class ApiError extends Error {
    constructor(response, body) {
        super(body.message || 'API Error');
        this.name = 'ApiError';
        this.code = body.error;
        this.statusCode = response.status;
        this.requestId = body.request_id;
        this.details = body.details || {};
        this.docsUrl = body.docs_url;

        // Rate limit headers
        this.rateLimit = {
            limit: response.headers.get('x-ratelimit-limit'),
            remaining: response.headers.get('x-ratelimit-remaining'),
            reset: response.headers.get('x-ratelimit-reset')
        };

        // Retry-After for 429 errors
        if (response.status === 429) {
            this.retryAfter = response.headers.get('retry-after');
        }
    }
}

module.exports = ApiError;
