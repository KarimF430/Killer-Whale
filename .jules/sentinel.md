# Sentinel Journal - Security Learnings

## 2025-05-14 - Regex Injection (ReDoS) and SonarCloud Compliance
**Vulnerability:** User input was passed directly into `new RegExp()` constructors in several endpoints (`/api/search`, AI chat, etc.), leading to potential Regular Expression Denial of Service (ReDoS) attacks.
**Learning:** Even with escaping, static analysis tools like SonarCloud flag `new RegExp()` with dynamic input as a security risk (Security Hotspot). To clear high-security gates, it's often better to use database-native regex handling (like MongoDB's `$regex` string syntax) or strictly whitelist input.
**Prevention:**
1. Use a centralized security utility for regex escaping and sanitization.
2. Favor whitelisting alphanumeric characters for search queries over blacklisting/escaping.
3. Pre-compile static regexes outside of request handlers to avoid redundant computation and satisfy maintainability checks.
4. When using MongoDB, pass regexes as strings in the `$regex` field rather than `RegExp` objects when the pattern is dynamic.
