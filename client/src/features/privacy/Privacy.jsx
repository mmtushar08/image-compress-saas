import { SEOHead } from '../../components/SEOHead';

export default function Privacy() {
    return (
        <>
            <SEOHead
                title="Privacy Policy"
                description="Shrinkix privacy policy. Learn how we handle your images and data — files are deleted immediately after processing. GDPR and CCPA compliant."
                canonical="/privacy"
            />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', lineHeight: 1.8 }}>
                <h1>Privacy Policy</h1>
                <p style={{ color: '#666' }}>Last updated: May 25, 2026</p>

                <p>
                    Shrinkix is built with privacy as a core principle. This policy explains what data
                    we collect, how we use it, and the rights you have over your information.
                </p>

                <h2>1. Images you upload</h2>
                <p>
                    Images uploaded to Shrinkix are used solely for the purpose of compression and
                    conversion. We process your images using automated systems and delete them from our
                    servers immediately after the compressed file is delivered to you. We do not store,
                    index, view, reuse, sell, or share your image content with any third party.
                </p>

                <h2>2. Account information</h2>
                <p>
                    If you create an account, we collect your email address to:
                </p>
                <ul>
                    <li>Send your magic-link login email</li>
                    <li>Manage your subscription and billing</li>
                    <li>Communicate service updates and support responses</li>
                </ul>
                <p>We do not sell your email address or share it with third parties for marketing purposes.</p>

                <h2>3. Usage data</h2>
                <p>
                    We collect anonymized usage statistics (number of compressions, file sizes, formats)
                    to improve the service. This data cannot be used to identify you or your images.
                </p>

                <h2>4. Cookies</h2>
                <p>
                    We use a single session cookie to keep you logged in. We do not use advertising
                    cookies or third-party tracking cookies.
                </p>

                <h2>5. Payment data</h2>
                <p>
                    Payments are processed by Stripe. Shrinkix never stores your credit card number.
                    Stripe's privacy policy governs the handling of payment information.
                </p>

                <h2>6. GDPR & CCPA</h2>
                <p>
                    Shrinkix is compliant with the General Data Protection Regulation (GDPR) and the
                    California Consumer Privacy Act (CCPA). You have the right to:
                </p>
                <ul>
                    <li>Access the personal data we hold about you</li>
                    <li>Request deletion of your account and associated data</li>
                    <li>Request a copy of your data in a portable format</li>
                    <li>Opt out of any communications</li>
                </ul>
                <p>
                    To exercise these rights, email <a href="mailto:support@shrinkix.com">support@shrinkix.com</a>.
                </p>

                <h2>7. Data retention</h2>
                <p>
                    Images: deleted immediately after processing.<br />
                    Account data: retained while your account is active, deleted within 30 days of account deletion request.<br />
                    Anonymized usage statistics: retained indefinitely.
                </p>

                <h2>8. Security</h2>
                <p>
                    All data in transit is encrypted via TLS/SSL. API keys are stored as hashed values.
                    We follow industry-standard security practices and conduct regular security reviews.
                </p>

                <h2>9. Contact</h2>
                <p>
                    For privacy questions or data requests, contact us at{' '}
                    <a href="mailto:support@shrinkix.com">support@shrinkix.com</a>.
                </p>
            </main>
        </>
    );
}
