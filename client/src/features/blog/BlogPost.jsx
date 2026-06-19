import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEOHead, JsonLd } from '../../components/SEOHead';
import { getPost, POSTS } from './posts';

const SITE_URL = 'https://shrinkix.com';

/* ── Utilities ───────────────────────────────────────────────── */

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseInline(raw) {
    return raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>');
}

/* ── Schema builders ─────────────────────────────────────────── */

function buildArticleSchema(post) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.lastReviewed || post.date,
        wordCount: post.wordCount,
        keywords: post.tags?.join(', '),
        articleSection: post.category,
        author: {
            '@type': 'Organization',
            name: 'Shrinkix',
            url: SITE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Shrinkix',
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${post.slug}`,
        },
    };
}

function buildFaqSchema(post) {
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

function buildBreadcrumbSchema(post) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
    };
}

/* ── Markdown block renderer ─────────────────────────────────── */

function CodeBlock({ code, lang, blockIdx }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [code]);

    return (
        <div className="blog-code-wrap">
            <div className="blog-code-header">
                {lang && <span className="blog-code-lang">{lang}</span>}
                <button className={`blog-code-copy ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                    {copied ? '✓ Copied' : 'Copy'}
                </button>
            </div>
            <pre className="blog-code"><code>{code}</code></pre>
        </div>
    );
}

function renderBlock(block, i) {
    // Code block
    if (block.startsWith('```')) {
        const lines = block.split('\n');
        const lang = lines[0].slice(3).trim();
        const end = lines[lines.length - 1].trim() === '```' ? lines.length - 1 : lines.length;
        const code = lines.slice(1, end).join('\n');
        return <CodeBlock key={i} code={code} lang={lang} blockIdx={i} />;
    }

    // Table
    const lines = block.split('\n').filter(l => l.trim());
    if (lines.length >= 3 && lines[0].startsWith('|')) {
        const headers = lines[0].split('|').slice(1, -1).map(c => c.trim());
        const rows = lines
            .slice(2)
            .filter(l => l.startsWith('|') && !l.match(/^[\s|:-]+$/))
            .map(l => l.split('|').slice(1, -1).map(c => c.trim()));
        return (
            <div key={i} className="blog-table-wrap">
                <table className="blog-table">
                    <thead>
                        <tr>{headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.map((row, j) => (
                            <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Regular paragraph
    return <p key={i} dangerouslySetInnerHTML={{ __html: parseInline(block) }} />;
}

function renderBody(text) {
    return text.split('\n\n').map((block, i) => renderBlock(block.trim(), i));
}

/* ── Sub-components ──────────────────────────────────────────── */

function TableOfContents({ sections }) {
    const items = sections.map(s => ({ id: slugify(s.heading), label: s.heading }));
    return (
        <nav className="blog-toc" aria-label="Table of contents">
            <h4 className="blog-toc-title">Contents</h4>
            <ol className="blog-toc-list">
                {items.map(item => (
                    <li key={item.id}>
                        <a href={`#${item.id}`}>{item.label}</a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function AuthorBox() {
    return (
        <div className="blog-author-box">
            <div className="blog-author-avatar" aria-hidden="true">S</div>
            <div className="blog-author-info">
                <p className="blog-author-name">Shrinkix Team</p>
                <p className="blog-author-bio">
                    We build and maintain Shrinkix — a Sharp/MozJPEG-powered compression engine.
                    These guides are based on real benchmarks run against our production pipeline.
                </p>
            </div>
        </div>
    );
}

function SocialShare({ url, title }) {
    const [copied, setCopied] = useState(false);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="blog-social-share">
            <span className="blog-social-label">Share this article</span>
            <div className="blog-social-btns">
                <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-social-btn blog-social-btn--twitter"
                    aria-label="Share on X (Twitter)"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                </a>
                <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-social-btn blog-social-btn--linkedin"
                    aria-label="Share on LinkedIn"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </a>
                <button
                    className={`blog-social-btn blog-social-btn--copy ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    aria-label="Copy link"
                >
                    {copied ? '✓ Copied!' : '🔗 Copy link'}
                </button>
            </div>
        </div>
    );
}

function PostNav({ prev, next }) {
    if (!prev && !next) return null;
    return (
        <nav className="blog-post-nav" aria-label="Post navigation">
            <div className="blog-post-nav-inner">
                {prev ? (
                    <Link to={`/blog/${prev.slug}`} className="blog-nav-link blog-nav-link--prev">
                        <span className="blog-nav-dir">← Previous</span>
                        <span className="blog-nav-title">{prev.title}</span>
                    </Link>
                ) : <div />}
                {next ? (
                    <Link to={`/blog/${next.slug}`} className="blog-nav-link blog-nav-link--next">
                        <span className="blog-nav-dir">Next →</span>
                        <span className="blog-nav-title">{next.title}</span>
                    </Link>
                ) : <div />}
            </div>
        </nav>
    );
}

/* ── Main component ──────────────────────────────────────────── */

export default function BlogPost() {
    const { slug } = useParams();
    const post = getPost(slug);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? Math.min((el.scrollTop / total) * 100, 100) : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!post) return <Navigate to="/blog" replace />;

    const postIndex = POSTS.findIndex(p => p.slug === slug);
    const prevPost = postIndex > 0 ? POSTS[postIndex - 1] : null;
    const nextPost = postIndex < POSTS.length - 1 ? POSTS[postIndex + 1] : null;

    const relatedPosts = (post.relatedPosts || [])
        .map(s => POSTS.find(p => p.slug === s))
        .filter(Boolean);

    const postUrl = `${SITE_URL}/blog/${post.slug}`;

    // Insert inline CTA after the section where cumulative words first cross 50% of total
    const sectionWordCounts = post.sections.map(s => s.body.split(/\s+/).length);
    const totalWords = sectionWordCounts.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const midSectionIndex = sectionWordCounts.findIndex(count => {
        cumulative += count;
        return cumulative >= totalWords * 0.5;
    });
    const faqSchema = buildFaqSchema(post);

    const dateStr = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
    const reviewedStr = post.lastReviewed
        ? new Date(post.lastReviewed).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : null;

    return (
        <main className="blog-post-page">
            <SEOHead
                rawTitle={`${post.title} | Shrinkix Blog`}
                description={post.description}
                canonical={`/blog/${post.slug}`}
                ogType="article"
            />
            {/* Article-specific Open Graph tags */}
            <Helmet>
                <meta property="article:published_time" content={post.date} />
                <meta property="article:modified_time" content={post.lastReviewed || post.date} />
                <meta property="article:author" content="Shrinkix Team" />
                <meta property="article:section" content={post.category} />
                {post.tags?.map(tag => (
                    <meta key={tag} property="article:tag" content={tag} />
                ))}
            </Helmet>
            <JsonLd schema={buildArticleSchema(post)} />
            {faqSchema && <JsonLd schema={faqSchema} />}
            <JsonLd schema={buildBreadcrumbSchema(post)} />

            {/* Reading progress bar */}
            <div
                className="reading-progress-bar"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Reading progress"
            />

            {/* Layout: article + sticky TOC sidebar */}
            <div className="blog-post-layout">

                {/* Main Article */}
                <article className="blog-article" itemScope itemType="https://schema.org/Article">

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
                        <div className="blog-header-meta-top">
                            <span className="blog-card-category">{post.category}</span>
                        </div>
                        <h1 itemProp="headline">{post.title}</h1>
                        <div className="blog-post-meta">
                            <time dateTime={post.date} itemProp="datePublished">{dateStr}</time>
                            <span className="blog-meta-sep">·</span>
                            <span>{post.readTime}</span>
                            {post.wordCount && (
                                <>
                                    <span className="blog-meta-sep">·</span>
                                    <span>{post.wordCount.toLocaleString()} words</span>
                                </>
                            )}
                            {reviewedStr && (
                                <>
                                    <span className="blog-meta-sep">·</span>
                                    <span>Updated <time dateTime={post.lastReviewed} itemProp="dateModified">{reviewedStr}</time></span>
                                </>
                            )}
                        </div>
                        <p className="blog-lead" itemProp="description">{post.description}</p>
                        {post.tags?.length > 0 && (
                            <div className="blog-header-tags">
                                {post.tags.map(tag => (
                                    <span key={tag} className="blog-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Inline TOC (mobile + always visible) */}
                    <TableOfContents sections={post.sections} />

                    {/* Article Body */}
                    <div className="blog-body" itemProp="articleBody">
                        {post.sections.map((section, i) => (
                            <section key={i}>
                                <h2 id={slugify(section.heading)}>{section.heading}</h2>
                                {renderBody(section.body)}
                                {/* Mid-article CTA — inserted after the section that crosses 50% word count */}
                                {i === midSectionIndex && (
                                    <aside className="blog-inline-cta">
                                        <strong>Free tool:</strong> Compress your images directly in the browser — no sign-up, instant results.{' '}
                                        <Link to="/">Try Shrinkix →</Link>
                                    </aside>
                                )}
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

                    {/* Author box */}
                    <AuthorBox />

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="blog-post-tags">
                            <span className="blog-post-tags-label">Tagged:</span>
                            {post.tags.map(tag => (
                                <span key={tag} className="blog-tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Social share */}
                    <SocialShare url={postUrl} title={post.title} />

                    {/* Related Tools */}
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

                    {/* Prev / Next navigation */}
                    <PostNav prev={prevPost} next={nextPost} />
                </article>

                {/* Sticky TOC sidebar (desktop only) */}
                <aside className="blog-toc-sidebar" aria-label="Table of contents">
                    <div className="blog-toc-sticky">
                        <TableOfContents sections={post.sections} />
                        <div className="blog-toc-progress">
                            <div className="blog-toc-progress-bar" style={{ height: `${progress}%` }} />
                        </div>
                    </div>
                </aside>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="blog-related">
                    <div className="section-container">
                        <h2>Related articles</h2>
                        <div className="blog-grid blog-grid--small">
                            {relatedPosts.map(p => (
                                <Link key={p.slug} to={`/blog/${p.slug}`} className="blog-card">
                                    <span className="blog-card-category">{p.category}</span>
                                    <h3 className="blog-card-title">{p.title}</h3>
                                    <p className="blog-card-excerpt">{p.description}</p>
                                    <div className="blog-card-meta">
                                        <time dateTime={p.date}>
                                            {new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </time>
                                        <span className="blog-card-dot">·</span>
                                        <span>{p.readTime}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
