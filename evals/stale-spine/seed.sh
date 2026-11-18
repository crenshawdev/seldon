#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/stale-spine/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The brief and PRD after reminders were dropped, next to the spine and epics built before that.
mkdir -p .planning/seldon
cp "$repo/samples/spine-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-rerun/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
