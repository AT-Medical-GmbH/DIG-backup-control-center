# Security Hardening

- Never store real secrets in Git. Commit only templates and placeholders.
- Use SOPS + age for encrypted secret material tracked in version control.
- Store the age private key in an external break-glass vault, not in this repository.
- Restrict permissions on secret files to the minimum required service account.
- Protect dashboard access with authentication and least-privilege authorization.
- Prepare future SSO integration for centralized identity and policy enforcement.
- Document key rotation procedures for age keys, access keys and notification tokens.
