PLAN CHECKPOINT: human-verify
Plan: .planning/phases/8/PLAN-6.md
Tasks: 0 of 6
| Task | Commit | Note |
|---|---|---|
| 1 - Add the readiness-findings case | e2ff264 | Verify 1 and 2 done: scaffold test 4/4, cmp equal on no-write, no-edit and no-other-agent against resume-later's, D-21 32/32 under no flags and `m`. Verify 3 (seed vet) is this checkpoint, and Verify 4 (the run) waits on it |
| 2 - Add the readiness-crossing case | a2f3364 | Verify 1 and 2 done: scaffold test 4/4, cmp equal on names-crossing and ends-on-question against readiness-findings's and on the three shared graders against resume-later's, D-21 on one-finding 10/10. Verify 3 is this checkpoint. Verify 4 to 6 wait on it |
| 3 - Add the readiness-hand-off case | not committed | case.yaml, prompt.md, seed.sh and the three shared graders are written (cmp equal to resume-later's). The history waits on Task 2's passing run (D-19), so the task isn't committed yet. Verify 3 is this checkpoint |
| 4 - Add the readiness-fix case | not committed | case.yaml, prompt.md, seed.sh and all five graders are written, ends-on-confirm cmp equal to stale-spine's. D-21 for Verify 2 passes (in the 48 below). The history waits on Task 3's history. Verify 3 is this checkpoint |
| 5 - Add the readiness-fix-answer case | not committed (capture state, as the plan says) | seed.sh and the capture setup are written: case.yaml in capture form, prompt.md equal to readiness-fix's, and the six spine-who-relies grader copies (cmp equal) plus starts-no-agent. The capture history waits on Task 4's history. The final no-spine-write, keeps-answer and starts-no-agent are staged in scratch and pass D-21 (in the 48 below). Verify 4 is this checkpoint |
| 6 - Add the readiness-agent case | 20e90e3 | Verify 1, 2 and 2a done: scaffold test 4/4, cmp equal on no-other-agent, D-21 and the probe traces 104/104 under no flags and `m`. Verify 3 is this checkpoint, and Verify 4 waits on it |

Tasks counts tasks satisfied. None is satisfied until its run is in.

No `claude plugin eval` run has been made in this dispatch.

## Seed vet (Verify 3 of Tasks 1-4 and 6, Verify 4 of Task 5), for Daneel

All six seeds are mode 755, ASCII only (`LC_ALL=C grep -c '[^ -~]'` is 0 on each) and pass tests/scaffold.test.mjs. Every line is one of the allowed forms: the shebang, `set -euo pipefail`, a comment, the repo line, `mkdir -p`, and `cp`/`cp -R` from `"$repo/samples/..."` to a relative path. None copies code or a `.env`, so none gets a no-secret grader under term D. Blobs are from `git hash-object` on the working copy. Tasks 1, 2 and 6 are committed, and their working copy equals the index entry.

### evals/readiness-findings/seed.sh, blob 2fdeec871ab773f8f81a390a976c6d8a77fdae97, 574 bytes, committed in e2ff264

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-findings/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design with CAT-01 on no epic, and E-02 spanning Loans and Repairs with no spine boundary between them.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness-uncovered/epics.md" .planning/seldon/epics.md
```

### evals/readiness-crossing/seed.sh, blob da62d2f1d32f186967b83644d9905f69ee72105f, 571 bytes, committed in a2f3364

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-crossing/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design: every requirement on an epic, and E-02 spanning Loans and Repairs with no spine boundary between them.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness/epics.md" .planning/seldon/epics.md
```

### evals/readiness-hand-off/seed.sh, blob 94934f90b518107e6f294a84c0075ba3a48af91a, 571 bytes, uncommitted

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-hand-off/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design: every requirement on an epic, and E-02 spanning Loans and Repairs with no spine boundary between them.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness/epics.md" .planning/seldon/epics.md
```

`diff` against readiness-crossing's: line 4 only, the folder in the comment.

### evals/readiness-fix/seed.sh, blob 55d775cbbc9c87e853b2f00c32d962d6f8df4704, 566 bytes, uncommitted

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-fix/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design: every requirement on an epic, and E-02 spanning Loans and Repairs with no spine boundary between them.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness/epics.md" .planning/seldon/epics.md
```

`diff` against readiness-hand-off's: line 4 only, the folder comment, as Task 4 says.

### evals/readiness-fix-answer/seed.sh, blob a1940f550212e023b18be223ea95af1523250008, 633 bytes, uncommitted (it stays out of git through the capture run, as Task 5 says)

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-fix-answer/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The readiness design: every requirement on an epic, and E-02 spanning Loans and Repairs with no spine boundary between them.
mkdir -p .planning/seldon
cp -R "$repo/samples/cadence-project/planning/." .planning/
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/readiness/prd.md" .planning/seldon/prd.md
cp "$repo/samples/readiness/spine.md" .planning/seldon/spine.md
cp "$repo/samples/readiness/epics.md" .planning/seldon/epics.md
```

`diff` against readiness-fix's: line 4 (the folder comment), plus the added line 9, the `cp -R` line `evals/spine-who-relies/seed.sh` and `evals/handoff-cadence/seed.sh` use. `mkdir -p` comes first so `.planning/` exists before the `cp -R` into it.

### evals/readiness-agent/seed.sh, blob 24ddea4e946191a6a4380bd7b689d823f8244542, 516 bytes, committed in 20e90e3

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-agent/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# All four documents are on disk, so a bare /seldon starts the readiness agent over the three it checks.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
```

`diff` against evals/resume-later/seed.sh: lines 4 and 7 only, both comments.

### Every samples/ source the six seeds copy (blobs at HEAD 20e90e3, all 100644 regular files)

- samples/brief.md 77fc6ce97f23b70e62b4f975933d7663b2f77e01 (all six)
- samples/readiness/prd.md 893f09d4302f6ae804a41bd11b1c5e30eda77a2b (findings, crossing, hand-off, fix, fix-answer)
- samples/readiness/spine.md c40038bd21cb080c301f37a701809778786d95ac (findings, crossing, hand-off, fix, fix-answer)
- samples/readiness/epics.md e259ce2d38cc1c3275821a0bc8bc658e4f1725f9 (crossing, hand-off, fix, fix-answer)
- samples/readiness-uncovered/epics.md e7378590bb0f40eae4280f6ec1557a31f49bc9ca (findings)
- samples/prd.md 5054c0f2e3a90455856f747875e3efa845a6f21e, samples/spine.md 71f74684d0e88698b39bfa20ab3287bd2be19597, samples/epics.md be719be2da6417e21ea2ba9cb5319d9e39c1b5fe (agent)
- The `cp -R` source samples/cadence-project/planning/ (fix-answer): exactly PROJECT.md 38319dd7ad0d7e3282e9d1ddb391e5304c9a7c14, ROADMAP.md 57331c8c3d9a11c97d76f12652eeb210f3932b25 and STATE.md 0da660ac6c8fb9287b3220d8e2699305f2b6599c, with no seldon/ entry, so it can't reach into the .planning/seldon/** write grant.

`find samples -type l` finds no symlink. `git status --porcelain samples` is clean. A credential-pattern grep (api key, secret, token, password, private-key header, AKIA, sk-) over every source above finds nothing.

Staleness of the seeded designs: built by hand in the scratch area from the same sources, `node lib/check.mjs --stale` prints "seldon check: no stale link" for the findings design and for the crossing design (exit 0). The stamps are brief c5fe3e61100c2e40, prd 82ab766cb0a09dda and spine 13d597adba767ef4. So a bare `/seldon` lands on the readiness check in Tasks 1, 2 and 6.

### Each case folder now holds only regular files

- readiness-findings: case.yaml, prompt.md, seed.sh, graders/{names-uncovered, names-crossing, ends-on-question, no-write, no-edit, no-other-agent}.md
- readiness-crossing: case.yaml, prompt.md, seed.sh, graders/{names-crossing, one-finding, ends-on-question, no-write, no-edit, no-other-agent}.md
- readiness-agent: case.yaml, prompt.md, seed.sh, graders/{one-agent, starts-readiness, hands-three-paths, no-other-path, no-skill-read, agent-reads-three, agent-reads-nothing-else, no-other-agent}.md
- readiness-hand-off (no history yet): case.yaml, prompt.md (`/seldon hand it off as it is`), seed.sh, graders/{ends-on-new-project, no-write, no-edit}.md
- readiness-fix (no history yet): case.yaml, prompt.md (`/seldon fix them`), seed.sh, graders/{edits-spine, fixes-boundary, no-epics-write, no-epics-edit, ends-on-confirm}.md
- readiness-fix-answer, in capture state (no history yet): case.yaml, prompt.md (`/seldon fix them`), seed.sh, graders/{asks-who-relies, no-trust-question, no-unattended-question, no-failure-question, no-write, no-edit, starts-no-agent}.md

Every case.yaml has `allowed_tools: [Skill, Read, Glob, Grep]` with no Agent entry and no disallowed_tools. findings, crossing and agent take 20/600, hand-off 10/300, and fix and fix-answer 20/600.

## The runs this checkpoint holds, in order, once cleared

From /code/seldon, the main tree, one per case:
`claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`

1. readiness-crossing first, since the hand-off, fix and fix-answer histories copy its last message. If any try reports anything other than the one E-02 crossing, the run stops at a checkpoint with the last message and the fixture lines. No retry past it, and no history.
2. readiness-findings and readiness-agent.
3. readiness-hand-off and readiness-fix, once their histories are written from (1) and checked (Task 3 Verify 2, Task 4 Verify 1).
4. The readiness-fix-answer capture run, with three tries of its own. Then the case is assembled and run.

Each run is followed by the Bash audit, the agent-start audit (the agent's own calls included), the trace copy into evals/results/phase-8-traces/, and removal of the kept folder by its exact path. Hand-off, fix, fix-answer and its capture expect no agent start, so any start there stops the run and comes to Daneel.

## D-21 checks (scratch, uncommitted)

The scripts are in /tmp/claude-1000/-code-seldon/8e645b01-f58e-4a35-9c78-089fd8a306cb/scratchpad/p6/. lib.mjs reads each grader's `pattern`/`input_match`, `match` and `flags` from the grader file itself. `input_match` inputs are JSON.stringify of a hand-made tool input. Trace inputs are lines of evals/results/phase-8-traces/readiness-probe-run-4.trace.jsonl, with only the Read input and the parent id swapped. Every check came back as predicted.

- t1.mjs, Task 1, 32/32 under no flags and `m`:
  - names-uncovered fails on CAT-02, on CAT-011, on the line ending `/seldon spine` and on text after the line.
  - names-crossing fails on E-01, on E-021 and on the line ending `/seldon epics`, and passes with other categories in the parentheses.
  - ends-on-question fails on text after the question (on its own line and on the same line) and on a word changed. It passes with a trailing newline and in a fence.
- t2.mjs, Task 2, 10/10 under both flag sets: one-finding matches (and so fails the grader) on crossing plus uncovered, on crossing plus decision left open, and on two indented lines. It doesn't match the crossing line alone, with or without a lead-in.
- t45.mjs, Tasks 4 and 5, 48/48:
  - edits-spine, no-epics-edit and no-epics-write match their own file with `replace_all` before `file_path`. None of them matches the other file or `spine.md.bak`, and no-epics-edit also doesn't match `epics.md.bak`.
  - fixes-boundary fails on the unchanged samples/readiness/spine.md, on it with only the stamp changed, and with repairs named in S-01 (how state changes). It also fails with repairs in boundaries S-06 and loans only in the next decision, and with loans and repairs under a how-state-changes S-07.
  - fixes-boundary passes a `Kind: boundaries` S-07 between the loan log and the repair log, at the end or mid-file, and with both names in the heading only.
  - no-spine-write matches a Write to spine.md and matches neither epics.md nor spine.md.bak.
  - keeps-answer, under its own `m`, fails on the unchanged spine, on the words on a line without `> ` and on a `> ` line above the first `## S-`. It passes on a `> ` line under S-03, the reminders decision.
- t6.mjs, Task 6, 104/104 under no flags and `m`:
  - starts-readiness fails on general-purpose and on Explore.
  - hands-three-paths fails with each one path missing, with a path only in the description and with prd.md.bak. It passes on absolute paths and with the keys in another order.
  - no-other-path matches on the three plus each of these: .planning/seldon/brief.md (after or first), architecture.md, .planning/PROJECT.md, src/app.js, a bare brief.md, prd.md.bak, and a repair-log path. It doesn't match the three alone, the three as absolute paths, or a path-like description.
  - no-skill-read matches a skill Read (`"parent_tool_use_id":null`) of epics.md with `limit` first or not, and of a relative prd.md. It doesn't match the same Read on an agent line or a skill Read of brief.md.
  - agent-reads-three fails with each one of the agent's Reads missing, and with all three on skill lines.
  - agent-reads-nothing-else matches an agent Read of brief.md and of .planning/PROJECT.md. It doesn't match agent Reads of the three, or a skill Read of brief.md.
  - (2a) Over each whole readiness-probe-run-{1,2,3,4} trace, no-skill-read and agent-reads-nothing-else don't match and agent-reads-three matches.

Deviations: none
Open items:
- Static analysis: `workflow.lint_command` is null and `detect-commands` returns lint null and typecheck null, so there's nothing to run. Skipped for e2ff264, a2f3364 and 20e90e3.
- ends-on-question ends on `(?![\s\S])` where prd-conflict's form ends on `$`. Under `m`, `$` let text on a later line through: my first draft failed that D-21 check under `m`. The end-of-input form holds under both. readiness-crossing's copy is byte-equal.
- no-other-path takes a path to be a run of `[\w./~-]` holding a `/` or a `.x` inside the prompt string only, after a quote or a `\n` escape. So a prompt carrying prose with "e.g." would read as a path and fail. Every kept trace's prompt is the three paths alone.
- Tasks 3 and 4 are written but not committed, since each history needs Task 2's passing run (D-19). Each gets its one commit when its history is in. Their seeds will hash the same then unless a change comes back from this vet.
- Task 5's final graders no-spine-write, keeps-answer and starts-no-agent wait in /tmp/claude-1000/-code-seldon/8e645b01-f58e-4a35-9c78-089fd8a306cb/scratchpad/p6/stage/readiness-fix-answer/graders/ until the capture run passes. The case folder now holds only the capture graders.
