## 2025-05-22 - [Critical] Unprotected Administrative and PII Endpoints
**Vulnerability:** Several administrative and system-sensitive endpoints (e.g., `/api/admin/users`, `/api/cache`, `/api/diagnostics`, `/api/admin/backup`, `/api/variants`) were completely unprotected by authentication and authorization middleware. The `/api/admin/users/export` endpoint allowed unauthorized downloading of all frontend users' PII (emails, phone numbers, etc.) in CSV format.
**Learning:** The application utilizes multiple authentication systems (`backend/server/auth.ts` vs `backend/server/middleware/auth.ts` vs session-based), which likely led to developer confusion and inconsistent application of security middleware across different route files and entry points.
**Prevention:** Consolidate administrative routes under a single authentication/authorization strategy and ensure that all sensitive routes are audited for middleware application during registration, particularly those mounted in the main server entry point (`index.ts`).

## 2025-05-22 - [Medium] Regular Expression Denial of Service (ReDoS) Risk
**Vulnerability:** The search API was using user-provided input directly in a `new RegExp()` constructor with potentially overlapping wildcards, creating a ReDoS vulnerability.
**Learning:** SonarCloud and other security scanners are very effective at identifying ReDoS patterns, especially when user input is used to dynamically build regexes.
**Prevention:** Avoid dynamic regex generation from user input. Use safe string manipulation or MongoDB's built-in string-based `$regex` operator which is safer and satisfies security gates.

## 2025-05-22 - [Enhancement] Increased Password Hashing Complexity
**Vulnerability:** Bcrypt salt rounds were set to 12, which is acceptable but can be improved to stay ahead of increasing computational power.
**Learning:** Modern security standards for high-security applications often recommend 14 rounds.
**Prevention:** Set salt rounds to 14 to enhance resistance against brute-force and hardware-accelerated cracking attempts.
