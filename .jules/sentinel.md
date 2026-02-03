# Sentinel Journal

## 2025-11-27 - Hardened Admin Routes and Cleaned Leaked Secrets
**Vulnerability:** Numerous administrative and data-modifying routes were public. Production credentials were leaked in Git history and backup files.
**Learning:** Even if files are in .gitignore, they might have been committed previously. Always audit Git history for sensitive files like .env.bak.
**Prevention:** Use pre-commit hooks to scan for secrets and ensure .gitignore blocks common backup patterns (*.bak, .history).

## 2025-11-27 - Regex Injection (ReDoS) Mitigations
**Vulnerability:** Dynamic RegExp constructors using user input in search and AI components.
**Learning:** Using `new RegExp()` with unsanitized user input allows attackers to craft patterns that cause exponential backtracking, leading to Denial of Service.
**Prevention:** Always escape user input using a utility like `escapeRegExp` or use string-based `$regex` operators in MongoDB queries which are generally safer against ReDoS.

## 2025-11-27 - Weak OTP and predictable filenames
**Vulnerability:** `Math.random()` was used for generating OTPs and unique suffixes for filenames.
**Learning:** `Math.random()` is PRNG (Pseudo-Random Number Generator) and is predictable. It should never be used for security-sensitive values like OTPs.
**Prevention:** Use `crypto.randomInt` for OTPs and `crypto.randomUUID` for unique identifiers to ensure cryptographic strength and unpredictability.
