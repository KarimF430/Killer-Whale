## 2025-05-22 - Broken Access Control on Variant and Comparison Routes
**Vulnerability:** Mutation endpoints for car variants and popular comparisons were lacking authentication and role-based authorization, allowing unauthorized data modification.
**Learning:** Some administrative routes were added without the standard security middleware stack used in other parts of the application.
**Prevention:** Ensure all routes that perform data modification (POST, PATCH, DELETE) are wrapped with appropriate authentication and authorization middleware.
