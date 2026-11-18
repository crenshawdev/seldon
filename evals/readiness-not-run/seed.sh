#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-not-run/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# All four documents are on disk, so a bare /seldon lands on a readiness check it can't start.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
