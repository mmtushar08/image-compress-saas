import { Link } from 'react-router-dom';

export default function FaasLink() {
    return (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#666' }}>
            <p>Looking for API access? <Link to="/developers" style={{ color: '#3c78d8', textDecoration: 'none' }}>Check out our Developer API plans</Link></p>
        </div>
    );
}
