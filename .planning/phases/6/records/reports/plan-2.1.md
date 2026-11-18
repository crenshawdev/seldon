PLAN CHECKPOINT: human-verify
Plan: /code/seldon/.planning/phases/6/PLAN-2.md
Tasks: 3 of 4
| Task | Commit | Note |
|---|---|---|
| 1 - Say what Cadence's files mean to a run | 0b5d382 | One added paragraph at the head of "2. Where a run starts"; verify (1)-(4) as predicted: one paragraph, count 1, 0 removed lines, skill.test 2/2, validate exit 0 |
| 2 - Add Toolshed's Cadence files as a fixture | a474f28 | samples/cadence-project/planning/{PROJECT,ROADMAP,STATE}.md; verify (1) all three open with `# `; verify (2) first run found 1 shared line (`**Depends on:** Nothing (first phase)`) from my own draft, reworded, re-run 0 |
| 3 - Add the cadence-project case | 797e541 | Case files committed in the worktree run, merged at ba6055d. Verify (1) scaffold.test 4/4; (2) history 2 lines parse, parentUuid chained; (3) D-21 all hold (no-write-outside matches Write to .planning/PROJECT.md, .planning/seldon/x/brief.md, .planning/seldon/../STATE.md, not .planning/seldon/brief.md relative or absolute; runs-check matches `--brief .planning/seldon`, not `--prd`; check-passes rejects `seldon check: prd.md conforms`). (4) seed vetted, (5) SECURITY approval recorded, see Checkpoint outcome below. (6) Try 1 of 3 from /code/seldon at ba6055d with the plan's command and exactly the two grants: exit 0, score 1.00, 5/5 graders, no `not granted`, no `scaffold failed`, $0.48, 21s. Bash audit of out/trace.jsonl: one Bash call, `node /code/seldon/lib/check.mjs --brief .planning/seldon`, within terms. Tools used: Write 1 (to .planning/seldon/brief.md), Bash 1, no Edit. Kept workspace: `node lib/check.mjs --brief <kept>/sealed/home/cwd/.planning/seldon` exit 0 (`seldon check: brief.md conforms`); cmp of PROJECT.md, ROADMAP.md and STATE.md against samples/cadence-project/planning/ all exit 0; .planning/seldon/ holds brief.md only. Cleanup: removed /tmp/claude-eval-b9XRJ8 by exact path, confirmed gone. Results report under evals/results/ is gitignored (evals/.gitignore:1) |
| 4 - Add the cadence-dump case (IN PROGRESS) | 18a8dc3 | Case files committed: case.yaml (scaffold_script: seed.sh only, no history, max_turns 10, timeout_seconds 300, [Skill, Read, Glob, Grep]), prompt.md, seed.sh, graders recommends-fast-path/no-write/no-edit. Verify (1) scaffold.test 4/4 pass, `cmp evals/cadence-dump/seed.sh evals/cadence-project/seed.sh` exit 0 (same blob 804045b, mode 100755); the three graders cmp 0 against evals/fast-path/graders/. (2) prompt after `/seldon ` equals history line 1's user message after `/seldon `: true. (3) D-21, pattern read from recommends-fast-path.md over scratch inputs: matches `Recommended path: fast path` on its own line, rejects `Recommended path: coaching` and `Project already initialized.` Case rules: only `scaffold_script: seed.sh` says scaffold, no double-quoted backslash. Lint and typecheck: detect-commands returns null for both, none to run. Lease check ok (6 staged, 19 declared). PENDING: (4) seed.sh vetting, (5) the run, Bash audit, check that the kept workspace holds no .planning/seldon/, cleanup of the kept folder |

Checkpoint outcome (Task 3, verify 4 and 5), as the coordinator's continuation dispatch carried it:
- Seed: the coordinator vetted evals/cadence-project/seed.sh at 797e541 against the plan's seed rule, and the owner's delegate cleared it. Its cp -R source, samples/cadence-project/planning/, holds exactly PROJECT.md, ROADMAP.md and STATE.md, mode 100644, no symlinks and no seldon/ entry (re-checked by this executor before the run: same three files, no symlink). That source check now applies to every new seed: a symlink or a .planning/seldon entry in any cp -R source is a SECURITY checkpoint.
- SECURITY: per the coordinator, the owner approved phase 6's eval runs directly in the coordinator's session on 2026-11-18 (UTC; 2026-11-17 local), on PLAN-2.md's Context terms: the per-case runs Plans 2, 4, 5 and 7 make, plus Plan 8's one full-suite run, from /code/seldon only, with exactly the two grants, the Bash audit after every run, at most three tries per case, and cleanup by exact kept path. The owner's delegate (Daneel) also ruled it approved, logged at /code/cadence/.planning/drafts/overnight-2026-11-17-daneel.md (ruling 1, read by this executor and consistent with the terms above).

Checkpoint (Task 4, verify 4): seed.sh to vet, evals/cadence-dump/seed.sh as committed in 18a8dc3 (mode 100755, blob 804045b, byte-identical to the vetted evals/cadence-project/seed.sh at 797e541):

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/cadence-project/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and no .planning/seldon/ yet.
mkdir -p .planning
cp -R "$repo/samples/cadence-project/planning/." .planning/
```

Its cp -R source is the same samples/cadence-project/planning/ the Task 3 check cleared, unchanged at HEAD: PROJECT.md (38319dd), ROADMAP.md (57331c8), STATE.md (0da660a), all 100644, no symlinks, no seldon/ entry. The run that follows is a per-case run under the approval above.

Deviations: none
Open items: evals/cadence-dump/seed.sh's first comment names evals/cadence-project/, because Verify (1) requires the file byte-identical to Task 3's seed. The statement it makes (two levels up) is true for both folders. Rewording it in both seeds would need a second vetting, so it is left as is.
