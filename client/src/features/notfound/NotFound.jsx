import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

export default function NotFound() {
    return (
        <>
            <SEOHead
                title="Page Not Found"
                description="The page you are looking for does not exist. Return to Shrinkix to compress and convert images online."
                canonical="/404"
            />
            <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '5rem', fontWeight: 700, margin: 0, color: '#3c78d8' }}>404</h1>
                    <h2 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Page not found</h2>
                    <p style={{ color: '#666', marginBottom: '2rem', maxWidth: '400px' }}>
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/" className="btn btn-primary">Back to home</Link>
                </div>
            </main>
        </>
    );
}
