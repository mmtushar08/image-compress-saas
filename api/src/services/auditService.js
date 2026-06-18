const logger = require('../utils/logger');
const auditRepo = require('../repositories/auditRepository');

/**
 * Fire-and-forget audit recorder. Never throws into the request path — an audit
 * failure is logged but must not break the user-facing action.
 *
 *   audit('auth.login', { actorType: 'user', actorId, ip, metadata });
 */
function audit(action, fields = {}) {
    auditRepo
        .record({ action, ...fields })
        .catch((err) => logger.error('Audit write failed', { action, error: err.message }));
}

module.exports = { audit };
