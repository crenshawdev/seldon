PLAN CHECKPOINT: human-verify
Plan: /code/seldon/.planning/phases/6/PLAN-5.md
Tasks: 0 of 2
| Task | Commit | Note |
|---|---|---|
| 1 - Add the which-design case (files) | f28d989 | case.yaml (scaffold_script: seed.sh only, no history, max_turns 10, timeout_seconds 300, [Skill, Read, Glob, Grep]), prompt.md `/seldon`, seed.sh (mkdir -p .planning/seldon/sowlist, four cp from samples/ to .planning/seldon/, cp samples/spine-job/brief.md to .planning/seldon/sowlist/brief.md), graders asks-which-design (regex on last_message, says-later-release form, question copied from SKILL.md, `grep -cxF` count 1), no-write and no-edit (copied from spine-job). Verify (1) scaffold.test 4/4 pass, as predicted; only `scaffold_script: seed.sh` says scaffold, no double-quoted backslash. Verify (2) D-21, pattern read from the grader file over scratch inputs: matches a message ending on the question; rejects text after it and the later-release line ending, as predicted. Lint and typecheck: detect-commands returns null for both, none to run. Lease check ok (6 staged, 13 declared). Verify (3)-(5) pending: seed vet checkpoint below, then the which-design and resume runs |
| 2 - Add the which-design-answer case (files) | 5331e96 | case.yaml (history_file: history.jsonl, scaffold_script: seed.sh, max_turns 20, timeout_seconds 600, [Skill, Read, Glob, Grep]), prompt.md `/seldon sowlist`, seed.sh (Task 1's lines; only the comment naming the case folder differs), history.jsonl (2 lines, cwd /tmp/seldon-which-design-answer, fresh sessionId; user `/seldon`, then an assistant turn of one sentence naming the design at the top of `.planning/seldon/` and the one in `.planning/seldon/sowlist/`, then the which-design question last), graders names-brief-first (resume's pattern with both paths moved into sowlist/; the only diff from resume's) and writes-prd (file_exists .planning/seldon/sowlist/prd.md). Verify (1) scaffold.test 4/4 pass; history 2 lines parse, parentUuid chained, one sessionId; last text line is the question, `grep -cxF` count 1 in SKILL.md and in the extracted text; case rules hold. Verify (2) D-21 over hand-made trace lines: matches the sowlist resume line then a Write to .planning/seldon/sowlist/prd.md (absolute and relative); rejects the top-level resume line, the sowlist line followed only by a Write to .planning/seldon/prd.md, and the Write coming before the line, all as predicted. Lint and typecheck null. Lease check ok (6 staged, 13 declared). Verify (3)-(4) pending: seed vet checkpoint below, then the which-design-answer run |

Checkpoint (Task 1 verify 3 and Task 2 verify 3, the seed vet, both seeds together as the dispatch asks):

evals/which-design/seed.sh at f28d989 (blob 49de044, mode 100755):

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/which-design/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Two designs: Toolshed's finished one at the top, and a Sowlist brief in its own folder.
mkdir -p .planning/seldon/sowlist
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
cp "$repo/samples/spine-job/brief.md" .planning/seldon/sowlist/brief.md
```

evals/which-design-answer/seed.sh at 5331e96 (blob 1b7e8a5, mode 100755), the same but for line 4:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/which-design-answer/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Two designs: Toolshed's finished one at the top, and a Sowlist brief in its own folder.
mkdir -p .planning/seldon/sowlist
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
cp "$repo/samples/spine-job/brief.md" .planning/seldon/sowlist/brief.md
```

Sources checked by this executor: no cp -R in either seed. samples/brief.md (77fc6ce), samples/prd.md (ba4f7d7), samples/spine.md (e773e99), samples/epics.md (2519db0) and samples/spine-job/brief.md (01b8208) are all regular files, mode 100644, tracked; `find samples -type l` is empty.

Deviations: none
Open items: none
