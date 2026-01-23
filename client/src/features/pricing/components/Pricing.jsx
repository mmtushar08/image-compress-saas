import { useNavigate } from 'react-router-dom';
import PricingHero from './pricing/PricingHero';
import PricingCard from './pricing/PricingCard';
import FaasLink from './pricing/FaasLink';
import '../../../styles/checkout.css';

export default function Pricing() {
    const navigate = useNavigate();

    const plans = [
        {
            title: 'Free',
            price: 0,
            features: [
                { text: 'Up to 5 MB per file', included: true },
                { text: 'Max 20 images per day', included: true },
                { text: 'Web Interface Only', included: true },
                { text: 'No Priority Support', included: false }
            ],
            buttonText: 'Current Plan',
            isCurrent: true
        },
        {
            title: 'Web Pro',
            price: 39,
            period: 'year',
            monthlyPrice: 5,
            features: [
                { text: '<strong>Unlimited</strong> images', included: true },
                { text: '<strong>75 MB</strong> file size limit', included: true },
                { text: 'Web Interface Only', included: true },
                { text: 'Priority Support', included: true }
            ],
            buttonText: 'Upgrade to Pro',
            buttonAction: () => navigate('/checkout?tier=pro'),
            isPrimary: true,
            isFeatured: true,
            accentColor: '#3c78d8'
        },
        {
            title: 'Web Ultra',
            price: 59,
            period: 'year',
            monthlyPrice: 9,
            features: [
                { text: '<strong>Unlimited</strong> images', included: true },
                { text: '<strong>150 MB</strong> file size limit', included: true },
                { text: 'Web Interface Only', included: true },
                { text: 'Highest Priority', included: true }
            ],
            buttonText: 'Upgrade to Ultra',
            buttonAction: () => navigate('/checkout?tier=ultra'),
            isPrimary: true,
            accentColor: '#8bc34a'
        }
    ];

    return (
        <section className="pricing-section">
            <PricingHero />

            <div className="pricing-cards" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {plans.map((plan, idx) => (
                    <PricingCard key={idx} {...plan} />
                ))}
            </div>

            <FaasLink />
        </section>
    );
}
