#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
printf 'Re-run the installer in dry-run mode before applying an upgrade.\n'
exec "$SCRIPT_DIR/install.sh" "$@"
