import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './features/compression/components/Home';
import Pricing from './features/pricing/components/Pricing';
import ApiDocs from './features/developers/components/ApiDocs';
import APIDocsPage from './features/developers/components/APIDocsPage';
import Developers from './features/developers/components/Developers';
import DeveloperPricing from './features/developers/components/DeveloperPricing';
import Signup from './features/auth/components/Signup';
import Auth from './features/auth/components/Auth';
import Dashboard from './features/dashboard/components/Dashboard';
import CreditPurchase from './features/pricing/components/CreditPurchase';
import Checkout from './features/pricing/components/Checkout';
import Admin from './features/admin/components/Admin';
import HowItWorks from './features/developers/components/developers/HowItWorks';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/developers/pricing" element={<DeveloperPricing />} />
        <Route path="/developers/how-it-works" element={<HowItWorks />} />
        <Route path="/docs" element={<ApiDocs />} />
        <Route path="/api-docs" element={<APIDocsPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buy-credits" element={<CreditPurchase />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/:type" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
