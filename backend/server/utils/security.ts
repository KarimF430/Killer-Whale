/**
 * Security Utilities
 *
 * Centralized functions for input sanitization and security checks.
 */

/**
 * Escapes special characters in a string for use in a Regular Expression.
 * Prevents Regex Injection vulnerabilities.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes a string for use in a Regular Expression by removing common operators.
 * Useful for cases where you want to allow some matching but minimize ReDoS risk.
 */
export function sanitizeForRegExp(string: string): string {
  // Removes common regex operators that can lead to ReDoS or unexpected behavior
  return string.replace(/[*+?^${}()|[\]\\]/g, '');
}
