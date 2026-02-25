const db = require('../services/db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generate a new secure API key
const generateKey = () => {
    return 'sk_' + crypto.randomBytes(24).toString('hex');
};

exports.listKeys = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const keys = db.prepare(`
            SELECT id, name, prefix, createdAt, lastUsedAt, status 
            FROM api_keys 
            WHERE userId = ? AND status IN ('active', 'disabled')
            ORDER BY createdAt DESC
        `).all(req.user.id);

        const exposedKeys = keys.map(k => ({
            ...k,
            apiKey: k.prefix
        }));

        res.json({ success: true, keys: exposedKeys });
    } catch (error) {
        console.error("List Keys Error:", error);
        res.status(500).json({ success: false, error: 'Failed to fetch API keys' });
    }
};

exports.createKey = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Limit number of keys (e.g., 5 per user)
    const count = db.prepare('SELECT count(*) as count FROM api_keys WHERE userId = ? AND status = \'active\'').get(req.user.id).count;
    if (count >= 5) {
        return res.status(400).json({ success: false, error: 'Maximum limit of 5 Active API keys reached.' });
    }

    try {
        const { name } = req.body;
        const apiKey = generateKey();
        const keyHash = await bcrypt.hash(apiKey, 10);
        const prefix = apiKey.substring(0, 10) + '...';
        const id = 'key_' + crypto.randomBytes(8).toString('hex');

        db.prepare(`
            INSERT INTO api_keys (id, userId, keyHash, name, prefix, createdAt, status)
            VALUES (?, ?, ?, ?, ?, ?, 'active')
        `).run(id, req.user.id, keyHash, name || 'New API Key', prefix, new Date().toISOString());

        res.json({
            success: true,
            key: {
                id,
                name: name || 'New API Key',
                prefix,
                apiKey, // Return raw key
                createdAt: new Date().toISOString(),
                status: 'active'
            }
        });
    } catch (error) {
        console.error("Create Key Error:", error);
        res.status(500).json({ success: false, error: 'Failed to create API key' });
    }
};

exports.revokeKey = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const keyId = req.params.id;

    try {
        const result = db.prepare(`
            UPDATE api_keys 
            SET status = 'revoked' 
            WHERE id = ? AND userId = ?
        `).run(keyId, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Key not found or permission denied' });
        }

        res.json({ success: true, message: 'API Key revoked successfully' });
    } catch (error) {
        console.error("Revoke Key Error:", error);
        res.status(500).json({ success: false, error: 'Failed to revoke API key' });
    }
};

exports.renameKey = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const keyId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Name is required' });
    }

    try {
        const result = db.prepare(`
            UPDATE api_keys 
            SET name = ? 
            WHERE id = ? AND userId = ?
        `).run(name.substring(0, 50), keyId, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Key not found' });
        }

        res.json({ success: true, message: 'Key renamed' });
    } catch (error) {
        console.error("Rename Key Error:", error);
        res.status(500).json({ success: false, error: 'Failed to rename key' });
    }
};

exports.toggleKeyStatus = (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const keyId = req.params.id;
    const { status } = req.body; // 'active' or 'disabled'

    if (!['active', 'disabled'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    try {
        const result = db.prepare(`
            UPDATE api_keys 
            SET status = ? 
            WHERE id = ? AND userId = ?
        `).run(status, keyId, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Key not found' });
        }

        res.json({ success: true, message: `Key ${status}` });
    } catch (error) {
        console.error("Toggle Key Status Error:", error);
        res.status(500).json({ success: false, error: 'Failed to update key status' });
    }
};
