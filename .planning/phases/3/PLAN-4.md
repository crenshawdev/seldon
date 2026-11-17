---
phase: 3
plan: 4
depends_on: [1, 2, 3]
requirements:
  - FLOW-03
  - FLOW-04
files:
  - skills/seldon/SKILL.md
  - evals/spine-later/case.yaml
  - evals/spine-later/prompt.md
  - evals/spine-later/seed.sh
  - evals/spine-later/graders/says-later-release.md
  - evals/spine-later/graders/no-write.md
  - evals/spine-later/graders/no-edit.md
  - samples/prd-reads-brief/brief.md
  - evals/prd-reads-brief/case.yaml
  - evals/prd-reads-brief/prompt.md
  - evals/prd-reads-brief/history.jsonl
  - evals/prd-reads-brief/seed.sh
  - evals/prd-reads-brief/graders/writes-prd.md
  - evals/prd-reads-brief/graders/carries-brief-fact.md
  - evals/prd-reads-brief/graders/drops-talk-fact.md
  - evals/prd-ignores-talk/case.yaml
  - evals/prd-ignores-talk/prompt.md
  - evals/prd-ignores-talk/history.jsonl
  - evals/prd-ignores-talk/graders/no-prd.md
  - evals/prd-ignores-talk/graders/no-write.md
  - samples/prd-rerun/brief.md
  - evals/prd-rerun/case.yaml
  - evals/prd-rerun/prompt.md
  - evals/prd-rerun/seed.sh
  - evals/prd-rerun/graders/keeps-unchanged-lines.md
  - evals/prd-rerun/graders/retires-dropped-id.md
  - evals/prd-rerun/graders/no-reused-id.md
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

# Phase 3: The PRD, resume and rerun - Plan 4: Rerunning one step

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan does four things:

- makes `/seldon brief`, `/seldon prd`, `/seldon spine` and `/seldon epics` reruns of that one step
- keeps every untouched requirement ID and line when the PRD reruns
- updates the brief in place when it reruns
- proves that the PRD comes from the brief file, not the earlier conversation

## Must be true when done

- `/seldon spine` writes and edits nothing and ends on the fixed later-release line, even with a brief and a PRD on disk. The spine-later case scores 1.00.
- A brief file and an earlier conversation can disagree on one fact. In that case `/seldon prd` puts the brief's fact in `prd.md` and leaves the conversation's fact out. The prd-reads-brief case scores 1.00, or so do both halves of the split.
- After the brief drops reminders, `/seldon prd` does three things, and the prd-rerun case scores 1.00:
  - it keeps every other requirement's line and quote byte-identical
  - it lists LOAN-03 on a `Retired:` line under `## Requirements`
  - it doesn't bring LOAN-03 back as a bullet
- `/seldon brief` followed by a change updates `brief.md` in place, keeps an untouched item and its quote byte-identical, and never writes or edits `prd.md`. The brief-rerun case scores 1.00.
- `/seldon brief` typed as the reply to Plan 2's documents question takes the dump from that question's turn as the change. It puts the dump's new words in `brief.md` in that same turn, without asking what should change. The brief-rerun-dump case scores 1.00.
- Only `/seldon prd` updates an existing `prd.md`. Every other route into the PRD step that finds one still ends on the later-release line, as Plan 2's guard says.
- SKILL.md's `allowed-tools` still holds exactly phase 2 D-02's five entries.

## Context

- **Locked:** D-02, D-03, D-04, D-08, D-09, D-15, D-16, D-17, D-20 and D-21.
- **SECURITY (phase 2 D-02):** `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`.
- **Fixed lines in use:** Plan 2's later-release line and Plan 3's `/clear` words.
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
- **The combined form:** Plan 3 Task 5 settled whether a case can combine a history and a scaffold. `evals/confirm-clear/case.yaml` naming a `scaffold_script` means it can. It names one only when that run showed a Read of the seeded brief inside its own workspace, made under the history.
  - Without it, Task 3 takes CONTEXT's fallback split.
  - Without it, Tasks 7 and 8 stop at a checkpoint for John, with no fallback made up for them (the user's decision at the plan review).
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Treat an exact step name as a rerun of that step

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#3. The dump
- **Decisions:** D-08, D-17, D-15
- **Pins:** tests/skill.test.mjs
- **Action:**
  - **The test, first in §1:** before §1 looks at the conversation, trim `$ARGUMENTS`. If it is exactly `brief`, `prd`, `spine` or `epics`, it's a rerun of that step, whatever position the conversation is in and whatever files exist. Any other argument keeps its meaning (D-08): a dump on a new run, the documents question when documents exist, or a summary or answer on a later turn.
  - **`spine` or `epics`:** write nothing and end on Plan 2's fixed later-release line (D-17).
  - **`prd`:** the PRD step, from `brief.md` alone (D-15).
    - With no `brief.md`, the PRD has nothing to build from. Write nothing and say there's no brief yet, and that a bare `/seldon` starts it.
    - With a `prd.md` already there, it's a rerun, which Task 4 adds.
  - **`brief`:**
    - With a `brief.md` there, it's the brief rerun, which Task 6 adds.
    - When the turn before was Plan 2's documents question, the brief rerun takes that question's dump as the change and skips Reopening's ask. Task 6 says how. The step-name test still decides that this is a brief rerun; the turn before decides only where the rerun gets its change.
    - With none, it's a new brief run with no dump, which is the fixed dump ask in §3.
  - **`argument-hint`:** in the frontmatter, it names the step names alongside the dump.
- **Verify:**
  - **Testing scope:** Task 2 proves the spine route by eval, Task 3 the `prd` route, and Tasks 7 and 8 the `brief` route. A text check that fails today plus the pinned test are enough here, and testing stops there.
  - (1) SKILL.md's §1 names all four step names and says the whole trimmed argument must be exactly one of them. `argument-hint` names them. The `brief` route points to Task 6 for a `/seldon brief` that follows the documents question. None of this is true today.
  - (2) `node --test tests/skill.test.mjs` passes and `claude plugin validate --strict .` exits 0.

### Task 2: Add the spine-later case

- **Files:** evals/spine-later/case.yaml, evals/spine-later/prompt.md, evals/spine-later/seed.sh, evals/spine-later/graders/says-later-release.md, evals/spine-later/graders/no-write.md, evals/spine-later/graders/no-edit.md
- **Reads:** evals/existing-brief/case.yaml, evals/resume/seed.sh
- **Decisions:** D-17, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** The second half of AC6.
  - **`seed.sh`:** copies `samples/brief.md` and `samples/prd.md` into `.planning/seldon/`. With both documents there, drafting a spine would be the tempting mistake, and the case is meant to catch it.
  - **`prompt.md`:** exactly `/seldon spine`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 10`, `timeout_seconds: 300` and the read-only tools.
  - **Graders:**
    - **`says-later-release.md`:** `regex` on `last_message`, matching the fixed later-release line.
    - **`no-write.md`:** `tool_used` Write, with `min: 0` and `max: 0`.
    - **`no-edit.md`:** `tool_used` Edit, with `min: 0` and `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is the second half of AC6. Nothing covers it today. Three graders and one run are the evidence, and testing stops there.
  - (1) D-21, checked with a `node -e` script that reads the pattern from its file. `says-later-release` matches the fixed line as SKILL.md holds it. It doesn't match:
    - phase 2's removed line `Rerunning a step comes in a later release.`
    - the fixed resume line
    - a reply announcing a drafted spine

    The two `tool_used` graders read `min: 0` and `max: 0`.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) The run command with `--case spine-later` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

### Task 3: Add the prd-reads-brief case

- **Files:** samples/prd-reads-brief/brief.md, evals/prd-reads-brief/case.yaml, evals/prd-reads-brief/prompt.md, evals/prd-reads-brief/history.jsonl, evals/prd-reads-brief/seed.sh, evals/prd-reads-brief/graders/writes-prd.md, evals/prd-reads-brief/graders/carries-brief-fact.md, evals/prd-reads-brief/graders/drops-talk-fact.md, evals/prd-ignores-talk/case.yaml, evals/prd-ignores-talk/prompt.md, evals/prd-ignores-talk/history.jsonl, evals/prd-ignores-talk/graders/no-prd.md, evals/prd-ignores-talk/graders/no-write.md
- **Reads:** evals/confirm-clear/case.yaml, evals/confirm-clear/history.jsonl, samples/brief.md
- **Decisions:** D-15, D-16, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC3's case. It proves the PRD step reads the brief file, never the earlier conversation.
  - **Fixture `samples/prd-reads-brief/brief.md`:**
    - A confirmed brief for a coined project. It passes `--brief`, and every item carries a quote or a tag.
    - One fact the PRD has to carry sits in an item and its `> ` quote. It's a capability-level value, such as a number of days or a limit, not a technology.
  - **`history.jsonl`:**
    - The brief step's whole conversation for the same project, as text in the record shape of confirm-clear's history.
    - The user's dump states a different value for that fact, the one they held before editing the brief file by hand.
    - Then the recommendation, the confirmation, the written-and-checked brief with its confirm question, and the user's confirmation.
    - It ends on Seldon's fixed `/clear` words, and the user never clears (D-16).
    - The brief's value appears nowhere in the history, and the history's value appears nowhere in the fixture.
  - **`seed.sh`:** copies the fixture to `.planning/seldon/brief.md`.
  - **`prompt.md`:** exactly `/seldon prd`.
  - **`case.yaml`:** both `context.history_file: history.jsonl` and `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`writes-prd.md`:** `file_exists` on `.planning/seldon/prd.md`. No PRD is seeded, so the run's own write is visible.
    - **`carries-brief-fact.md`:** `regex` on the file `.planning/seldon/prd.md`, finding the brief's value.
    - **`drops-talk-fact.md`:** `regex` on the same file, with `match: not_contains`. It matches the history's value in any spelling the PRD could use, in digits and in words.
  - **Fallback (CONTEXT's flagged assumption):** applies if `evals/confirm-clear/case.yaml` names no `scaffold_script`. That means one case can't combine a history and a scaffold, so the case splits.
    - `prd-reads-brief` drops `history_file`, `history.jsonl` and `drops-talk-fact`, and proves only the brief's fact.
    - A new history-only case, `prd-ignores-talk`, takes this history and the prompt `/seldon prd`, with no brief on disk. It proves the PRD step doesn't build from the conversation (D-15, Task 1's no-brief route). Its graders:
      - **`no-prd.md`:** `file_exists` on `.planning/seldon/prd.md`, with `exists: false`.
      - **`no-write.md`:** `tool_used` Write, with `min: 0` and `max: 0`.
    - Don't create files for the form that isn't used.
- **Verify:**
  - **Testing scope:** the outcome is AC3, the brief's fact in and the conversation's fact out. Nothing covers it today. The graders, the run or runs and the D-21 checks are the evidence, and testing stops there.
  - (1) `node lib/check.mjs --brief samples/prd-reads-brief` passes. `grep` finds the brief's value nowhere in the history and the history's value nowhere in the fixture.
  - (2) D-21, checked with a `node -e` script that reads each pattern from its file:
    - `carries-brief-fact` doesn't match a PRD holding only the history's value.
    - `drops-talk-fact` matches, which fails the grader, a PRD holding the history's value in digits and one holding it in words.
    - `writes-prd`'s path is exactly `.planning/seldon/prd.md`.
    - Under the fallback, `no-prd` reads `exists: false`, so a run that creates `prd.md` fails it.
  - (3) `node --test tests/scaffold.test.mjs` passes.
  - (4) The run command for each case this task kept exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. The report says which form was used.

### Task 4: Keep requirement IDs when the PRD reruns

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, docs/FORMAT.md#IDs are stable, samples/prd.md
- **Decisions:** D-09, D-03, D-17
- **Pins:** tests/skill.test.mjs
- **Action:** This covers `/seldon prd` when `prd.md` is already there.
  - **The one route that updates a PRD:** other routes reach the PRD step with `prd.md` there too, such as going on from the documents question with both documents present. Plan 2's guard sends each of them to the later-release line without writing. This task makes the `/seldon prd` rerun the guard's one exception, and leaves the guard in force for every other route. The rerun never makes a fresh Write over `prd.md`.
  - **What it reads:** read `prd.md` first, the previous version of its own document, and `brief.md`, and nothing else. That excludes the conversation.
  - **How it updates:** update `prd.md` in place with Edit, so lines the change doesn't touch are never retyped. Every requirement the brief change doesn't touch keeps its bullet line and its quote lines byte-identical (D-09).
  - **Changed and dropped requirements:**
    - A requirement the change alters keeps its ID and takes the new text and quote.
    - A requirement the change drops is removed. Its ID goes on the `Retired:` line under `## Requirements`, where `docs/FORMAT.md` places it. The line is made when the first ID retires and extended after that (D-03).
  - **New requirements:** a new one takes the next unused number for its prefix, never an ID in use or on the `Retired:` line, because IDs carry into Cadence's `REQUIREMENTS.md` unchanged.
  - **The rest of the PRD:** Non-goals and MVP scope follow the brief too. A new refusal becomes a non-goal bullet with its quote, and MVP scope stops naming a retired ID.
  - **End:** then the check and the step's end, as for a first draft.
- **Verify:**
  - **Testing scope:** Task 5 proves this behavior by eval. A text check that fails today plus the pinned test are enough here, and testing stops there.
  - (1) SKILL.md says a PRD rerun reads the existing `prd.md`, updates it with Edit, keeps untouched requirement lines byte-identical, and lists a dropped ID on the `Retired:` line without reusing it. `grep -c 'Retired:' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) SKILL.md's guard from Plan 2 Task 4 still sends every route into the PRD step that finds `prd.md`, except `/seldon prd`, to the later-release line.
  - (3) `node --test tests/skill.test.mjs` passes.

### Task 5: Add the prd-rerun case and its fixture

- **Files:** samples/prd-rerun/brief.md, evals/prd-rerun/case.yaml, evals/prd-rerun/prompt.md, evals/prd-rerun/seed.sh, evals/prd-rerun/graders/keeps-unchanged-lines.md, evals/prd-rerun/graders/retires-dropped-id.md, evals/prd-rerun/graders/no-reused-id.md
- **Reads:** samples/brief.md, samples/prd.md, evals/spine-later/seed.sh
- **Decisions:** D-09, D-03, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** The first half of AC4.
  - **Fixture `samples/prd-rerun/brief.md`:**
    - It's `samples/brief.md` with only the reminder taken out. Scope's item and its quote no longer hold the reminder.
    - What it refuses gains a fourth refusal: it won't send reminders, because of a reason, with its quote.
    - Every other line is byte-identical to `samples/brief.md`. Plan 1 Task 6 made LOAN-03 the only requirement in `samples/prd.md` that quotes the Scope line, so rewriting that line touches LOAN-03 alone.
  - **`seed.sh`:** copies the fixture to `.planning/seldon/brief.md` and `samples/prd.md` to `.planning/seldon/prd.md`.
  - **`prompt.md`:** exactly `/seldon prd`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`keeps-unchanged-lines.md`:** `regex` on the file `.planning/seldon/prd.md`. For each requirement in `samples/prd.md` except LOAN-03, it requires the bullet line and its quote or tag exactly as `samples/prd.md` has them, as one block starting at a line start. It uses one lookahead per requirement. One grader is my choice, and the executor may split it into one grader per requirement.
    - **`retires-dropped-id.md`:** `regex` on the same file, finding a line starting `Retired:` that names LOAN-03 inside `## Requirements`.
    - **`no-reused-id.md`:** `regex` on the same file, with `match: not_contains` and `flags: m`. It matches a `- **LOAN-03**:` bullet.
- **Verify:**
  - **Testing scope:** the outcome is the first half of AC4. Nothing covers it today. Three graders, one run and the D-21 checks are the evidence, and testing stops there.
  - (1) `diff samples/brief.md samples/prd-rerun/brief.md` shows only Scope's item and quote and the added refusal. `node lib/check.mjs --brief samples/prd-rerun` passes.
  - (2) D-21, checked with a `node -e` script that reads each pattern from its file:
    - **`keeps-unchanged-lines`:**
      - It matches `samples/prd.md` with LOAN-03's lines removed.
      - It doesn't match a copy with one character changed in CAT-01's text.
      - It doesn't match a copy with LOAN-01's quote line removed.
      - It doesn't match a copy with NFR-02 renumbered.
    - **`retires-dropped-id`:**
      - It doesn't match `samples/prd.md`.
      - It doesn't match a copy with the `Retired:` line under MVP scope.
      - It doesn't match a copy whose `Retired:` line names another ID.
    - **`no-reused-id`:** it matches `samples/prd.md`, which still lists LOAN-03, and doesn't match a copy without that bullet.
  - (3) `node --test tests/scaffold.test.mjs` passes.
  - (4) The run command with `--case prd-rerun` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

### Task 6: Rerun the brief in place

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
  - **Testing scope:** Tasks 7 and 8 prove this behavior by eval. A text check that fails today plus the pinned test are enough here, and testing stops there.
  - (1) SKILL.md says three things, none of which it says today:
    - `/seldon brief` reopens the existing brief and updates it with Edit, keeping untouched items and quotes byte-identical.
    - It leaves `prd.md` alone.
    - `/seldon brief`, or another rerun answer, right after the documents question takes that question's dump as the change and skips Reopening's ask.
  - (2) `node --test tests/skill.test.mjs` passes and `claude plugin validate --strict .` exits 0.

### Task 7: Add the brief-rerun case

- **Files:** evals/brief-rerun/case.yaml, evals/brief-rerun/prompt.md, evals/brief-rerun/history.jsonl, evals/brief-rerun/seed.sh, evals/brief-rerun/graders/keeps-untouched-item.md, evals/brief-rerun/graders/carries-change.md, evals/brief-rerun/graders/prd-not-written.md, evals/brief-rerun/graders/prd-not-edited.md
- **Reads:** evals/confirm-clear/case.yaml, evals/confirm-clear/history.jsonl, samples/brief.md, evals/write-scope/graders/no-write-outside.md
- **Decisions:** D-04, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** The second half of AC4. It needs the combined form.
  - **Without the combined form:** if `evals/confirm-clear/case.yaml` names no `scaffold_script`, stop at a checkpoint for John. This case needs a history and a seeded brief together, and it has no fallback. Don't make one up.
  - **`seed.sh`:** copies `samples/brief.md` to `.planning/seldon/brief.md` and `samples/prd.md` to `.planning/seldon/prd.md`.
  - **`history.jsonl`:** the user's `/seldon brief`, then Seldon naming `.planning/seldon/brief.md` and asking what should change, as Task 6 shapes that turn.
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

### Task 8: Add the brief-rerun-dump case

- **Files:** evals/brief-rerun-dump/case.yaml, evals/brief-rerun-dump/prompt.md, evals/brief-rerun-dump/history.jsonl, evals/brief-rerun-dump/seed.sh, evals/brief-rerun-dump/graders/carries-dump.md
- **Reads:** evals/brief-rerun/case.yaml, evals/brief-rerun/history.jsonl, evals/brief-rerun/graders/carries-change.md, evals/existing-brief/prompt.md, samples/brief.md, skills/seldon/SKILL.md
- **Decisions:** D-02, D-04, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** A case where the user answers Plan 2's documents question with `/seldon brief`. It proves the dump they just gave becomes the change and isn't set aside (D-02). A case holds one history, so this is a case of its own rather than a second history in brief-rerun.
  - **Without the combined form:** if `evals/confirm-clear/case.yaml` names no `scaffold_script`, stop at a checkpoint for John, as Task 7 does. This case also needs a history and a seeded brief together.
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

- **Choices derived, not decided:** two routes in Task 1 follow from D-15, D-08 and D-06 rather than from a decision of their own. Both were accepted at the plan review.
  - `/seldon prd` with no brief writes nothing and says the brief comes first.
  - `/seldon brief` with no brief is a new brief run that asks for the dump.
- **The documents question's rerun answer:** Task 6 wires it in, `/seldon brief` typed as the reply included, and Task 8 proves that reply by eval. Plan 2 left it without a path until this plan.
- **Task 4's premise:** `/seldon prd` isn't the only route that reaches the PRD step with `prd.md` there. Plan 2's guard covers the others, and Task 4 makes the rerun its one exception.
- **Prior art:** each is from phases/3/CONTEXT.md, phase 3.
  - D-09 (keeping IDs) and D-03 (retired IDs) inform Tasks 4 and 5.
  - D-07 (ending a step) is the end every rerun uses.
- **Byte-identical lines:** an Edit update, not a full rewrite, is how D-09's lines stay byte-identical. It's Task 4's chosen method. Its Verify accepts any method the eval passes.
