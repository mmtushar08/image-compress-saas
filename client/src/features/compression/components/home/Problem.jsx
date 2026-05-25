export default function Problem() {
    return (
        <section className="problem-section">
            <div className="section-container">
                <h2>What is image compression, and why does it matter?</h2>
                <div className="problem-content">
                    <p>
                        Image compression is the process of reducing an image file's size by encoding data
                        more efficiently. Images account for an average of 50–75% of a webpage's total weight.
                        Large unoptimized images slow page load times, hurt Core Web Vitals scores, and reduce
                        search rankings — page speed is a confirmed Google ranking factor.
                    </p>
                    <p>
                        Every second of extra load time reduces conversions by up to 7%. On mobile — where
                        most web traffic now originates — the impact is even larger.
                    </p>
                    <p>
                        Manually converting and compressing images takes time, breaks workflows, and doesn't scale.
                    </p>
                    <p className="highlight-text">
                        Shrinkix removes that friction — images are optimized automatically the moment they are uploaded.
                    </p>
                </div>
            </div>
        </section>
    );
}
