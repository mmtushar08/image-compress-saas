const Shrinkix = require('./client');
const ApiError = require('./errors/ApiError');
const NetworkError = require('./errors/NetworkError');

module.exports = {
    Shrinkix,
    ApiError,
    NetworkError
};

// Default export
module.exports.default = Shrinkix;
