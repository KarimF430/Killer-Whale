## 2025-05-14 - [Critical Secret Leakage in IDE History]
**Vulnerability:** Numerous `.env` files and configuration backups containing production MongoDB URIs, JWT secrets, Cloudflare R2 credentials, and Sentry DSNs were leaked within the `.history/` directory and `.env.bak` files.
**Learning:** Local IDE history extensions (like VS Code's Local History) can automatically save copies of sensitive files, bypassing standard `.gitignore` rules if the history directory itself isn't explicitly ignored.
**Prevention:** Proactively add `.history/`, `*.bak`, and other common temporary/backup patterns to the root `.gitignore` and perform regular audits of hidden directories.

## 2025-05-14 - [Regex Injection (ReDoS) in Search and AI Engines]
**Vulnerability:** The application used `new RegExp()` with unsanitized user input in several critical paths, including the search endpoint and AI self-learning system, creating a risk of Denial of Service (ReDoS) via catastrophic backtracking.
**Learning:** Even with basic escaping, dynamic regex constructors are a high-risk pattern. MongoDB's string-based `$regex` is a safer alternative for database queries as it offloads the safety to the database engine's optimized implementation.
**Prevention:** Use a centralized `escapeRegExp` utility and prefer non-regex string operations or native database regex operators over the JavaScript `RegExp` constructor for user-provided strings.
