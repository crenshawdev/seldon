---
phase: 3
plan: 3
depends_on: [1, 2]
requirements:
  - DOCS-02
  - FLOW-04
files:
  - skills/seldon/SKILL.md
  - samples/prd-from-brief/brief.md
  - evals/prd-from-brief/case.yaml
  - evals/prd-from-brief/prompt.md
  - evals/prd-from-brief/seed.sh
  - evals/prd-from-brief/graders/writes-prd.md
  - evals/prd-from-brief/graders/check-passes.md
  - evals/prd-from-brief/graders/runs-check.md
  - evals/prd-from-brief/graders/carries-refusals.md
  - evals/prd-from-brief/graders/no-tech-words.md
  - evals/prd-from-brief/graders/every-item-quoted-or-tagged.md
  - evals/confirm-clear/case.yaml
  - evals/confirm-clear/prompt.md
  - evals/confirm-clear/history.jsonl
  - evals/confirm-clear/graders/suggests-clear.md
  - evals/confirm-clear/graders/no-write.md
  - evals/confirm-clear/graders/no-edit.md
---

# Phase 3: The PRD, resume and rerun - Plan 3: The brief's words in the PRD, and a step's end

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan does two things:

- makes the PRD carry the user's own words and the brief's refusals, proven by AC1's case
- ends every step on a confirm and fixed words suggesting `/clear`, proven by AC5's case

## Must be true when done

- The prd-from-brief case scores 1.00. From a brief whose user quotes name a framework, a database and a host, `/seldon` writes a `prd.md` that:
  - passes `--prd`
  - names none of those technology words
  - carries every refusal as a `because` bullet under `## Non-goals`, each with the brief's quote under it
  - gives every requirement and non-goal line a `> ` quote under it or an `[ASSUMPTION]` tag
- Each step ends the same way: write, check, repeat the check's result line, then ask the user to confirm or name changes. phase 2's fast-path-brief, coaching-brief and write-scope cases still score 1.00 with that ending.
- The confirm-clear case scores 1.00. When the user confirms a written step, Seldon writes and edits nothing and ends on the fixed words suggesting `/clear` and then `/seldon`.

## Context

- **Locked:** D-07, D-12, D-13, D-14, D-16, D-19, D-20 and D-21.
- **SECURITY (phase 2 D-02):** SKILL.md's `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`. No task touches it.
- **Fixed words:** a sentence a grader matches gets fixed words on a line of their own. This plan fixes the `/clear` suggestion.
- **Runs and the Bash audit:** as in Plan 2's Context.
  - Run from `/code/seldon`, never a worktree, one `--case` per run, with `--keep-temp` before `--allow-tools`, and `--allow-tools` last with exactly `"Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`.
  - Report every Bash command in each kept trace. Anything but the `--brief` or `--prd` check on `.planning/seldon` is a checkpoint.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:**
  - `allowed_tools: [Skill, Read, Glob, Grep]` only.
  - A continuation prompt starts with `/seldon` (phase 2 D-15).
  - A history is hand-written in phase 1's record shape, with a UUID-shaped `sessionId`, so `evals/.gitignore` ignores the session file a run writes.
  - A scaffold is only copy lines from `samples/`.
  - No line of a `case.yaml` or `prompt.md` says "scaffold" except `scaffold_script: seed.sh`, and none holds a double-quoted backslash.
  - Every new grader passes D-21 before commit.
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Quote or tag every requirement and non-goal in the PRD

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#10. The draft, docs/FORMAT.md#The user's own words, samples/prd.md
- **Decisions:** D-13, D-14
- **Pins:** tests/skill.test.mjs
- **Action:** In the PRD draft section, every requirement bullet and every line in `## Non-goals` carries one of two things (D-13):
  - a `> ` quote directly under it, indented two spaces under a `- ` bullet
  - an `[ASSUMPTION]` tag, inline after the text and never inside the bold ID
  - **Sources:**
    - The brief's `> ` lines, word for word. A quote can be one unbroken run of a line's exact words. It keeps the `(docs/design/...)` line under it wherever the brief's quote had one.
    - The user's replies to the PRD step's own questions (Plan 2 Task 3).
    - The brief's item text is Seldon's wording, so it is never quoted as the user's.
  - **Tech words (D-14):** a tech word the user said isn't carried into a quote. Quote a run of that line without the word, or tag the requirement instead.
  - **Form:** never paraphrase a quote and never tidy it. User journeys and MVP scope need no quotes.
  - **Reference:** follow `docs/FORMAT.md`'s "The user's own words" as Plan 1 extended it, and say so.
- **Verify:**
  - **Testing scope:** Task 3's every-item grader proves this behavior by eval. A text check that fails today plus the pinned test are enough here, and testing stops there.
  - (1) SKILL.md's PRD draft section names the brief's `> ` lines as a quote source and requires a quote or a tag on every requirement and non-goal line. Neither appears today.
  - (2) `node --test tests/skill.test.mjs` passes.

### Task 2: Carry the brief's refusals into the PRD's Non-goals

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#10. The draft, docs/FORMAT.md#prd.md
- **Decisions:** D-12
- **Pins:** tests/skill.test.mjs
- **Action:** In the PRD draft section, each refusal in the brief's `## What it refuses` goes into `## Non-goals` as a `- <what it won't do> because <reason>` bullet, with the brief's quote for that refusal under it, word for word (D-12).
  - **Sections:** the PRD keeps its five sections.
  - **No invented refusals:** never invent one. When the brief refuses nothing, which shows as its quoted refuses-nothing line, carry none.
  - **Other non-goals:** they can follow, under Task 1's quote-or-tag rule.
- **Verify:**
  - **Testing scope:** Task 3's carries-refusals grader proves this behavior by eval. A text check that fails today is enough here, and testing stops there.
  - (1) SKILL.md's PRD draft section tells it to carry each brief refusal into `## Non-goals` as a `because` bullet with the brief's quote. Nothing says so today.
  - (2) `node --test tests/skill.test.mjs` passes.

### Task 3: Add the prd-from-brief case and its fixture

- **Files:** samples/prd-from-brief/brief.md, evals/prd-from-brief/case.yaml, evals/prd-from-brief/prompt.md, evals/prd-from-brief/seed.sh, evals/prd-from-brief/graders/writes-prd.md, evals/prd-from-brief/graders/check-passes.md, evals/prd-from-brief/graders/runs-check.md, evals/prd-from-brief/graders/carries-refusals.md, evals/prd-from-brief/graders/no-tech-words.md, evals/prd-from-brief/graders/every-item-quoted-or-tagged.md
- **Reads:** samples/brief.md, evals/fast-path-brief/graders/every-item-quoted-or-tagged.md, evals/fast-path-brief/graders/runs-check.md, evals/resume/seed.sh
- **Decisions:** D-12, D-13, D-14, D-19, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC1's case: a confirmed brief seeded by a scaffold, with the prompt `/seldon`.
  - **Fixture `samples/prd-from-brief/brief.md`:**
    - A confirmed brief for a coined project. It passes `--brief`, and every item carries a quote or a tag, as in `samples/brief.md`.
    - Its user quotes name at least three technology choices, in Solution or Scope: a web framework, a database and a hosting provider. None appears in What it refuses.
    - It holds at least two refusals, each a `- ... because ...` bullet with its quote.
    - Every section is answered, so nothing that only the user can decide is open, and the PRD step drafts in one turn (D-19).
  - **`seed.sh`:** copies the fixture to `.planning/seldon/brief.md` after making the folder, and does nothing else.
  - **`prompt.md`:** exactly `/seldon`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`writes-prd.md`:** `file_exists` on `.planning/seldon/prd.md`.
    - **`check-passes.md`:** `regex` on `last_message`, matching `seldon check: prd\.md conforms`.
    - **`runs-check.md`:** `tool_used` on Bash, with `input_match` `lib/check\.mjs --prd` and `min: 1`.
      - Together with `check-passes`, this proves several parts of AC1, because the PRD-only check requires each one (Plan 1): an ID'd bullet in Requirements, one in Non-functional requirements, a user journey that isn't empty, and MVP scope that isn't empty.
      - That's how phase 2 graded section completeness, through the check's result line.
    - **`carries-refusals.md`:** `regex` on the file `.planning/seldon/prd.md`.
      - For each of the fixture's refusals, inside `## Non-goals` and before the next `## `, it finds a `- ` bullet holding `because`.
      - Right under that bullet, it finds the refusal's quote from the fixture, word for word, on a `  > ` line.
      - A lookahead per refusal keeps it to one grader.
    - **`no-tech-words.md`:** `regex` on the file `.planning/seldon/prd.md`, with `match: not_contains` and `flags: i`. It matches each of the fixture's technology words as a whole word.
      - It reads the whole PRD, not just the requirement lines, because D-14 keeps technology out of the whole PRD, quotes included. That scope is my choice.
    - **`every-item-quoted-or-tagged.md`:** fast-path-brief's grader adapted to `prd.md`, with `match: not_contains` and `flags: m`. It matches any line of these two kinds that holds no `[ASSUMPTION]` and isn't followed by a `  > ` line:
      - a requirement bullet (`- **ID**:`) in either requirement section
      - a non-blank line in `## Non-goals` that isn't itself a `>` line or a `(` source line
- **Verify:**
  - **Testing scope:** the outcome is AC1, a PRD built from the brief with the right content. Nothing covers it today. Six graders, one passing run and the D-21 checks are the evidence, and testing stops there.
  - (1) `node lib/check.mjs --brief samples/prd-from-brief` prints `seldon check: brief.md conforms`. Each technology word in `no-tech-words` appears on a `> ` line of the fixture and nowhere in its What it refuses.
  - (2) `node --test tests/scaffold.test.mjs` passes, with the new `seed.sh` scanned.
  - (3) D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - **`carries-refusals`:**
      - It matches a hand-made PRD carrying both refusals as `because` bullets with their quotes.
      - It doesn't match when one quote is missing or one word of it changes.
      - It doesn't match when a refusal bullet sits under MVP scope instead, or lacks `because`.
    - **`no-tech-words`:**
      - It matches, which fails the grader, a PRD holding any one of the words in any letter case. That covers a requirement line and a quote line.
      - It doesn't match `samples/prd.md`.
    - **`every-item-quoted-or-tagged`:**
      - It matches a PRD with one requirement that has neither quote nor tag, and a PRD with one prose Non-goals line that has neither.
      - It doesn't match `samples/prd.md`, or a PRD whose only unquoted requirement is tagged.
    - **`check-passes`:** it doesn't match `seldon check: brief.md conforms` or `seldon check: all four documents conform`.
    - **`runs-check`:** its `input_match` matches the JSON-encoded input of the `--prd` check command and not the `--brief` one.
  - (4) The run command with `--case prd-from-brief` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (5) Before the kept folder is removed, `node lib/check.mjs --prd <kept workspace>/.planning/seldon` exits 0.

### Task 4: End each step on its confirm and the fixed /clear words

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#11. The check
- **Decisions:** D-07, D-16
- **Pins:** tests/skill.test.mjs
- **Action:** The brief step and the PRD step end the same way (D-07):
  1. Write the document.
  2. Run the step's check.
  3. Repeat its result line word for word on a line of its own.
  4. Ask, in one plain-prose question that ends the turn, whether the user confirms the document or wants changes.

  This replaces the final message at the end of §11 and the PRD step's ending from Plan 2 Task 5.
  - **§1's new position:** it replaces Run finished. A step's document has been written, its confirm has been asked, and the user has answered:
    - **Confirms:** write nothing, edit nothing, run nothing, and end on the fixed `/clear` words, in a fenced block introduced with "exactly these words", on a line of their own with nothing after them, as §3's dump ask says. They suggest `/clear` and then `/seldon` for the next step, and require nothing (D-16).
    - **Names changes:** make them in that step's document with Edit. Leave every line the change doesn't touch as it is, and quote the user's new words as "The draft" says. Then rerun the check, repeat the line and ask again.
  - **After the `/clear` words:** the step is confirmed. A later `/seldon` in the same conversation is a new run and starts from the files (D-06, D-16).
- **Verify:**
  - **Testing scope:** Task 5's case proves the confirm path. This change also changes the last message of every case that writes a document, so the three phase 2 cases that grade that message are rerun, along with prd-from-brief. That's the regression check, and testing stops there.
  - (1) `grep -c 'Run finished' skills/seldon/SKILL.md` prints 0. It prints 1 on the tree before this task. SKILL.md holds the fixed `/clear` words on a line of their own.
  - (2) Run `fast-path-brief`, `coaching-brief`, `write-scope` and `prd-from-brief`, one per run, each with the run command. Each scores 1.00. Each kept trace's last assistant message repeats the check's line and ends on a question. The Bash audit is reported.
  - (3) `node --test tests/skill.test.mjs` passes and `claude plugin validate --strict .` exits 0.

### Task 5: Add the confirm-clear case

- **Files:** evals/confirm-clear/case.yaml, evals/confirm-clear/prompt.md, evals/confirm-clear/history.jsonl, evals/confirm-clear/graders/suggests-clear.md, evals/confirm-clear/graders/no-write.md, evals/confirm-clear/graders/no-edit.md
- **Reads:** evals/fast-path-brief/history.jsonl, evals/fast-path-brief/case.yaml, samples/brief.md
- **Decisions:** D-07, D-16, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC5's case: a replay where the user confirms a written step.
  - **`history.jsonl`:**
    - Hand-written in phase 1's record shape: a `parentUuid` chain, a UUID-shaped `sessionId`, `cwd`, `version`, `type` and `message`. Text only, for the Toolshed project that `samples/brief.md` holds.
    - The user's `/seldon` dump, built from that brief's `> ` phrases.
    - Seldon's fast-path recommendation, then the user's `/seldon` confirmation of it.
    - Seldon's step end in Task 4's shape: it names `.planning/seldon/brief.md`, gives the brief check's pass line, and ends on the confirm question.
  - **`prompt.md`:** `/seldon` and a plain confirmation that doesn't ask to go on to the next step, for example `/seldon Yes, that's right.`
  - **`case.yaml`:** `context.history_file: history.jsonl` only, `max_turns: 10`, `timeout_seconds: 300` and the read-only tools. The confirm happens inside a step already under way and needs no document on disk, so the case names no `scaffold_script` and has no `seed.sh`.
  - **Graders:**
    - **`suggests-clear.md`:** `regex` on `last_message`, matching Task 4's fixed words only as they end the message. After the words, only whitespace or a closing fence may come before the end of the message, the way Plan 2's `asks-rerun-or-go-on` matches its question as it ends the message.
    - **`no-write.md`:** `tool_used` Write, with `min: 0` and `max: 0`.
    - **`no-edit.md`:** `tool_used` Edit, with `min: 0` and `max: 0`.
  - **The combined form isn't tested here:** whether a history and a scaffold combine is settled by Plan 4 Task 3's prd-reads-brief case, whose `/seldon prd` step has to read the seeded brief.
- **Verify:**
  - **Testing scope:** the outcome is AC5. Nothing covers it today. Three graders and the run are the evidence, and testing stops there.
  - (1) D-21, checked with a `node -e` script that reads the pattern from its file. `suggests-clear` matches the fixed words as SKILL.md holds them, both alone at the end of a message and followed by a closing fence. It doesn't match:
    - the brief check's pass line
    - a confirm question
    - the fixed resume line
    - a reply saying the brief is confirmed without those words
    - the fixed words followed by one extra sentence, such as an offer to start the PRD now

    `no-write` and `no-edit` read `min: 0` and `max: 0` with no `input_match`, so any call of the tool fails them.
  - (2) `evals/confirm-clear/case.yaml` names `history_file` and no `scaffold_script`, and `evals/confirm-clear/seed.sh` doesn't exist. `node --test tests/scaffold.test.mjs` passes.
  - (3) The run command with `--case confirm-clear` exits 0 at 1.00, with no `not granted`. The trace shows no Write, Edit or Bash call. The Bash audit is reported.
  - (4) `git status --porcelain evals/` lists only this plan's case files. No session file appears, because `evals/.gitignore` ignores it.
  - (5) `ls -d /tmp/claude-eval-*` matches nothing.

## Notes

- **The no-technology grader's scope:** it reads the whole `prd.md` where AC1 says requirement lines, because D-14 keeps technology out of the whole PRD. This is Task 3's choice, recorded in its Action.
- **Prior art:**
  - D-07 (ending a step), from phases/3/CONTEXT.md, phase 3. It informs Task 4.
  - D-12 and D-13 (refusals and quotes in the PRD), from phases/3/CONTEXT.md, phase 3. They inform Tasks 1 to 3.
  - Phase 2 UAT items 6 and 9 (phases/2/UAT.md, phase 2) are why every grader here gets a D-21 check against known-bad text.
- **Why confirm-clear is history-only:** confirming gives Seldon no reason to read a file, so a Read check there would fail for that reason and not because the harness can't combine a history and a scaffold. The user moved the combined-form check to Plan 4 Task 3's prd-reads-brief case, the first case whose step has to read the seeded brief under a history, and confirm-clear keeps only the `history_file` it needs.
