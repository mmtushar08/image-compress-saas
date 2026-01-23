// Initialize Stripe lazily or handle dummy key to avoid crash
let stripe;
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_dummy')) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}
const { PLANS } = require('./userController');

exports.createPaymentIntent = async (req, res) => {
    try {
        const { plan, billingCycle, quantity, email, productType, package: creditPackage } = req.body;

        // Handle credit purchases
        if (productType === 'credit') {
            const CREDIT_PACKAGES = {
                'small-boost': { credits: 1000, price: 8 },
                'growth-boost': { credits: 5000, price: 35 },
                'scale-boost': { credits: 10000, price: 85 }
            };

            const pkg = CREDIT_PACKAGES[creditPackage];
            if (!pkg) {
                return res.status(400).json({ error: 'Invalid credit package' });
            }

            const totalAmount = pkg.price * 100; // Convert to cents
            const userEmail = email || (req.user && req.user.email);
            const userId = req.user ? req.user.id : 'guest';

            if (!userEmail) {
                return res.status(400).json({ error: 'Email is required' });
            }

            // DUMMY PAYMENT MODE FOR LOCAL TESTING
            if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_dummy')) {
                console.log("⚠️ Using Dummy Payment Mode for Credits");
                return res.json({
                    clientSecret: 'mock_secret_for_testing_credits'
                });
            }

            // Create PaymentIntent for credits
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: 'usd',
                metadata: {
                    productType: 'credit',
                    package: creditPackage,
                    credits: pkg.credits,
                    userEmail,
                    userId
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return res.json({
                clientSecret: paymentIntent.client_secret
            });
        }

        // Verify Inputs for subscription plans
        let selectedPlan = plan;
        if (plan === 'ultra') selectedPlan = 'web-ultra';
        else if (plan === 'pro') selectedPlan = 'web-pro';
        else if (plan === 'api-pro' || plan === 'api-ultra') selectedPlan = plan;

        if (!selectedPlan || !PLANS[selectedPlan]) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }

        const planDetails = PLANS[selectedPlan];

        // Calculate Amount (in cents)
        let unitPrice = 0;
        if (selectedPlan === 'web-pro') {
            unitPrice = billingCycle === 'yearly' ? 3900 : 500; // $39.00 or $5.00
        } else if (selectedPlan === 'web-ultra') {
            unitPrice = billingCycle === 'yearly' ? 5900 : 900; // $59.00 or $9.00
        } else if (selectedPlan === 'api-pro') {
            unitPrice = billingCycle === 'yearly' ? 19000 : 1900; // $190 or $19
        } else if (selectedPlan === 'api-ultra') {
            unitPrice = billingCycle === 'yearly' ? 49000 : 4900; // $490 or $49
        }

        const totalAmount = unitPrice * (quantity || 1);

        if (totalAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const userEmail = email || (req.user && req.user.email);
        const userId = req.user ? req.user.id : 'guest';

        if (!userEmail) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // DUMMY PAYMENT MODE FOR LOCAL TESTING
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_dummy')) {
            console.log("⚠️ Using Dummy Payment Mode");
            return res.json({
                clientSecret: 'mock_secret_for_testing'
            });
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            metadata: {
                plan: selectedPlan,
                billingCycle,
                quantity: quantity || 1,
                userEmail,
                userId
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
