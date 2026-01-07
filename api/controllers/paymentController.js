const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PLANS } = require('./userController');

exports.createPaymentIntent = async (req, res) => {
    try {
        const { plan, billingCycle, quantity } = req.body;

        // Verify Inputs
        const selectedPlan = plan === 'ultra' ? 'web-ultra' : (plan === 'pro' ? 'web-pro' : null);

        if (!selectedPlan || !PLANS[selectedPlan]) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }

        const planDetails = PLANS[selectedPlan];

        // Calculate Amount (in cents)
        // Price is stored as simple number (9 or 39, etc) in User Controller logic, 
        // we need to replicate that logic here or import it carefully.
        // For simplicity/robustness, we re-declare base prices matching Checkout.jsx/Pricing.jsx

        let unitPrice = 0;
        if (selectedPlan === 'web-pro') {
            unitPrice = billingCycle === 'yearly' ? 3900 : 500; // $39.00 or $5.00
        } else if (selectedPlan === 'web-ultra') {
            unitPrice = billingCycle === 'yearly' ? 5900 : 900; // $59.00 or $9.00
        }

        const totalAmount = unitPrice * (quantity || 1);

        if (totalAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            metadata: {
                plan: selectedPlan,
                billingCycle,
                quantity: quantity || 1
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
};
