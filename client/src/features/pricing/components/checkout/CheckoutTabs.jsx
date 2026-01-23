import { Crown, Terminal, Coins } from 'lucide-react';

export default function CheckoutTabs({ activeTab, setActiveTab }) {
    return (
        <div className="checkout-tabs">
            <button
                className={`tab-btn ${activeTab === 'web' ? 'active' : ''}`}
                onClick={() => setActiveTab('web')}
            >
                <Crown size={18} />
                <span>Web App</span>
            </button>
            <button
                className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
                onClick={() => setActiveTab('api')}
            >
                <Terminal size={18} />
                <span>Developer API</span>
            </button>
            <button
                className={`tab-btn ${activeTab === 'credits' ? 'active' : ''}`}
                onClick={() => setActiveTab('credits')}
            >
                <Coins size={18} />
                <span>Prepaid Credits</span>
            </button>
        </div>
    );
}
