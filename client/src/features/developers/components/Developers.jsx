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
                title="Image Compression API for Developers"
                description="Automate image optimization with the Shrinkix REST API. Compress PNG, JPEG, WebP, and AVIF at scale. SDKs for Node.js, Python, PHP, Ruby, Go, and more. Free plan available."
                canonical="/developers"
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
