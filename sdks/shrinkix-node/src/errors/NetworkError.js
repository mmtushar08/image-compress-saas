/**
 * Network Error
 * Thrown when network request fails
 */
class NetworkError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'NetworkError';
        this.originalError = originalError;
    }
}

module.exports = NetworkError;
