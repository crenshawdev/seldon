#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-later/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Both documents on disk, which is exactly when drafting a spine is tempting.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
