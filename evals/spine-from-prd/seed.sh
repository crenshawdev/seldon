#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-from-prd/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief and PRD for a one-person project, and no spine yet.
mkdir -p .planning/seldon
cp "$repo/samples/spine-from-prd/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-from-prd/prd.md" .planning/seldon/prd.md
