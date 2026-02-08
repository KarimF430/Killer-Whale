/**
 * Security utilities for the backend
 */

/**
 * Escapes special characters in a string for use in a Regular Expression.
 * Prevents Regex Injection vulnerabilities (ReDoS).
 */
export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes a string for use in a Regular Expression by allowing only a whitelist of characters.
 * This is even safer than escaping for simple search queries.
 */
export function sanitizeForRegExp(string: string): string {
    // Allow alphanumeric characters, spaces, hyphens and dots (common in car names)
    return string.replace(/[^\w\s\.-]/g, '');
}
