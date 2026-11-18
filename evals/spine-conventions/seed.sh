#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-conventions/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, the repair log's confirmed brief and PRD, and no spine yet.
mkdir -p .planning/seldon
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/spine-conventions/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-conventions/prd.md" .planning/seldon/prd.md

# Toolshed's code as already built, at the project root.
cp -R "$repo/samples/spine-conventions/code/." .
