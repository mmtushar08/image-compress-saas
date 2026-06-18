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
        </section>
    );
}
