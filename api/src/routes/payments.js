const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const { createPaymentIntent } = require('../controllers/paymentController');

// CSRF Protection
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

// Route to initialize payment (with CSRF protection)
router.post('/create-payment-intent', csrfProtection, createPaymentIntent);

const { handleWebhook } = require('../controllers/webhookController');
// Listen to Stripe Webhooks (no CSRF - Stripe signs requests)
router.post('/webhook', handleWebhook);

module.exports = router;
