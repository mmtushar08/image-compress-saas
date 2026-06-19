export default function HeroSection({ children }) {
    return (
        <section className="hero">
            <div className="hero-inner">
                <div className="hero-left">
                    <h1 className="hero-title">
                        Smarter Compression<br />for Better Images
                    </h1>
                    <p className="hero-subtitle">
                        Reduce file sizes while keeping your images sharp and beautiful.
                    </p>
                    {children}
                </div>
            </div>
            {/* Wave transition matching mockup */}
            <div className="hero-wave" aria-hidden="true">
                <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path
                        d="M0,40 C240,90 480,0 720,45 C960,90 1200,10 1440,50 L1440,90 L0,90 Z"
                        fill="#f4f8ff"
                    />
                </svg>
            </div>
        </section>
    );
}
