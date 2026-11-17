#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/brief-rerun-dump/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Just the confirmed brief, the one the new dump is about to change.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
