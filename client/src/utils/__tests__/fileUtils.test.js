import { describe, it, expect } from 'vitest';
import { formatFileSize } from '../fileUtils';

describe('formatFileSize()', () => {
    it('formats bytes below 1 MB as KB', () => {
        expect(formatFileSize(512 * 1024)).toBe('512 KB');
    });

    it('formats bytes at exactly 1 MB as 1 MB', () => {
        expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    });

    it('formats bytes above 1 MB as MB (no decimal)', () => {
        expect(formatFileSize(2.5 * 1024 * 1024)).toBe('3 MB');
    });

    it('returns 0 KB for 0 bytes', () => {
        expect(formatFileSize(0)).toBe('0 KB');
    });

    it('returns 1 KB for values between 1 and 1024 bytes', () => {
        expect(formatFileSize(1024)).toBe('1 KB');
    });

    it('handles large file sizes', () => {
        expect(formatFileSize(100 * 1024 * 1024)).toBe('100 MB');
    });
});
