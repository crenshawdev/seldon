#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-no-boundary/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The split case's brief and PRD, with a spine that has no boundary to cut Lettings.
mkdir -p .planning/seldon
cp "$repo/samples/epics-split/brief.md" .planning/seldon/brief.md
cp "$repo/samples/epics-split/prd.md" .planning/seldon/prd.md
cp "$repo/samples/epics-no-boundary/spine.md" .planning/seldon/spine.md
