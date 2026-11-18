#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-open-decision/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design with Repairs split from Lending, so nothing crosses, and no spine decision says how a checkout learns a tool is logged broken.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness-open-decision/epics.md" .planning/seldon/epics.md
