const Shrinkix = require('./Client');

/**
 * Initialize the Shrinkix SDK
 * @param {string} apiKey - Your API Key
 * @param {Object} options - Configuration options
 */
module.exports = (apiKey, options) => {
    return new Shrinkix(apiKey, options);
};

// Export class for manual instantiation if needed
module.exports.Shrinkix = Shrinkix;
