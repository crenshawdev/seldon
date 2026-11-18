#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-answers/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# spine-job's confirmed brief and PRD, and no spine yet: the history already asked the spine's questions.
mkdir -p .planning/seldon
cp "$repo/samples/spine-job/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-job/prd.md" .planning/seldon/prd.md
