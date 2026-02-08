import { escapeRegExp, sanitizeForRegExp } from '../../server/utils/security';

describe('Security Utilities', () => {
    describe('escapeRegExp', () => {
        it('should escape special regex characters', () => {
            const unsafe = 'honda.*+?^${}()|[\\]\\';
            const safe = escapeRegExp(unsafe);
            expect(safe).toBe('honda\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\\\\\]\\\\');

            // Verify it actually works in a RegExp
            const re = new RegExp(safe);
            expect(re.test(unsafe)).toBe(true);
        });
    });

    describe('sanitizeForRegExp', () => {
        it('should remove dangerous characters', () => {
            const input = 'honda(a+)+$';
            const sanitized = sanitizeForRegExp(input);
            expect(sanitized).toBe('hondaa');
        });

        it('should allow alphanumeric characters, spaces, dots, and hyphens', () => {
            const input = 'Tata Safari 2.0-Diesel';
            const sanitized = sanitizeForRegExp(input);
            expect(sanitized).toBe('Tata Safari 2.0-Diesel');
        });
    });
});
