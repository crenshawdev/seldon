#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/handoff-cadence/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and Toolshed's finished design at the top of .planning/seldon/.
mkdir -p .planning/seldon
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
