#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-rerun/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Reminders are gone from the brief, PRD and spine, but the epics drafted before still hold E-03.
mkdir -p .planning/seldon
cp "$repo/samples/spine-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-rerun/prd.md" .planning/seldon/prd.md
cp "$repo/samples/epics-rerun/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
