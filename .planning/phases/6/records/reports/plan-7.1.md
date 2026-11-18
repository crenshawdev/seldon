PLAN CHECKPOINT: human-verify
Plan: /code/seldon/.planning/phases/6/PLAN-7.md
Tasks: 1 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Add the repair log's brief, PRD and Toolshed's code | 25d3799 | samples/spine-conventions/{brief,prd}.md and code/{server.mjs,fly.toml,src/tools.mjs,src/catalog.mjs,.env}. Token `plinkward`, one line of src/tools.mjs: `// Only this plinkward module changes a tool's record; everything else reads them.` (who owns shared data; SHELF-01 makes the repair log touch tool records). Every `> ` line in the brief and PRD is a substring of the dump (node check, 0 misses); no `> ` line names a stack or host; members-report refusal left out so nothing reads as outside input. Verify, all as predicted: (1) --brief and --prd exit 0 with their conforms lines; (2) token grep lists only code/src/tools.mjs; (3) node --check 0 on all three .mjs; (4) validate --strict exit 0 (ICON_MISSING directory warning only), `check.mjs samples` exit 0, node --test 88/88; (5) FAKE grep lists only code/.env (one line, `cat -A` shows no stray bytes), check-ignore exit 1, ls-files mode 100644. Lint/typecheck: detect-commands null for both, none to run. Lease ok (7 staged, 23 declared). No deletions |
| 2 - Add the spine-who-relies case (in progress, stopped at verify 3) | 77aa9c7 | Case files committed: case.yaml (scaffold_script: seed.sh, max_turns 20, timeout_seconds 600, [Skill, Read, Glob, Grep]), prompt.md `/seldon spine`, seed.sh (mode 100755), graders asks-who-relies (spine-job's asks-unattended form, words `grep -cxF` 1 in SKILL.md), no-write and no-edit (copies of spine-job's). Only `scaffold_script: seed.sh` says scaffold; no double-quoted backslash. Verify (1) scaffold.test 4/4 pass. (2) D-21, pattern read from the grader file over scratch inputs: matches the question on its own line (alone, and with a line after); rejects one word changed (`repository`), the unattended question alone, and the question mid-line. Lint/typecheck null. Lease ok (6 staged, 23 declared). No deletions. Verify (3) the seed vet: CHECKPOINT, see below. Verify (4)-(6) not run yet |

Checkpoint (Task 2, verify 3, the seed vet). evals/spine-who-relies/seed.sh at 77aa9c7 (blob 95de252, mode 100755):

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/spine-who-relies/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, the repair log's confirmed brief and PRD, and no spine yet.
mkdir -p .planning/seldon
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/spine-conventions/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-conventions/prd.md" .planning/seldon/prd.md

# Toolshed's code as already built, at the project root.
cp -R "$repo/samples/spine-conventions/code/." .
```

Source state checked by this executor at 77aa9c7: `find samples/cadence-project samples/spine-conventions -type l` is empty. samples/cadence-project/planning/ holds exactly PROJECT.md (38319dd), ROADMAP.md (57331c8), STATE.md (0da660a), no seldon/ entry. samples/spine-conventions/code/ holds exactly .env (6c92d6d), fly.toml (a8fa9b9), server.mjs (d7211e6), src/catalog.mjs (19fbf92), src/tools.mjs (bb88fbe), all mode 100644, no seldon/ or .planning entry. code/.env is a regular file, 39 bytes, one line `TOOLSHED_ADMIN_TOKEN=FAKE-not-a-secret` plus its newline.

Deviations: none
Open items: none
