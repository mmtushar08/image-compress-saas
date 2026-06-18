const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit   = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const path        = require('path');
const authMiddleware = require('./middleware/auth');
const compressRoutes = require('./routes/compress');
const logger      = require('./utils/logger');

const app = express();

app.set('trust proxy', 1);

app.use((req, res, next) => {
    req.id = `req_${uuidv4().substring(0, 8)}`;
    res.setHeader('X-Request-ID', req.id);
    next();
});

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            return res.redirect(301, `https://${req.header('host')}${req.url}`);
        }
        next();
    });
}

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc:  ["'self'"],
            styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
            scriptSrc:   ["'self'"],
            imgSrc:      ["'self'", 'blob:'],
            connectSrc:  ["'self'"],
            frameSrc:    ["'self'", 'https://js.stripe.com'],
            objectSrc:   ["'none'"],
            baseUri:     ["'self'"],
            formAction:  ["'self'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    crossOriginEmbedderPolicy: false,
}));

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    exposedHeaders: [
        'X-Original-Size', 'X-Compressed-Size', 'X-Saved-Percent',
        'X-Compression-Ratio', 'X-Output-Format', 'X-Compression-Count',
    ],
}));

app.use(express.json({
    limit: '200mb',
    verify: (req, res, buf) => {
        if (req.originalUrl.includes('/webhook')) req.rawBody = buf;
    },
}));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(cookieParser());

const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { success: false, error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', generalLimiter);

app.use(authMiddleware);

app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'shrinkix-api', uptime: process.uptime() });
});

app.get('/api/check-limit', async (req, res) => {
    const { PLANS } = require('./controllers/userController');

    if (req.user) {
        const planConfig = PLANS[req.user.plan] || PLANS.free;
        const remaining  = req.user.plan === 'free' || req.user.plan === 'starter'
            ? 10 - (req.user.dailyUsage || 0)
            : planConfig.credits - (req.user.usage || 0);
        return res.json({
            remaining:   Math.max(0, remaining),
            plan:        req.user.plan,
            total:       req.user.plan === 'free' || req.user.plan === 'starter' ? 10 : planConfig.credits,
            usage:       req.user.plan === 'free' || req.user.plan === 'starter' ? (req.user.dailyUsage || 0) : (req.user.usage || 0),
            maxFileSize: planConfig.maxFileSize,
        });
    }

    const { checkGuestLimit } = require('./controllers/userController');
    const guestStats = checkGuestLimit(req.ip);
    res.json({
        remaining:   guestStats.remaining,
        plan:        'guest',
        total:       guestStats.limit,
        usage:       guestStats.usage,
        maxFileSize: PLANS.free.maxFileSize,
    });
});

app.use(express.static(path.join(__dirname, '../../client/dist')));

const userRoutes    = require('./routes/users');
const v1Routes      = require('./routes/v1/index');
const paymentRoutes = require('./routes/payments');
const adminRoutes   = require('./routes/admin');

app.use('/api/users',    userRoutes);
app.use('/api/v1',       v1Routes);
app.use('/api/compress', compressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin',    adminRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (err.code === 'LIMIT_FILE_SIZE')      return res.status(413).json({ success: false, error: 'File too large' });
    if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ success: false, error: 'Too many files' });
    if (err.code === 'INVALID_FILE_TYPE')    return res.status(400).json({ success: false, error: 'Invalid file type' });

    logger.error('Unhandled error', { message: err.message, ...(isDevelopment && { stack: err.stack }) });

    if (res.headersSent) return next(err);

    res.status(err.status || 500).json({
        success: false,
        error:   isDevelopment ? (err.message || 'Internal Server Error') : 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack }),
    });
});

module.exports = app;
