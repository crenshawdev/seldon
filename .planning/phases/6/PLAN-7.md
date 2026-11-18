---
phase: 6
plan: 7
depends_on: [2, 6]
requirements:
  - ARCH-03
files:
  - skills/seldon/SKILL.md
  - samples/spine-conventions/brief.md
  - samples/spine-conventions/prd.md
  - samples/spine-conventions/code/server.mjs
  - samples/spine-conventions/code/fly.toml
  - samples/spine-conventions/code/src/tools.mjs
  - samples/spine-conventions/code/src/catalog.mjs
  - evals/spine-who-relies/case.yaml
  - evals/spine-who-relies/prompt.md
  - evals/spine-who-relies/seed.sh
  - evals/spine-who-relies/graders/asks-who-relies.md
  - evals/spine-who-relies/graders/no-write.md
  - evals/spine-who-relies/graders/no-edit.md
  - evals/spine-conventions/case.yaml
  - evals/spine-conventions/prompt.md
  - evals/spine-conventions/seed.sh
  - evals/spine-conventions/history.jsonl
  - evals/spine-conventions/graders/writes-spine.md
  - evals/spine-conventions/graders/check-passes.md
  - evals/spine-conventions/graders/quotes-code.md
  - evals/spine-conventions/graders/records-who-relies.md
---

# Phase 6: Existing projects and design folders - Plan 7: The spine cases on a project under Cadence

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan proves AC4: on a project under Cadence the spine step asks who relies on what today, and once answered writes a spine that quotes a convention from the code under an S- ID and records the answer under the decision for the part it names.

## Must be true when done

- `samples/spine-conventions/` holds the repair log's brief and PRD and a small Toolshed code tree. One coined token sits in `code/src/tools.mjs` and in no other fixture, prompt or history file. Outside the code, only `quotes-code`'s pattern names it.
- The spine-who-relies case scores 1.00. With Cadence's files, that code and that brief and PRD seeded, `/seldon spine` writes and edits nothing and asks the who-relies question in its fixed words.
- The spine-conventions case scores 1.00. Answering that question writes a `spine.md` that passes `--spine`. The token sits on a `> ` line under an `## S-NN:` heading, with `(src/tools.mjs)` on the line after the quote, and the answer sits on a `> ` line in the decision for the part it names.
- `spine-from-prd` still scores 1.00, so a project not under Cadence still drafts its spine in one turn.
- The loaded skill in a kept run is the whole of SKILL.md.
- `node --test tests/*.test.mjs` passes, and `claude plugin validate --strict .` exits 0 with the code fixture in the tree.

## Context

- **Locked:** D-06, D-07, D-08, D-09, D-12, D-13, D-15 and D-16. From Plan 2: `samples/cadence-project/planning/` and the repair-log dump. From Plan 6: the spine step's code reading, its quote form, the settled stack and host, and the who-relies question and route.
- **The fixture (my choice):** the same Toolshed and repair log as Plans 2 and 4. The repair log is used by the coordinator alone and runs nothing unattended, so the brief and PRD show no outside input and no unattended work. The code settles the stack and the host (D-13). That leaves the who-relies question as the spine step's only open question, so the ask turn and its replay stay one question long. The code tree's four file names are fixed here because the lease needs them.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Eval runs (SECURITY):** on the approval Plan 2 recorded for phase 6. If Plan 2's report records none, stop at a checkpoint marked SECURITY before the first run. Anything off these terms is a checkpoint marked SECURITY.
  - Run from `/code/seldon`, the main tree, never a worktree, one case at a time: `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants. `--keep-temp` is for the audit only and goes in no committed file.
  - **Bash audit:** after every run, report every Bash command in the kept `out/trace.jsonl`. Only `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon`, is allowed. Anything else is a SECURITY checkpoint: stop.
  - **Retries:** at most three tries per case. A retry comes only after a fix, or after a miss the trace shows is model variance. A case still failing after its third try is a checkpoint.
  - **Cleanup:** before the plan finishes, remove only the folders each run printed as kept, by their exact paths, never by a glob such as `/tmp/claude-eval-*`.
  - A kept run's workspace is `<kept>/sealed/home/cwd/`. Its session transcript is under `config/projects/` in the kept folder, and `out/trace.jsonl` holds no skill text (phase 5 Plan 4's deviation).
  - **This plan runs three cases:** `spine-who-relies`, `spine-conventions` and `spine-from-prd`.
- **Seed vetting:** a new `seed.sh` holds only the shebang, `set -euo pipefail`, the repo line, comments, `mkdir -p` inside the run and `cp` or `cp -R` from `"$repo/samples/..."`. The coordinator vets it before its first run: the task stops at a checkpoint quoting the file.
- **Case rules:** `allowed_tools` is `[Skill, Read, Glob, Grep]`. No line of a `case.yaml` or `prompt.md` says "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none holds a double-quoted backslash. Every new grader must fail when the behavior it claims is missing (phase 3 D-21), checked with a `node -e` script that reads each pattern from its grader file over hand-made inputs in the scratch area, never committed.
- **SKILL.md in the lease:** declared so a run that fails on the skill's text can be fixed inside this plan. No task edits it unless a run fails because of it. If any task edits SKILL.md, then before the plan reports done, run again every case this plan has already passed (`spine-who-relies`, `spine-from-prd`, and `spine-conventions` if it passed before the edit), redo Task 2's loaded-size check (5) at SKILL.md's final size, and run `node --test tests/*.test.mjs` and `claude plugin validate --strict .`, each case on the same audit, retry and cleanup terms. A must-be-true line counts as met only against the SKILL.md the plan ends with.
- **Owner's words:** committed files never carry the owner's own words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add the repair log's brief, PRD and Toolshed's code

- **Files:** samples/spine-conventions/brief.md, samples/spine-conventions/prd.md, samples/spine-conventions/code/server.mjs, samples/spine-conventions/code/fly.toml, samples/spine-conventions/code/src/tools.mjs, samples/spine-conventions/code/src/catalog.mjs
- **Reads:** evals/cadence-project/history.jsonl, samples/spine-from-prd/brief.md, samples/spine-from-prd/prd.md, samples/cadence-project/planning/PROJECT.md, skills/seldon/SKILL.md#15. The spine step
- **Decisions:** D-16, D-12, D-13, D-08
- **Action:** the fixture both spine cases seed.
  - **`brief.md` and `prd.md`:** the repair log, from the dump in `evals/cadence-project/history.jsonl`.
    - The brief passes `--brief` and the PRD passes `--prd`. Every item is quoted or tagged, as in `samples/spine-from-prd/`.
    - Neither shows outside input or unattended work: the coordinator alone uses the repair log.
    - No `> ` line names a stack or a host, so the code is what settles them (D-13).
    - Neither holds the token.
  - **The code, Toolshed as already built, each file short:**
    - **`server.mjs`:** serves the app with Node's built-in `http` module and nothing else, which settles the stack.
    - **`fly.toml`:** deploys it, which settles the host.
    - **`src/catalog.mjs`:** renders the catalog page members see.
    - **`src/tools.mjs`:** holds the tool records.
  - **The token (D-16):** one coined word on one line of `src/tools.mjs`, in a comment or an identifier, found in no file in the repository before this task. That line states a convention of one of the six kinds that the repair log touches, such as that only this module changes a tool's record (D-08, D-12). Task 3's grader looks for the token on a quoted line, so keep the convention on one line.
  - **Kept clear:** no package manifest, lockfile or test file in the tree, so nothing in this repository runs or installs it.
- **Verify:**
  - **Testing scope:** the outcome is a fixture that conforms, settles the stack and host in code, and holds the token in one place. Four checks are enough, and testing stops there.
  - (1) `node lib/check.mjs --brief samples/spine-conventions` and `--prd samples/spine-conventions` each exit 0. Today each exits 1 with a missing file.
  - (2) `grep -rlF --exclude-dir=results <token> README.md docs evals lib samples skills tests` lists only `samples/spine-conventions/code/src/tools.mjs`.
  - (3) `node --check` exits 0 on `server.mjs`, `src/tools.mjs` and `src/catalog.mjs`.
  - (4) `claude plugin validate --strict .` exits 0, `node lib/check.mjs samples` exits 0, and `node --test tests/*.test.mjs` passes.

### Task 2: Add the spine-who-relies case

- **Files:** evals/spine-who-relies/case.yaml, evals/spine-who-relies/prompt.md, evals/spine-who-relies/seed.sh, evals/spine-who-relies/graders/asks-who-relies.md, evals/spine-who-relies/graders/no-write.md, evals/spine-who-relies/graders/no-edit.md
- **Reads:** evals/cadence-project/seed.sh, evals/spine-job/case.yaml, evals/spine-job/graders/asks-unattended.md, evals/spine-job/graders/no-write.md, evals/spine-job/graders/no-edit.md, skills/seldon/SKILL.md#15. The spine step
- **Decisions:** D-09, D-06, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC4's ask. A project under Cadence with Toolshed's code and the repair log's brief and PRD, no spine, and the prompt `/seldon spine`.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then `cp -R "$repo/samples/cadence-project/planning/." .planning/`. Copy `samples/spine-conventions/brief.md` and `prd.md` into `.planning/seldon/`, then `cp -R "$repo/samples/spine-conventions/code/." .`. Nothing else.
  - **`prompt.md`:** exactly `/seldon spine`.
  - **`case.yaml`:** `scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`asks-who-relies.md`:** `regex` on `last_message`. It matches the who-relies question copied from SKILL.md, on a line of its own, in spine-job's `asks-unattended` form.
    - **`no-write.md` and `no-edit.md`:** spine-job's.
- **Verify:**
  - **Testing scope:** the outcome is AC4's ask, which no case covers today. Three graders, their D-21 checks, one passing run, a `spine-from-prd` rerun for projects not under Cadence and the size check are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) Phase 3 D-21, with a `node -e` script: `asks-who-relies` matches a message holding the question on a line of its own. It doesn't match the question with one word changed, or one holding only the unattended-work question.
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case spine-who-relies` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported.
  - (5) In that run's kept session transcript, the loaded skill text holds SKILL.md's last sentence and ends at `</process>`, and `wc -c skills/seldon/SKILL.md` is reported beside it. This answers the loader-size assumption at SKILL.md's final size for the phase.
  - (6) The run command with `--case spine-from-prd` exits 0 at 1.00.

### Task 3: Add the spine-conventions case

- **Files:** evals/spine-conventions/case.yaml, evals/spine-conventions/prompt.md, evals/spine-conventions/seed.sh, evals/spine-conventions/history.jsonl, evals/spine-conventions/graders/writes-spine.md, evals/spine-conventions/graders/check-passes.md, evals/spine-conventions/graders/quotes-code.md, evals/spine-conventions/graders/records-who-relies.md
- **Reads:** evals/spine-who-relies/seed.sh, evals/spine-answers/history.jsonl, evals/spine-answers/case.yaml, evals/spine-answers/graders/carries-answer.md, evals/spine-answers/graders/check-passes.md, evals/spine-answers/graders/writes-spine.md, samples/spine-conventions/code/src/tools.mjs, skills/seldon/SKILL.md#16. The spine draft
- **Decisions:** D-16, D-07, D-09, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC4's replay (D-16). Same seed as Task 2. A saved session asked the who-relies question, and the prompt answers it.
  - **`seed.sh`:** the same lines as Task 2's.
  - **`history.jsonl`:** spine-answers' shape, `cwd` `/tmp/seldon-spine-conventions`. Two lines:
    - the user's `/seldon spine`
    - the assistant's turn: one or two sentences saying the code already settles the stack and the host, then the who-relies question last, as SKILL.md writes it
  - **`prompt.md`:** `/seldon ` and an answer naming one dependent outside the repository and the one part of Toolshed it relies on. Pick a part the repair log's brief and PRD make it touch, so the spine has a decision for it. Use words found nowhere in the fixture, so a quote of them can only come from the answer.
  - **`case.yaml`:** `history_file: history.jsonl`, `scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders, on `.planning/seldon/spine.md` unless named otherwise:**
    - **`writes-spine.md` and `check-passes.md`:** spine-answers'.
    - **`quotes-code.md`:** `regex`, `flags: m`. It matches an `## S-NN:` section whose body holds a `> ` line with the token. After any further `> ` lines of the same quote, the next line is `(src/tools.mjs)`, indented like the quote.
    - **`records-who-relies.md`:** `regex`, `flags: m`, in carries-answer's form. It matches an `## S-NN:` section holding a `> ` line with a distinctive run of the answer, whose own text outside its quotes names the part the answer names.
- **Verify:**
  - **Testing scope:** the outcome is AC4's spine, which no case covers today. Four graders, their D-21 checks, one passing run and the kept workspace's check are enough, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and every `history.jsonl` line parses as JSON with its `parentUuid` chained. The history's last line holds the who-relies question as a whole line, `grep -cxF`-equal to SKILL.md's. `grep -rlF --exclude-dir=results <token> README.md docs evals lib samples skills tests` lists only `samples/spine-conventions/code/src/tools.mjs` and `evals/spine-conventions/graders/quotes-code.md`.
  - (2) Phase 3 D-21, with a `node -e` script over hand-made spines:
    - A correct spine, with the token quoted under one decision followed by its path line and the answer quoted in the named part's decision, passes all four graders and passes `--spine`.
    - `quotes-code` fails each of these: the token only in prose with no quote, the quote with no path line, the path line naming another file, and the token quoted before the first `## ` heading.
    - `records-who-relies` fails each of these: the answer quoted in a decision whose text names another part, and the answer paraphrased.
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case spine-conventions` exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported. Before the kept folder is removed, `node lib/check.mjs --spine <kept>/sealed/home/cwd/.planning/seldon` exits 0.
