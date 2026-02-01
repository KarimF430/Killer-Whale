/**
 * Security utilities
 */

/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents Regex Injection (ReDoS) attacks.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes user input for use in a regular expression search.
 * Trims input and removes potentially dangerous patterns.
 */
export function sanitizeForRegExp(input: string): string {
  if (!input) return '';
  // Trim and escape special characters
  return escapeRegExp(input.trim());
}
