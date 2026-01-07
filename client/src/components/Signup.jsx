import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import '../styles/dashboard.css';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const plan = searchParams.get('plan') || 'free';

    // If already logged in, go to dashboard
    useEffect(() => {
        if (localStorage.getItem('trimixo_auth')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, plan })
            });
            const data = await res.json();

            if (data.success) {
                // DON'T auto-login! Show email confirmation instead
                setEmailSent(true);
            } else {
                alert(data.error || "Registration failed");
            }
        } catch (err) {
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

    const isLogin = location.pathname === '/login';

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-circle">
                        <ShieldCheck size={32} />
                    </div>
                    <h1>{isLogin ? 'Welcome Back' : 'Get Started with Trimixo'}</h1>
                    <p>{isLogin ? 'Sign in to access your dashboard' : 'Enter your email to receive your API access link.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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
