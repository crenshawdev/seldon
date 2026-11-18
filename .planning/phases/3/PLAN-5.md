---
phase: 3
plan: 5
depends_on: [1, 2, 3, 4]
requirements:
  - FLOW-03
files:
  - skills/seldon/SKILL.md
  - evals/brief-rerun/case.yaml
  - evals/brief-rerun/prompt.md
  - evals/brief-rerun/history.jsonl
  - evals/brief-rerun/seed.sh
  - evals/brief-rerun/graders/keeps-untouched-item.md
  - evals/brief-rerun/graders/carries-change.md
  - evals/brief-rerun/graders/prd-not-written.md
  - evals/brief-rerun/graders/prd-not-edited.md
  - evals/brief-rerun-dump/case.yaml
  - evals/brief-rerun-dump/prompt.md
  - evals/brief-rerun-dump/history.jsonl
  - evals/brief-rerun-dump/seed.sh
  - evals/brief-rerun-dump/graders/carries-dump.md
---

# Phase 3: The PRD, resume and rerun - Plan 5: Rerunning the brief

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan does two things:

- updates the brief in place when `/seldon brief` reruns it
- takes the dump from Plan 2's documents question as the change when the user answers it with the rerun

## Must be true when done

- `/seldon brief` followed by a change updates `brief.md` in place, keeps an untouched item and its quote byte-identical, and never writes or edits `prd.md`. The brief-rerun case scores 1.00.
- `/seldon brief` typed as the reply to Plan 2's documents question takes the dump from that question's turn as the change. It puts the dump's new words in `brief.md` in that same turn, without asking what should change. The brief-rerun-dump case scores 1.00.
- SKILL.md's `allowed-tools` still holds exactly phase 2 D-02's five entries.

## Context

- **Locked:** D-02, D-04, D-20 and D-21.
- **SECURITY (phase 2 D-02):** `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`.
- **Fixed lines in use:** Plan 2's documents question and Plan 3's `/clear` words.
- **Runs and the Bash audit:** as in Plan 2's Context.
  - Run from `/code/seldon`, never a worktree, one `--case` per run, with `--keep-temp` before `--allow-tools`, and `--allow-tools` last with exactly `"Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`.
  - Report every Bash command in each kept trace. Anything but the `--brief` or `--prd` check on `.planning/seldon` is a checkpoint.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:**
  - `allowed_tools: [Skill, Read, Glob, Grep]` only.
  - Continuation prompts start with `/seldon`.
  - Histories are hand-written in phase 1's record shape, with a UUID-shaped `sessionId`.
  - A scaffold is only copy lines from `samples/`.
  - No line of a `case.yaml` or `prompt.md` says "scaffold" except `scaffold_script: seed.sh`, and none holds a double-quoted backslash.
  - Every new grader passes D-21 before commit.
  - A scaffolded file is invisible to `file_exists`, so a document the scaffold placed is graded by its contents or by `tool_used`.
- **The combined form:** Plan 4 Task 3 settled whether a case can combine a history and a scaffold. `evals/prd-reads-brief/case.yaml` naming a `history_file` means it can. It names one only when that run showed a Read of the seeded brief inside its own workspace, made under the history.
  - Without it, Tasks 2 and 3 stop at a checkpoint for John, with no fallback made up for them (the user's decision at the plan review).
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Rerun the brief in place

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#10. The draft
- **Decisions:** D-04, D-02
- **Pins:** tests/skill.test.mjs
- **Action:**
  - **Reopening (D-04):** with `brief.md` there, `/seldon brief` reopens the brief step on it.
    - Read `brief.md`, name it, and ask in one prose question what should change. Write nothing in that turn.
    - There's no path recommendation, because the user chose a path when the brief was first written. That's my choice, recorded here.
  - **§1's new position:** the brief has been reopened, the change asked about, and the user has answered. Update `brief.md` in place with Edit:
    - Every item the change doesn't touch keeps its line and quote byte-identical.
    - A changed or new item quotes the user's new words, as "The draft" says, or carries a tag.
    - What it refuses keeps its rules: a refusal is never guessed.
    - Then the brief check and the step's end (Plan 3 Task 4).
  - **The documents question (D-02):** when the turn before was Plan 2's documents question and the user answers it by choosing the rerun, the dump from that question's turn is the change. That holds whether the answer is `/seldon brief`, the command the question names, or the rerun in other words.
    - This comes before Reopening. The rerun skips Reopening's ask and goes straight to the update in the same turn, so the user never has to type the dump again.
    - The update is the one in §1's new position above, with the dump as the user's answer: its new words are the quotes.
  - **`prd.md`:** the brief rerun never writes or edits it. Marking it stale is phase 6's CHECK-04.
- **Verify:**
  - **Testing scope:** Tasks 2 and 3 prove this behavior by eval. A text check that fails today plus the pinned test are enough here, and testing stops there.
  - (1) SKILL.md says three things, none of which it says today:
    - `/seldon brief` reopens the existing brief and updates it with Edit, keeping untouched items and quotes byte-identical.
    - It leaves `prd.md` alone.
    - `/seldon brief`, or another rerun answer, right after the documents question takes that question's dump as the change and skips Reopening's ask.
  - (2) `node --test tests/skill.test.mjs` passes and `claude plugin validate --strict .` exits 0.

### Task 2: Add the brief-rerun case

- **Files:** evals/brief-rerun/case.yaml, evals/brief-rerun/prompt.md, evals/brief-rerun/history.jsonl, evals/brief-rerun/seed.sh, evals/brief-rerun/graders/keeps-untouched-item.md, evals/brief-rerun/graders/carries-change.md, evals/brief-rerun/graders/prd-not-written.md, evals/brief-rerun/graders/prd-not-edited.md
- **Reads:** evals/prd-reads-brief/case.yaml, evals/confirm-clear/history.jsonl, samples/brief.md, evals/write-scope/graders/no-write-outside.md
- **Decisions:** D-04, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** The second half of AC4. It needs the combined form.
  - **Without the combined form:** if `evals/prd-reads-brief/case.yaml` names no `history_file`, stop at a checkpoint for John. This case needs a history and a seeded brief together, and it has no fallback. Don't make one up.
  - **`seed.sh`:** copies `samples/brief.md` to `.planning/seldon/brief.md` and `samples/prd.md` to `.planning/seldon/prd.md`.
  - **`history.jsonl`:** the user's `/seldon brief`, then Seldon naming `.planning/seldon/brief.md` and asking what should change, as Task 1 shapes that turn.
  - **`prompt.md`:** `/seldon` and a change that touches one item of `samples/brief.md`, in new words found nowhere in it. A tighter checkout time is one example.
  - **`case.yaml`:** `context.history_file: history.jsonl` and `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`keeps-untouched-item.md`:** `regex` on the file `.planning/seldon/brief.md`. It requires one item the change doesn't touch, its text line and its quote line, exactly as `samples/brief.md` has them, as one block. Who it serves is one example.
    - **`carries-change.md`:** `regex` on the same file, finding the user's new words on a `> ` line.
    - **`prd-not-written.md`:** `tool_used` Write, with `min: 0`, `max: 0` and an `input_match` matching a `file_path` that ends in `.planning/seldon/prd.md`.
    - **`prd-not-edited.md`:** the same, for Edit.
- **Verify:**
  - **Testing scope:** the outcome is the second half of AC4. Nothing covers it today. Four graders, one run, the D-21 checks and a byte comparison of the seeded PRD are the evidence, and testing stops there.
  - (1) D-21, checked with a `node -e` script that reads each pattern from its file:
    - `keeps-untouched-item` doesn't match a copy of `samples/brief.md` with one word of that item's quote changed.
    - `carries-change` doesn't match `samples/brief.md`.
    - The two `input_match` patterns match the JSON-encoded input of a Write or Edit to `<workspace>/.planning/seldon/prd.md`, and don't match one to `brief.md`.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) The run command with `--case brief-rerun` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (4) Before the kept folder is removed, `cmp` shows the workspace's `.planning/seldon/prd.md` is byte-identical to `samples/prd.md`.

### Task 3: Add the brief-rerun-dump case

- **Files:** evals/brief-rerun-dump/case.yaml, evals/brief-rerun-dump/prompt.md, evals/brief-rerun-dump/history.jsonl, evals/brief-rerun-dump/seed.sh, evals/brief-rerun-dump/graders/carries-dump.md
- **Reads:** evals/prd-reads-brief/case.yaml, evals/brief-rerun/case.yaml, evals/brief-rerun/history.jsonl, evals/brief-rerun/graders/carries-change.md, evals/existing-brief/prompt.md, samples/brief.md, skills/seldon/SKILL.md
- **Decisions:** D-02, D-04, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** A case where the user answers Plan 2's documents question with `/seldon brief`. It proves the dump they just gave becomes the change and isn't set aside (D-02). A case holds one history, so this is a case of its own rather than a second history in brief-rerun.
  - **Without the combined form:** if `evals/prd-reads-brief/case.yaml` names no `history_file`, stop at a checkpoint for John, as Task 2 does. This case also needs a history and a seeded brief together.
  - **`seed.sh`:** copies `samples/brief.md` to `.planning/seldon/brief.md` after making the folder, and does nothing else.
  - **`history.jsonl`:** in the record shape of confirm-clear's history, with a UUID-shaped `sessionId`, two records:
    - The user's `/seldon` and a new dump for the Toolshed project that changes one item of `samples/brief.md`, in new words found nowhere in it. A change to who borrows, such as the counter opening to a second group, is one example. Pick words that also differ from brief-rerun's change.
    - Seldon's reply, which ends on SKILL.md's fixed documents question, copied character for character from SKILL.md.
  - **`prompt.md`:** exactly `/seldon brief`.
  - **`case.yaml`:** `context.history_file: history.jsonl` and `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description never uses the word scaffold.
  - **Grader `carries-dump.md`:** `regex` on the file `.planning/seldon/brief.md`, finding the dump's new words on a `> ` line, in the same form as brief-rerun's `carries-change`. The run has one user turn, so a rerun that asks what should change and stops leaves the seeded brief as it was, and this grader fails it.
- **Verify:**
  - **Testing scope:** the outcome is the D-02 promise for the reply the documents question names: the dump reaches `brief.md` without a second ask. Nothing covers it today: brief-rerun's history starts from `/seldon brief` itself. One grader, one run and the D-21 checks are the evidence, and testing stops there.
  - (1) The history's last record is an assistant message whose text ends with SKILL.md's fixed documents question, character for character. `grep` finds the dump's new words nowhere in `samples/brief.md`.
  - (2) D-21, checked with a `node -e` script that reads the pattern from its file. `carries-dump` doesn't match:
    - `samples/brief.md`, which is what a run that asks what should change leaves on disk
    - a copy of `samples/brief.md` holding the dump's new words only in an item's text line and on no `> ` line

    It matches a copy whose changed item carries the new words on a `> ` line.
  - (3) `node --test tests/scaffold.test.mjs` passes, with the new `seed.sh` scanned.
  - (4) The run command with `--case brief-rerun-dump` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (5) `ls -d /tmp/claude-eval-*` matches nothing, and `git status --porcelain` lists only this plan's files.

## Notes

- **The documents question's rerun answer:** Task 1 wires it in, `/seldon brief` typed as the reply included, and Task 3 proves that reply by eval. Plan 2 left it without a path until this plan.
- **Prior art:** D-07 (ending a step), from phases/3/CONTEXT.md, phase 3, is the end the brief rerun uses.
- **Split from Plan 4:** Plans 4 and 5 were one eight-task plan whose composed brief passed Cadence's 32,768-byte ceiling. This plan takes the brief rerun's three tasks and runs after Plan 4, whose Task 3 answers the combined-form question these cases need.
