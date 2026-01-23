import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import '../../../styles/dashboard.css';

export default function Auth() {
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Fetch CSRF token on mount
    useEffect(() => {
        fetch('/api/csrf-token')
            .then(res => res.json())
            .then(data => setCsrfToken(data.csrfToken))
            .catch(err => console.error('Failed to fetch CSRF', err));
    }, []);

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            setStatus('error'); // eslint-disable-line react-hooks/set-state-in-effect
            setMessage('Invalid authentication link');
            return;
        }

        // Wait for CSRF token before verifying
        if (!csrfToken) return;

        // Changed to POST request for security
        fetch('/api/users/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({ token, email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Save auth data to localStorage (will be migrated to cookies later)
                    localStorage.setItem('shrinkix_auth', JSON.stringify({
                        email: data.user.email,
                        plan: data.user.plan
                        // Note: API key no longer stored in localStorage
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
            .catch(() => {
                setStatus('error');
                setMessage('Something went wrong. Please try again.');
            });
    }, [searchParams, navigate, csrfToken]);

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
