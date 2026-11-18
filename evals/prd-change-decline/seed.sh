#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-change-decline/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief, PRD and spine that agree, since the history just reran the PRD and changed nothing.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
