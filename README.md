# DIG-backup-control-center

## System

ATMED Backup Control Center (ATMED-BCC)

## Short description

DIG-backup-control-center is the canonical repository scaffold for ATMED-BCC, a self-hosted backup control plane that coordinates restic/rclone backups, records metadata in SQLite, and provides operational visibility through a FastAPI dashboard.

## Current status

Initial repository bootstrap only. The production reference implementation currently exists externally and will be imported later in sanitized, reviewable increments.

## Architecture overview

- **scripts/**: backup orchestration, audit, install and restore-test entrypoints
- **app/**: FastAPI dashboard backend plus static/template assets
- **db/**: SQLite schema and migrations
- **systemd/**: service/timer units for scheduled execution
- **examples/**: non-secret configuration templates
- **packaging/**: install, uninstall and upgrade helpers
- **docs/**: installation, operations, restore and security guidance

## Supported components

- Bash orchestration
- `restic`
- `rclone`
- SQLite
- Python / FastAPI / Uvicorn
- systemd services and timers
- SOPS + age for secret management workflows
- ntfy notifications
- HTML/CSS/JavaScript dashboard UI

## Non-goals

- Committing production credentials, private logs, or production database files
- Rewriting live backup logic speculatively during bootstrap
- Treating backups as enterprise-ready without documented and tested restore procedures

## Security warning

Never commit secrets, tokens, private keys, `rclone.conf`, restic passwords, `.env` files, private logs, or production SQLite databases to Git.

## High-level installation concept

1. Clone repository and review docs.
2. Copy files from `examples/` into an operator-managed secure config directory.
3. Provide secrets outside Git (SOPS + age recommended).
4. Validate with non-destructive audit and syntax checks.
5. Install into target prefix and enable systemd units only after operator review.

## High-level restore concept

1. Run mini-restore verification first.
2. Progress to scoped file/service restores as needed.
3. Escalate to full endpoint restore and disaster-recovery exercises on a controlled schedule.
4. Record outcomes and treat unresolved restore failures as blocking risk.

## Roadmap

- Import sanitized production reference scripts and app logic
- Add controlled database migration history and operational audit hardening
- Expand restore automation and drill documentation
- Introduce stronger dashboard auth and future SSO integration
- Prepare reusable deployment profiles for other organizations

## Validation

The repository includes lightweight validation that avoids secrets and live infrastructure access:

- `scripts/atmed-bcc-audit --config-dir examples`
- `bash -n scripts/*`
- `bash -n packaging/*`
- `python3 -m py_compile app/main.py`

## Governance baseline

- Treat current production behavior as reference.
- Keep backup execution logic separated from dashboard UI logic.
- Route changes through branches and pull requests.
- Keep destructive operations explicit and documented.
- Surface backup-check and restore-test failures clearly and safely.

## License

This project is released under the MIT License. See `LICENSE`.
