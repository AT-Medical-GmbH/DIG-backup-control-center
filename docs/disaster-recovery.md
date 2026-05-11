# Disaster Recovery

## Scope

Disaster recovery is broader than snapshot creation and includes:

- configuration recovery
- secret access recovery
- repository integrity validation
- mini-restore success
- documented full-system rebuild steps

## Break-glass requirements

- Maintain an offline copy of the age private key.
- Keep operator access procedures outside the production host.
- Test a full server rebuild before declaring disaster-recovery readiness.
