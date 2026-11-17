---
phase: 4
plan: 6
depends_on: [1, 2, 3, 5]
requirements:
  - ARCH-04
files:
  - skills/seldon/SKILL.md
  - evals/architecture-on-request/case.yaml
  - evals/architecture-on-request/prompt.md
  - evals/architecture-on-request/seed.sh
  - evals/architecture-on-request/graders/writes-architecture.md
---

# Phase 4: The architecture spine - Plan 6: The full architecture document

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. This plan lets the user ask for a full architecture document with `/seldon architecture`, and Seldon writes one only on that request (ARCH-04). It proves both halves:

- AC5's positive half here
- the negative half, already graded in spine-from-prd, run again once the spine's confirm names the command

## Must be true when done

- The architecture-on-request case scores 1.00. `/seldon architecture` over a confirmed spine creates `.planning/seldon/architecture.md`. The document expands on each S- decision by its ID, adds none of its own, and leaves `spine.md` untouched.
- The spine's confirm question names `/seldon architecture`. spine-from-prd still scores 1.00, so naming it doesn't make Seldon write `architecture.md` unasked.
- `/seldon architecture` with no `spine.md` there writes nothing and says the spine comes first.
- Every point in SKILL.md where a turn stops to ask still has a §1 route back. `allowed-tools` is still phase 2 D-02's five, and `claude plugin validate --strict .` exits 0.

## Context

- **Locked:** D-05, D-13 and D-17.
- **The flagged assumption:** CONTEXT left the no-spine case to the planner. I take it as flagged: `/seldon architecture` with no spine writes nothing and says the spine comes first, as `/seldon spine` with no PRD does under D-07.
- **SECURITY (phase 2 D-02, D-13):** `allowed-tools` stays exactly its five entries. `architecture.md` falls inside `Edit(.planning/seldon/**)`. No task touches the grant.
- **No new stop point:** the architecture document ends without a question, so it needs no §1 route. Task 2's Verify runs the stop-point audit once more, as the phase's last SKILL.md change.
- **Eval runs:** as in Plan 3's Context.
  - Run from `/code/seldon`, the main tree, never a worktree, one `--case` per run.
  - Use `--trust-plugin --no-publish --ablation none --scaffold --keep-temp`, then `--allow-tools` last with exactly the two grants.
  - **This plan runs exactly two cases:** `architecture-on-request`, which is new, and `spine-from-prd` again, for AC5's negative half after Task 2.
- **Seed vetting:** the new `seed.sh` holds only `mkdir -p .planning/seldon` and `cp` lines from `"$repo/samples/..."`, besides the shebang, `set -euo pipefail`, the repo line and comments. The coordinator vets it before its first run. The task stops at a checkpoint quoting the file.
- **Bash audit:** as in Plan 3. architecture-on-request should run no command at all, since the document gets no check. Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:** as in Plan 3. Every new grader must fail when the behavior it claims is missing (phase 3 D-21).
- **Owner's words:** committed files never carry the owner's own words.
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Write architecture.md only on /seldon architecture

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#rules, skills/seldon/SKILL.md#17. The spine check, docs/FORMAT.md#Location and ownership
- **Decisions:** D-05, D-17, D-13
- **Pins:** tests/skill.test.mjs
- **Action:** The full document is written on one exact request and nowhere else.
  - **The name (D-17):** §1's name test takes `architecture` as a fifth name beside `brief`, `prd`, `spine` and `epics`. It's matched the same way: the whole trimmed argument is exactly `architecture`. It isn't a step, so the wording says that. Its route:
    - Look for `.planning/seldon/spine.md` with Read or Glob.
    - **No spine there:** write nothing, and say the spine comes first and how to get to it. The wording is free (the flagged assumption).
    - **A spine there:** go to a new "18. The architecture document", after "17. The spine check". The name is my choice.
  - **"18. The architecture document" (D-05):**
    - **What it reads:** `brief.md`, `prd.md` and `spine.md`, and nothing else.
    - **What it writes:** `.planning/seldon/architecture.md`. It expands on each decision in `spine.md` by its S- ID and names every one of them, drawing on the three files.
    - **What it adds:** no decision and no ID of its own. Say why: `/cad-context` locks only S- IDs, so a decision here would be a second, unlocked source a planner could follow against the spine.
    - **What it leaves alone:** it never writes or edits `spine.md`, `brief.md` or `prd.md`.
    - **No check:** none runs on it.
    - **A second request:** when `architecture.md` is already there, Read it and replace it whole with Write, from the files as they stand. It holds nothing of its own to keep. That's my choice, recorded here.
    - **The ending:** name the file, and say every decision in it is the spine's. End without a question, so this route adds no stop point.
  - **No other route writes it,** including a confirm answer that asks for the document in other words. D-17 rejects reading a request from free wording.
  - **`<rules>`:** the files Seldon writes are `brief.md`, `prd.md` and `spine.md`, plus `architecture.md`, the one file written only on `/seldon architecture`.
  - **`argument-hint`:** adds `architecture`. The frontmatter `description` mentions the document on request. `allowed-tools` doesn't change.
- **Verify:**
  - **Testing scope:** Task 3 proves the write by eval, and Task 2's rerun of spine-from-prd proves nothing is written unasked. Text checks that fail today, plus the pinned test, are enough here, and testing stops there.
  - (1) `grep -c '/seldon architecture' skills/seldon/SKILL.md` and `grep -c 'architecture.md' skills/seldon/SKILL.md` each print at least 1. Each prints 0 today.
  - (2) §1's name test names `architecture` and routes the no-spine case to writing nothing. "18. The architecture document" says the document expands by S- ID, adds no decision of its own, gets no check and ends with no question.
  - (3) `argument-hint` holds `architecture`, and `<rules>` names `architecture.md` as written only on request.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 2: Name /seldon architecture at the spine's confirm

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#17. The spine check, skills/seldon/SKILL.md#11. The check, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-17
- **Pins:** tests/skill.test.mjs
- **Action:** The spine step's confirm question names the command, so the user learns it's there (D-17).
  - **The question:** it's still one plain-prose question that ends the message and the turn, after the repeated `--spine` result line. It still asks whether the user confirms the spine or wants changes, so §1's "Step confirm answered" still reads it.
  - **The other confirms:** the brief's and the PRD's confirm questions don't change.
  - **A typed reply:** a `/seldon architecture` typed as the reply goes through the name test first, as every step name does.
- **Verify:**
  - **Testing scope:** the regression run below is the evidence that naming the command writes nothing unasked. A text check that fails today plus the audit are enough, and testing stops there.
  - (1) `perl -ne 'print if /^## 17\./../^## 18\./' skills/seldon/SKILL.md | grep -c '/seldon architecture'` prints at least 1. It prints 0 before this task.
  - (2) **Stop-point audit, the phase's last:** list every place SKILL.md ends a turn on a question and the §1 route that carries it on, as a table in the plan report. Every row has a route, and the architecture document has no row because it asks nothing.
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (4) The run command with `--case spine-from-prd` exits 0 at 1.00. Its `no-write-but-spine` and `no-edit-but-spine` graders pass, and the Bash audit is reported.

### Task 3: Add the architecture-on-request case

- **Files:** evals/architecture-on-request/case.yaml, evals/architecture-on-request/prompt.md, evals/architecture-on-request/seed.sh, evals/architecture-on-request/graders/writes-architecture.md
- **Reads:** evals/resume-later/seed.sh, evals/spine-from-prd/graders/writes-spine.md, samples/spine.md
- **Decisions:** D-05, D-15, D-17
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC5's positive half.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy `samples/brief.md`, `samples/prd.md` and `samples/spine.md` in. A spine on disk counts as confirmed, so no history is needed.
  - **`prompt.md`:** exactly `/seldon architecture`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description doesn't say "scaffold".
  - **`writes-architecture.md`:** `file_exists` on `.planning/seldon/architecture.md`. D-15 fixes `file_exists` as this half's grader, and no second grader goes beside it.
- **Verify:**
  - **Testing scope:** the outcome is AC5's positive half, which nothing covers today. One grader, its D-21 check, one passing run and the workspace observations below are enough, and testing stops there.
  - (1) D-21: the grader's path is exactly `.planning/seldon/architecture.md`, and `seed.sh` copies no file of that name, so the seed can't satisfy it. A run that writes no such file scores 0 on it.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case architecture-on-request` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (5) Before the kept folder is removed, two checks on the workspace:
    - Its `architecture.md` names every S- ID in `samples/spine.md` and no S- ID outside it.
    - Its `.planning/seldon/spine.md` is byte-identical to `samples/spine.md` (`cmp`).

    Both are D-05's no-decision-of-its-own rule, checked by hand here and not graded.
