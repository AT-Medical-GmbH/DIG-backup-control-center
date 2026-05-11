# Security Hardening

- Do not expose the dashboard publicly without authentication.
- Restrict secret files to the service account that needs them.
- Prefer least-privilege S3 credentials and SSH principals.
- Avoid logging environment variables or repository passwords.
- Prepare for future role separation and OIDC/SSO integration.
