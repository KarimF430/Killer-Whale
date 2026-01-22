## 2025-11-27 - [Administrative Access Control Gaps]
**Vulnerability:** Several administrative routes (users, articles, reviews, emails) were either completely unprotected or had authentication commented out, allowing unauthorized access to sensitive PII and site content.
**Learning:** Development-time convenience (disabling auth) can easily leak into "ready" code if not strictly managed. Inconsistent authentication systems (JWT vs Sessions) across different modules can lead to confusion and overlooked security gaps.
**Prevention:** Always implement a default-deny policy for administrative routes. Use a consistent, project-wide authentication middleware. Add automated checks for unprotected routes in the CI/CD pipeline.

## 2025-11-27 - [Exposed Secrets in Scripts and Backups]
**Vulnerability:** Production MongoDB credentials were hardcoded in `test-all-services.sh`, and a sensitive environment backup file `backend/.env.bak` was committed to the repository.
**Learning:** Secrets often hide in "non-application" code like helper scripts and backup files. Password rotation without updating hardcoded values elsewhere leaves the system vulnerable.
**Prevention:** Never hardcode secrets in any file, including scripts. Use environment variables. Use tools like `git-secrets` or `trufflehog` to scan for secrets before every commit. Ensure `.gitignore` covers all possible backup file patterns (e.g., `*.bak`, `*.old`, `*.swp`).
