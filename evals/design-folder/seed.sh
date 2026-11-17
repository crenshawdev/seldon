#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/design-folder/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Copy the design fixture into the run's empty workspace, and nothing else.
mkdir -p docs/design
cp -R "$repo/samples/design/." docs/design/
