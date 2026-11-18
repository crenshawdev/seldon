PLAN CHECKPOINT: human-verify
Plan: .planning/phases/8/PLAN-5.md
Tasks: 0 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Add the handoff-cadence case | c3e31db | Verify 1 and 2 done (scaffold test 4/4, cmp equal on the five shared graders, D-21 11/11); Verify 3 (seed vet) is this checkpoint, Verify 4 (run) waits on it |
| 2 - Add the handoff-named case | 71ed0d4 | Verify 1 and 2 done (scaffold test 4/4, cmp equal on the four shared graders, D-21 5/5); Verify 3 is this checkpoint, Verify 4 waits on it |
| 3 - Add the readiness-not-run case | 147351f | Verify 1 and 2 done (scaffold test 4/4, allowed_tools `[Skill, Read, Glob, Grep]` with no Agent entry, disallowed_tools `[Agent]`, `claude plugin validate --strict .` on 2.1.327 "Validation passed" exit 0 with the case in place, cmp equal on asks-nothing, D-21 11/11); Verify 3 is this checkpoint, Verify 4 waits on it |

Tasks counts tasks satisfied: none is until its run (Verify 4) is in.

## Seed vet (Verify 3 of all three tasks), for Daneel

No `claude plugin eval` run has been made in this dispatch. Nothing runs until this checkpoint's answer, which also covers the lead's read of plan 3's fix 70a0b54.

Each seed is mode 755 and passes tests/scaffold.test.mjs (every line one of the allowed forms: the shebang, `set -euo pipefail`, comments, the repo line, `mkdir -p` and `cp`/`cp -R` from `"$repo/samples/..."` to a path inside the workspace). None copies code or a `.env` into the run, so none gets the no-secret grader under term D.

### evals/handoff-cadence/seed.sh, blob 6a55b509c97182254bfac5d70e35d059d43cd8cf (`git hash-object`), 575 bytes

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/handoff-cadence/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and Toolshed's finished design at the top of .planning/seldon/.
mkdir -p .planning/seldon
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
```

`diff` against evals/new-design-name/seed.sh: line 4 only, the folder name in the comment.

### evals/handoff-named/seed.sh, blob 81d65f8729381d61dccb4a9b8e33c990cfd17689, 649 bytes

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/handoff-named/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Cadence's files for a built Toolshed, and one finished design in repair-log/ with nothing at the top of .planning/seldon/.
mkdir -p .planning/seldon/repair-log
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/repair-log/brief.md
cp "$repo/samples/prd.md" .planning/seldon/repair-log/prd.md
cp "$repo/samples/spine.md" .planning/seldon/repair-log/spine.md
cp "$repo/samples/epics.md" .planning/seldon/repair-log/epics.md
```

The `mkdir -p` comes first so `.planning/` exists before the `cp -R` into it. The samples' `Built from:` stamps name the parent by file name and hash, not by folder (lib/check.mjs:64), so they stay fresh in repair-log/.

### evals/readiness-not-run/seed.sh, blob 58f30ce04be6aa08b674a6a296827531429473a2, 508 bytes

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-not-run/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# All four documents are on disk, so a bare /seldon lands on a readiness check it can't start.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
```

`diff` against evals/resume-later/seed.sh: lines 4 and 7 only, both comments.

## The runs this checkpoint holds (Verify 4), as they will be made once approved

From /code/seldon, the main tree, one per case:
`claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`
for handoff-cadence, handoff-named and readiness-not-run, at most three tries each, with the Bash audit, the agent-start audit (the agent's own calls included), the trace copy into evals/results/phase-8-traces/ named for the case and the try, and removal of each kept folder by exact path. readiness-not-run's first run carries the disallowed_tools proof: the init record's `tools` list quoted, and any agent start, `Task` still in that list, or a refusal of the field stops at a checkpoint.

## D-21 checks (scratch, uncommitted)

Scripts in /tmp/claude-1000/-code-seldon/8e645b01-f58e-4a35-9c78-089fd8a306cb/scratchpad/d21/ (lib.mjs reads each grader's `pattern` and `match` from the file itself and compiles it with `new RegExp`, no flags). Every line came back as predicted:
- ends-on-already-built: fails on `/cad-new-project --brief .planning/seldon` (with and without the sentence after it), the command with no sentence, the sentence followed by "Good luck with the build.", and a prose line between; passes on plain lines (with and without a trailing newline), the command fenced alone with the sentence as prose after, and both in one fence.
- no-milestone: fails a message holding `/cad-milestone add`; passes the correct ending.
- ends-on-named-command: fails on `.planning/seldon` alone, on `.planning/seldon/repair-log/`, and on the command with no sentence; passes on the command fenced alone with the sentence as prose after, and on plain lines.
- says-not-run: fails on the no-findings line, on `The readiness check did not run:` with nothing after it, and on `: .`; passes on a reason.
- no-findings-line: fails a message holding the no-findings line; passes the correct ending.
- ends-on-unchecked-handoff: fails with the not-checked line missing, after the command, and between the lead-in and the command; passes on plain lines and on a fenced command.

Deviations: none
Open items:
- Static analysis: `workflow.lint_command` is null and `detect-commands` returns lint null and typecheck null, so no static-analysis command exists to run; skipped for all three commits.
- ends-on-already-built and ends-on-named-command take any number of bare fence lines between the command and the sentence, and after the sentence, not only one closing fence. That lets SKILL.md's own layout through, which shows the command and the sentence as two separate fenced blocks (a closing fence then an opening one between them); prose between them still fails.
- The already-built sentence is matched with a straight apostrophe (`\x27`), as SKILL.md writes it; a curly one fails the grader.
- `claude plugin validate --strict .` printed one plugin-directory warning (ICON_MISSING), which it states does not change the result; the result was "Validation passed", exit 0.
