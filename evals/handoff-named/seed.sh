#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/handoff-named/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and one finished design in repair-log/ with nothing at the top of .planning/seldon/.
mkdir -p .planning/seldon/repair-log
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/repair-log/brief.md
cp "$repo/samples/prd.md" .planning/seldon/repair-log/prd.md
cp "$repo/samples/spine.md" .planning/seldon/repair-log/spine.md
cp "$repo/samples/epics.md" .planning/seldon/repair-log/epics.md
