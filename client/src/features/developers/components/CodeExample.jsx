import { useState } from 'react';

export default function CodeExample({ examples }) {
    const keys = Object.keys(examples);
    const [active, setActive] = useState(keys[0]);
    const [copied, setCopied] = useState(false);

    if (!keys.length) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(examples[active]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-container">
            {keys.length > 1 && (
                <div className="code-header">
                    {keys.map(key => (
                        <button
                            key={key}
                            className={`code-tab ${active === key ? 'active' : ''}`}
                            onClick={() => setActive(key)}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            )}
            <div className="code-body">
                <button className="copy-btn" onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <pre><code>{examples[active]}</code></pre>
            </div>
        </div>
    );
}
