#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-reads-brief/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The brief as the user left it after editing it by hand, and no PRD yet.
mkdir -p .planning/seldon
cp "$repo/samples/prd-reads-brief/brief.md" .planning/seldon/brief.md
