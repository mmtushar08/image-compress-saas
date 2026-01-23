import { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const products = {
    web: [
        { id: 'pro', name: 'Web Pro', sub: 'COMPRESS', desc: 'Unlimited compression (75MB limit)', priceYearly: 39, priceMonthly: 5 },
        { id: 'ultra', name: 'Web Ultra', sub: 'COMPRESS & CONVERT', desc: 'Unlimited (150MB limit) + Conversion', priceYearly: 59, priceMonthly: 9 }
    ],
    api: [
        { id: 'api-business', name: 'API Pro', sub: '5,000 CREDITS/MO', desc: 'Priority support + fixed quota', priceYearly: 350, priceMonthly: 35 },
        { id: 'api-ultra', name: 'API Ultra', sub: '15,000 CREDITS/MO', desc: 'Dedicated support + high volume', priceYearly: 900, priceMonthly: 90 }
    ],
    credits: [
        { id: 'credit-1.5k', name: '1.5K Credits', sub: '1,500 CREDITS', desc: 'Never expires', price: 14, oneTime: true },
        { id: 'credit-3.5k', name: '3.5K Credits', sub: '3,500 CREDITS', desc: 'Best value', price: 28, oneTime: true },
        { id: 'credit-6.5k', name: '6.5K Credits', sub: '6,500 CREDITS', desc: 'Maximum volume', price: 56, oneTime: true }
    ]
};

export default function useCheckout() {
    const [searchParams] = useSearchParams();
    const { type: urlType } = useParams(); // Get type from URL slug
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    // Params - prioritize URL slug over query params
    const initialPlan = searchParams.get('tier') || searchParams.get('plan') || 'pro';
    let initialType = urlType || searchParams.get('type') || 'web'; // 'web', 'api', 'credits'
    if (initialType === 'credit') initialType = 'credits'; // Normalize singular to plural

    // State
    const [activeTab, setActiveTabState] = useState(initialType);

    // Wrapper to update URL when tab changes
    const setActiveTab = (newTab) => {
        setActiveTabState(newTab);
        /* verify if newTab is not same as current URL param */
        navigate(`/checkout/${newTab}`);
    };
    const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'
    const [selectedPlanId, setSelectedPlanId] = useState(initialPlan);
    const [quantity, setQuantity] = useState(1);
    const [showInvoice, setShowInvoice] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', country: 'United States' });
    const [invoiceData, setInvoiceData] = useState({ companyName: '', taxId: '', address: '', city: '', zip: '' });
    const [errors, setErrors] = useState({});

    // Status State
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Products Configuration


    // Helper to find plan
    const getPlan = (id) => {
        for (const cat in products) {
            const found = products[cat].find(p => p.id === id);
            if (found) return found;
        }
        return products.web[0];
    };

    const selectedPlan = getPlan(selectedPlanId);

    // Calculate Total
    const calculateTotal = () => {
        if (!selectedPlan) return 0;
        let basePrice = 0;

        if (selectedPlan.oneTime) {
            basePrice = selectedPlan.price * quantity;
        } else {
            basePrice = billingCycle === 'yearly' ? selectedPlan.priceYearly : selectedPlan.priceMonthly;
        }
        return basePrice;
    };

    // Auto-select first plan when tab changes if current plan is not in tab
    useEffect(() => {
        const currentCategoryRequest = activeTab;
        const planBelongsToCategory = products[currentCategoryRequest].find(p => p.id === selectedPlanId);

        if (!planBelongsToCategory) {
            setSelectedPlanId(products[currentCategoryRequest][0].id); // eslint-disable-line react-hooks/set-state-in-effect
        }
    }, [activeTab, selectedPlanId]);

    // Validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle Payment
    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!stripe || !elements) return;

        setLoading(true);

        // Mock API Call - Replace with real backend call
        // const { error, paymentMethod } = await stripe.createPaymentMethod({
        //     type: 'card',
        //     card: elements.getElement(CardElement),
        // });

        await new Promise(r => setTimeout(r, 1500)); // Simulate network request

        setLoading(false);
        setEmailSent(true);
    };

    return {
        state: {
            activeTab,
            billingCycle,
            selectedPlanId,
            selectedPlan,
            quantity,
            showInvoice,
            invoiceData,
            formData,
            errors,
            loading,
            emailSent,
            products
        },
        actions: {
            setActiveTab,
            setBillingCycle,
            setSelectedPlanId,
            setQuantity,
            setShowInvoice,
            setInvoiceData,
            setFormData,
            handleCheckout,
            calculateTotal
        }
    };
}
