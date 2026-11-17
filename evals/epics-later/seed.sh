#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-later/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# All three documents on disk, which is exactly when drafting epics is tempting.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
