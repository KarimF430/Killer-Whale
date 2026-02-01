# SENTINEL'S JOURNAL - CRITICAL SECURITY LEARNINGS

## 2025-05-15 - [Regex Injection in AI/Search Systems]
**Vulnerability:** User-controlled input was being passed directly into the `new RegExp()` constructor without sanitization. In a fuzzy search context (e.g., `query.split(' ').join('.*')`), this allowed attackers to inject regex meta-characters like `(a+)+$` which trigger catastrophic backtracking (ReDoS).
**Learning:** Even simple search queries can be weaponized if they are dynamically converted to regular expressions. Standard `string.includes()` is safer, but if `RegExp` is required for fuzzy matching, escaping is mandatory.
**Prevention:** Always use a centralized `escapeRegExp` utility before constructing dynamic patterns from user input. For MongoDB, prefer string-based `$regex` queries over `RegExp` objects where possible.
