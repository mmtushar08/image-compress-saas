import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://shrinkix.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function SEOHead({ title, description, canonical, ogImage, ogType = 'website' }) {
    const fullTitle = title
        ? `${title} | Shrinkix`
        : 'Compress & Convert Images Free — Shrinkix';
    const metaDesc = description || 'Instantly compress PNG, JPG, WebP, and AVIF images online. Free, fast, and private — files deleted after processing. No account required.';
    const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
    const image = ogImage || DEFAULT_OG_IMAGE;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDesc} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDesc} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Shrinkix" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDesc} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}

export function JsonLd({ schema }) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
}
