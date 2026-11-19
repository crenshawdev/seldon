#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/epics-small/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief, PRD and spine for one small switch, and no epics yet, so /seldon epics drafts them.
mkdir -p .planning/seldon
cp "$repo/samples/switch/brief.md" .planning/seldon/brief.md
cp "$repo/samples/switch/prd.md" .planning/seldon/prd.md
cp "$repo/samples/switch/spine.md" .planning/seldon/spine.md
