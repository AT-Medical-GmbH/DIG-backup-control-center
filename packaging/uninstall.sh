#!/usr/bin/env bash
set -euo pipefail
PREFIX="/opt/atmed-bcc"
if [[ $# -gt 0 ]]; then
  PREFIX="$1"
fi
printf 'Remove %s manually after stopping services and backing up local state.\n' "$PREFIX"
