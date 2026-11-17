#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/resume/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief on disk and no history, which is all a resume gets.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
