#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-past-project/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Toolshed under Cadence after v1.0, its REQUIREMENTS.md up to CAT-4, LOAN-07 and NFR-04, and a confirmed brief.
mkdir -p .planning/seldon
cp -R "$repo/samples/prd-past-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/brief.md
