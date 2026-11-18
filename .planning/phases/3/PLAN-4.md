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
---

# Phase 3: The PRD, resume and rerun - Plan 4: Step names and the PRD rerun

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan does three things:

- makes `/seldon brief`, `/seldon prd`, `/seldon spine` and `/seldon epics` reruns of that one step
- keeps every untouched requirement ID and line when the PRD reruns
- proves that the PRD comes from the brief file, not the earlier conversation, in the case that settles whether a history and a scaffold combine

## Must be true when done

- `/seldon spine` writes and edits nothing and ends on the fixed later-release line, even with a brief and a PRD on disk. The spine-later case scores 1.00.
- A brief file and an earlier conversation can disagree on one fact. In that case `/seldon prd` puts the brief's fact in `prd.md` and leaves the conversation's fact out. The prd-reads-brief case scores 1.00, or so do both halves of the split.
- This plan's report records whether one case can combine `context.history_file` and `context.scaffold_script`, and whether the history's recorded `cwd` gets in the way. A yes needs a Read of the seeded `.planning/seldon/brief.md` inside the run's own workspace, made under the history. `evals/prd-reads-brief/case.yaml` shows the answer: it names a `history_file` only on a yes.
- After the brief drops reminders, `/seldon prd` does three things, and the prd-rerun case scores 1.00:
  - it keeps every other requirement's line and quote byte-identical
  - it lists LOAN-03 on a `Retired:` line under `## Requirements`
  - it doesn't bring LOAN-03 back as a bullet
- Only `/seldon prd` updates an existing `prd.md`. Every other route into the PRD step that finds one still ends on the later-release line, as Plan 2's guard says.
- SKILL.md's `allowed-tools` still holds exactly phase 2 D-02's five entries.

## Context

- **Locked:** D-03, D-08, D-09, D-15, D-16, D-17, D-20 and D-21.
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
- **The combined form:** Task 3's run settles whether a case can combine a history and a scaffold. prd-reads-brief is the first case whose step has to read the seeded brief under a history.
  - Without it, Task 3 takes CONTEXT's fallback split.
  - Without it, Plan 5's brief-rerun cases stop at a checkpoint for John, with no fallback made up for them (the user's decision at the plan review). Plan 5 reads the answer from whether `evals/prd-reads-brief/case.yaml` names a `history_file`.
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
    - With a `brief.md` there, it's the brief rerun, which Plan 5 Task 1 adds.
    - When the turn before was Plan 2's documents question, the brief rerun takes that question's dump as the change and skips Reopening's ask. Plan 5 Task 1 says how. The step-name test still decides that this is a brief rerun; the turn before decides only where the rerun gets its change.
    - With none, it's a new brief run with no dump, which is the fixed dump ask in §3.
  - **`argument-hint`:** in the frontmatter, it names the step names alongside the dump.
- **Verify:**
  - **Testing scope:** Task 2 proves the spine route by eval, Task 3 the `prd` route, and Plan 5 Tasks 2 and 3 the `brief` route. A text check that fails today plus the pinned test are enough here, and testing stops there.
  - (1) SKILL.md's §1 names all four step names and says the whole trimmed argument must be exactly one of them. `argument-hint` names them. The `brief` route points to the brief rerun (Plan 5 Task 1) for a `/seldon brief` that follows the documents question. None of this is true today.
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
    - **`says-later-release.md`:** `regex` on `last_message`, matching the fixed later-release words only as they end the message. After the words, only whitespace or a closing fence may come before the end of the message, the way Plan 3's `suggests-clear` matches its words.
    - **`no-write.md`:** `tool_used` Write, with `min: 0` and `max: 0`.
    - **`no-edit.md`:** `tool_used` Edit, with `min: 0` and `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is the second half of AC6. Nothing covers it today. Three graders and one run are the evidence, and testing stops there.
  - (1) D-21, checked with a `node -e` script that reads the pattern from its file. `says-later-release` matches the fixed line as SKILL.md holds it, both alone at the end of a message and followed by a closing fence. It doesn't match:
    - phase 2's removed line `Rerunning a step comes in a later release.`
    - the fixed resume line
    - a reply announcing a drafted spine
    - the fixed words followed by one extra sentence, such as an offer to rerun the PRD instead

    The two `tool_used` graders read `min: 0` and `max: 0`.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) The run command with `--case spine-later` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

### Task 3: Add the prd-reads-brief case

- **Files:** samples/prd-reads-brief/brief.md, evals/prd-reads-brief/case.yaml, evals/prd-reads-brief/prompt.md, evals/prd-reads-brief/history.jsonl, evals/prd-reads-brief/seed.sh, evals/prd-reads-brief/graders/writes-prd.md, evals/prd-reads-brief/graders/carries-brief-fact.md, evals/prd-reads-brief/graders/drops-talk-fact.md, evals/prd-ignores-talk/case.yaml, evals/prd-ignores-talk/prompt.md, evals/prd-ignores-talk/history.jsonl, evals/prd-ignores-talk/graders/no-prd.md, evals/prd-ignores-talk/graders/no-write.md
- **Reads:** evals/confirm-clear/case.yaml, evals/confirm-clear/history.jsonl, evals/prd-from-brief/seed.sh, samples/brief.md
- **Decisions:** D-15, D-16, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC3's case. It proves the PRD step reads the brief file, never the earlier conversation. It's also the phase's first case that combines `history_file` and `scaffold_script`, and its run settles whether the two combine.
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
  - **The combined-form check (CONTEXT's flagged assumptions):** two things are unclear: whether the two combine, and whether the history's recorded `cwd` gets in the way of the scaffolded workspace. The answer lives in this case's combined run, so build and run the combined form first. Its `/seldon prd` step has to read `brief.md`, which is why the check sits here. The combination works only if all four of these hold:
    1. The case loads and runs.
    2. The kept trace shows the history's messages before the prompt.
    3. After the prompt, under the history, the trace holds at least one Read whose `file_path` is `.planning/seldon/brief.md` inside the run's own workspace, and its result is the seeded brief's text, not an error. Every other file-tool call in the trace resolves inside the workspace too. With zero file-tool calls this condition fails, because a run that touches no file shows nothing about where the tools resolve.
    4. The workspace still holds the seeded brief afterwards.

    If any of them fails, the combined form isn't shown to work. Record which condition failed and take the fallback below.
  - **Fallback (CONTEXT's flagged assumption):** applies when the combined-form check fails. That means one case can't combine a history and a scaffold, so the case splits.
    - `prd-reads-brief` drops `history_file`, `history.jsonl` and `drops-talk-fact`, and proves only the brief's fact.
    - A new history-only case, `prd-ignores-talk`, takes this history and the prompt `/seldon prd`, with no brief on disk. It proves the PRD step doesn't build from the conversation (D-15, Task 1's no-brief route). Its graders:
      - **`no-prd.md`:** `file_exists` on `.planning/seldon/prd.md`, with `exists: false`.
      - **`no-write.md`:** `tool_used` Write, with `min: 0` and `max: 0`.
    - Leave no files of the form that isn't used.
  - **What follows from a no:** Plan 5's brief-rerun cases stop at a checkpoint for John, with no fallback made up for them (the user's decision at the plan review). Plan 5 reads the answer from whether this `case.yaml` names a `history_file`, which it does only when all four conditions held.
- **Verify:**
  - **Testing scope:** the outcome is AC3, the brief's fact in and the conversation's fact out, plus the answer to the combined form. Nothing covers either today. The graders, the run or runs, the trace reading and the D-21 checks are the evidence, and testing stops there.
  - (1) `node lib/check.mjs --brief samples/prd-reads-brief` passes. `grep` finds the brief's value nowhere in the history and the history's value nowhere in the fixture.
  - (2) D-21, checked with a `node -e` script that reads each pattern from its file:
    - `carries-brief-fact` doesn't match a PRD holding only the history's value.
    - `drops-talk-fact` matches, which fails the grader, a PRD holding the history's value in digits and one holding it in words.
    - `writes-prd`'s path is exactly `.planning/seldon/prd.md`.
    - Under the fallback, `no-prd` reads `exists: false`, so a run that creates `prd.md` fails it.
  - (3) `node --test tests/scaffold.test.mjs` passes.
  - (4) The run command for each case this task kept exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. The report says which form was used.
  - (5) The report states the combined form's answer and the trace evidence from the combined run behind each of the four conditions. For condition 3, it gives the Read's `file_path` next to the kept workspace's path. With no such Read, it says condition 3 failed and that the case split. `evals/prd-reads-brief/case.yaml` names `history_file` exactly when all four held.

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
  - (5) `ls -d /tmp/claude-eval-*` matches nothing, and `git status --porcelain` lists only this plan's files.

## Notes

- **Choices derived, not decided:** two routes in Task 1 follow from D-15, D-08 and D-06 rather than from a decision of their own. Both were accepted at the plan review.
  - `/seldon prd` with no brief writes nothing and says the brief comes first.
  - `/seldon brief` with no brief is a new brief run that asks for the dump.
- **Task 4's premise:** `/seldon prd` isn't the only route that reaches the PRD step with `prd.md` there. Plan 2's guard covers the others, and Task 4 makes the rerun its one exception.
- **Why the combined-form check sits in Task 3:** prd-reads-brief is the first case whose step has to read the seeded brief under a history, so a missing Read there speaks to the harness rather than to a step with no reason to read. The user moved the check here from Plan 3's confirm-clear case after the last revision. It runs before Plan 5's brief-rerun cases, which need its answer.
- **Prior art:** each is from phases/3/CONTEXT.md, phase 3.
  - D-09 (keeping IDs) and D-03 (retired IDs) inform Tasks 4 and 5.
  - D-07 (ending a step) is the end every rerun uses.
- **Byte-identical lines:** an Edit update, not a full rewrite, is how D-09's lines stay byte-identical. It's Task 4's chosen method. Its Verify accepts any method the eval passes.
- **Split from one plan:** Plans 4 and 5 were one eight-task plan whose composed brief passed Cadence's 32,768-byte ceiling. The brief rerun's three tasks moved to Plan 5, which runs after this one.
