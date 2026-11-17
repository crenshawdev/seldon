---
phase: 5
plan: 6
depends_on: [1, 2, 3, 4, 5]
requirements:
  - FLOW-01
files:
  - skills/seldon/SKILL.md
  - evals/full-walk/case.yaml
  - evals/full-walk/prompt.md
  - evals/full-walk/history.jsonl
  - evals/full-walk/seed.sh
  - evals/full-walk/graders/names-spine-first.md
  - evals/full-walk/graders/writes-epics.md
  - evals/full-walk/graders/check-passes.md
  - evals/full-walk/graders/ends-on-confirm.md
  - evals/full-walk/graders/no-write-but-epics.md
  - evals/full-walk/graders/no-edit-but-epics.md
  - evals/epics-confirm/case.yaml
  - evals/epics-confirm/prompt.md
  - evals/epics-confirm/history.jsonl
  - evals/epics-confirm/seed.sh
  - evals/epics-confirm/graders/suggests-clear.md
  - evals/epics-confirm/graders/no-write.md
  - evals/epics-confirm/graders/no-edit.md
  - evals/resume-later/case.yaml
  - evals/resume-later/seed.sh
  - evals/resume-later/graders/says-later-release.md
  - evals/epics-no-spine/case.yaml
  - evals/epics-no-spine/prompt.md
  - evals/epics-no-spine/seed.sh
  - evals/epics-no-spine/graders/no-write.md
  - evals/epics-no-spine/graders/no-edit.md
  - evals/epics-no-spine/graders/names-spine-command.md
---

# Phase 5: Epics and the full walk - Plan 6: The full walk and its routes

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan proves the walk: a replayed conversation reaches the epics step after brief, PRD and spine and stops for a confirm, and the routes around the epics step go where the files say.

## Must be true when done

- The full-walk case scores 1.00. It replays a conversation that took brief, PRD and spine through their confirms and the `/clear` words, with those three files seeded. A bare `/seldon` then:
  - says the fixed epics resume line naming `spine.md` before any tool call but the look
  - writes `.planning/seldon/epics.md`
  - repeats `seldon check: epics.md conforms`
  - ends on the confirm question
  - writes and edits no `.planning/seldon/` file but `epics.md`
- The epics-confirm case scores 1.00: a confirm at the epics step ends on the `/clear` words, with Write and Edit at 0.
- The resume-later case scores 1.00 with all four documents seeded. A bare `/seldon` writes and edits nothing and ends on the new later-release line naming the readiness check and the handoff.
- The epics-no-spine case scores 1.00: `/seldon epics` with no `spine.md` writes and edits nothing and names `/seldon spine`.
- `git grep -n 'The epics step comes in a later release' -- skills/ docs/ README.md evals/` prints nothing, and `node --test tests/scaffold.test.mjs` passes with every new `seed.sh` scanned. It's `git grep` so the git-ignored eval results under `evals/results/` and the replay session files don't count.

## Context

- **Locked:** D-16, D-17, D-19 and D-20. From Plan 3: the epics resume line, the new later-release line, the `/seldon epics` route and the epics check's confirm question. From Plan 1: the updated `samples/epics.md`.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan. A hand-written history copies its fixed lines from SKILL.md too: the PRD and spine resume lines, each pass line, the epics confirm question and the `/clear` words.
- **Eval runs, seed vetting, the Bash audit and the case rules:** exactly as Plan 4's Context sets them, the four checks included.
  - **This plan runs four cases: `full-walk`, `epics-confirm`, `resume-later` and `epics-no-spine`.**
- **Histories:** a `history.jsonl` follows the form of `evals/spine-job/history.jsonl`: the same keys, a fresh `sessionId`, `parentUuid` chained from `null`, ascending timestamps, a `cwd` under `/tmp/seldon-<case>` and text-only assistant turns with no `tool_use` blocks. `evals/.gitignore` already ignores the session file a replay writes beside it.
- **The resume line's timing:** as Plan 3's Notes read D-16, the line comes after the look and before the next tool call. The resume grader allows only the look before it.
- **SKILL.md in the lease:** as in Plans 4 and 5, for a fix a failing run needs, and for nothing else.
- **Owner's words:** committed files never carry the owner's own words. The histories use the Toolshed dump `evals/confirm-clear/history.jsonl` already holds, and invented replies.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add the full-walk replay

- **Files:** evals/full-walk/case.yaml, evals/full-walk/prompt.md, evals/full-walk/history.jsonl, evals/full-walk/seed.sh, evals/full-walk/graders/names-spine-first.md, evals/full-walk/graders/writes-epics.md, evals/full-walk/graders/check-passes.md, evals/full-walk/graders/ends-on-confirm.md, evals/full-walk/graders/no-write-but-epics.md, evals/full-walk/graders/no-edit-but-epics.md
- **Reads:** evals/spine-job/case.yaml, evals/spine-job/history.jsonl, evals/confirm-clear/history.jsonl, evals/spine-from-prd/graders/names-prd-first.md, evals/spine-from-prd/graders/no-write-but-spine.md, evals/spine-from-prd/graders/no-edit-but-spine.md, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-20, D-16
- **Pins:** tests/scaffold.test.mjs
- **Action:** Criterion 1 and AC1's first half, as one history-plus-seed replay (D-20).
  - **`history.jsonl`:** the hand-written walk, in this order:
    1. A `/seldon` with the Toolshed dump, then the fast-path recommendation, the user confirming it, and the brief written with `seldon check: brief.md conforms` and its confirm question.
    2. The user confirming, then the `/clear` words.
    3. A bare `/seldon`, then the PRD resume line, the PRD written with its pass line and its confirm question.
    4. The user confirming, then the `/clear` words.
    5. A bare `/seldon`, then the spine resume line, the spine written with its pass line, and the spine's confirm question naming `/seldon architecture`.
    6. The user confirming, then the `/clear` words.

    The history needn't hold the spine's questions, since the epics step reads only the seeded files.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy `samples/brief.md`, `samples/prd.md` and `samples/spine.md` to `.planning/seldon/`, and nothing else.
  - **`prompt.md`:** exactly `/seldon`.
  - **`case.yaml`:** `context.history_file: history.jsonl` and `context.scaffold_script: seed.sh`, as spine-job's is. Also `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description doesn't say "scaffold".
  - **Graders:**
    - **`names-spine-first.md`:** `regex` on `trace`, spine-from-prd's `names-prd-first` adapted.
      - It finds an assistant text holding the epics resume line, exactly as SKILL.md fixes it, followed later by a Write whose `file_path` ends `.planning/seldon/epics.md`.
      - Between the look's last tool result and that text, the only `tool_use` allowed is Glob, Skill or a Read of `.planning/seldon/epics.md`. So a Read of `prd.md` or `spine.md` before the line fails it.
      - If one regex can't express that bound against a replay's trace, stop at a decision checkpoint with what it can express, rather than narrowing the must-be-true on your own.
    - **`writes-epics.md`:** `file_exists` on `.planning/seldon/epics.md`.
    - **`check-passes.md`:** `regex` on `last_message`, matching `seldon check: epics\.md conforms`.
    - **`ends-on-confirm.md`:** `regex` on `last_message`. The message's last non-blank line is the epics confirm question, exactly as "20. The epics check" fixes it, with regex metacharacters escaped.
    - **`no-write-but-epics.md` and `no-edit-but-epics.md`:** `tool_used` on Write and on Edit, each with `max: 0`. The `input_match` matches a `file_path` under `.planning/seldon/` whose file isn't `epics.md`, as spine-from-prd's pair does for `spine.md`.
- **Verify:**
  - **Testing scope:** the outcome is criterion 1 and AC1's first half, which nothing covers today. Six graders, their phase 3 D-21 checks and one passing run are enough. The earlier stops stay proven by phases 2 to 4's cases (D-20), and testing stops there.
  - (1) Every line of `history.jsonl` parses as JSON, each `parentUuid` names the line before it, and each fixed line in it equals SKILL.md's: the two resume lines, the three pass lines and the `/clear` words. A `node -e` script checks this.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) Phase 3 D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - **`names-spine-first`:** it matches a hand-made trace with the look, the line and then an `epics.md` Write. It doesn't match when the Write comes first, when the line is missing, when the line is the spine resume line, or when a Read of `prd.md` comes between the look and the line.
    - **`ends-on-confirm`:** it matches a message ending on the epics confirm question as SKILL.md fixes it. It doesn't match a message ending on the `/clear` words, on the new later-release line, or on a different question.
    - **`no-write-but-epics` and `no-edit-but-epics`:** each `input_match` matches the JSON-encoded input for `brief.md`, `prd.md` and `spine.md` under `.planning/seldon/`, and doesn't match it for `epics.md`.
    - **`check-passes`:** it doesn't match the brief, PRD, spine or all-four pass lines.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case full-walk` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. Before the kept folder is removed, `node lib/check.mjs --epics <kept workspace>/.planning/seldon` exits 0.

### Task 2: Add the epics-confirm replay

- **Files:** evals/epics-confirm/case.yaml, evals/epics-confirm/prompt.md, evals/epics-confirm/history.jsonl, evals/epics-confirm/seed.sh, evals/epics-confirm/graders/suggests-clear.md, evals/epics-confirm/graders/no-write.md, evals/epics-confirm/graders/no-edit.md
- **Reads:** evals/confirm-clear/case.yaml, evals/confirm-clear/history.jsonl, evals/confirm-clear/graders/suggests-clear.md, skills/seldon/SKILL.md#20. The epics check
- **Decisions:** D-20, D-17
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC1's second half: a confirm at the epics step proves the walk's last stop (D-20). It reuses the same `/clear` words (D-17).
  - **`history.jsonl`:** a bare `/seldon`, then the epics step's ending. That's the epics resume line, a sentence naming `.planning/seldon/epics.md`, `seldon check: epics.md conforms` on a line of its own, and the confirm question.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy `samples/brief.md`, `samples/prd.md`, `samples/spine.md` and `samples/epics.md` to `.planning/seldon/`, and nothing else. The history says those files exist, so the seed matches it. That's my choice, since confirm-clear seeds nothing.
  - **`prompt.md`:** exactly `/seldon Yes, that's right.`, as confirm-clear's is.
  - **`case.yaml`:** `context.history_file: history.jsonl` and `context.scaffold_script: seed.sh`, `max_turns: 10`, `timeout_seconds: 300` and the read-only tools. The description doesn't say "scaffold".
  - **Graders:**
    - **`suggests-clear.md`:** confirm-clear's grader, with the pattern copied unchanged.
    - **`no-write.md` and `no-edit.md`:** `tool_used` on Write and on Edit, each with `min: 0` and `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is the epics step's stop, which nothing covers today. Three graders and one passing run are enough, since `suggests-clear` is already proven by confirm-clear. Testing stops there.
  - (1) Every line of `history.jsonl` parses as JSON. Its resume line, pass line and confirm question, and the `/clear` words in `suggests-clear.md`, match SKILL.md's.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) A `node -e` script confirms `suggests-clear` matches the `/clear` words as SKILL.md fixes them, and doesn't match the new later-release line.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case epics-confirm` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

### Task 3: Rewrite resume-later for all four documents

- **Files:** evals/resume-later/case.yaml, evals/resume-later/seed.sh, evals/resume-later/graders/says-later-release.md
- **Reads:** evals/resume-later/case.yaml, evals/resume-later/seed.sh, evals/resume-later/graders/says-later-release.md, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-19, D-17
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC5's first half (D-19). `resume-later` seeds all four documents and asserts D-17's line.
  - **`seed.sh`:** also copy `samples/epics.md` to `.planning/seldon/epics.md`. Update the comment to say all four documents are on disk.
  - **`says-later-release.md`:** the pattern matches the new later-release line exactly as SKILL.md fixes it, with the apostrophe matched as `.` and the same end anchoring the current pattern uses.
  - **`case.yaml`:** the description says all four documents are seeded, and that Seldon has to write and edit nothing and end on the line naming the readiness check and the handoff.
  - **Unchanged:** `prompt.md`, `no-write.md` and `no-edit.md`.
- **Verify:**
  - **Testing scope:** the outcome is D-17's line, which no case checks today. One rewritten grader, its check and one passing run are enough, and testing stops there.
  - (1) `grep -c 'epics.md' evals/resume-later/seed.sh` prints at least 1. It prints 0 today.
  - (2) A `node -e` script confirms the new pattern matches the new line, and doesn't match the old epics-only line or the `/clear` words.
  - (3) `node --test tests/scaffold.test.mjs` passes.
  - (4) The coordinator vets the changed `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case resume-later` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (6) `git grep -n 'The epics step comes in a later release' -- skills/ docs/ README.md evals/` prints nothing. Before this task it prints the old line in `evals/resume-later/graders/says-later-release.md`.

### Task 4: Add the epics-no-spine case

- **Files:** evals/epics-no-spine/case.yaml, evals/epics-no-spine/prompt.md, evals/epics-no-spine/seed.sh, evals/epics-no-spine/graders/no-write.md, evals/epics-no-spine/graders/no-edit.md, evals/epics-no-spine/graders/names-spine-command.md
- **Reads:** evals/epics-no-boundary/graders/names-spine-command.md, evals/spine-job/graders/no-write.md, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-16
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC5's second half (D-16). With a brief and a PRD and no spine, `/seldon epics` writes nothing and names `/seldon spine`.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy `samples/brief.md` and `samples/prd.md` to `.planning/seldon/`, and nothing else.
  - **`prompt.md`:** exactly `/seldon epics`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 10`, `timeout_seconds: 300` and the read-only tools. The description doesn't say "scaffold".
  - **Graders:**
    - **`no-write.md` and `no-edit.md`:** `tool_used` on Write and on Edit, each with `min: 0` and `max: 0`.
    - **`names-spine-command.md`:** epics-no-boundary's grader, with the pattern copied unchanged.
- **Verify:**
  - **Testing scope:** the outcome is the no-spine route, which nothing covers today. Plan 5 already proves the `names-spine-command` pattern, so three graders and one passing run are enough. Testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (3) The run command with `--case epics-no-spine` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. The kept workspace has no `.planning/seldon/epics.md`.

## Notes

- **The walk's earlier stops:** D-20 keeps phases 2 to 4's cases as the proof of the brief, PRD and spine stops, so full-walk proves only the last leg and epics-confirm the last stop. Plan 7's full run covers them all together.
- **Case names:** `full-walk`, `epics-confirm` and `epics-no-spine` are my naming.
