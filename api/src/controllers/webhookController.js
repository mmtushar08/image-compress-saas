const userController = require('./userController');

// Initialize Stripe safely
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn("⚠️ STRIPE_SECRET_KEY missing. Webhooks disabled.");
}

exports.handleWebhook = async (req, res) => {
    let event = req.body;

    const signature = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Secure Verification (Requires Raw Body)
    if (webhookSecret && signature) {
        try {
            if (!req.rawBody) {
                console.error("❌ req.rawBody is missing! Ensure server.js preserves raw body for webhooks.");
                return res.status(400).send('Webhook Error: Raw body missing');
            }
            event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
        } catch (err) {
            console.error(`⚠️  Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    } else {
        // console.log('⚠️  Skipping signature verification (STRIPE_WEBHOOK_SECRET not set)');
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
