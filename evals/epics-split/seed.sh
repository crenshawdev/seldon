#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-split/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief, PRD and spine whose one category is over the limit, and no epics yet.
mkdir -p .planning/seldon
cp "$repo/samples/epics-split/brief.md" .planning/seldon/brief.md
cp "$repo/samples/epics-split/prd.md" .planning/seldon/prd.md
cp "$repo/samples/epics-split/spine.md" .planning/seldon/spine.md
