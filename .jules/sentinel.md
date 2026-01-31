# Sentinel Journal

## 2024-05-20 - [Regex Injection / ReDoS in AI & Search]
**Vulnerability:** User-provided search terms and car names were being directly passed to `new RegExp()` constructors without sanitization. This allowed for Regex Injection and potential ReDoS (Regular Expression Denial of Service) attacks.
**Learning:** SonarCloud and other security scanners specifically flag `new RegExp()` with dynamic variables. Even if the input seems safe, the pattern itself is inherently risky if not escaped. Additionally, MongoDB's `$regex` operator with a string is preferred over passing a JavaScript `RegExp` object for better security and performance.
**Prevention:** Use a centralized `escapeRegExp` utility for any dynamic input that must be used in a regex. Favor static pre-compiled regexes for known patterns and use MongoDB's string-based `$regex` syntax for database queries.

## 2024-05-20 - [Credential Leakage via IDE History]
**Vulnerability:** The `.history/` directory (common in some IDEs) was tracking multiple versions of `.env` files containing production MongoDB URIs, Sentry DSNs, and R2 credentials.
**Learning:** Even if `.env` is ignored, related metadata or history directories might not be. These are high-value targets for attackers.
**Prevention:** Explicitly ignore `.history/`, `*.bak`, and other common backup/temp patterns in the root `.gitignore`. Proactively scan for and delete these directories if they were accidentally committed.
