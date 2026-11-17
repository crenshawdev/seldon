---
phase: 5
plan: 4
depends_on: [1, 2, 3]
requirements:
  - EPIC-01
  - EPIC-02
files:
  - skills/seldon/SKILL.md
  - evals/epics-later/case.yaml
  - evals/epics-later/prompt.md
  - evals/epics-later/seed.sh
  - evals/epics-later/graders/no-edit.md
  - evals/epics-later/graders/no-write.md
  - evals/epics-later/graders/says-later-release.md
  - evals/epics-from-spine/case.yaml
  - evals/epics-from-spine/prompt.md
  - evals/epics-from-spine/seed.sh
  - evals/epics-from-spine/graders/writes-epics.md
  - evals/epics-from-spine/graders/runs-check.md
  - evals/epics-from-spine/graders/check-passes.md
  - evals/epics-from-spine/graders/every-epic-has-six-fields.md
  - evals/epics-from-spine/graders/cites-only-spine-ids.md
  - evals/epics-from-spine/graders/cites-every-spine-id.md
  - evals/epics-from-spine/graders/every-epic-cites-project-wide.md
  - evals/epics-from-spine/graders/every-epic-has-integrated-item.md
  - evals/epics-from-spine/graders/every-requirement-once.md
  - samples/epics-rerun/spine.md
  - evals/epics-rerun/case.yaml
  - evals/epics-rerun/prompt.md
  - evals/epics-rerun/seed.sh
  - evals/epics-rerun/graders/keeps-untouched-epic.md
  - evals/epics-rerun/graders/keeps-changed-epic-id.md
  - evals/epics-rerun/graders/retires-dropped-id.md
  - evals/epics-rerun/graders/no-reused-id.md
---

# Phase 5: Epics and the full walk - Plan 4: The epics output and rerun cases

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan proves the epics step's output, its fields and citations, and its rerun. Plan 5 proves its split along a boundary and its stop when there's no boundary.

## Must be true when done

- The epics-from-spine case scores 1.00. It replaces `epics-later`. With the Toolshed brief, PRD and spine seeded, `/seldon epics`:
  - writes `.planning/seldon/epics.md`
  - runs `--epics` and repeats its pass line
  - gives every epic the six fields and the integrated item
  - cites only S-01 to S-06, each at least once, with S-02, S-04 and S-05 on every epic
  - lists each of Toolshed's 7 requirement IDs, CAT-01 to NFR-02, on exactly one epic's `**Requirements:**` line (D-04)
- The epics-rerun case scores 1.00. Over the updated `samples/epics.md`, after LOAN-03 and S-03 retired, `/seldon epics`:
  - keeps E-01 byte-identical
  - keeps E-02's ID without S-03
  - lists E-03 on a `Retired:` line under the title and never brings it back
- A kept trace shows the run loaded SKILL.md through its last section, and `architecture-on-request` still scores 1.00.
- `evals/epics-later/` is gone, and `node --test tests/scaffold.test.mjs` passes with every new `seed.sh` scanned.

## Context

- **Locked:** D-02, D-04, D-09, D-10, D-12, D-19 and D-22. From Plan 1: the `--epics` token and pass line, the integrated item, the epics `Retired:` line and the updated `samples/epics.md`. From Plans 2 and 3: the epics step, its draft, check and rerun, and the `/seldon epics` route.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Eval runs:** the owner approved phase 5's eval runs on 2026-11-17, as a security item, on the terms in this Context: the command and its two grants, seed vetting, the Bash audit, the retries and the cleanup. Anything off those terms is a checkpoint marked SECURITY.
  - Run from `/code/seldon`, the main tree, never a worktree.
  - Run one case at a time with `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants and nothing broader.
  - `--keep-temp` is for the Bash audit only and goes in no committed file.
  - **Retries:** at most three tries per case. A retry comes only after a fix, or after a miss the trace shows is model variance. A case still failing after its third try is a checkpoint.
  - **This plan runs three cases: `epics-from-spine`, `epics-rerun` and `architecture-on-request`.**
- **Seed vetting:** a new or changed `seed.sh` holds nothing but these lines:
  - the shebang, `set -euo pipefail`, the repo line and comments
  - `mkdir -p .planning/seldon`
  - `cp` lines from `"$repo/samples/..."`

  The coordinator vets each one before its first run. The task stops at a checkpoint quoting the file, and runs the case only once the coordinator clears it.
- **The Bash audit:** after every run, read `out/trace.jsonl` in each folder that run printed as kept, and report every Bash command in it.
  - Only four commands are allowed: `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon`.
  - Any other command is a checkpoint marked SECURITY: stop.
- **Cleanup:** before the plan finishes, remove only the folders each run printed as kept, by their exact paths. Never remove by a glob such as `/tmp/claude-eval-*`, since other sessions' kept runs can sit there too.
- **Case rules:**
  - `allowed_tools` is `[Skill, Read, Glob, Grep]` and nothing else.
  - No line of a `case.yaml` or `prompt.md` may say "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none may hold a double-quoted backslash. `tests/scaffold.test.mjs` flags both.
  - Every new grader must fail when the behavior it claims is missing (phase 3 D-21). Each case task says how that's checked, with a `node -e` script that reads each pattern from its grader file. Hand-made test inputs live in the scratch area and are never committed.
- **SKILL.md in the lease:** it's declared so a run that fails on the skill's text can be fixed inside this plan, as phase 4 Plan 3 did. No task edits it unless a run fails because of it.
- **Owner's words:** committed files never carry the owner's own words. Fixtures use coined projects and invented user words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Turn epics-later into the epics-from-spine case

- **Files:** evals/epics-later/case.yaml, evals/epics-later/prompt.md, evals/epics-later/seed.sh, evals/epics-later/graders/no-edit.md, evals/epics-later/graders/no-write.md, evals/epics-later/graders/says-later-release.md, evals/epics-from-spine/case.yaml, evals/epics-from-spine/prompt.md, evals/epics-from-spine/seed.sh, evals/epics-from-spine/graders/writes-epics.md, evals/epics-from-spine/graders/runs-check.md, evals/epics-from-spine/graders/check-passes.md, evals/epics-from-spine/graders/every-epic-has-six-fields.md, evals/epics-from-spine/graders/cites-only-spine-ids.md, evals/epics-from-spine/graders/cites-every-spine-id.md, evals/epics-from-spine/graders/every-epic-cites-project-wide.md, evals/epics-from-spine/graders/every-epic-has-integrated-item.md, evals/epics-from-spine/graders/every-requirement-once.md
- **Reads:** evals/epics-later/seed.sh, evals/spine-from-prd/graders/every-decision-quoted-or-tagged.md, evals/spine-from-prd/graders/runs-check.md, evals/spine-from-prd/graders/check-passes.md, samples/spine.md, samples/epics.md, skills/seldon/SKILL.md#19. The epics draft
- **Decisions:** D-19, D-09, D-02, D-04, D-12
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC2's case (D-19). The case was `epics-later`, and it becomes the epics-from-spine case. Move the folder with `git mv evals/epics-later evals/epics-from-spine`. The name, which follows `spine-from-prd`, is my reading of D-19's wording.
  - **Remove** the three old graders, `no-edit.md`, `no-write.md` and `says-later-release.md`, since the case now writes.
  - **`seed.sh`:** keep its three `cp` lines from `samples/brief.md`, `samples/prd.md` and `samples/spine.md`. Update its comments to the new folder and purpose.
  - **`prompt.md`:** stays `/seldon epics`.
  - **`case.yaml`:** `name: epics-from-spine`, `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description says what's seeded and what's checked, without the word "scaffold".
  - **Graders** (the IDs pinned to `samples/spine.md`, as D-12 says):
    - **`writes-epics.md`:** `file_exists` on `.planning/seldon/epics.md`.
    - **`runs-check.md`:** `tool_used` on Bash, `input_match` `lib/check\.mjs --epics`, `min: 1`.
    - **`check-passes.md`:** `regex` on `last_message`, matching `seldon check: epics\.md conforms`.
    - **`every-epic-has-six-fields.md`:** `regex` on the file `.planning/seldon/epics.md`, `match: not_contains`, `flags: m`. It matches any `## E-NN:` section, up to the next `## ` or the end of the file, that lacks a column-0 line starting with one of the six bold labels.
    - **`cites-only-spine-ids.md`:** same target, `not_contains`. It matches a `**Spine decisions:**` line naming any S- ID but S-01 to S-06.
    - **`cites-every-spine-id.md`:** same target. Six lookaheads, one per ID from S-01 to S-06, each requiring a `**Spine decisions:**` line that names it.
    - **`every-epic-cites-project-wide.md`:** same target, `not_contains`. It matches any epic section whose `**Spine decisions:**` line lacks S-02, S-04 or S-05: the design approach, stack and hosting decisions.
    - **`every-epic-has-integrated-item.md`:** same target, `not_contains`. It matches any epic section holding no line that's `- ` plus the integrated item's words, exactly as SKILL.md fixes them, with regex metacharacters escaped.
    - **`every-requirement-once.md`:** same target, `flags: m`. Seven pairs of lookaheads, one pair per Toolshed requirement ID (CAT-01, CAT-02, LOAN-01, LOAN-02, LOAN-03, NFR-01, NFR-02): one requires a `**Requirements:**` line naming the ID, and the other rules out a second `**Requirements:**` line naming it. That's D-04's direct proof, the rule that every requirement ID lands in exactly one epic.
  - **The size check (the flagged assumption):** this is the first run of the epics step. Its kept trace is where the answer about SKILL.md's size lives (Verify 6).
- **Verify:**
  - **Testing scope:** the outcome is AC2 and D-04, which nothing covers today. Nine graders, their phase 3 D-21 checks, one passing run and the size check are the evidence, and testing stops there.
  - (1) `ls evals/epics-later` fails, and `evals/epics-from-spine/` holds the files above and no other grader.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) Phase 3 D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - **The positive control:** `samples/epics.md` passes all six file graders.
    - **`every-requirement-once`:** it doesn't match a copy with LOAN-03 added to E-02's `**Requirements:**` line as well as E-03's, or a copy with NFR-01 removed from every epic.
    - **`every-epic-has-six-fields`:** it matches, which fails the grader, a copy with one epic's `**Boundaries:**` line removed.
    - **`cites-only-spine-ids`:** it matches a copy where one epic also cites S-07.
    - **`cites-every-spine-id`:** it doesn't match a copy with S-06 removed from every epic.
    - **`every-epic-cites-project-wide`:** it matches a copy with S-04 removed from one epic.
    - **`every-epic-has-integrated-item`:** it matches a copy with the item removed from one epic, and a copy with one word of it changed.
    - **`check-passes`:** it doesn't match the brief, PRD, spine or all-four pass lines.
    - **`runs-check`:** it matches the `--epics` command's input and not the `--spine` one.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case epics-from-spine` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. Before the kept folder is removed, `node lib/check.mjs --epics <kept workspace>/.planning/seldon` exits 0.
  - (6) **Size check:** in that run's kept trace, `grep -c 'this route never ends a turn on one'` prints at least 1. That's the last sentence of SKILL.md, so the skill the run loaded held the whole file. Two other outcomes:
    - If no part of the skill body appears in the trace, the size question is unresolved. Stop at a checkpoint with what the trace holds. (7) is no answer to it, since its only grader is `file_exists`, which a cut last section can still pass.
    - If the body appears without that sentence, the loader cut the file. Stop at a checkpoint.

    Report `wc -c skills/seldon/SKILL.md` beside the result.
  - (7) The run command with `--case architecture-on-request` exits 0 at 1.00. Its section is now the last in SKILL.md, after the epics text.

### Task 2: Add the epics-rerun case and its fixture

- **Files:** samples/epics-rerun/spine.md, evals/epics-rerun/case.yaml, evals/epics-rerun/prompt.md, evals/epics-rerun/seed.sh, evals/epics-rerun/graders/keeps-untouched-epic.md, evals/epics-rerun/graders/keeps-changed-epic-id.md, evals/epics-rerun/graders/retires-dropped-id.md, evals/epics-rerun/graders/no-reused-id.md
- **Reads:** evals/spine-rerun/graders/keeps-untouched-decisions.md, evals/spine-rerun/graders/retires-dropped-id.md, evals/spine-rerun/graders/no-reused-id.md, evals/spine-rerun/seed.sh, samples/spine.md, samples/epics.md, samples/spine-rerun/prd.md
- **Decisions:** D-22, D-10, D-12
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC4's case (D-22). The spine-rerun brief and PRD (LOAN-03 retired), a spine with S-03 retired and the updated `samples/epics.md` are seeded. The prompt is `/seldon epics`.
  - **`samples/epics-rerun/spine.md`:** what the spine rerun makes of `samples/spine.md` over the spine-rerun brief and PRD. That's the output spine-rerun's graders accept:
    - S-03's heading and body removed
    - `Retired: S-03` on one prose line directly under the `# ` title
    - every other line byte-identical to `samples/spine.md`

    It passes `--spine`.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy, and nothing else:
    - `samples/spine-rerun/brief.md` and `samples/spine-rerun/prd.md`
    - `samples/epics-rerun/spine.md`
    - `samples/epics.md` to `.planning/seldon/epics.md`
  - **`prompt.md`:** exactly `/seldon epics`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description doesn't say "scaffold".
  - **Graders** (each on the file `.planning/seldon/epics.md`):
    - **`keeps-untouched-epic.md`:** `regex`, `flags: m`. It matches E-01's heading and every line of its body exactly as `samples/epics.md` holds them. Build the pattern from the file's text with regex metacharacters escaped, the way spine-rerun's `keeps-untouched-decisions` pins each decision. It ends by requiring that the next line is a `## ` heading, a blank line followed by one, or the end of the file, so a line added to E-01 fails it.
    - **`keeps-changed-epic-id.md`:** `regex`, `flags: m`. A `## E-02:` section whose `**Requirements:**` line names LOAN-01 and LOAN-02, and whose `**Spine decisions:**` line doesn't name S-03.
    - **`retires-dropped-id.md`:** `regex`. A `Retired:` line naming `E-03` between the `# ` title and the first `## ` heading.
    - **`no-reused-id.md`:** `regex`, `match: not_contains`, `flags: m`, on `^## E-03:`.
- **Verify:**
  - **Testing scope:** the outcome is AC4, which nothing covers today. Four graders, their phase 3 D-21 checks and one passing run are enough, and testing stops there.
  - (1) The fixture is valid:
    - `node lib/check.mjs --spine samples/epics-rerun` exits 0.
    - `diff samples/spine.md samples/epics-rerun/spine.md` shows only S-03's removal and the `Retired:` line.
    - Every S- ID that E-01 and E-02 cite in `samples/epics.md`, except S-03, is a decision in the fixture spine.
    - Every requirement ID E-01 and E-02 hold is a requirement in `samples/spine-rerun/prd.md`.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) Phase 3 D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - **`keeps-untouched-epic`:** it matches `samples/epics.md` itself. It doesn't match when any one E-01 line changes by one character, when a line is added to the end of E-01, or when E-01 is removed.
    - **`keeps-changed-epic-id`:** it matches a copy of `samples/epics.md` with S-03 removed from E-02's citations. It doesn't match `samples/epics.md` itself, which still cites S-03 on E-02, or a copy whose LOAN-01 and LOAN-02 epic is renumbered E-04.
    - **`retires-dropped-id`:** it matches a copy with `Retired: E-03` under the title. It doesn't match when the line sits after the last epic, or when it names a different ID.
    - **`no-reused-id`:** it matches, which fails the grader, `samples/epics.md`, which still has E-03.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case epics-rerun` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. Before the kept folder is removed, `node lib/check.mjs --epics <kept workspace>/.planning/seldon` exits 0.

## Notes

- **The split into Plan 5:** Plans 4 and 5 were one plan, whose brief passed the 32 KB ceiling. This plan keeps the epics-from-spine case first, since it's the phase's first run and carries the size check, then the epics-rerun case. Plan 5 holds the split and no-boundary pair, which share a fixture.
- **The architecture run:** it's an existing case, run again here only because Plan 2 moved its section to the end of SKILL.md.
