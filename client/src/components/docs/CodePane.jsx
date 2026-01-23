import { Check } from 'lucide-react';

export default function CodePane({ language, setLanguage, codeSamples }) {

    const languages = [
        { id: 'nodejs', label: 'Node.js' },
        { id: 'python', label: 'Python' },
        { id: 'php', label: 'PHP' },
        { id: 'curl', label: 'cURL' }
    ];

    return (
        <div className="code-pane">
            <div className="code-header">
                {languages.map(lang => (
                    <button
                        key={lang.id}
                        className={`lang-btn ${language === lang.id ? 'active' : ''}`}
                        onClick={() => setLanguage(lang.id)}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
            <div className="code-content">
                <pre><code>{codeSamples[language]}</code></pre>
            </div>
        </div>
    );
}
