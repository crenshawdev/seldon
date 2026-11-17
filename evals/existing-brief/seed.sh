#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/existing-brief/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Put a finished brief where /seldon looks for one, and nothing else.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
