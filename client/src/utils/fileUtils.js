/**
 * Format file size from bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2 MB", "500 KB")
 */
export const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(0) + ' MB';
    }
    return (bytes / 1024).toFixed(0) + ' KB';
};

/**
 * Retrieve API key from localStorage
 * @returns {string|null} API key or null if not found
 */
export const getApiKey = () => {
    try {
        const auth = JSON.parse(localStorage.getItem('shrinkix_auth'));
        return auth ? auth.apiKey : null;
    } catch {
        return null;
    }
};
