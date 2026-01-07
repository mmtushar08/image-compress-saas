import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import '../styles/dashboard.css';

export default function Auth() {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            setStatus('error');
            setMessage('Invalid authentication link');
            return;
        }

        // Verify the token
        fetch(`/api/users/verify-token?token=${token}&email=${encodeURIComponent(email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Save auth data to localStorage
                    localStorage.setItem('trimixo_auth', JSON.stringify({
                        email: data.email,
                        apiKey: data.apiKey,
                        plan: data.plan
                    }));

                    setStatus('success');
                    setMessage('Authentication successful! Redirecting to dashboard...');

                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Authentication failed');
                }
            })
            .catch(err => {
                setStatus('error');
                setMessage('Something went wrong. Please try again.');
            });
    }, [searchParams, navigate]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-circle" style={{
                        backgroundColor: status === 'success' ? '#8cc63f' : status === 'error' ? '#e74c3c' : '#3498db'
                    }}>
                        {status === 'verifying' && <Loader2 size={32} color="white" className="spin" />}
                        {status === 'success' && <CheckCircle size={32} color="white" />}
                        {status === 'error' && <XCircle size={32} color="white" />}
                    </div>
                    <h1>
                        {status === 'verifying' && 'Verifying...'}
                        {status === 'success' && 'Welcome!'}
                        {status === 'error' && 'Authentication Failed'}
                    </h1>
                    <p>{message}</p>
                </div>

                {status === 'error' && (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <button
                            onClick={() => navigate('/signup')}
                            className="auth-submit-btn"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
