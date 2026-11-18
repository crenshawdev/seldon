#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-job/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief and PRD whose design has a daily job and no outside input, and no spine yet.
mkdir -p .planning/seldon
cp "$repo/samples/spine-job/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-job/prd.md" .planning/seldon/prd.md
