# Installation

## Goal

Provision a dedicated ATMED-BCC host from version-controlled repository contents plus operator-managed secrets.

## Baseline steps

1. Install system packages for `bash`, `python3`, `sqlite3`, `restic`, `rclone`, `sops` and `age`.
2. Clone this repository onto the backup host.
3. Copy `examples/` into a protected configuration directory such as `/etc/atmed-bcc/`.
4. Store the age private key, restic passwords, S3 credentials and notification tokens outside Git with restrictive permissions.
5. Review `systemd/` units and adjust paths if the installation prefix differs.
6. Run `scripts/atmed-bcc-install --config-dir /etc/atmed-bcc --prefix /opt/atmed-bcc` in dry-run mode first. Add `--execute` only after reviewing the plan.
7. Enable services manually after operator review; installation helpers never auto-start backups.
