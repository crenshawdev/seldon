#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-rerun/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief that dropped reminders, next to the PRD drafted before it did.
mkdir -p .planning/seldon
cp "$repo/samples/prd-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
