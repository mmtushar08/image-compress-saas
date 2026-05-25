const SITE_URL = 'https://shrinkix.com';

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shrinkix",
    "url": SITE_URL,
    "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
        "width": 200,
        "height": 60
    },
    "description": "Shrinkix is an image compression and conversion tool for developers, designers, and teams. Supports PNG, JPG, WebP, and AVIF formats.",
    "email": "support@shrinkix.com",
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@shrinkix.com",
        "availableLanguage": "English"
    }
};

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shrinkix",
    "url": SITE_URL
};

export const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Shrinkix",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "Image Compression",
    "operatingSystem": "Web",
    "url": SITE_URL,
    "description": "Compress and convert PNG, JPG, WebP, and AVIF images automatically. Free online image compressor with API access for developers.",
    "featureList": [
        "Image compression",
        "Format conversion (WebP, AVIF, PNG, JPG)",
        "Bulk image optimization",
        "REST API",
        "Privacy-first — files deleted after processing",
        "Supports up to 150MB files (Ultra plan)"
    ],
    "offers": [
        {
            "@type": "Offer",
            "name": "Free",
            "price": "0",
            "priceCurrency": "USD",
            "description": "20 images per day, 5MB file limit"
        },
        {
            "@type": "Offer",
            "name": "Web Pro",
            "price": "39",
            "priceCurrency": "USD"
        },
        {
            "@type": "Offer",
            "name": "Web Ultra",
            "price": "59",
            "priceCurrency": "USD"
        }
    ]
};

export const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to compress images for a website",
    "description": "Shrinkix automatically compresses and converts your images in three simple steps.",
    "totalTime": "PT1M",
    "step": [
        {
            "@type": "HowToStep",
            "position": 1,
            "name": "Upload your images",
            "text": "Add PNG, JPG, WebP, or AVIF files — single images or bulk uploads.",
            "url": `${SITE_URL}/#upload`
        },
        {
            "@type": "HowToStep",
            "position": 2,
            "name": "Automatic conversion and compression",
            "text": "Shrinkix optimizes each image for size and quality in seconds.",
            "url": `${SITE_URL}/#upload`
        },
        {
            "@type": "HowToStep",
            "position": 3,
            "name": "Download optimized files",
            "text": "Smaller images, same visual quality, ready for production.",
            "url": `${SITE_URL}/#upload`
        }
    ]
};

export const faqHomeSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Is my data safe?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your images are uploaded via a secure SSL connection. Shrinkix processes them automatically and deletes them from servers immediately after you download them. No one else has access to your files."
            }
        },
        {
            "@type": "Question",
            "name": "How does the compression work?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Shrinkix uses smart lossy compression techniques to reduce the number of colors in image data, requiring fewer bytes to store. The effect is nearly invisible to the eye but makes a very large difference in file size."
            }
        },
        {
            "@type": "Question",
            "name": "What is the maximum file size?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Free users: 5 MB per image. Pro users: 75 MB. Ultra users: 150 MB per image."
            }
        },
        {
            "@type": "Question",
            "name": "Do you support animated PNGs or WebPs?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Currently Shrinkix focuses on static image compression to ensure the highest quality and speed. Supported formats: standard JPG, PNG, WebP, and AVIF."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use the compressed images commercially?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Once compressed, images are yours to use freely for any personal or commercial project with no attribution required."
            }
        },
        {
            "@type": "Question",
            "name": "Does compressing images affect quality?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Smart compression reduces file size with minimal visible quality loss. Shrinkix uses lossy compression that typically achieves 60–80% size reduction while maintaining visual quality that is indistinguishable from the original."
            }
        },
        {
            "@type": "Question",
            "name": "What image format loads fastest on websites?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "WebP loads 25–35% faster than JPEG at comparable quality, and AVIF can be 50% smaller than JPEG. Both are supported by all modern browsers. Shrinkix can automatically convert your images to WebP or AVIF."
            }
        },
        {
            "@type": "Question",
            "name": "Does image optimization improve SEO?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Page speed is a confirmed Google ranking factor, and images are the largest contributor to page weight. Optimized images improve Core Web Vitals scores — especially Largest Contentful Paint (LCP) — which directly influences search rankings."
            }
        }
    ]
};

export const faqDevelopersSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How can I sign up for an API account?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sign up for the developer API by entering your name and email on the developers page. An activation email will be sent. Clicking the link in that email logs you in and directs you to the dashboard immediately."
            }
        },
        {
            "@type": "Question",
            "name": "Is there a maximum file size limit for the API?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The maximum file size is 100MB for Enterprise plans. Free: 5MB, Pro: 25MB, Ultra: 50MB. Images should not exceed 256MP canvas size."
            }
        },
        {
            "@type": "Question",
            "name": "Can I use one API account for multiple websites?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. In the API dashboard you can create multiple API keys — one per project or website — so you can monitor compressions separately for each implementation."
            }
        },
        {
            "@type": "Question",
            "name": "Can Shrinkix see what images I have uploaded?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Shrinkix cannot see the content of your images. Only minimal personal information is collected to administer your account and provide requested services. Images are deleted immediately after processing."
            }
        }
    ]
};

export const faqDeveloperPricingSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What payment methods do you accept?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "For the Developer API, we accept payments via credit card and PayPal. Enterprise customers can also pay via invoice with NET30 terms."
            }
        },
        {
            "@type": "Question",
            "name": "How does the Developer API pricing work?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Every account starts with 500 free API credits each month. Subscribe to API Pro (5,000 credits/month for $35) or API Ultra (15,000 credits/month for $90). Monthly credits reset each calendar month. You can also purchase additional credit bundles anytime — they never expire."
            }
        },
        {
            "@type": "Question",
            "name": "What happens if I hit my monthly credit limit?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Once you reach your monthly credit allowance, the API returns an error. You can wait for the next calendar month, upgrade to a higher tier, or purchase additional credit bundles to continue immediately."
            }
        },
        {
            "@type": "Question",
            "name": "What happens if I don't use all my monthly credits?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Unused monthly subscription credits do not roll over. At the start of each calendar month your allowance resets. However, purchased credit bundles never expire and remain in your account until used."
            }
        },
        {
            "@type": "Question",
            "name": "How are credits consumed?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Credits are consumed in order: first your monthly subscription allowance, then purchased credit bundles. This ensures you get maximum value from your subscription before using pay-as-you-go credits."
            }
        },
        {
            "@type": "Question",
            "name": "How will I be billed for my subscription?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Subscription plans (API Pro and API Ultra) are billed monthly at a fixed rate at the beginning of each billing cycle. Credit bundles are one-time purchases charged immediately. All payments are processed securely through Stripe."
            }
        },
        {
            "@type": "Question",
            "name": "How do I cancel my subscription?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Cancel anytime from your API dashboard. You will be downgraded to the free tier (500 credits/month) at the end of your current billing period. Purchased credit bundles remain in your account."
            }
        },
        {
            "@type": "Question",
            "name": "Are there volume discounts for Enterprise?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Enterprise customers processing over 100,000 images per month can get custom volume pricing. Contact support@shrinkix.com to discuss your needs."
            }
        }
    ]
};

export const pricingWebSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Shrinkix Web Plans",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "item": {
                "@type": "Product",
                "name": "Shrinkix Free",
                "description": "20 images per day, up to 5MB per file, web interface only.",
                "brand": { "@type": "Brand", "name": "Shrinkix" },
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": `${SITE_URL}/pricing`
                }
            }
        },
        {
            "@type": "ListItem",
            "position": 2,
            "item": {
                "@type": "Product",
                "name": "Shrinkix Web Pro",
                "description": "Unlimited images, 75MB file limit, priority support. $39/year.",
                "brand": { "@type": "Brand", "name": "Shrinkix" },
                "offers": {
                    "@type": "Offer",
                    "price": "39",
                    "priceCurrency": "USD",
                    "priceValidUntil": "2027-12-31",
                    "availability": "https://schema.org/InStock",
                    "url": `${SITE_URL}/checkout?tier=pro`
                }
            }
        },
        {
            "@type": "ListItem",
            "position": 3,
            "item": {
                "@type": "Product",
                "name": "Shrinkix Web Ultra",
                "description": "Unlimited images, 150MB file limit, highest priority support. $59/year.",
                "brand": { "@type": "Brand", "name": "Shrinkix" },
                "offers": {
                    "@type": "Offer",
                    "price": "59",
                    "priceCurrency": "USD",
                    "priceValidUntil": "2027-12-31",
                    "availability": "https://schema.org/InStock",
                    "url": `${SITE_URL}/checkout?tier=ultra`
                }
            }
        }
    ]
};

export const pricingApiSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Shrinkix API Plans",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "item": {
                "@type": "Product",
                "name": "Shrinkix API Free",
                "description": "500 API credits/month, 5MB file limit, PNG/JPEG/WebP/AVIF.",
                "brand": { "@type": "Brand", "name": "Shrinkix" },
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": `${SITE_URL}/developers`
                }
            }
        },
        {
            "@type": "ListItem",
            "position": 2,
            "item": {
                "@type": "Product",
                "name": "Shrinkix API Pro",
                "description": "5,000 API credits/month, batch processing, format conversion, 25MB file limit.",
                "brand": { "@type": "Brand", "name": "Shrinkix" },
                "offers": {
                    "@type": "Offer",
                    "price": "35",
                    "priceCurrency": "USD",
                    "priceValidUntil": "2027-12-31",
                    "availability": "https://schema.org/InStock",
                    "url": `${SITE_URL}/checkout/api?tier=api-pro`
                }
            }
        },
        {
            "@type": "ListItem",
            "position": 3,
            "item": {
                "@type": "Product",
                "name": "Shrinkix API Ultra",
                "description": "15,000 API credits/month, dedicated support, 50MB file limit.",
                "brand": { "@type": "Brand", "name": "Shrinkix" },
                "offers": {
                    "@type": "Offer",
                    "price": "90",
                    "priceCurrency": "USD",
                    "priceValidUntil": "2027-12-31",
                    "availability": "https://schema.org/InStock",
                    "url": `${SITE_URL}/checkout/api?tier=api-ultra`
                }
            }
        }
    ]
};

export const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Shrinkix API Reference Documentation",
    "description": "Complete reference for the Shrinkix Image Compression and Conversion API. Covers authentication, compressing images, converting formats, error handling, and rate limits.",
    "url": `${SITE_URL}/api-docs`,
    "author": { "@type": "Organization", "name": "Shrinkix" },
    "publisher": {
        "@type": "Organization",
        "name": "Shrinkix",
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` }
    },
    "dateModified": "2026-05-25",
    "proficiencyLevel": "Beginner",
    "programmingLanguage": ["JavaScript", "Python", "PHP", "Ruby", "Go", "Java", "C#"]
};

export function breadcrumbSchema(crumbs) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": crumbs.map((crumb, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": crumb.name,
            "item": `${SITE_URL}${crumb.path}`
        }))
    };
}

export const speakableHomeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".faq-answer p", ".trust-content p", ".problem-content p", ".new-hero-content p"]
    },
    "url": SITE_URL
};
