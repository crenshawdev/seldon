PLAN CHECKPOINT: decision
Plan: /code/seldon/.planning/phases/7/PLAN-7.md
Tasks: 0 of 6
| Task | Commit | Note |
|---|---|---|
| 1 - Add the prd-conflict case | none yet | Stopped at Verify 3, the seed vet. All 7 lease files are written and uncommitted. Verify 1: `node --test tests/scaffold.test.mjs` 4 pass, 0 fail. Verify 2 (D-21, plain node, no flags, as the frontmatter declares none): names-decision passes on S-03 and fails on S-01 only and on S-031; ends-on-question passes on the question (and with a closing fence after it) and fails on text after it and on `now` in place of `anyway`. no-write and no-edit are byte copies of resume-later's. The conflict question is copied from SKILL.md:868. |
| 2 - Add the prd-conflict-decline case | none yet | Stopped at Verify 3. All 7 lease files written. Verify 1: scaffold test 4/0; the history parses, 2 lines (user, assistant), text-only, `parentUuid` chained, a sessionId no other history uses, cwd `/tmp/seldon-prd-conflict-decline`. Verify 2: says-decline-line passes on the brief decline line (SKILL.md:195) and fails on the nothing-changed line and on the brief decline line followed by `Anything else?`. The history's report names S-03, says what it states and quotes (`> a reminder when something's due`) and that the change retires LOAN-03, and it also names the rest of the change worked out from these files (the new refusal into Non-goals with its quote, MVP scope no longer naming LOAN-03; the same diff as samples/spine-rerun/prd.md against samples/prd.md). That way the go-ahead in Task 3, which reworks the change from the files under SKILL.md:179-183, finds the same change the report described rather than taking the changed-since branch. |
| 3 - Add the prd-conflict-apply case | none yet | Stopped at Verify 3. All 8 lease files written. Verify 1: scaffold test 4/0; the history chains and is text-only. A `node -e` comparison with Task 2's parsed history, dropping only sessionId, cwd, uuid and parentUuid, shows every other field equal. The stamp `Built from: brief.md sha256:38cbca64db3f39c8` is from `--stale` over a scratch folder seeded as seed.sh seeds (it printed `stale: prd.md was built from an earlier brief.md`, exit 1). Verify 2: stamps-brief-hash and retires-dropped-id each fail on samples/prd.md and pass on samples/spine-rerun/prd.md; ends-on-confirm passes on `Do you confirm this PRD, or do you want changes?` and fails on the conflict question and on a confirm question followed by a non-question line; check-passes is a byte copy of prd-from-brief's and retires-dropped-id of prd-rerun's. case.yaml has max_turns 20, timeout 600. |
| 4 - Add the prd-change-conflict case | none yet | Stopped at Verify 2, the seed vet. All 8 lease files written. Verify 1: scaffold test 4/0; the history chains (2 lines, text-only); `cmp` shows names-decision.md, ends-on-question.md, no-write.md and no-edit.md equal to Task 1's. `--stale` and `--prd` over the fresh seed: `seldon check: no stale link` and `seldon check: prd.md conforms`, both exit 0. |
| 5 - Add the prd-change-decline case | none yet | Stopped at Verify 3. All 8 lease files written. Verify 1: scaffold test 4/0; the history is 4 lines (u, a, u, a), chained and text-only; its first two lines equal Task 4's but for sessionId, cwd and uuids, and line 3 is Task 4's prompt. Verify 2: says-decline-line passes on the nothing-changed line (SKILL.md:199) and fails on the brief decline line; no-brief-command (not_contains `/seldon brief`) matches the brief decline line, so the grader fails it, and passes the nothing-changed line. |
| 6 - Add the stale-prd case | none yet | Stopped at Verify 3. All 9 lease files written. Verify 1: scaffold test 4/0. Verify 2: says-stale-line (the PRD stale line, SKILL.md:340, then a Read of prd.md, in names-brief-first's form with stale-spine's skip-leading-keys input clause) passes on a hand-made trace of Glob, `--stale`, the line, Read prd.md, and fails on the spine stale line instead, on the PRD resume line instead, and on the line with no Read of prd.md after it. no-epics-line (not_contains, the epics resume line's opening `I.m building the epics from \.planning/seldon/spine\.md` in an assistant text, SKILL.md:390) matches a trace saying that line, so the grader fails it. The four shared graders are byte copies of Task 1's. 43 of 43 D-21 checks came out as expected across the plan. |

Seed vet (standing rule 3): all six seed.sh files are written; none has run. Each is quoted whole below. Two contents only: Tasks 1, 2, 3 and 6 carry the shared conflict seed, Tasks 4 and 5 the fresh one, and each file differs from its sibling only in the folder comment.

evals/prd-conflict/seed.sh - git hash-object 859e0c85139dfcd577a22b0057f377ee51e1f1f0, mode 100755, 11 lines, 445 bytes:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-conflict/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief that dropped reminders, next to the PRD and spine built before it did.
mkdir -p .planning/seldon
cp "$repo/samples/prd-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

evals/prd-conflict-decline/seed.sh - git hash-object 6dbf79b72f0481f70e14c1c961691b3ad0453bb0, mode 100755, 11 lines, 453 bytes:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-conflict-decline/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief that dropped reminders, next to the PRD and spine built before it did.
mkdir -p .planning/seldon
cp "$repo/samples/prd-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

evals/prd-conflict-apply/seed.sh - git hash-object 2cef077b7207fbc34b6e210827481aecd3b8921d, mode 100755, 11 lines, 451 bytes:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-conflict-apply/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief that dropped reminders, next to the PRD and spine built before it did.
mkdir -p .planning/seldon
cp "$repo/samples/prd-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

evals/prd-change-conflict/seed.sh - git hash-object d6258da7f90746bd31b11e2cdd802ccda2477b11, mode 100755, 11 lines, 456 bytes:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-change-conflict/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief, PRD and spine that agree, since the history just reran the PRD and changed nothing.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

evals/prd-change-decline/seed.sh - git hash-object 87df88b5a2543cba5332b0ccadc1a190586d6c50, mode 100755, 11 lines, 455 bytes:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/prd-change-decline/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief, PRD and spine that agree, since the history just reran the PRD and changed nothing.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

evals/stale-prd/seed.sh - git hash-object 3fa61e2af0e63c52a8115d64618bdb0901dcbd37, mode 100755, 11 lines, 442 bytes:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/stale-prd/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A brief that dropped reminders, next to the PRD and spine built before it did.
mkdir -p .planning/seldon
cp "$repo/samples/prd-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

Deviations: none
Open items: none
