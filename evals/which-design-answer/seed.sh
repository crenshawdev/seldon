#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/which-design-answer/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Two designs: Toolshed's finished one at the top, and a Sowlist brief in its own folder.
mkdir -p .planning/seldon/sowlist
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
cp "$repo/samples/spine-job/brief.md" .planning/seldon/sowlist/brief.md
