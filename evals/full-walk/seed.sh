#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/full-walk/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The brief, PRD and spine the history confirmed, and no epics yet.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
