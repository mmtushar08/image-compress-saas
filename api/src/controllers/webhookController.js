const userController = require('./userController');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

exports.handleWebhook = async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = req.headers['stripe-signature'];

    if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
        return res.status(503).json({
            success: false,
            error: 'Webhook is not configured on this server'
        });
    }

    if (!signature) {
        return res.status(400).json({
            success: false,
            error: 'Missing Stripe signature header'
        });
    }

    if (!req.rawBody) {
        console.error("❌ req.rawBody is missing! Ensure server.js preserves raw body for webhooks.");
        return res.status(400).send('Webhook Error: Raw body missing');
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle Events
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`💰 Payment succeeded: ${paymentIntent.id}`);

            const { userEmail, plan } = paymentIntent.metadata;

            if (userEmail && plan) {
                const updatedUser = userController.upgradeUserPlan(userEmail, plan, paymentIntent.id);
                if (updatedUser) {
                    console.log(`✅ User ${userEmail} upgraded to ${plan}`);
                } else {
                    console.error(`❌ Failed to upgrade user ${userEmail} - User not found or plan invalid.`);
                }
            } else {
                console.warn(`⚠️  Payment Intent missing metadata: email=${userEmail}, plan=${plan}`);
            }
            break;

        default:
        // console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};
