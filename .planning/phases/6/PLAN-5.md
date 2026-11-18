---
phase: 6
plan: 5
depends_on: [3, 4]
requirements:
  - FLOW-05
files:
  - skills/seldon/SKILL.md
  - evals/which-design/case.yaml
  - evals/which-design/prompt.md
  - evals/which-design/seed.sh
  - evals/which-design/graders/asks-which-design.md
  - evals/which-design/graders/no-write.md
  - evals/which-design/graders/no-edit.md
  - evals/which-design-answer/case.yaml
  - evals/which-design-answer/prompt.md
  - evals/which-design-answer/seed.sh
  - evals/which-design-answer/history.jsonl
  - evals/which-design-answer/graders/names-brief-first.md
  - evals/which-design-answer/graders/writes-prd.md
---

# Phase 6: Existing projects and design folders - Plan 5: The which-design cases

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan proves AC3: with two designs, a bare `/seldon` asks which one, and the answer goes on with that design's next step, while one design never asks.

## Must be true when done

- The which-design case scores 1.00. With Toolshed's four documents at the top of `.planning/seldon/` and a Sowlist brief in `.planning/seldon/sowlist/`, a bare `/seldon` writes and edits nothing and ends on the which-design question.
- The which-design-answer case scores 1.00. A saved session ended on that question, and answering `sowlist` says the PRD resume line naming `.planning/seldon/sowlist/brief.md` before it writes `.planning/seldon/sowlist/prd.md`. In the kept workspace that PRD passes `--prd`, and the top-level design is byte-identical to its fixture.
- `resume` still scores 1.00, so one design never triggers the ask.
- `node --test tests/scaffold.test.mjs` passes with both new `seed.sh` files scanned.

## Context

- **Locked:** D-05, D-02, D-03. From Plan 3: the working folder, the which-design question and the "Design chosen" route.
- **The fixture (my choice):** the top-level design is `samples/`'s four Toolshed documents, finished. The named design `sowlist` holds only a copy of `samples/spine-job/brief.md`, so its next step is the PRD, the cheapest write that shows which design the run went on with. No Cadence files are seeded: D-10 keeps them out of where a run starts, and leaving them out shows designs work on any project.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Eval runs (SECURITY):** on the approval Plan 2 recorded for phase 6. If Plan 2's report records none, stop at a checkpoint marked SECURITY before the first run. Anything off these terms is a checkpoint marked SECURITY.
  - Run from `/code/seldon`, the main tree, never a worktree, one case at a time: `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants. `--keep-temp` is for the audit only and goes in no committed file.
  - **Bash audit:** after every run, report every Bash command in the kept `out/trace.jsonl`. Only `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon` or `.planning/seldon/sowlist`, is allowed. Anything else is a SECURITY checkpoint: stop.
  - **Retries:** at most three tries per case. A retry comes only after a fix, or after a miss the trace shows is model variance. A case still failing after its third try is a checkpoint.
  - **Cleanup:** before the plan finishes, remove only the folders each run printed as kept, by their exact paths, never by a glob such as `/tmp/claude-eval-*`.
  - A kept run's workspace is `<kept>/sealed/home/cwd/`.
  - **This plan runs three cases:** `which-design`, `which-design-answer` and `resume`.
- **Seed vetting:** a new `seed.sh` holds only the shebang, `set -euo pipefail`, the repo line, comments, `mkdir -p` inside the run and `cp` or `cp -R` from `"$repo/samples/..."`. The coordinator vets it before its first run: the task stops at a checkpoint quoting the file.
- **Case rules:** `allowed_tools` is `[Skill, Read, Glob, Grep]`. No line of a `case.yaml` or `prompt.md` says "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none holds a double-quoted backslash. Every new grader must fail when the behavior it claims is missing (phase 3 D-21), checked with a `node -e` script that reads each pattern from its grader file over hand-made inputs in the scratch area, never committed.
- **SKILL.md in the lease:** declared so a run that fails on the skill's text can be fixed inside this plan. No task edits it unless a run fails because of it. If any task edits SKILL.md, then before the plan reports done, run again every case this plan has already passed (`which-design`, `resume`, and `which-design-answer` if it passed before the edit), each on the same audit, retry and cleanup terms. A must-be-true line counts as met only against the SKILL.md the plan ends with.
- **Owner's words:** committed files never carry the owner's own words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add the which-design case

- **Files:** evals/which-design/case.yaml, evals/which-design/prompt.md, evals/which-design/seed.sh, evals/which-design/graders/asks-which-design.md, evals/which-design/graders/no-write.md, evals/which-design/graders/no-edit.md
- **Reads:** evals/resume-later/case.yaml, evals/resume-later/seed.sh, evals/resume-later/graders/says-later-release.md, evals/spine-job/graders/no-write.md, evals/spine-job/graders/no-edit.md, skills/seldon/SKILL.md#Which design
- **Decisions:** D-05, D-03
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC3's first half. Two designs are seeded, and the prompt is a bare `/seldon`.
  - **`seed.sh`:** `mkdir -p .planning/seldon/sowlist`. Copy `samples/brief.md`, `samples/prd.md`, `samples/spine.md` and `samples/epics.md` into `.planning/seldon/`, and `samples/spine-job/brief.md` to `.planning/seldon/sowlist/brief.md`. Nothing else.
  - **`prompt.md`:** exactly `/seldon`.
  - **`case.yaml`:** as resume-later's, with its own name and description.
  - **Graders:**
    - **`asks-which-design.md`:** `regex` on `last_message`. It matches the which-design question copied from SKILL.md as the message's last line, in resume-later's `says-later-release` form.
    - **`no-write.md` and `no-edit.md`:** spine-job's.
- **Verify:**
  - **Testing scope:** the outcome is AC3's ask, which no case covers today. Three graders, their D-21 checks, one passing run and a `resume` rerun for the one-design half are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) Phase 3 D-21, with a `node -e` script: `asks-which-design` matches a message ending on the question, and doesn't match one where text follows it or one ending on the later-release line.
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case which-design` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported.
  - (5) The run command with `--case resume` exits 0 at 1.00.

### Task 2: Add the which-design-answer case

- **Files:** evals/which-design-answer/case.yaml, evals/which-design-answer/prompt.md, evals/which-design-answer/seed.sh, evals/which-design-answer/history.jsonl, evals/which-design-answer/graders/names-brief-first.md, evals/which-design-answer/graders/writes-prd.md
- **Reads:** evals/which-design/seed.sh, evals/spine-job/history.jsonl, evals/spine-job/case.yaml, evals/resume/graders/names-brief-first.md, evals/resume/graders/writes-prd.md, skills/seldon/SKILL.md#Which design, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-05, D-02
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC3's second half. Same seed as Task 1. A saved session ended on the which-design question, and the prompt answers it.
  - **`seed.sh`:** the same lines as Task 1's.
  - **`history.jsonl`:** spine-job's shape, `cwd` `/tmp/seldon-which-design-answer`. Two lines:
    - the user's `/seldon`
    - the assistant's turn as "Which design" writes it: one sentence naming the design at the top of `.planning/seldon/` and the one in `.planning/seldon/sowlist/`, then the which-design question last
  - **`prompt.md`:** `/seldon sowlist`
  - **`case.yaml`:** `history_file: history.jsonl`, `scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`names-brief-first.md`:** resume's pattern with both paths in the named folder. The PRD resume line names `.planning/seldon/sowlist/brief.md`, then a Write to `.planning/seldon/sowlist/prd.md` follows.
    - **`writes-prd.md`:** `file_exists` on `.planning/seldon/sowlist/prd.md`.
- **Verify:**
  - **Testing scope:** the outcome is AC3's route back, which no case covers today. Two graders, their D-21 checks, one passing run and the kept workspace's checks are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and every `history.jsonl` line parses as JSON with its `parentUuid` chained. The history's last line holds the which-design question as a whole line, `grep -cxF`-equal to SKILL.md's.
  - (2) Phase 3 D-21, with a `node -e` script over hand-made trace lines: `names-brief-first` matches the sowlist resume line followed by a Write to `.planning/seldon/sowlist/prd.md`. It doesn't match the top-level resume line naming `.planning/seldon/brief.md`, or the sowlist line followed only by a Write to `.planning/seldon/prd.md`.
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case which-design-answer` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported. Before the kept folder is removed:
    - `node lib/check.mjs --prd <kept>/sealed/home/cwd/.planning/seldon/sowlist` exits 0.
    - `cmp` finds the kept `.planning/seldon/` four files byte-identical to `samples/brief.md`, `prd.md`, `spine.md` and `epics.md`.
