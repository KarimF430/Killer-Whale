## 2025-05-22 - Broken Access Control on Administrative and Data-Modification Endpoints
**Vulnerability:** Several administrative and data-modification endpoints (variants, popular-comparisons, users export, diagnostics, etc.) were registered without authentication or role-based authorization middleware.
**Learning:** In large projects with multiple routing files and two distinct authentication systems (one for core data and one for news), it's easy for new routes to be added without following the security patterns established in older routes.
**Prevention:** Use a centralized routing configuration or a consistent middleware wrapper for all administrative routes. Periodically audit the main routes and entry points (index.ts) for unprotected paths.
