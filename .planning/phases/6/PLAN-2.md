---
phase: 6
plan: 2
requirements:
  - FLOW-05
files:
  - skills/seldon/SKILL.md
  - samples/cadence-project/planning/PROJECT.md
  - samples/cadence-project/planning/ROADMAP.md
  - samples/cadence-project/planning/STATE.md
  - evals/cadence-project/case.yaml
  - evals/cadence-project/prompt.md
  - evals/cadence-project/seed.sh
  - evals/cadence-project/history.jsonl
  - evals/cadence-project/graders/writes-brief.md
  - evals/cadence-project/graders/runs-check.md
  - evals/cadence-project/graders/check-passes.md
  - evals/cadence-project/graders/no-write-outside.md
  - evals/cadence-project/graders/no-edit.md
  - evals/cadence-dump/case.yaml
  - evals/cadence-dump/prompt.md
  - evals/cadence-dump/seed.sh
  - evals/cadence-dump/graders/recommends-fast-path.md
  - evals/cadence-dump/graders/no-write.md
  - evals/cadence-dump/graders/no-edit.md
---

# Phase 6: Existing projects and design folders - Plan 2: Projects under Cadence

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan proves FLOW-05 end to end, first: SKILL.md says what Cadence's files mean to a run, and a case shows `/seldon` on a project under Cadence writing the brief with every Cadence file untouched.

## Must be true when done

- SKILL.md says a project counts as under Cadence when `.planning/PROJECT.md` exists, that files in `.planning/` outside `.planning/seldon/` don't change where a run starts, and that the brief and PRD steps read none of them. No route, stop point or fixed line changes.
- `samples/cadence-project/planning/` holds Cadence's `PROJECT.md`, `ROADMAP.md` and `STATE.md` for Toolshed, the fixture Plans 4 and 7 seed as well.
- The cadence-project case scores 1.00 (AC1). Cadence's three files are seeded and `.planning/seldon/` isn't, and confirming the fast path on a dump writes `.planning/seldon/brief.md`. The brief passes `--brief`, with no Write outside `.planning/seldon/` and no Edit. In the kept workspace the three Cadence files are byte-identical to the fixture.
- The cadence-dump case scores 1.00, proving FLOW-05's "instead of refusing" live: Cadence's three files are seeded and `.planning/seldon/` isn't, the prompt is the dump itself, and the model's own last message puts `Recommended path: fast path` on a line of its own, with no Write and no Edit.
- `node --test tests/*.test.mjs` passes, and `allowed-tools` is still the pinned five.

## Context

- **Locked:** D-01, D-10, D-11 and D-15. Seldon has no refusal to remove (D-10). The refusal FLOW-05 names is Cadence's own, so this plan adds a statement and its proof, not a route.
- **Toolshed (my choice):** the coined project of `samples/brief.md`. In this phase's fixtures it is already built under Cadence. Its next body of work is a repair log that the library's coordinator alone keeps: each tool that comes back broken, what's wrong with it, and when it's fixed. That work takes no outside input and runs nothing unattended, and its dump names no stack or host. Plan 4 reuses this plan's dump word for word, and Plan 7's spine fixture is the same body of work.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Eval runs (SECURITY):** phases 4 and 5 ran cases with the owner's approval per phase. Phase 6 has none on record. Before this phase's first run (Task 3), stop at a checkpoint marked SECURITY that asks the owner to approve phase 6's runs on the terms below, and record the answer in the task report. The approval asked for covers two kinds of run: every per-case run Plans 2, 4, 5 and 7 make, and Plan 8's one full-suite run, the README's command run verbatim from `/code/seldon` with only `--keep-temp` added before `--allow-tools`. Both kinds follow the audit, retry and cleanup terms below. Anything off these terms is a checkpoint marked SECURITY.
  - Run from `/code/seldon`, the main tree, never a worktree, one case at a time: `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants. `--keep-temp` is for the audit only and goes in no committed file.
  - **Bash audit:** after every run, report every Bash command in the kept `out/trace.jsonl`. Only `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon` or a named design's folder under it, is allowed. Anything else is a SECURITY checkpoint: stop.
  - **Retries:** at most three tries per case. A retry comes only after a fix, or after a miss the trace shows is model variance. A case still failing after its third try is a checkpoint.
  - **Cleanup:** before the plan finishes, remove only the folders each run printed as kept, by their exact paths, never by a glob such as `/tmp/claude-eval-*`.
  - A kept run's workspace is `<kept>/sealed/home/cwd/`, as phase 5's reports found.
- **Seed vetting:** a new `seed.sh` holds only the shebang, `set -euo pipefail`, the repo line, comments, `mkdir -p` inside the run and `cp` or `cp -R` from `"$repo/samples/..."`. The coordinator vets it before its first run: the task stops at a checkpoint quoting the file.
- **Case rules:** `allowed_tools` is `[Skill, Read, Glob, Grep]`. No line of a `case.yaml` or `prompt.md` says "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none holds a double-quoted backslash. Every new grader must fail when the behavior it claims is missing (phase 3 D-21), checked with a `node -e` script that reads each pattern from its grader file over hand-made inputs in the scratch area, never committed.
- **Owner's words:** committed files never carry the owner's own words. This repository's own `.planning/` files are a shape to follow, never text to copy.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Say what Cadence's files mean to a run

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#rules, skills/seldon/SKILL.md#4. The design folder, skills/seldon/SKILL.md#12. The PRD step
- **Decisions:** D-01, D-10, D-11
- **Pins:** tests/skill.test.mjs
- **Action:** one paragraph of its own in "2. Where a run starts", ahead of its routes, says three things:
  - **Under Cadence (D-01):** a project counts as under Cadence when `.planning/PROJECT.md` exists, the file Cadence's `/cad-new-project` stops on. Whether it's there is a question for Glob. Never Read it.
  - **Where a run starts (D-10):** files in `.planning/` outside `.planning/seldon/`, Cadence's included, don't change where a run starts. With no brief a run goes to the dump, just as on a new project, and writes only inside `.planning/seldon/`.
  - **The brief and the PRD (D-11):** the brief and PRD steps read none of those files. The dump describes the next body of work, and what the project already has enters the design only at the spine step.
  - **Pure addition:** change no existing line. No new route, stop point, question or fixed line, and no Glob added at the start of a run. D-10 means where a run starts never depends on these files, and the spine-from-prd and full-walk graders allow only Glob and Skill before a resume line. Plan 6 uses this test at the spine step.
- **Verify:**
  - **Testing scope:** the outcome is the statement. Task 4's cadence-dump case proves the behavior live, and Task 3's case the brief written under Cadence, so greps that fail today, the pinned test and the validator are enough, and testing stops there.
  - (1) `perl -00 -ne 'print if /\.planning\/PROJECT\.md/' skills/seldon/SKILL.md` prints exactly one paragraph, and it holds `brief`, `PRD` and `spine`. Today it prints nothing.
  - (2) `perl -ne 'print if /^## 2\./../^## 3\./' skills/seldon/SKILL.md | grep -c 'PROJECT\.md'` prints at least 1. It prints 0 today.
  - (3) `git diff -U0 skills/seldon/SKILL.md | grep -c '^-[^-]'` prints 0, so the task only adds lines.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 2: Add Toolshed's Cadence files as a fixture

- **Files:** samples/cadence-project/planning/PROJECT.md, samples/cadence-project/planning/ROADMAP.md, samples/cadence-project/planning/STATE.md
- **Reads:** .planning/PROJECT.md, .planning/ROADMAP.md, .planning/STATE.md, samples/brief.md, samples/prd.md
- **Decisions:** D-15
- **Action:** three short files in the shape of Cadence's own, for Toolshed already built under Cadence (D-15).
  - **`PROJECT.md`:** what Toolshed is and who it's for, as `samples/brief.md` tells it, with its requirements shown as built.
  - **`ROADMAP.md`:** a few phases with goals, every one complete.
  - **`STATE.md`:** the position after the last phase.
  - **Words:** coined, written for this fixture. This repository's own `.planning/` files give the headings and line forms only.
  - **The folder:** `planning/`, with no leading dot, so nothing that reads this repository's own `.planning/` takes the fixture for it. Seeds copy it to `.planning/`. It holds no `seldon/` folder.
- **Verify:**
  - **Testing scope:** the outcome is a fixture that looks like Cadence's files and carries none of the owner's words. Two checks are enough, and testing stops there.
  - (1) Each of the three files exists and its first non-blank line starts `# `. Today none exists.
  - (2) A `node -e` script finds no line over 30 characters in the three files that also appears in this repository's `.planning/PROJECT.md`, `.planning/ROADMAP.md` or `.planning/STATE.md`.

### Task 3: Add the cadence-project case

- **Files:** evals/cadence-project/case.yaml, evals/cadence-project/prompt.md, evals/cadence-project/seed.sh, evals/cadence-project/history.jsonl, evals/cadence-project/graders/writes-brief.md, evals/cadence-project/graders/runs-check.md, evals/cadence-project/graders/check-passes.md, evals/cadence-project/graders/no-write-outside.md, evals/cadence-project/graders/no-edit.md
- **Reads:** evals/write-scope/history.jsonl, evals/write-scope/case.yaml, evals/design-folder/graders/no-write-outside.md, evals/design-folder/graders/no-edit.md, evals/coaching-brief/graders/runs-check.md, evals/coaching-brief/graders/check-passes.md, evals/design-folder/seed.sh, skills/seldon/SKILL.md#6. The recommendation
- **Decisions:** D-15, D-10, D-01
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC1's case. Cadence's files are seeded with no `.planning/seldon/`, a saved session holds a dump and the recommendation, and the prompt confirms the fast path.
  - **`seed.sh`:** `mkdir -p .planning`, then `cp -R "$repo/samples/cadence-project/planning/." .planning/`, and nothing else.
  - **`history.jsonl`:** write-scope's shape: the same fields, one `sessionId`, `parentUuid` chained, `cwd` `/tmp/seldon-cadence-project`, and write-scope's `version`. Two lines:
    - the user's `/seldon` with the dump: the repair log as Context describes it, answering all eight brief sections and the stakes plainly, who it's for and what it won't do and why included, so the fast path has nothing to ask
    - the assistant's recommendation, as "6. The recommendation" says: it names the repair log, puts `Recommended path: fast path` on a line of its own, gives one or two reasons from the dump and asks whether the user confirms
  - **`prompt.md`:** `/seldon Fast path is fine, go ahead.`
  - **`case.yaml`:** `history_file: history.jsonl`, `scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders (D-15: no Edit plus no Write outside `.planning/seldon/` is what keeps every Cadence file byte-identical):**
    - **`writes-brief.md`:** `file_exists` on `.planning/seldon/brief.md`.
    - **`runs-check.md`:** coaching-brief's, `lib/check\.mjs --brief` at least once.
    - **`check-passes.md`:** coaching-brief's, the brief's pass line in the last message.
    - **`no-write-outside.md`:** design-folder's, byte for byte.
    - **`no-edit.md`:** design-folder's, no Edit at all, as AC1 says.
- **Verify:**
  - **Testing scope:** the outcome is AC1, which no case covers today. Five graders, their D-21 checks, one passing run and a byte comparison in the kept workspace are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes with the new `seed.sh` scanned.
  - (2) Every line of `history.jsonl` parses as JSON, and each line's `parentUuid` is the line before's `uuid`.
  - (3) Phase 3 D-21, with a `node -e` script reading each pattern from its grader file:
    - `no-write-outside` matches a Write to `.planning/PROJECT.md`, to `.planning/seldon/x/brief.md` and to `.planning/seldon/../STATE.md`. It doesn't match one to `.planning/seldon/brief.md`, relative or absolute.
    - `runs-check` matches a `--brief .planning/seldon` command and not a `--prd` one.
    - `check-passes` rejects the PRD's pass line.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The owner's approval of phase 6's runs is recorded. This is the SECURITY checkpoint in Context.
  - (6) The run command with `--case cadence-project` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported. Before the kept folder is removed:
    - `node lib/check.mjs --brief <kept>/sealed/home/cwd/.planning/seldon` exits 0.
    - `cmp` finds each of the kept workspace's `.planning/PROJECT.md`, `ROADMAP.md` and `STATE.md` byte-identical to its file in `samples/cadence-project/planning/`.

### Task 4: Add the cadence-dump case

- **Files:** evals/cadence-dump/case.yaml, evals/cadence-dump/prompt.md, evals/cadence-dump/seed.sh, evals/cadence-dump/graders/recommends-fast-path.md, evals/cadence-dump/graders/no-write.md, evals/cadence-dump/graders/no-edit.md
- **Reads:** evals/cadence-project/history.jsonl, evals/cadence-project/seed.sh, evals/fast-path/prompt.md, evals/fast-path/graders/recommends-fast-path.md, evals/fast-path/graders/no-write.md, evals/fast-path/graders/no-edit.md, skills/seldon/SKILL.md#6. The recommendation
- **Decisions:** D-10, D-01, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** the live proof of FLOW-05's "instead of refusing". Task 3's dump turn and recommendation come from its history, so the model writes neither. Here the model meets the dump itself on a project under Cadence with no design, and has to recommend a path.
  - **`seed.sh`:** byte-identical to Task 3's.
  - **`prompt.md`:** `/seldon ` followed by the dump in Task 3's first history line, word for word.
  - **`case.yaml`:** `scaffold_script: seed.sh` only, no history, `max_turns: 10`, `timeout_seconds: 300` and the read-only tools.
  - **Graders:** fast-path's `recommends-fast-path.md`, `no-write.md` and `no-edit.md`, byte for byte.
- **Verify:**
  - **Testing scope:** the outcome is FLOW-05's first turn on a project under Cadence, which no case runs live today. Three copied graders, their D-21 checks and one passing run are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes with the new `seed.sh` scanned, and `cmp evals/cadence-dump/seed.sh evals/cadence-project/seed.sh` exits 0.
  - (2) The prompt after `/seldon ` equals the text of Task 3's first history line's user message, checked with a `node -e` script.
  - (3) Phase 3 D-21, with a `node -e` script reading the pattern from `recommends-fast-path.md`: it matches `Recommended path: fast path` on a line of its own, and rejects `Recommended path: coaching` and a message that says only `Project already initialized.`
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint, and with the file byte-identical to Task 3's vetted seed it is quick.
  - (5) The run command with `--case cadence-dump` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported. The kept workspace holds no `.planning/seldon/` at all.
