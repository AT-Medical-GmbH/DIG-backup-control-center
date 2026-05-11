# DIG-backup-control-center

DIG-Backup-Control-center is the ATMED Backup Control Center (ATMED-BCC): a self-hosted backup control plane for remote `restic`/`rclone` backups, SQLite-backed audit metadata, operational visibility and restore-readiness workflows.

This repository now ships the reproducible project structure, example configuration, non-destructive bootstrap scripts, dashboard skeleton and validation workflow needed to clone and customize the platform without committing secrets.

## Repository layout

- `docs/` deployment, operations, restore and security guidance
- `systemd/` service and timer units for backup and dashboard processes
- `scripts/` safe Bash entrypoints for backup, audit, install and restore-test flows
- `app/` dashboard bootstrap with a simple ATMED-BCC overview page
- `db/` SQLite schema and initial migration
- `examples/` configuration templates only, never live secrets
- `packaging/` install, uninstall and upgrade helpers
- `.github/workflows/validate.yml` CI checks that do not require secrets

## Safety model

- No production credentials, logs or backup data belong in Git.
- Scripts default to non-destructive modes.
- Live backup or restore execution remains an explicit operator action after site-specific restic/rclone integration.
- Dashboard code is isolated from backup script execution.

## Quick start

1. Copy the files from `examples/` into an operator-managed configuration directory.
2. Review `docs/installation.md` and `docs/configuration.md`.
3. Run `scripts/atmed-bcc-audit --config-dir examples` to validate the bootstrap scaffold.
4. Start the local dashboard preview with `python3 app/main.py --config-dir examples`.

## Validation

The repository includes lightweight validation that avoids secrets and live infrastructure access:

- `scripts/atmed-bcc-audit`
- `bash -n scripts/*`
- `python3 -m py_compile app/main.py`

## License

This project is released under the MIT License. See `LICENSE`.
