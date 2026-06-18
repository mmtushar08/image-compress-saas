import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { SEOHead } from '../SEOHead';

const wrap = (ui) => render(<HelmetProvider>{ui}</HelmetProvider>);

describe('SEOHead title logic', () => {
    it('uses rawTitle verbatim — no suffix appended', () => {
        wrap(<SEOHead rawTitle="My Raw Title" />);
        expect(document.title).toBe('My Raw Title');
    });

    it('appends " | Shrinkix" when only title prop is given', () => {
        wrap(<SEOHead title="Compress Images" />);
        expect(document.title).toBe('Compress Images | Shrinkix');
    });

    it('falls back to the default site title when neither prop is provided', () => {
        wrap(<SEOHead />);
        expect(document.title).toBe('Compress & Convert Images Free — Shrinkix');
    });

    it('rawTitle takes precedence over title prop', () => {
        wrap(<SEOHead rawTitle="Override" title="Should be ignored" />);
        expect(document.title).toBe('Override');
    });
});

describe('SEOHead description', () => {
    it('renders without crashing when no description is provided', () => {
        const { container } = wrap(<SEOHead title="Test" />);
        expect(container).toBeTruthy();
    });
});
