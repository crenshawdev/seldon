#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-small/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief for one small switch, and no PRD yet, so /seldon prd drafts one.
mkdir -p .planning/seldon
cp "$repo/samples/switch/brief.md" .planning/seldon/brief.md
