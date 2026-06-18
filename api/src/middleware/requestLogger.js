const logger = require('../utils/logger');

/**
 * Attaches a request-scoped child logger (carrying the correlation/request id)
 * and emits one structured access-log line per request on completion. Every
 * log written via req.log is automatically tagged with the same requestId, so
 * a single request can be traced across services and files.
 */
module.exports = (req, res, next) => {
    req.log = logger.child({ requestId: req.id });

    const start = process.hrtime.bigint();

    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

        req.log[level]('request completed', {
            method:     req.method,
            path:       req.originalUrl,
            status:     res.statusCode,
            durationMs: Math.round(durationMs),
            ip:         req.ip,
        });
    });

    next();
};
