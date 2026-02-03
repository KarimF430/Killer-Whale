/**
 * Security utilities to prevent common vulnerabilities
 */

/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents Regex Injection (ReDoS) vulnerabilities.
 * @param string The string to escape
 * @returns The escaped string
 */
export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes user input for use in a regular expression.
 * @param input User-provided input string
 * @returns Sanitized string safe for regex
 */
export function sanitizeForRegExp(input: string): string {
    if (!input) return '';
    return escapeRegExp(input);
}
