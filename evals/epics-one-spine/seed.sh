#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-one-spine/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Two designs, and only Toolshed's at the top holds a spine, so /seldon epics has one design to take.
mkdir -p .planning/seldon/sowlist
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/spine-job/brief.md" .planning/seldon/sowlist/brief.md
