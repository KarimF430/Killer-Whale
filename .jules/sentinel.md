# SENTINEL'S JOURNAL - CRITICAL SECURITY LEARNINGS

## 2025-05-15 - [Regex Injection & ReDoS]
**Vulnerability:** User-controlled input was being passed directly into `new RegExp()` and MongoDB `$regex` without sanitization. Also, a complex regex for script tag removal in `sanitizeString` was vulnerable to catastrophic backtracking (ReDoS).
**Learning:** SonarCloud heavily flags dynamic regular expressions. Even when using MongoDB's `$regex`, it is safer to use string-based patterns with separate options and mandatory escaping of user-provided segments.
**Prevention:** Use a robust escaping utility like `replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` for any user input entering a regex. Simplify sanitization regexes to use non-greedy, non-overlapping matches like `[\s\S]*?`.

## 2025-05-15 - [Information Leakage in Production]
**Vulnerability:** Error responses in the `/api/variants` endpoint were returning `error.stack`, exposing internal system paths and logic to potential attackers.
**Learning:** Stack traces should only be logged server-side and never returned to the client in production.
**Prevention:** Explicitly remove `stack` properties from error objects before sending them in JSON responses.
