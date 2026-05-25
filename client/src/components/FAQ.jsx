import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
    {
        question: "Is my data safe?",
        answer: "Absolutely. Your images are uploaded via a secure SSL connection. We process them automatically and delete them from our servers immediately after you download them. No one else has access to your files."
    },
    {
        question: "How does the compression work?",
        answer: "We use smart lossy compression techniques to reduce the number of colors in your image data. This requires fewer bytes to store the data. The effect is nearly invisible to the eye but it makes a very large difference in file size!"
    },
    {
        question: "What is the maximum file size?",
        answer: "For Free users, the maximum file size is 5 MB per image. Web Pro users can upload files up to 75 MB, and Web Ultra users up to 150 MB."
    },
    {
        question: "Do you support animated PNGs or WebPs?",
        answer: "Currently, we focus on static image compression to ensure the highest quality and speed. We support standard JPG, PNG, WebP, and AVIF formats."
    },
    {
        question: "Can I use the compressed images commercially?",
        answer: "Yes! Once you compress the images, they are yours to use freely for any personal or commercial project with no attribution required."
    },
    {
        question: "Does compressing images affect quality?",
        answer: "Smart compression reduces file size with minimal visible quality loss. Shrinkix uses lossy compression that typically achieves 60–80% size reduction while maintaining visual quality indistinguishable from the original."
    },
    {
        question: "What image format loads fastest on websites?",
        answer: "WebP loads 25–35% faster than JPEG at comparable quality, and AVIF can be 50% smaller than JPEG. Both are supported by all modern browsers. Shrinkix can automatically convert your images to WebP or AVIF to maximize loading speed."
    },
    {
        question: "Does image optimization improve SEO?",
        answer: "Yes. Page speed is a confirmed Google ranking factor, and images are the largest contributor to page weight. Optimized images improve Core Web Vitals scores — especially Largest Contentful Paint (LCP) — which directly influences search rankings."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-header">
                <h2>Frequently Asked Questions</h2>
                <p>Everything you need to know about Shrinkix.</p>
            </div>

            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            <span>{faq.question}</span>
                            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {openIndex === index && (
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
