#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-no-spine/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief and PRD and no spine, so the epics step has nothing to build from.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
