# Restore Runbook

## Mini-restore objective

A backup is not considered healthy until restore-readiness is tested.

## Recommended workflow

1. Select a representative endpoint/provider combination.
2. Run `scripts/atmed-bcc-restore-test --config-dir /etc/atmed-bcc` in dry-run mode.
3. Review the planned restore target and temporary directory.
4. Perform the operator-approved restore using site-specific restic credentials.
5. Record the result in SQLite and in the operational change log.
6. Escalate immediately if the restore output differs from the expected verification marker.
