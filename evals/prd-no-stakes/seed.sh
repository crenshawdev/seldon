#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-no-stakes/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief that never says who depends on it or what breaks.
mkdir -p .planning/seldon
cp "$repo/samples/prd-no-stakes/brief.md" .planning/seldon/brief.md
