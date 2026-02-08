# Sentinel Security Journal

## 2025-05-15 - Cryptographically Secure OTP Generation
**Vulnerability:** Use of `Math.floor(100000 + Math.random() * 900000)` for OTP generation in `backend/server/routes/user-auth.ts`.
**Learning:** `Math.random()` is not cryptographically secure and can be predictable, allowing attackers to guess OTPs. Node.js `crypto.randomInt()` should be used for all sensitive numeric values like OTPs.
**Prevention:** Always use `node:crypto` for security-sensitive random values. Prefer named imports and the `node:` prefix for clarity and best practices.

## 2025-05-15 - Information Leakage in API Error Responses
**Vulnerability:** Returning `error.message` or `error.stack` in API responses, particularly for cloud storage (R2/S3) connections.
**Learning:** Error details can reveal internal infrastructure configurations, endpoints, and bucket names, aiding attackers in reconnaissance.
**Prevention:** Sanitize error responses by returning generic messages like "Internal Server Error" or "Failed to connect to storage" while logging the full error internally.
