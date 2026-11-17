#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-outside-input/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief and PRD whose design takes reports from the public and runs nothing unattended, and no spine yet.
mkdir -p .planning/seldon
cp "$repo/samples/spine-outside-input/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-outside-input/prd.md" .planning/seldon/prd.md
