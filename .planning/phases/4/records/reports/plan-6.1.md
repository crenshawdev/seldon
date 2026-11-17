PLAN CHECKPOINT: decision
Plan: .planning/phases/4/PLAN-6.md
Tasks: 1 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Write architecture.md only on /seldon architecture | 8becc40 | `/seldon architecture` 3 hits, `architecture.md` 5 hits (0 before). §1 names `architecture` as a fifth name that isn't a step, matched the same way, routed first. With no spine it writes nothing and says the spine comes first (`/seldon spine` once there's a PRD, or a bare `/seldon`). With a spine it goes to the new "18. The architecture document": reads brief.md, prd.md and spine.md only, writes architecture.md expanding on every S- decision by ID, adds no decision or ID of its own and says why (`/cad-context` locks only S- IDs), never writes or edits the other three, no check and no command, a second request Reads then replaces it whole with Write, and it ends with no question. No other route writes it, including a confirm reply in other words. `argument-hint` adds `architecture`, `description` mentions the document on request, `<rules>` names architecture.md as written only on `/seldon architecture`, `allowed-tools` unchanged. tests/skill.test.mjs 2/2 pass. `claude plugin validate --strict .` exit 0 (the existing ICON_MISSING warning only). No lint or typecheck command (detect-commands: both null). |
| 2 - Name /seldon architecture at the spine's confirm | (uncommitted, awaiting Verify (4)) | §17's confirm stays one plain-prose question asking whether the user confirms the spine or wants changes, and that question now names `/seldon architecture`. A following paragraph says naming it writes nothing, and a typed `/seldon architecture` reply goes through the name test first. The brief's and PRD's confirms are unchanged. Verify (1): the §17-§18 range has 4 hits (0 before). Verify (2): the stop-point audit is below. Verify (3): skill.test.mjs 2/2, validate exit 0. Verify (4), the spine-from-prd rerun, is held for approval because it calls the model API. Commit follows a passing run. |
| 3 - Add the architecture-on-request case | (uncommitted, awaiting seed vet and run) | Files written: case.yaml (`scaffold_script: seed.sh`, max_turns 20, timeout_seconds 600, `[Skill, Read, Glob, Grep]`, and no "scaffold" in the description), prompt.md (`/seldon architecture`), seed.sh (mode 755), graders/writes-architecture.md (`file_exists`, `.planning/seldon/architecture.md`, the only grader). Verify (1) D-21: the grader's path is exactly `.planning/seldon/architecture.md`. The seed's only `cp` lines write brief.md, prd.md and spine.md, and `samples/` holds no architecture.md, so the seed can't satisfy the grader, and a run that writes no such file scores 0. Verify (2): scaffold.test.mjs 4/4 pass. Verify (3): seed vet pending (this checkpoint). Verify (4)-(5) pending. |

Stop-point audit (Task 2 Verify (2), the phase's last). Every place SKILL.md ends a turn on a question, and the §1 route that carries it on:
| Stop point | Where | Route in §1 |
|---|---|---|
| Dump ask (empty `$ARGUMENTS`, or `/seldon brief` with no brief) | §3, §1 `brief` | Dump given |
| Recommendation | §6 | Path chosen |
| Fast-path questions | §8 | Interview under way |
| Refusal re-ask after the fast-path answers | §8, §10 What it refuses | Interview under way ("asked again about What it refuses") |
| Coaching question, including a refusal re-ask during the walk | §9 | Interview under way |
| Brief reopen on `/seldon brief` | §1 `brief`, "Otherwise, reopen it" | Brief change answered (first way) |
| Refusal re-ask during a brief change | §10 The brief rerun | Brief change answered (second way) |
| Documents question | §2 "A dump when documents are there" | Documents question answered, and the name test's "After the documents question" for a `/seldon brief` reply |
| Brief confirm question | §11 | Step confirm answered (Confirms / Names changes) |
| PRD confirm question | §14 | Step confirm answered |
| Spine confirm question, now naming `/seldon architecture` | §17 | Step confirm answered; a typed `/seldon architecture` reply goes to the name test first |
| PRD questions, fresh and on a `/seldon prd` rerun | §12 | PRD questions answered (both branches) |
| Spine questions, fresh and on a `/seldon spine` rerun | §15 "The spine's questions" | Spine questions answered (both branches) |
Every row has a route. "18. The architecture document" and the no-spine `architecture` route have no row: both end without a question.

Seed to vet, /code/seldon/evals/architecture-on-request/seed.sh (mode 755), in full:
```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/architecture-on-request/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# A confirmed brief, PRD and spine, and no architecture.md, so only the request can make one.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
```

Eval runs awaiting approval, exactly two. Each runs from /code/seldon, one case at a time, and calls the model API. Each is followed by the Bash audit of its kept trace, then the kept `/tmp/claude-eval-*` folder is removed:
- `claude plugin eval . --case spine-from-prd --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"` (Task 2 Verify (4), AC5's negative half)
- the same with `--case architecture-on-request` (Task 3 Verify (4)), then, before removing the kept folder, the two workspace checks: every S- ID in samples/spine.md (S-01 to S-06) and no other appears in architecture.md, and `cmp` of the workspace spine.md against samples/spine.md.

Each case gets one scored run. A miss the trace shows is model variance gets a retry with no file changes, at most 3 tries per case. A miss that needs a grader, fixture or SKILL change stops at a checkpoint instead.
No `/tmp/claude-eval-*` folder exists now.
Commits on continuation: Task 2 (`feat(4-6): ...`, SKILL.md) after the spine-from-prd run passes, then Task 3 after its passing run. Then the full suite, `node --test tests/*.test.mjs` (the test step in .github/workflows/test.yml; `workflow.test_command` is null and there is no package.json).

Deviations: none
Open items: none
