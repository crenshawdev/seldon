---
phase: 6
plan: 4
depends_on: [2, 3]
requirements:
  - FLOW-05
files:
  - skills/seldon/SKILL.md
  - evals/new-design-name/case.yaml
  - evals/new-design-name/prompt.md
  - evals/new-design-name/seed.sh
  - evals/new-design-name/graders/asks-for-name.md
  - evals/new-design-name/graders/no-write.md
  - evals/new-design-name/graders/no-edit.md
  - evals/new-design-brief/case.yaml
  - evals/new-design-brief/prompt.md
  - evals/new-design-brief/seed.sh
  - evals/new-design-brief/history.jsonl
  - evals/new-design-brief/graders/writes-brief.md
  - evals/new-design-brief/graders/runs-check.md
  - evals/new-design-brief/graders/check-passes.md
  - evals/new-design-brief/graders/no-write-outside.md
  - evals/new-design-brief/graders/no-edit-outside.md
---

# Phase 6: Existing projects and design folders - Plan 4: The new-design cases

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan proves AC2: a dump for new work on a project under Cadence that already holds a design asks for a folder name, and the walk then writes the new brief in that folder and leaves the old design alone.

## Must be true when done

- The new-design-name case scores 1.00. With Cadence's files and Toolshed's four documents at the top of `.planning/seldon/`, the repair-log dump writes and edits nothing, and the last message holds the name line on a line of its own.
- The new-design-brief case scores 1.00. A saved session answered the name line with `repair-log` and got the fast-path recommendation, and confirming the fast path writes `.planning/seldon/repair-log/brief.md`. The brief passes `--brief` on that folder, with no Write or Edit anywhere else. In the kept workspace the top-level design and Cadence's files are byte-identical to their fixtures.
- `existing-brief` still scores 1.00, though its dump turn now shows the name line.
- The loaded skill in a kept run is the whole of SKILL.md.
- `node --test tests/scaffold.test.mjs` passes with both new `seed.sh` files scanned.

## Context

- **Locked:** D-02, D-03, D-04, D-15. From Plan 2: `samples/cadence-project/planning/` and the repair-log dump in `evals/cadence-project/history.jsonl`. From Plan 3: the working folder, the name line and the "Name given" route.
- **The name (my choice):** `repair-log`. It holds a hyphen, so the case exercises every allowed kind of character but the digit.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Eval runs (SECURITY):** on the approval Plan 2 recorded for phase 6. If Plan 2's report records none, stop at a checkpoint marked SECURITY before the first run. Anything off these terms is a checkpoint marked SECURITY.
  - Run from `/code/seldon`, the main tree, never a worktree, one case at a time: `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants. `--keep-temp` is for the audit only and goes in no committed file.
  - **Bash audit:** after every run, report every Bash command in the kept `out/trace.jsonl`. Only `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon` or `.planning/seldon/repair-log`, is allowed. Anything else is a SECURITY checkpoint: stop.
  - **Retries:** at most three tries per case. A retry comes only after a fix, or after a miss the trace shows is model variance. A case still failing after its third try is a checkpoint.
  - **Cleanup:** before the plan finishes, remove only the folders each run printed as kept, by their exact paths, never by a glob such as `/tmp/claude-eval-*`.
  - A kept run's workspace is `<kept>/sealed/home/cwd/`. Its session transcript is under `config/projects/` in the kept folder, and `out/trace.jsonl` holds no skill text (phase 5 Plan 4's deviation).
  - **This plan runs three cases:** `new-design-name`, `new-design-brief` and `existing-brief`.
- **Seed vetting:** a new `seed.sh` holds only the shebang, `set -euo pipefail`, the repo line, comments, `mkdir -p` inside the run and `cp` or `cp -R` from `"$repo/samples/..."`. The coordinator vets it before its first run: the task stops at a checkpoint quoting the file.
- **Case rules:** `allowed_tools` is `[Skill, Read, Glob, Grep]`. No line of a `case.yaml` or `prompt.md` says "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none holds a double-quoted backslash. Every new grader must fail when the behavior it claims is missing (phase 3 D-21), checked with a `node -e` script that reads each pattern from its grader file over hand-made inputs in the scratch area, never committed.
- **SKILL.md in the lease:** declared so a run that fails on the skill's text can be fixed inside this plan. No task edits it unless a run fails because of it. If any task edits SKILL.md, then before the plan reports done, run again every case this plan has already passed (`new-design-name`, `existing-brief`, and `new-design-brief` if it passed before the edit) and repeat Task 1's loaded-size check, each on the same audit, retry and cleanup terms. A must-be-true line counts as met only against the SKILL.md the plan ends with.
- **Owner's words:** committed files never carry the owner's own words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add the new-design-name case

- **Files:** evals/new-design-name/case.yaml, evals/new-design-name/prompt.md, evals/new-design-name/seed.sh, evals/new-design-name/graders/asks-for-name.md, evals/new-design-name/graders/no-write.md, evals/new-design-name/graders/no-edit.md
- **Reads:** evals/cadence-project/seed.sh, evals/cadence-project/history.jsonl, evals/existing-brief/case.yaml, evals/spine-job/graders/asks-unattended.md, evals/spine-job/graders/no-write.md, evals/spine-job/graders/no-edit.md, skills/seldon/SKILL.md#A dump when documents are there
- **Decisions:** D-04, D-03, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC2's first half. A project under Cadence holds a finished design at the top of `.planning/seldon/`, and the prompt is a dump for new work.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then `cp -R "$repo/samples/cadence-project/planning/." .planning/`. Then copy `samples/brief.md`, `samples/prd.md`, `samples/spine.md` and `samples/epics.md` into `.planning/seldon/`. Nothing else.
  - **`prompt.md`:** `/seldon ` followed by the repair-log dump, word for word from the first line of `evals/cadence-project/history.jsonl`.
  - **`case.yaml`:** `scaffold_script: seed.sh`, `max_turns: 10`, `timeout_seconds: 300` and the read-only tools, as existing-brief's.
  - **Graders:**
    - **`asks-for-name.md`:** `regex` on `last_message`. It matches the name line copied from SKILL.md, on a line of its own, in spine-job's `asks-unattended` form.
    - **`no-write.md` and `no-edit.md`:** spine-job's, no Write and no Edit at all.
- **Verify:**
  - **Testing scope:** the outcome is AC2's ask, which no case covers today. Three graders, their D-21 checks, one passing run, an existing-brief rerun for the changed dump turn and the size check are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) Phase 3 D-21, with a `node -e` script: `asks-for-name` matches a message holding the name line and then the documents question. It doesn't match the documents question alone, or the name line with one word changed.
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case new-design-name` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported.
  - (5) In that run's kept session transcript, the loaded skill text holds SKILL.md's last sentence and ends at `</process>`, and `wc -c skills/seldon/SKILL.md` is reported beside it. This answers the loader-size assumption where the answer lives.
  - (6) The run command with `--case existing-brief` exits 0 at 1.00.

### Task 2: Add the new-design-brief case

- **Files:** evals/new-design-brief/case.yaml, evals/new-design-brief/prompt.md, evals/new-design-brief/seed.sh, evals/new-design-brief/history.jsonl, evals/new-design-brief/graders/writes-brief.md, evals/new-design-brief/graders/runs-check.md, evals/new-design-brief/graders/check-passes.md, evals/new-design-brief/graders/no-write-outside.md, evals/new-design-brief/graders/no-edit-outside.md
- **Reads:** evals/new-design-name/seed.sh, evals/cadence-project/history.jsonl, evals/cadence-project/graders/no-write-outside.md, evals/cadence-project/graders/runs-check.md, evals/cadence-project/graders/check-passes.md, skills/seldon/SKILL.md#A dump when documents are there, skills/seldon/SKILL.md#6. The recommendation
- **Decisions:** D-02, D-04, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC2's second half. Same seed as Task 1. A saved session answered the name line with `repair-log`, and the prompt confirms the fast path.
  - **`seed.sh`:** the same lines as Task 1's.
  - **`history.jsonl`:** cadence-project's shape, `cwd` `/tmp/seldon-new-design-brief`. Four lines:
    - the user's `/seldon` with the repair-log dump, as Task 1's prompt
    - the assistant's dump turn as SKILL.md's "A dump when documents are there" writes it for one design: one sentence, the name line, then the documents question last
    - the user's `/seldon repair-log`
    - the assistant's recommendation, as cadence-project's second line
  - **`prompt.md`:** `/seldon Fast path is fine, go ahead.`
  - **`case.yaml`:** `history_file: history.jsonl`, `scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders (D-15: no Write or Edit outside the named folder keeps the top-level design and Cadence's files byte-identical):**
    - **`writes-brief.md`:** `file_exists` on `.planning/seldon/repair-log/brief.md`.
    - **`runs-check.md`:** `tool_used` on Bash, at least once, matching `lib/check.mjs --brief` on `.planning/seldon/repair-log` and never on `.planning/seldon` alone.
    - **`check-passes.md`:** cadence-project's.
    - **`no-write-outside.md` and `no-edit-outside.md`:** cadence-project's `no-write-outside` pattern with the allowed folder narrowed to `.planning/seldon/repair-log/`, one on Write and one on Edit, each `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is AC2's write, which no case covers today. Five graders, their D-21 checks, one passing run and byte comparisons in the kept workspace are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and every `history.jsonl` line parses as JSON with its `parentUuid` chained.
  - (2) The history's dump turn holds the name line and the documents question as whole lines, each `grep -cxF`-equal to its line in SKILL.md.
  - (3) Phase 3 D-21, with a `node -e` script:
    - `no-write-outside` and `no-edit-outside` match a path to `.planning/seldon/brief.md`, `.planning/seldon/prd.md`, `.planning/PROJECT.md` and `.planning/seldon/repair-log/../brief.md`. They don't match `.planning/seldon/repair-log/brief.md`, relative or absolute.
    - `runs-check` matches `node /x/lib/check.mjs --brief .planning/seldon/repair-log` and not `--brief .planning/seldon`.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case new-design-brief` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported. Before the kept folder is removed:
    - `node lib/check.mjs --brief <kept>/sealed/home/cwd/.planning/seldon/repair-log` exits 0.
    - `cmp` finds the kept `.planning/seldon/` four files byte-identical to `samples/brief.md`, `prd.md`, `spine.md` and `epics.md`, and the three Cadence files byte-identical to `samples/cadence-project/planning/`.
