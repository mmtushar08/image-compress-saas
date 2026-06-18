import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEOHead } from '../../../components/SEOHead';
import '../../../styles/dashboard.css';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const plan = searchParams.get('plan') || 'free';
    const isLogin = location.pathname === '/login';

    // If already logged in, go to dashboard
    useEffect(() => {
        if (localStorage.getItem('shrinkix_auth') || localStorage.getItem('trimixo_auth')) {
            navigate('/dashboard');
        }

        // Fetch CSRF token
        fetch('/api/csrf-token')
            .then(res => res.json())
            .then(data => setCsrfToken(data.csrfToken))
            .catch(err => console.error('Failed to fetch CSRF token', err));
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ email, name, plan })
            });
            const data = await res.json();

            if (data.success) {
                // DON'T auto-login! Show email confirmation instead
                setEmailSent(true);
            } else {
                alert(data.error || "Registration failed");
            }
        } catch {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show success message if email was sent
    if (emailSent) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon-circle" style={{ backgroundColor: '#8cc63f' }}>
                            <Mail size={32} color="white" />
                        </div>
                        <h1>Check your email</h1>
                        <p>We've sent a link to <strong>{email}</strong></p>
                    </div>

                    <div style={{ padding: '20px', textAlign: 'center', color: '#4a4a4a' }}>
                        <p>Click the link in the email to access your dashboard and API key.</p>
                        <p style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <SEOHead
                title={isLogin ? 'Sign In to Your Account' : 'Create a Free Account'}
                description={isLogin ? 'Sign in to your Shrinkix account to access your dashboard and API key.' : 'Sign up for Shrinkix and start compressing images instantly. Free plan includes 500 API credits per month.'}
                canonical={isLogin ? '/login' : '/signup'}
            />
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-circle">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Get Started with Shrinkix'}</h1>
                    <p>{isLogin ? 'Sign in to access your dashboard' : 'Enter your email to receive your API access link.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            placeholder="your@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="plan-selection-preview">
                        Selected Plan: <strong>{plan.charAt(0).toUpperCase() + plan.slice(1)}</strong>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? "Sending..." : (
                            <>
                                Get Access Link <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    By continuing, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}
