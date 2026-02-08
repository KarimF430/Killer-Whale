/**
 * Security Utility Functions
 */

/**
 * Escape special characters in a string for use in a regular expression.
 * This prevents Regex Injection (ReDoS) vulnerabilities.
 */
export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
