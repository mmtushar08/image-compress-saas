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
