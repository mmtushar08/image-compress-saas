import { Link } from 'react-router-dom';
import { SEOHead, JsonLd } from '../../components/SEOHead';
import { POSTS } from './posts';

const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Shrinkix Blog',
    description: 'Guides and tips on image compression, web performance, and modern image formats.',
    url: 'https://shrinkix.com/blog',
    publisher: {
        '@type': 'Organization',
        name: 'Shrinkix',
        url: 'https://shrinkix.com',
    },
};

export default function Blog() {
    const sorted = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <main className="blog-page">
            <SEOHead
                rawTitle="Blog — Image Compression Guides & Tips | Shrinkix"
                description="Practical guides on image compression, WebP vs JPEG, AVIF, and web performance. Written by the team behind Shrinkix."
                canonical="/blog"
            />
            <JsonLd schema={blogListSchema} />

            <section className="blog-hero">
                <div className="section-container">
                    <h1>The Shrinkix Blog</h1>
                    <p>Practical guides on image compression, formats, and web performance.</p>
                </div>
            </section>

            <section className="blog-list-section">
                <div className="section-container">
                    <div className="blog-grid">
                        {sorted.map(post => (
                            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                                <span className="blog-card-category">{post.category}</span>
                                <h2 className="blog-card-title">{post.title}</h2>
                                <p className="blog-card-excerpt">{post.description}</p>
                                <div className="blog-card-meta">
                                    <time dateTime={post.date}>
                                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </time>
                                    <span className="blog-card-read">{post.readTime}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
