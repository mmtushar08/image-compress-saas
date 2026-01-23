import { Book, Image, Maximize, User } from 'lucide-react';

export default function DocsSidebar({ activeSection, scrollToSection }) {
    const navItems = [
        { id: 'authentication', label: 'Authentication', icon: <Book size={18} /> },
        { id: 'compress', label: 'Compress Image', icon: <Image size={18} /> },
        { id: 'resize', label: 'Resize Image', icon: <Maximize size={18} /> },
        { id: 'account', label: 'Account Usage', icon: <User size={18} /> }
    ];

    return (
        <div className="docs-sidebar">
            <div className="docs-logo">
                Shrinkix API
            </div>
            <nav className="docs-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => scrollToSection(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
