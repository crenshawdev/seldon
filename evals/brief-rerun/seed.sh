#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/brief-rerun/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The confirmed brief and the PRD built from it, so a rerun has a PRD it must leave alone.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
