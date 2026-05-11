# Configuration

## Endpoint model

Each endpoint entry should define:

- `name`
- `ssh_alias`
- `role`
- `enabled`
- `include_paths`
- `exclude_patterns`
- `rpo`
- `rto`

## Provider model

Each provider entry should define:

- `name`
- `type`
- `remote_name`
- `repository_path`
- `enabled`
- `repository`

## Secrets

Keep secrets outside Git. Use `examples/secrets.example.env` and `examples/rclone.example.conf` as templates only.

## Retention baseline

- daily: 14
- weekly: 8
- monthly: 12
- yearly: 3
