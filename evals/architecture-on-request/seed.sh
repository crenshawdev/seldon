#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/architecture-on-request/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief, PRD and spine, and no architecture.md, so only the request can make one.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
