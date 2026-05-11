# Operations

## Daily checks

- Review latest backup status in the dashboard.
- Review repository checks and mini-restore status separately from snapshot creation.
- Investigate failures explicitly; do not rely on generic shell trap messages.

## Routine validation

- Run `scripts/atmed-bcc-audit` after configuration changes.
- Verify timer and dashboard service status via `systemctl status`.
- Confirm snapshot coverage across all enabled endpoint/provider combinations.
