# Restore Runbook

A backup is not considered healthy until restore-readiness is tested and documented.

## Mini restore

Purpose: quick periodic verification that backup content can be read and minimally restored.

Baseline flow:
1. Select representative endpoint/provider pair.
2. Run `scripts/atmed-bcc-restore-test --config-dir /etc/atmed-bcc` in dry-run mode first.
3. Execute approved mini restore and record pass/fail evidence.

## File restore

Purpose: recover one or more specific files for incident response without full service replacement.

Baseline flow:
1. Confirm requested files and authorized requester.
2. Restore into an isolated target path.
3. Verify file integrity and hand off through controlled channel.

## Service restore

Purpose: recover a complete service dataset/configuration to a controlled target and validate startup behavior.

Baseline flow:
1. Restore service data to staging host or isolated recovery target.
2. Apply required configuration and dependency material.
3. Validate service startup, data consistency and access controls.

## Full endpoint restore

Purpose: recover the complete endpoint scope (data + required configuration) and validate operational integrity.

Baseline flow:
1. Prepare endpoint replacement target and network/security prerequisites.
2. Restore all required datasets and configuration in documented order.
3. Run endpoint-level validation checks and capture recovery timing.

## Disaster recovery exercise

Purpose: rehearse cross-service recovery under realistic outage assumptions, capture timings, and document gaps.

Baseline flow:
1. Define DR scenario, success criteria and rollback conditions.
2. Execute coordinated restores for affected services/endpoints.
3. Produce an after-action report with remediation and ownership.
