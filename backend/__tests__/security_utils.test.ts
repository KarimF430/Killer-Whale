import { escapeRegExp, sanitizeForRegExp } from '../server/utils/security';

describe('Security Utilities: Regex Escaping', () => {
  it('should escape special regex characters', () => {
    const unsafe = '.*+?^${}()|[]\\';
    const safe = escapeRegExp(unsafe);

    // Each special character should be preceded by a backslash
    expect(safe).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');

    // Verify it works in a real RegExp
    const re = new RegExp(safe);
    expect(re.test(unsafe)).toBe(true);
  });

  it('should sanitize user input for regex', () => {
    // Current implementation doesn't escape spaces, which is usually fine
    expect(sanitizeForRegExp('  hello (world)  ')).toBe('hello \\(world\\)');
    expect(sanitizeForRegExp('')).toBe('');
  });
});
