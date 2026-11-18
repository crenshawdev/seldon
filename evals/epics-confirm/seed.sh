#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-confirm/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# All four documents, since the history's last turn just wrote the epics.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
