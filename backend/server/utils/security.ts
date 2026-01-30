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
