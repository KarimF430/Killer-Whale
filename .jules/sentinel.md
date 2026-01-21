## 2025-11-27 - Hardcoded Secrets in Utility Scripts
**Vulnerability:** Widespread hardcoded production credentials (MongoDB URI, JWT super-admin tokens, R2 keys) across utility scripts and committed backup files.
**Learning:** Utility scripts and test files are often overlooked during security audits, leading to critical credential leakage. Developers sometimes hardcode tokens in scripts used for bulk data imports to "save time."
**Prevention:** 1. Enforce use of `dotenv` in all scripts. 2. Implement pre-commit hooks that scan for credential patterns. 3. Use non-committable `.env.local` for local development secrets. 4. Regularly audit and rotate all production credentials.
