#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-rerun/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief and PRD that dropped reminders, next to the spine drafted before they did.
mkdir -p .planning/seldon
cp "$repo/samples/spine-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-rerun/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
