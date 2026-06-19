import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead, JsonLd } from '../../components/SEOHead';
import { POSTS } from './posts';

const SITE_URL = 'https://shrinkix.com';

const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Shrinkix Blog',
    description: 'Practical guides on image compression, web performance, and modern image formats.',
    url: `${SITE_URL}/blog`,
    publisher: {
        '@type': 'Organization',
        name: 'Shrinkix',
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    blogPost: POSTS.map(p => ({
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.description,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.date,
        keywords: p.tags?.join(', '),
    })),
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
    ],
};

const ALL_CATEGORIES = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];

function PostCard({ post, featured = false }) {
    const dateStr = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    return (
        <Link
            to={`/blog/${post.slug}`}
            className={`blog-card ${featured ? 'blog-card--featured' : ''}`}
            aria-label={`Read: ${post.title}`}
        >
            <div className="blog-card-top">
                <span className="blog-card-category">{post.category}</span>
                {featured && <span className="blog-card-badge">Latest</span>}
            </div>
            <h2 className="blog-card-title">{post.title}</h2>
            <p className="blog-card-excerpt">{post.description}</p>
            {post.tags?.length > 0 && (
                <div className="blog-card-tags">
                    {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                </div>
            )}
            <div className="blog-card-meta">
                <time dateTime={post.date}>{dateStr}</time>
                <span className="blog-card-dot">·</span>
                <span>{post.readTime}</span>
            </div>
            <span className="blog-card-read-link">Read article →</span>
        </Link>
    );
}

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('All');

    const sorted = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
    const featured = sorted[0];
    const filtered = activeCategory === 'All'
        ? sorted
        : sorted.filter(p => p.category === activeCategory);

    return (
        <main className="blog-page">
            <SEOHead
                rawTitle="Blog — Image Compression Guides & Tips | Shrinkix"
                description="Practical guides on image compression, WebP vs JPEG, AVIF, and web performance. Written by the Shrinkix team."
                canonical="/blog"
            />
            <JsonLd schema={blogListSchema} />
            <JsonLd schema={breadcrumbSchema} />

            {/* Hero */}
            <section className="blog-hero">
                <div className="section-container">
                    <nav className="blog-breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span aria-hidden="true"> › </span>
                        <span>Blog</span>
                    </nav>
                    <h1>The Shrinkix Blog</h1>
                    <p>Practical guides on image compression, formats, and web performance.</p>
                    <p className="blog-hero-count">{POSTS.length} articles published</p>
                </div>
            </section>

            {/* Featured Post */}
            <section className="blog-featured-section">
                <div className="section-container">
                    <h2 className="blog-section-label">Featured</h2>
                    <PostCard post={featured} featured />
                </div>
            </section>

            {/* Category Filter + Grid */}
            <section className="blog-list-section">
                <div className="section-container">
                    <div className="blog-filter-bar">
                        {ALL_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`blog-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={activeCategory === cat}
                            >
                                {cat}
                                <span className="blog-filter-count">
                                    {cat === 'All' ? POSTS.length : POSTS.filter(p => p.category === cat).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="blog-grid">
                        {filtered.map(post => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="blog-newsletter-section">
                <div className="section-container">
                    <div className="blog-newsletter-inner">
                        <h2>Get new guides in your inbox</h2>
                        <p>We publish deep-dives on image formats, web performance, and compression techniques. No spam, unsubscribe any time.</p>
                        <div className="blog-newsletter-form">
                            <input
                                type="email"
                                placeholder="you@company.com"
                                className="blog-newsletter-input"
                                aria-label="Email address"
                            />
                            <Link to="/login" className="btn btn-primary">Subscribe</Link>
                        </div>
                        <p className="blog-newsletter-note">Or <Link to="/login">create a free account</Link> to get updates and 20 free compressions per month.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
