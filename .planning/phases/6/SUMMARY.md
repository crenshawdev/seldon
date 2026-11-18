---
phase: 6
status: complete
completed: 2026-11-18
---

# Phase 6: Existing projects and design folders - Summary

`/seldon` now runs on a project already under Cadence (`.planning/PROJECT.md` present) without touching Cadence's files. It puts each later body of work in its own folder, `.planning/seldon/<name>/`, asks which design to use when there are several, and on a project under Cadence the spine step reads the existing code, records its conventions as quoted S- decisions and asks who relies on what today. Eight new eval cases prove it, and the full 40-case suite scores 1.00.

## What shipped

- The format for named designs and code quotes. Each later body of work lives in `.planning/seldon/<name>/`, and the code is the spine's third quote source. Lives in `docs/FORMAT.md` (cd4b679, 3d9d9d9).
- Projects under Cadence. Cadence's planning files don't change where a run starts, and the brief and PRD steps never read them. Lives in `skills/seldon/SKILL.md` §2 (0b5d382, 041d106), with the fixture `samples/cadence-project/planning/`.
- Designs and the working folder. A dump that lands on a finished design asks for a short folder name, a run with several designs asks which one, and the answer routes back to the step. Lives in `skills/seldon/SKILL.md` §1 and §2 (3ada0c2, 61c91d6, 83b901f, 9fe9a7b, a9c347d).
- The spine on a project under Cadence. It reads the existing code and records conventions as decisions of the six kinds, each quoting the code with its file. It takes a stack or host the code settles as settled, and always asks who relies on what today. It reads code with Read, Glob and Grep only, and keeps `.env*`, key and credential files out of every tool, including any Grep over a folder. Lives in `skills/seldon/SKILL.md` §15 (dde809f, 7d970cc, 1ed64c5, 1917904, bb0fd64, 43f29ef, 444fc4f, 7304538).
- Eval cases: `cadence-project`, `cadence-dump`, `new-design-name`, `new-design-brief`, `which-design`, `which-design-answer`, `spine-who-relies` and `spine-conventions`, under `evals/`. Their fixtures are in `samples/cadence-project/` and `samples/spine-conventions/`, the latter holding one fake credential line in `code/.env`.
- The README says what `/seldon` does on a project under Cadence and with more than one design, lists all 40 cases, and states the grant as it is (c614806, 93fef3e, 8483cd7).

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | cd4b679 | Name `.planning/seldon/<name>/` in the format's location, architecture and check sections |
| 1 | 2 | 3d9d9d9 | Make the code the spine's third quote source, with an S-02 example quoting `(src/db.js)` |
| 2 | 1 | 0b5d382 | SKILL.md §2: Cadence's files don't change where a run starts |
| 2 | 2 | a474f28 | Add Toolshed's Cadence files as a fixture |
| 2 | 3 | 797e541 | Add the cadence-project case (merged at ba6055d) |
| 2 | 4 | 18a8dc3 | Add the cadence-dump case |
| 2 | fix | 041d106 | Diff-review finding 1: a design folder still enters at the brief on a Cadence project |
| 3 | 1 | 3ada0c2 | Give each design a folder, and settle a run's working folder first |
| 3 | 2 | 61c91d6 | Ask for a new design's name when a dump lands on a design |
| 3 | 3 | 83b901f | Ask which design when there are several |
| 3 | fix | 9fe9a7b | Diff-review finding 1: keep the documents question after a rejected name with one design |
| 3 | fix | a9c347d | "Rerun the brief" takes its change from the dump turn after a name retry |
| 4 | 1 | 02d66b6 | Add the new-design-name case |
| 4 | 2 | 4b222ce | Add the new-design-brief case |
| 5 | 1 | f28d989 | Add the which-design case |
| 5 | 2 | 5331e96 | Add the which-design-answer case |
| 6 | 1 | dde809f | Read the existing code at the spine step on a project under Cadence |
| 6 | 2 | 7d970cc | Record the code's conventions as decisions of the six kinds |
| 6 | 3 | 1ed64c5 | Quote a convention from its file |
| 6 | 4 | 1917904 | Take a stack or host the code settles as settled |
| 6 | 5 | bb0fd64 | Ask who relies on what today |
| 6 | fix | 43f29ef | Diff-review finding 1: keep secret files and credential lines out of the code reading |
| 7 | 1 | 25d3799 | Add the repair log's brief and PRD and Toolshed's code, with the token `plinkward` and the fake `code/.env` |
| 7 | 2 | 77aa9c7 | Add the spine-who-relies case |
| 7 | 2 | 8faa2ac | Add a no-secret grader to spine-who-relies (seed-vet ruling) |
| 7 | 2 | 444fc4f | SKILL.md §15: read code with Read, Glob and Grep only, and close secret files to every tool |
| 7 | 3 | f1100ea | Add the spine-conventions case |
| 7 | 3 | 0d949a7 | Pin both no-secret graders to the trace's first character |
| 7 | fix | 7304538 | Risk-surface fix: secret files kept out of any Grep over a folder |
| 7 | fix | 07f1437 | Diff-review fix: spine-who-relies fails if the turn also asks the trust, unattended or failure question |
| 8 | 1 | c614806 | README: projects under Cadence, named designs, which design, the spine reading code |
| 8 | 2 | 93fef3e | README: list all 40 cases, and reword the grant sentence |
| 8 | fix | 8483cd7 | Diff-review fix: README.md:51 says the spine step is told to read code without a shell |

34 commits from 6757b36 to 8483cd7: 33 task and fix commits, plus the merge ba6055d.

## Deviations

- [deviation] Plan 5: the which-design-answer seed differs from which-design's in line 4's comment only, which names its own case folder. The plan said "the same lines", and Daneel accepted it as the command lines (5331e96).
- [deviation] Plan 7: the spine-who-relies seed copies `code/.env` into the run, so on the seed-vet ruling it gained the no-secret grader the plan gave only spine-conventions, and the lease grew to cover it (8faa2ac).
- [deviation] Plan 7: spine-who-relies try 1 ran the off-terms Bash call `git ls-files; ls -la`. The sandbox refused git, and `ls` listed the workspace. The fake value was not read. On Daneel's security ruling, SKILL.md §15 now says to read code with Read, Glob and Grep only, never a shell command, and the secret rule closes every tool and command (444fc4f).
- [deviation] Plan 7: try 2, with that text loaded, ran the same listing, which Claude Code accepted as read-only (`subcommandResults`). The skill text alone doesn't stop it. John ruled "1", which widens the Bash audit: besides the check.mjs commands, a read-only listing the permission layer accepted inside the sandbox is allowed, as long as the case's no-secret grader passes. PLAN-7.md's audit term was amended, and try 2 stands.
- [deviation] Plan 7: the check.mjs call also carries `subcommandResults`, not `rule`, so the permission record alone can't tell a grant from a read-only acceptance. The audit judges each command by its text.
- [deviation] Plan 7: both no-secret patterns `^(?![\s\S]*FAKE-not-a-secret)` passed a leaked trace under the `m` flag. Their D-21 checks had run as plain node regexes. Both now start `^(?<![\s\S])`, which holds with or without `m`, and D-21 was redone under both (0d949a7). spine-who-relies wasn't rerun, because its passing trace had 0 hits.
- [deviation] Plan 7: the blocking risk_surface review over 43f29ef..0d949a7 found a medium. The secret rule gave no way to keep a folder-wide content Grep, which searches hidden files, from returning a `.env` line. John chose to fix it now: one sentence makes such a Grep exclude `.env*`, `*.pem` and `*.key` with its glob (7304538). All three spine cases, the size check, the suite and strict validate were rerun, all passing.
- [deviation] Plan 7: the narrowed re-review of 7304538 left one low: the glob list is only examples, and misses files like `credentials.json`, `id_rsa` or `.npmrc`. John chose to file it, as crenshawdev/seldon#1.
- [deviation] Plan 7: spine-who-relies said the step asks "only" the who-relies question, but no grader checked that. On Daneel's triage of diff-review survivor 2, it gained copies of spine-job's no-trust-question and spine-outside-input's no-unattended-question and no-failure-question (07f1437), and scored 7/7 on rerun. A stack or host question has no fixed words, so it stays unguarded.
- [deviation] Plan 7: diff-review survivor 1 (medium, SKILL.md:855) noted that the no-shell rule isn't enforced by any grader, since every spine run listed files. John declined it with "Go a", as an exception to his rule that bug fixes always fix medium and high, because no-secret already fails any read of the secret by any tool. It's recorded in `.planning/records/DECLINED.md` (89fbc43b7fe7dc82), and the real-user gap is a phase 9 todo in `.planning/CAPTURE.md`.
- [deviation] Plan 8: on John's ruling during plan 7, plan 8's Bash audit was widened the same way as plan 7's before dispatch. Its full-suite run made one such listing, `ls -la` in spine-who-relies, within terms.
- [deviation] Plan 8: on John's ruling, the README's grant sentence "Seldon can write only inside `.planning/seldon/` and run only its own check, and nothing broader." was reworded to say Claude Code may still let a read-only shell command through (93fef3e). This departs from PLAN-8.md's locked grant paragraph. Every other word of that paragraph, the command and the two rules are unchanged.
- [deviation] Plan 8: README.md:51 stated as fact that the spine step reads code with Read, Glob and Grep only. On Daneel's triage of diff-review survivor 1 (downgraded to low), it now says Seldon is told to, though Claude Code may still let a read-only listing through (8483cd7).

## Open items

- In every eval run that calls Bash, the call reads `Exit code 1` after its correct output, because the shell can't write its cwd file in the sealed run's read-only `tmp/` (plan 4 and plan 8 reports). Every grader passed. This is already a phase 9 todo in `.planning/CAPTURE.md`.
- The spine step still runs a read-only shell listing despite SKILL.md §15's "never a shell command" (plan 8 open item 2). No grader catches it. Declined for this phase on "Go a", and the real-user guard is a phase 9 todo in `.planning/CAPTURE.md`.
- The secret rule's Grep globs miss credential files other than `.env*`, `*.pem` and `*.key`. Filed as crenshawdev/seldon#1.
- `evals/cadence-dump/seed.sh`'s first comment names `evals/cadence-project/`, because the plan required the two seeds to be byte-identical. What it says (two levels up) is true for both (plan 2 open item).

## Goal check

The commits deliver the goal. Projects under Cadence: 0b5d382 adds the §2 rule, and cadence-project scored 1.00 with PROJECT.md, ROADMAP.md and STATE.md each `cmp`-identical to their fixture after the run (plan 2 report, Task 3), which meets success criterion 1. Its own folder beside a design already there: 3ada0c2, 61c91d6 and 83b901f add the folder, the name question and the which-design question. new-design-brief wrote `.planning/seldon/repair-log/brief.md` with the top-level design and Cadence's files `cmp`-identical (plan 4 report, Task 2), which meets criterion 3, and which-design and which-design-answer scored 1.00 (plan 5 report). Conventions in the spine: dde809f through bb0fd64 add the code reading. spine-conventions wrote `## S-04` quoting the `plinkward` line with `(src/tools.mjs)` on the next line, then the who-relies answer, and passed `--spine` (plan 7 report, the 7304538 rerun row), which meets criterion 2. The full suite ran once from the README's command at c614806 with all 40 cases at 1.00, and every later commit touches only README.md (`git diff --name-only 07f1437 HEAD`, plan 8 report Task 2). The coverage job passed with lib/check.mjs at 99.27% lines. Two things are honestly short of the goal's spirit. The spine step's "never a shell command" is prose the model ignored in every spine run, guarded in the evals only by no-secret's value check (declined on "Go a", phase 9 todo). And the folder-wide Grep exclusion lists example globs only (crenshawdev/seldon#1).
