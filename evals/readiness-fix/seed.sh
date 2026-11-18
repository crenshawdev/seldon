#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-fix/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design: every requirement on an epic, and E-02 spanning Loans and Repairs with no spine boundary between them.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness/epics.md" .planning/seldon/epics.md
