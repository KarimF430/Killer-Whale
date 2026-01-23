## 2025-05-15 - Hardcoded Secrets Proliferation
**Vulnerability:** Hardcoded MongoDB credentials, Sentry DSNs, and Cloudflare R2 keys were found across multiple files including shell scripts, documentation, and backup environment files.
**Learning:** Secrets often leak into non-code files like `.env.bak`, `test-all-services.sh`, and `SENTRY_CONFIGURED.md` where they may be overlooked during standard code reviews.
**Prevention:** Use placeholders in all documentation and example files. Implement secret scanning in CI/CD and use environment variables for all sensitive configurations. Add explicit security comments to placeholders.
