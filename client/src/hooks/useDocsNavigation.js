import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useDocsNavigation() {
    const [activeSection, setActiveSection] = useState('authentication');
    const [language, setLanguage] = useState('nodejs');
    const location = useLocation();

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            setActiveSection(id);
            element.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, null, `#${id}`);
        }
    };

    // Handle hash scrolling on initial load
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            scrollToSection(id); // eslint-disable-line react-hooks/set-state-in-effect
        }
    }, [location]);

    // Handle scroll spy to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['authentication', 'compress', 'resize', 'account'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return {
        activeSection,
        language,
        setLanguage,
        scrollToSection
    };
}
