import { useState } from 'react';
import NewHeroSection from './home/NewHeroSection';
import TrustSignal from './home/TrustSignal';
import Problem from './home/Problem';
import SolutionOverview from './home/SolutionOverview';
import HowItWorksSection from './home/HowItWorksSection';
import FeaturesSection from './home/FeaturesSection';
import WhoItsFor from './home/WhoItsFor';
import APISection from './home/APISection';
import PrivacySecurity from './home/PrivacySecurity';
import Positioning from './home/Positioning';
import PricingPreview from './home/PricingPreview';
import FinalCTA from './home/FinalCTA';
import UploadZone from './home/UploadZone';
import DownloadAllButton from './home/DownloadAllButton';
import ResultsList from './home/ResultsList';
import FAQ from '../../../components/FAQ';
import { useImageCompression } from '../../../hooks/useImageCompression';
import { useDownloadAll } from '../../../hooks/useDownloadAll';
import { formatFileSize } from '../../../utils/fileUtils';

/**
 * Home Component
 * Comprehensive marketing homepage with full conversion funnel
 * 
 * Structure:
 * 1. Hero with upload functionality
 * 2. Trust signal (privacy guarantee)
 * 3. Problem statement
 * 4. Solution overview
 * 5. How it works
 * 6. Features
 * 7. Who it's for
 * 8. API section
 * 9. Privacy & security
 * 10. Positioning
 * 11. Pricing preview
 * 12. Final CTA
 */
export default function Home() {
    const [targetFormats, setTargetFormats] = useState([]);

    // Custom hook for compression logic
    const {
        items,
        limitInfo,
        handleFiles,
        formatWarnings
    } = useImageCompression(targetFormats);

    // Custom hook for download all functionality
    const {
        isProcessing,
        handleDownloadAll,
        showDownloadAll
    } = useDownloadAll(items);

    return (
        <main id="upload">
            {/* Hero Section with Upload */}
            <NewHeroSection>
                <UploadZone
                    onFilesSelected={handleFiles}
                    limitInfo={limitInfo}
                    targetFormats={targetFormats}
                    setTargetFormats={setTargetFormats}
                    formatWarnings={formatWarnings}
                />
            </NewHeroSection>

            {/* Results List */}
            <ResultsList
                items={items}
                formatFileSize={formatFileSize}
            />

            <DownloadAllButton
                showDownloadAll={showDownloadAll}
                onDownloadAll={handleDownloadAll}
                isProcessing={isProcessing}
            />

            {/* Trust Signal */}
            <TrustSignal />

            {/* Problem Statement */}
            <Problem />

            {/* Solution Overview */}
            <SolutionOverview />

            {/* How It Works */}
            <HowItWorksSection />

            {/* Features */}
            <FeaturesSection />

            {/* Who It's For */}
            <WhoItsFor />

            {/* API Section */}
            <APISection />

            {/* Privacy & Security */}
            <PrivacySecurity />

            {/* Positioning */}
            <Positioning />

            {/* Pricing Preview */}
            <PricingPreview />

            {/* Final CTA */}
            <FinalCTA />

            {/* FAQ */}
            <FAQ />
        </main>
    );
}
