## 2025-05-22 - Credential Leakage in Backup Files
**Vulnerability:** A backup environment file (`backend/.env.bak`) was found in the repository containing real production credentials for MongoDB, Cloudflare R2, and Sentry.
**Learning:** Developers often create backup copies of environment files (e.g., `.env.bak`, `.env.old`) that are not covered by standard `.gitignore` rules (like `.env`), leading to accidental commitment of secrets.
**Prevention:** Explicitly add common backup patterns (e.g., `*.bak`, `*.old`, `*.orig`) to `.gitignore`. Proactively scan for such files during security audits.

## 2025-05-22 - Unprotected Administrative Endpoints
**Vulnerability:** Several administrative and diagnostic endpoints (`/api/admin/users`, `/api/cache`, `/api/diagnostics`) were publicly accessible without authentication, exposing PII and system controls.
**Learning:** Newer or auxiliary routes can sometimes be added without following established authentication patterns used in the main `routes.ts`.
**Prevention:** Implement a standard "secure by default" routing architecture where all routes under sensitive prefixes (like `/api/admin` or `/api/diagnostics`) automatically require authentication unless explicitly marked as public.
