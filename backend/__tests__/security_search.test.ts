import { escapeRegExp } from '../server/utils/security';

describe('Search Security - ReDoS Prevention', () => {
  it('should escape special regex characters', () => {
    const input = '.*+?^${}()|[]\\';
    const escaped = escapeRegExp(input);
    expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('should prevent malicious regex from matching everything', () => {
    const maliciousQuery = '.*';
    const escaped = escapeRegExp(maliciousQuery);
    const regex = new RegExp(escaped, 'i');

    expect(regex.test('any string')).toBe(false);
    expect(regex.test('.*')).toBe(true);
  });

  it('should handle complex ReDoS attempts gracefully', () => {
    const redoS = '(a+)+$';
    const escaped = escapeRegExp(redoS);
    const regex = new RegExp(escaped, 'i');

    const longString = 'a'.repeat(100) + 'X';
    // If NOT escaped, this might hang or take long.
    // If escaped, it just looks for the literal string "(a+)+$"
    const start = Date.now();
    expect(regex.test(longString)).toBe(false);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100); // Should be near-instant
  });
});
