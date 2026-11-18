PLAN CHECKPOINT: human-verify
Plan: .planning/phases/6/PLAN-4.md
Tasks: 0 of 2 (Task 1 committed, verify 3 to 6 outstanding)
| Task | Commit | Note |
|---|---|---|
| 1 - Add the new-design-name case (in progress) | 02d66b6 | Case files committed: case.yaml (scaffold_script: seed.sh, no history, max_turns 10, timeout_seconds 300, [Skill, Read, Glob, Grep]), prompt.md, seed.sh (mode 100755, blob 9ff676c), graders asks-for-name, no-write and no-edit (the last two copied from evals/spine-job/graders/). prompt.md is history line 1's user message from evals/cadence-project/history.jsonl, `/seldon ` included, plus a newline; it equals cadence-dump's prompt after `/seldon `. Verify (1) `node --test tests/scaffold.test.mjs` 4/4 pass. (2) D-21, pattern read from asks-for-name.md over scratch inputs: matches the name line followed by the documents question; rejects the documents question alone, the name line with `short` changed to `brief`, and the name line run into a sentence. The name line in the grader is the one whole line in SKILL.md (count 1). Case rules: only `scaffold_script: seed.sh` says scaffold, no double-quoted backslash. Lint and typecheck: detect-commands returns null for both, none to run. Lease check ok (6 staged, 16 declared). No deletions in the commit. (3) Seed vet: CHECKPOINT, waiting on the coordinator. Seed sources checked: samples/cadence-project/planning/ holds PROJECT.md, ROADMAP.md, STATE.md, regular files, mode 644, `find -type l` empty, no seldon entry; samples/brief.md, prd.md, spine.md, epics.md regular files, mode 644. (4)-(6) not yet run. |

The seed for the coordinator's vet (evals/new-design-name/seed.sh at 02d66b6):

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/new-design-name/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and Toolshed's finished design at the top of .planning/seldon/.
mkdir -p .planning/seldon
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
```

Deviations: none
Open items: none
