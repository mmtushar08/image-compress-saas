import { onCLS, onFCP, onLCP, onINP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, rating, id }) {
    // Replace with your analytics endpoint or GA4 measurement ID
    // Example: send to Google Analytics 4
    if (typeof window.gtag === 'function') {
        window.gtag('event', name, {
            value: Math.round(name === 'CLS' ? value * 1000 : value),
            metric_id: id,
            metric_value: value,
            metric_rating: rating,
            non_interaction: true,
        });
    }

    // Log to console in development
    if (import.meta.env.DEV) {
        const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
        console.log(`${emoji} ${name}: ${Math.round(value)}ms (${rating})`);
    }
}

export function reportWebVitals() {
    onCLS(sendToAnalytics);   // Cumulative Layout Shift — target < 0.1
    onFCP(sendToAnalytics);   // First Contentful Paint — target < 1.8s
    onLCP(sendToAnalytics);   // Largest Contentful Paint — target < 2.5s
    onINP(sendToAnalytics);   // Interaction to Next Paint — target < 200ms
    onTTFB(sendToAnalytics);  // Time to First Byte — target < 800ms
}
