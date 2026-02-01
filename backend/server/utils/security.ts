/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents Regex Injection (ReDoS) vulnerabilities when using user input
 * to construct dynamic regex patterns.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sanitizes a string specifically for use in MongoDB $regex queries or new RegExp().
 */
export function sanitizeForRegExp(input: any): string {
  if (typeof input !== 'string') return '';
  return escapeRegExp(input);
}
