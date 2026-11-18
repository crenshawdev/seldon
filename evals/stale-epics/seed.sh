#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/stale-epics/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The spine was rewalked without reminders and confirmed, but the epics were built from the spine before that.
mkdir -p .planning/seldon
cp "$repo/samples/spine-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-rerun/prd.md" .planning/seldon/prd.md
cp "$repo/samples/epics-rerun/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
