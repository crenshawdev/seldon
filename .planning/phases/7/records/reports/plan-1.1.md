PLAN CHECKPOINT: decision
Plan: /code/seldon/.planning/phases/7/PLAN-1.md
Tasks: 0 of 1
| Task | Commit | Note |
|---|---|---|
| 1 - Measure whether SKILL.md loads whole at phase 7's size | none | Stopped at the SECURITY checkpoint before any pad or run, as the plan requires. Pre-checks: branch cadence/phase-7-plan-1 created from 77e8e63; `wc -c skills/seldon/SKILL.md` = 65786 (matches D-19). Nothing padded, nothing run. |

SECURITY - owner approval needed for phase 7's eval runs (none on record):
- Runs covered: this plan's one probe run (`no-dump`, SKILL.md padded to >= 90,000 bytes in the main tree and restored after); the per-case runs in Plans 5 and 7; Plan 8's full-suite run (README command verbatim plus `--keep-temp` before `--allow-tools`), with a second full run only on a trace-shown model-variance miss, two full runs at most.
- How: from /code/seldon (main tree, never a worktree), per-case command `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`.
- Bash audit after every run; allowed: `node /code/seldon/lib/check.mjs` with --brief/--prd/--spine/--epics/--stale on .planning/seldon, .planning/seldon/repair-log or .planning/seldon/sowlist. Separate question: does the owner re-approve phase 6 Plan 7's ruling (permission-layer read-only list/read commands inside the sandbox, no-secret grader passing) for phase 7?
- Retries: at most three per case, only after a fix or a trace-shown model-variance miss. Cleanup by exact printed kept paths only, never a glob.

Routing problem the answer must also settle: this executor is a workflow worktree executor, and its rules forbid any write into the main tree (the host refuses it). The probe pads /code/seldon/skills/seldon/SKILL.md and runs the eval from /code/seldon. So even with approval this executor cannot perform the pad, run or restore. Either the main session runs the probe itself (pad, run, transcript read, restore, kept-folder removal) and records the result, or the continuation dispatch must explicitly carry a main-tree grant for this one file and command.

Deviations: none
Open items: none
