/**
 * Hero Section Component
 * Displays the main title and description
 */
import heroBg from '../../../../assets/hero-bg.png';

export default function HeroSection({ children }) {
    return (
        <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="container">
                {children}
            </div>
        </section>
    );
}
