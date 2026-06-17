import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { JsonLd } from './components/SEOHead';
import { organizationSchema, websiteSchema } from './seo/schemas';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Eager-load the home page (critical path, must be fast)
import Home from './features/compression/components/Home';

// Lazy-load all other routes — split into separate chunks
const Pricing = lazy(() => import('./features/pricing/components/Pricing'));
const ApiDocs = lazy(() => import('./features/developers/components/ApiDocs'));
const APIDocsPage = lazy(() => import('./features/developers/components/APIDocsPage'));
const Developers = lazy(() => import('./features/developers/components/Developers'));
const DeveloperPricing = lazy(() => import('./features/developers/components/DeveloperPricing'));
const Signup = lazy(() => import('./features/auth/components/Signup'));
const Auth = lazy(() => import('./features/auth/components/Auth'));
const Dashboard = lazy(() => import('./features/dashboard/components/Dashboard'));
const CreditPurchase = lazy(() => import('./features/pricing/components/CreditPurchase'));
const Checkout = lazy(() => import('./features/pricing/components/Checkout'));
const Admin = lazy(() => import('./features/admin/components/Admin'));
const HowItWorks = lazy(() => import('./features/developers/components/developers/HowItWorks'));
const About = lazy(() => import('./features/about/About'));
const Privacy = lazy(() => import('./features/privacy/Privacy'));
const NotFound = lazy(() => import('./features/notfound/NotFound'));
const CompressJpeg = lazy(() => import('./features/formats/components/CompressJpeg'));
const CompressPng = lazy(() => import('./features/formats/components/CompressPng'));
const CompressWebp = lazy(() => import('./features/formats/components/CompressWebp'));
const CompressAvif = lazy(() => import('./features/formats/components/CompressAvif'));
const ConvertToWebp = lazy(() => import('./features/formats/components/ConvertToWebp'));
const CompressImageToKb = lazy(() => import('./features/formats/components/CompressImageToKb'));
const Compress = lazy(() => import('./features/compress/components/Compress'));
const Convert = lazy(() => import('./features/convert/components/Convert'));
const WordPressPlugin = lazy(() => import('./features/wordpress/components/WordPress'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e3e8ee', borderTopColor: '#3c78d8', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <JsonLd schema={organizationSchema} />
      <JsonLd schema={websiteSchema} />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/developers/pricing" element={<DeveloperPricing />} />
          <Route path="/developers/how-it-works" element={<HowItWorks />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/api-docs" element={<APIDocsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Signup />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buy-credits" element={<CreditPurchase />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:type" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/compress-jpeg" element={<CompressJpeg />} />
          <Route path="/compress-png" element={<CompressPng />} />
          <Route path="/compress-webp" element={<CompressWebp />} />
          <Route path="/compress-avif" element={<CompressAvif />} />
          <Route path="/convert-to-webp" element={<ConvertToWebp />} />
          <Route path="/compress-image-to-kb" element={<CompressImageToKb />} />
          <Route path="/compress" element={<Compress />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/wordpress" element={<WordPressPlugin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}

export default App;
