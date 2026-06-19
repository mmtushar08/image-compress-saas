import { useState } from 'react';
import { SEOHead, JsonLd } from '../../../components/SEOHead';
import { softwareAppSchema, howToSchema, faqHomeSchema, speakableHomeSchema } from '../../../seo/schemas';
import HeroSection from './home/HeroSection';
import TrustSignals from './home/TrustSignals';
import FormatSupport from './home/FormatSupport';
import ApiCallout from './home/ApiCallout';
import HowItWorksSection from './home/HowItWorksSection';
import FeaturesSection from './home/FeaturesSection';
import PricingPreview from './home/PricingPreview';
import FinalCTA from './home/FinalCTA';
import UploadZone from './home/UploadZone';
import DownloadAllButton from './home/DownloadAllButton';
import ResultsList from './home/ResultsList';
import FAQ from '../../../components/FAQ';
import { useImageCompression } from '../../../hooks/useImageCompression';
import { useDownloadAll } from '../../../hooks/useDownloadAll';
import { formatFileSize } from '../../../utils/fileUtils';

export default function Home() {
    const [targetFormats, setTargetFormats] = useState([]);

    const {
        items,
        limitInfo,
        handleFiles,
        formatWarnings
    } = useImageCompression(targetFormats);

    const {
        isProcessing,
        handleDownloadAll,
        showDownloadAll
    } = useDownloadAll(items);

    return (
        <main id="upload">
            <SEOHead
                rawTitle="Shrinkix — Automatic Image Compression & WebP/AVIF Converter"
                description="Compress and convert PNG, JPG, WebP & AVIF automatically. Free forever. No sign-up. Files deleted instantly after processing."
                canonical="/"
                ogImage="https://shrinkix.com/og/home.png"
            />
            <JsonLd schema={softwareAppSchema} />
            <JsonLd schema={howToSchema} />
            <JsonLd schema={faqHomeSchema} />
            <JsonLd schema={speakableHomeSchema} />

            {/* 1. Hero + Upload Tool */}
            <HeroSection>
                <UploadZone
                    onFilesSelected={handleFiles}
                    limitInfo={limitInfo}
                    targetFormats={targetFormats}
                    setTargetFormats={setTargetFormats}
                    formatWarnings={formatWarnings}
                />
            </HeroSection>

            {/* 2. Results area */}
            <DownloadAllButton
                showDownloadAll={showDownloadAll}
                onDownloadAll={handleDownloadAll}
                isProcessing={isProcessing}
            />
            <ResultsList
                items={items}
                formatFileSize={formatFileSize}
            />
            <DownloadAllButton
                showDownloadAll={showDownloadAll}
                onDownloadAll={handleDownloadAll}
                isProcessing={isProcessing}
            />

            {/* 3. Stats Bar */}
            <section className="stats-bar-section">
                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-number">74<span className="stat-pct">%</span></span>
                        <span className="stat-label-top">Avg. Reduction</span>
                        <span className="stat-label-sub">Smaller, Faster Files</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number">4</span>
                        <span className="stat-label-top">Formats Supported</span>
                        <span className="stat-label-sub">PNG · JPG · WebP · AVIF</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-label-top stat-big">Instant Delete</span>
                        <span className="stat-label-sub">Files Gone After Download</span>
                    </div>
                </div>
            </section>

            {/* 4. Trust Signals */}
            <TrustSignals />

            {/* 5. Format Support */}
            <FormatSupport />

            {/* 6. How It Works */}
            <HowItWorksSection />

            {/* 7. Features */}
            <FeaturesSection />

            {/* 8. API Callout */}
            <ApiCallout />

            {/* 9. Pricing Preview */}
            <PricingPreview />

            {/* 10. FAQ */}
            <FAQ />

            {/* 11. Final CTA */}
            <FinalCTA />
        </main>
    );
}
