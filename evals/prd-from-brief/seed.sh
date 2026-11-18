#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-from-brief/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief whose quotes name a framework, a database and a host, and nothing else.
mkdir -p .planning/seldon
cp "$repo/samples/prd-from-brief/brief.md" .planning/seldon/brief.md
