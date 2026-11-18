#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/cadence-project/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and no .planning/seldon/ yet.
mkdir -p .planning
cp -R "$repo/samples/cadence-project/planning/." .planning/
