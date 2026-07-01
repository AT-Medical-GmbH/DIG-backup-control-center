# Vendored ATMED Footer

This directory contains a local vendored copy of the centrally maintained ATMED footer used by the Backup Control Center dashboard.

## Source of truth

The source is maintained outside this app, currently documented as:

- `ATMED-assets/shared/atmed-footer`
- Build/deploy process: `build + deploy-footer`

Do **not** hand-edit the generated footer artifacts in this directory.

## Current vendored version

See `footer.version.json` for machine-readable provenance.

Current recorded metadata at the time this note was added:

- Name: `atmed-global-footer`
- Version: `1.0.0+2026-06-30.0d95b89ea2ce`
- Content hash: `0d95b89ea2ce`
- Build date: `2026-06-30T16:14:44.650Z`

## Update rule

When refreshing the vendored copy:

1. Replace all generated artifacts together, not individually.
2. Verify `footer.version.json` changed consistently.
3. Review the diff for unexpected script or external-resource additions.
4. Keep dashboard rendering tolerant of a missing footer so BCC never fails because of branding assets.
