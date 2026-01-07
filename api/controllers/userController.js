const fs = require('fs');
const path = require('path');
const { sendWelcomeEmail } = require('../services/emailService');
const crypto = require('crypto');
const { sanitizeString, isValidEmail } = require('../utils/validation');

const DB_PATH = path.join(__dirname, '../data/users.json');

// Helper to read/write DB
const readDB = () => {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// --- GUEST USAGE TRACKING (In-Memory) ---
// IP -> { count, date }
const guestUsage = new Map();

exports.checkGuestLimit = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    let record = guestUsage.get(ip);

    if (!record || record.date !== today) {
        // Reset or new
        record = { count: 0, date: today };
        guestUsage.set(ip, record);
    }

    // Default limit for guests is 10 (matching rate limiter)
    // We don't block here (controller does via rate limiter), we just report
    return {
        usage: record.count,
        remaining: Math.max(0, 10 - record.count),
        limit: 10
    };
};

exports.incrementGuestUsage = (ip) => {
    const today = new Date().toISOString().split('T')[0];
    let record = guestUsage.get(ip);

    if (!record || record.date !== today) {
        record = { count: 0, date: today };
    }

    record.count += 1;
    guestUsage.set(ip, record);
};

// Plan Definitions
const PLANS = {
    // Free Tier
    free: {
        name: 'Free',
        price: 0,
        webLimit: 20,          // 20 images/day on web
        apiCredits: 0,         // No API access
        maxFileSize: 5 * 1024 * 1024
    },

    // Web Subscriptions (Unlimited Web, No API)
    'web-pro': {
        name: 'Web Pro',
        price: 39, // Yearly
        webLimit: -1,          // Unlimited on web
        apiCredits: 0,         // No API access included in base plan
        maxFileSize: 75 * 1024 * 1024
    },
    'web-ultra': {
        name: 'Web Ultra',
        price: 59, // Yearly
        webLimit: -1,          // Unlimited on web
        apiCredits: 0,         // No API access included in base plan
        maxFileSize: 150 * 1024 * 1024
    },

    // Legacy / API Add-on Plans (if needed later)
    pro: { credits: 1000, name: 'Pro API', price: 9, maxFileSize: 25 * 1024 * 1024 },
};
exports.PLANS = PLANS;

exports.register = (req, res) => {
    let { email, plan = 'free', billingCycle, invoiceData } = req.body;

    // Validate and sanitize email
    if (!email) {
        return res.status(400).json({ success: false, error: "Email is required" });
    }

    email = sanitizeString(email);

    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // Validate plan
    const validPlans = ['free', 'starter', 'pro', 'business', 'enterprise'];
    plan = sanitizeString(plan.toLowerCase());
    // Map input plan names to backend keys
    const planMapping = {
        'pro': 'web-pro',
        'ultra': 'web-ultra',
        'free': 'free'
    };
    // Default to free if invalid
    plan = planMapping[plan] || 'free';

    const users = readDB();
    let user = users.find(u => u.email === email);

    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(now.getMonth() + 1);

    const magicToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    if (user) {
        // Support Upgrade/Downgrade
        if (user.plan !== plan) {
            user.plan = plan;
            user.webLimit = PLANS[plan] ? PLANS[plan].webLimit : 20;
            user.apiCredits = PLANS[plan] ? PLANS[plan].apiCredits : 0;
            user.usage = 0; // Reset usage on plan change
            user.expiresAt = plan === 'free' ? null : nextMonth.toISOString();
            user.lastResetDate = now.toISOString();
            user.lastResetDate = now.toISOString();
            user.billingCycle = billingCycle || (plan.startsWith('web-') ? 'yearly' : 'monthly'); // Web plans default to yearly if not specified, API usually monthly
        }

        if (invoiceData) {
            user.invoiceDetails = invoiceData;
        }

        // Update user with new magic token for login/access
        user.magicToken = magicToken;
        user.tokenExpiry = tokenExpiry;
        writeDB(users);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const magicLink = `${frontendUrl}/auth?token=${magicToken}&email=${encodeURIComponent(email)}`;

        // Send specific email based on plan type
        if (plan.startsWith('web-')) {
            // Web Subscription Email
            sendWelcomeEmail(email, magicLink, false).catch(err => console.error("Error sending welcome email:", err));
        } else {
            // API / Default Email
            sendWelcomeEmail(email, magicLink, true).catch(err => console.error("Error sending welcome email:", err));
        }

        return res.json({ success: true, message: "Check your email for access link" });
    }

    // New User
    const apiKey = 'tr_' + crypto.randomBytes(16).toString('hex');

    const newUser = {
        id: Date.now().toString(),
        email,
        apiKey,
        plan: plan,
        webLimit: PLANS[plan] ? PLANS[plan].webLimit : 20,
        apiCredits: PLANS[plan] ? PLANS[plan].apiCredits : 0,
        usage: 0,
        createdAt: now.toISOString(),
        lastResetDate: now.toISOString(), // Track billing cycle start
        expiresAt: plan === 'free' ? null : nextMonth.toISOString(),
        billingCycle: billingCycle || 'yearly',
        invoiceDetails: invoiceData || {},
        magicToken, // Store token for verification
        tokenExpiry // 24 hour expiry
    };

    users.push(newUser);
    writeDB(users);

    // Generate magic link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const magicLink = `${frontendUrl}/auth?token=${magicToken}&email=${encodeURIComponent(email)}`;

    // Send Welcome Email with magic link, customized by plan type
    if (plan.startsWith('web-')) {
        sendWelcomeEmail(email, magicLink, false).catch(err => console.error("Error sending welcome email:", err));
    } else {
        // Free or API plans
        sendWelcomeEmail(email, magicLink, true).catch(err => console.error("Error sending welcome email:", err));
    }

    // DON'T return API key! User must verify email first
    res.json({ success: true, message: 'Check your email for access link' });
};

// Verify magic link token
exports.verifyToken = (req, res) => {
    const { token, email } = req.query;

    if (!token || !email) {
        return res.status(400).json({ success: false, error: "Token and email required" });
    }

    const users = readDB();
    const user = users.find(u => u.email === email && u.magicToken === token);

    if (!user) {
        return res.status(401).json({ success: false, error: "Invalid or expired link" });
    }

    // Check token expiry
    if (user.tokenExpiry && new Date() > new Date(user.tokenExpiry)) {
        return res.status(401).json({ success: false, error: "Link has expired. Please request a new one." });
    }

    // Token is valid! Return user data for login
    res.json({
        success: true,
        email: user.email,
        apiKey: user.apiKey,
        plan: user.plan
    });
};

exports.getProfile = (req, res) => {
    // User attached by auth middleware
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    res.json({
        email: user.email,
        apiKey: user.apiKey,
        plan: user.plan,
        usage: user.usage,
        credits: user.credits,
        expiresAt: user.expiresAt
    });
};

// Internal API to check/deduct credits (used by middleware)
exports.checkLimit = (apiKey) => {
    let users = readDB(); // Use let to allow modification if needed
    const idx = users.findIndex(u => u.apiKey === apiKey); // Get index to modify
    const user = users[idx];

    if (!user) return { allowed: false, error: "Invalid API Key" };

    const now = new Date();

    // Renewal Logic (Simple check)
    if (user.expiresAt && now > new Date(user.expiresAt)) {
        return { allowed: false, error: "Plan expired. Please renew." };
    }

    // PERIODIC RESET LOGIC (Monthly for Paid, Daily for Free)
    let stateChanged = false;

    if (user.plan === 'free' || user.plan === 'starter') {
        // Daily Logic for Free/Starter
        const today = now.toISOString().split('T')[0];
        if (user.lastUsedDate !== today) {
            user.dailyUsage = 0;
            user.lastUsedDate = today;
            stateChanged = true;
        }

        if (user.dailyUsage >= 10) {
            // Need to save if we reset dailyUsage above but are now blocked
            if (stateChanged) writeDB(users);
            return { allowed: false, error: "Daily limit reached (10 images/day). Please upgrade to Pro for more." };
        }
    } else {
        // Monthly Logic for Paid (Pro, Business, Enterprise)
        // Reset usage if we are in a new month compared to last reset
        // Using simple calendar month check for resilience
        const lastReset = user.lastResetDate ? new Date(user.lastResetDate) : new Date(user.createdAt);
        const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

        if (isNewMonth) {
            user.usage = 0;
            user.lastResetDate = now.toISOString();
            stateChanged = true;
        }

        if (user.usage >= user.credits && user.apiCredits > 0) {
            // API User Limit Check
            if (stateChanged) writeDB(users);
            return { allowed: false, error: "Credit limit reached for your plan." };
        }

        // For Web Pro/Ultra, webLimit is -1 (Unlimited), so we don't block based on usage count
        // We only check for file size limits which are handled in the Controller, not here.
        if (user.webLimit !== -1 && user.usage >= user.webLimit && user.webLimit > 0) {
            if (stateChanged) writeDB(users);
            return { allowed: false, error: "Daily web limit reached." };
        }
    }

    if (stateChanged) writeDB(users);

    return { allowed: true, user };
};

exports.incrementUsage = (apiKey) => {
    const users = readDB();
    const idx = users.findIndex(u => u.apiKey === apiKey);
    if (idx === -1) return;

    const user = users[idx];

    // We trust checkLimit has already handled resets/checks, 
    // but strictly we should re-check or just increment.
    // For simplicity, we just increment.

    user.usage = (user.usage || 0) + 1;

    if (user.plan === 'free' || user.plan === 'starter') {
        const today = new Date().toISOString().split('T')[0];
        if (user.lastUsedDate !== today) {
            user.dailyUsage = 0;
            user.lastUsedDate = today;
        }
        user.dailyUsage = (user.dailyUsage || 0) + 1;
    }

    writeDB(users);
};
