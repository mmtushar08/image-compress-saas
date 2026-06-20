const FAQS = [
    {
        q: 'Do I need to install an SDK?',
        a: 'No. The Shrinkix API is a standard HTTP multipart endpoint. Any HTTP client works — axios (Node.js), requests (Python), cURL (PHP / shell), net/http (Go), or java.net.http (Java).',
    },
    {
        q: 'Is there a free tier?',
        a: '500 compressions per month are free — no credit card required. The free plan supports files up to 5 MB in JPEG, PNG, and WebP format.',
    },
    {
        q: 'Can I use one API key across multiple projects?',
        a: 'Yes, but we recommend creating separate keys from the API Dashboard for each project. That way you can track usage per project and rotate keys independently.',
    },
    {
        q: 'Are my images stored on your servers?',
        a: 'No. Images are processed in memory and immediately discarded. Nothing is written to permanent storage. Shrinkix is GDPR and CCPA compliant.',
    },
    {
        q: 'What formats can I compress and convert?',
        a: 'JPEG, PNG, WebP, and AVIF are all supported as both input and output. AVIF output requires an API Pro plan or higher.',
    },
    {
        q: 'What happens when I hit my monthly limit?',
        a: 'The API returns a 429 status with error code QUOTA_EXCEEDED. You can upgrade your plan from the dashboard at any time, or add-on credits are available without changing your base plan.',
    },
];

export default function DeveloperFAQ() {
    return (
        <section className="dev-section">
            <div className="dev-section-inner">
                <span className="dev-section-label">FAQ</span>
                <h2 className="dev-section-title">Common questions</h2>
                <div className="dev-faq-list">
                    {FAQS.map((item, i) => (
                        <div className="dev-faq-item" key={i}>
                            <h3>{item.q}</h3>
                            <p>{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
