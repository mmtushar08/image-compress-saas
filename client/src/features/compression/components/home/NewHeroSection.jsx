export default function NewHeroSection({ children }) {
    return (
        <section className="new-hero">
            <div className="new-hero-content">
                <h1>Convert and compress images automatically</h1>
                <p className="sub-headline">
                    Shrinkix optimizes your images the moment they are uploaded - smaller files, faster websites, and no manual work.
                </p>
                <p className="supporting-line">
                    Built for developers, designers, and teams who care about performance, privacy, and speed.
                </p>

                <div className="hero-cta-group">
                    <a href="#upload" className="btn btn-primary">Upload images</a>
                    <a href="/api-docs" className="btn btn-secondary">Use the API</a>
                </div>
            </div>

            <div className="hero-upload-area">
                {children}
            </div>
        </section>
    );
}

