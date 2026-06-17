import { SEOHead, JsonLd } from '../../../components/SEOHead';
import { faqDevelopersSchema, breadcrumbSchema } from '../../../seo/schemas';
import DeveloperHero from './developers/DeveloperHero';
import ApiSignupForm from './developers/ApiSignupForm';
import StatsCounter from './developers/StatsCounter';
import CodeExamples from './developers/CodeExamples';
import DeveloperFAQ from './developers/DeveloperFAQ';
import DeveloperCta from './developers/DeveloperCta';
import '../../../styles/Developers.css';

const Developers = () => {
    return (
        <div className="developers-page">
            <SEOHead
                rawTitle="Image Compression API for Developers — Shrinkix"
                description="Automate image optimization with the Shrinkix REST API. SDKs for Node.js, Python, PHP, Ruby, Go. Free plan. No credit card."
                canonical="/developers"
                ogImage="https://shrinkix.com/og/api.png"
            />
            <JsonLd schema={faqDevelopersSchema} />
            <JsonLd schema={breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Developers', path: '/developers' }
            ])} />
            {/* Hero Section with Signup and Stats */}
            <div className="dev-container" style={{ position: 'relative', zIndex: 2 }}>
                <DeveloperHero />
                <ApiSignupForm />
                <StatsCounter />
            </div>

            <CodeExamples />
            <DeveloperFAQ />
            <DeveloperCta />
        </div>
    );
};

export default Developers;
