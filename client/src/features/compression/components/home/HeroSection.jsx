export default function HeroSection({ children }) {
    return (
        <section
            className="hero"
            style={{
                backgroundImage: `linear-gradient(135deg, rgba(10,22,40,0.72) 0%, rgba(26,16,53,0.65) 100%), url('/hero-bg.png')`
            }}
        >
            <div className="container">
                {children}
            </div>
        </section>
    );
}
