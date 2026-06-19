import { useParams, Link, Navigate } from 'react-router-dom';
import { SEOHead, JsonLd } from '../../components/SEOHead';
import { getPost, POSTS } from './posts';

function articleSchema(post) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            '@type': 'Organization',
            name: 'Shrinkix',
            url: 'https://shrinkix.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Shrinkix',
            url: 'https://shrinkix.com',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://shrinkix.com/blog/${post.slug}`,
        },
    };
}

function faqSchema(post) {
    if (!post.faq?.length) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
        })),
    };
}

function renderBody(text) {
    return text.split('\n\n').map((para, i) => {
        if (para.startsWith('```')) {
            const lines = para.split('\n');
            const code = lines.slice(1, -1).join('\n');
            return <pre key={i} className="blog-code"><code>{code}</code></pre>;
        }
        const html = para
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.+?)`/g, '<code class="blog-inline-code">$1</code>');
        return <p key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
}

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPost(slug);

    if (!post) return <Navigate to="/blog" replace />;

    const relatedPosts = (post.relatedPosts || [])
        .map(s => POSTS.find(p => p.slug === s))
        .filter(Boolean);

    const faq = faqSchema(post);

    return (
        <main className="blog-post-page">
            <SEOHead
                rawTitle={`${post.title} | Shrinkix Blog`}
                description={post.description}
                canonical={`/blog/${post.slug}`}
            />
            <JsonLd schema={articleSchema(post)} />
            {faq && <JsonLd schema={faq} />}

            <article className="blog-article">
                {/* Breadcrumb */}
                <nav className="blog-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <span aria-hidden="true"> › </span>
                    <Link to="/blog">Blog</Link>
                    <span aria-hidden="true"> › </span>
                    <span>{post.title}</span>
                </nav>

                {/* Header */}
                <header className="blog-header">
                    <span className="blog-card-category">{post.category}</span>
                    <h1>{post.title}</h1>
                    <div className="blog-post-meta">
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span>·</span>
                        <span>{post.readTime}</span>
                    </div>
                    <p className="blog-lead">{post.description}</p>
                </header>

                {/* Body sections */}
                <div className="blog-body">
                    {post.sections.map((section, i) => (
                        <section key={i}>
                            <h2>{section.heading}</h2>
                            {renderBody(section.body)}
                        </section>
                    ))}
                </div>

                {/* FAQ */}
                {post.faq?.length > 0 && (
                    <section className="blog-faq">
                        <h2>Frequently asked questions</h2>
                        <div className="blog-faq-list">
                            {post.faq.map((item, i) => (
                                <div key={i} className="blog-faq-item">
                                    <h3>{item.q}</h3>
                                    <p>{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Tools CTA */}
                {post.relatedTools?.length > 0 && (
                    <section className="blog-cta-tools">
                        <h2>Try these free tools</h2>
                        <div className="blog-tool-links">
                            {post.relatedTools.map(tool => (
                                <Link key={tool.href} to={tool.href} className="blog-tool-btn">
                                    {tool.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <aside className="blog-related">
                    <div className="section-container">
                        <h2>Related articles</h2>
                        <div className="blog-grid blog-grid--small">
                            {relatedPosts.map(p => (
                                <Link key={p.slug} to={`/blog/${p.slug}`} className="blog-card">
                                    <span className="blog-card-category">{p.category}</span>
                                    <h3 className="blog-card-title">{p.title}</h3>
                                    <p className="blog-card-excerpt">{p.description}</p>
                                    <span className="blog-card-read">{p.readTime}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            )}
        </main>
    );
}
