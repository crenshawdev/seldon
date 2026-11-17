---
phase: 2
plan: 3
depends_on: [1, 2]
requirements:
  - FLOW-06
  - FLOW-07
  - DOCS-01
  - DOCS-03
files:
  - evals/fast-path-brief/case.yaml
  - evals/fast-path-brief/prompt.md
  - evals/fast-path-brief/history.jsonl
  - evals/fast-path-brief/graders/writes-brief.md
  - evals/fast-path-brief/graders/runs-check.md
  - evals/fast-path-brief/graders/check-passes.md
  - evals/fast-path-brief/graders/tags-assumption.md
  - evals/fast-path-brief/graders/states-refusal.md
  - evals/asks-for-dump/case.yaml
  - evals/asks-for-dump/prompt.md
  - evals/asks-for-dump/history.jsonl
  - evals/asks-for-dump/graders/recommends-a-path.md
  - evals/asks-for-dump/graders/no-write.md
  - evals/asks-who-for/case.yaml
  - evals/asks-who-for/prompt.md
  - evals/asks-who-for/history.jsonl
  - evals/asks-who-for/graders/asks-who-its-for.md
  - evals/asks-who-for/graders/no-write.md
  - evals/coaching-brief/case.yaml
  - evals/coaching-brief/prompt.md
  - evals/coaching-brief/history.jsonl
  - evals/coaching-brief/graders/writes-brief.md
  - evals/coaching-brief/graders/runs-check.md
  - evals/coaching-brief/graders/check-passes.md
  - evals/coaching-brief/graders/quotes-answer.md
  - evals/write-scope/case.yaml
  - evals/write-scope/prompt.md
  - evals/write-scope/history.jsonl
  - evals/write-scope/graders/no-write-outside.md
  - evals/write-scope/graders/no-edit-outside.md
  - evals/no-dump/case.yaml
  - evals/no-dump/prompt.md
  - evals/no-dump/graders/asks-for-dump.md
  - evals/no-dump/graders/no-write.md
  - evals/no-dump/graders/no-ask-user-question.md
  - evals/fast-path/prompt.md
  - skills/seldon/SKILL.md
---

# Phase 2: The brief - Plan 3: Eval cases for the brief step and the eval grant

## Goal

A user runs `/seldon` on a new project, dumps what they have, confirms fast path or coaching, and gets a brief in `.planning/seldon/`, proven by eval cases this phase adds. This plan proves the brief step end to end with five replay cases and a bare-`/seldon` case, and brings phase 1's two cases up to the new SKILL.md. Its first run settles how D-16's grant behaves.

## Must be true when done

- Each of the six new cases scores 1.00 under the D-16 grant, with no `not granted` in the output:
  - **fast-path-brief:** confirming the fast path writes `.planning/seldon/brief.md` with at least one `[ASSUMPTION]` and a What it refuses bullet that gives its reason, runs the check, and repeats its pass line.
  - **no-dump:** a bare `/seldon` gets a plain-prose request for the dump that ends on a question, with no Write and no AskUserQuestion.
  - **asks-for-dump:** having asked for the dump, Seldon recommends a path from it and writes nothing.
  - **asks-who-for:** confirming the fast path on a dump that never says who the project is for gets that question, and no write.
  - **coaching-brief:** the last coaching answer gets the brief written and the check's pass line. The brief quotes a replayed answer word for word on a `> ` line.
  - **write-scope:** a dump asking for the brief in `docs/` and a README link gets no Write or Edit outside `.planning/seldon/`, and the run doesn't error.
- The plan report records what the relative `.planning/seldon/**` resolved against in the first run.
- Phase 1's two cases still pass under the new SKILL.md and the grant:
  - fast-path, with Read, Glob and Grep added to its `allowed_tools` (D-04)
  - replay, unchanged (D-14)

## Context

- **Locked:** D-01, D-03, D-04, D-10, D-13, D-14, D-15, D-16 (SECURITY), D-17 and D-18, plus three phase 1 decisions:
  - Phase 1 D-05: eval cases grade the check with a `tool_used` grader on the command plus a regex on its output.
  - Phase 1 D-07: `--trust-plugin` only for this plugin, always with `--no-publish`.
  - Phase 1 D-10: `runs: 1` and `--ablation none`, with no cost ceiling.
- **The run command:** `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --allow-tools "Edit(.planning/seldon/**)" "Bash(node /code/seldon/lib/check.mjs:*)"`.
  - `--allow-tools` goes last, because it takes a list.
  - Never plain `Write`, never `Bash(node:*)`, never any broader grant.
  - No case here has a scaffold, so there's no `--scaffold`.
- **Where it runs:** in the main working tree at `/code/seldon`, never a worktree. Phase 1 found that the host's worktree guard refuses every command containing "eval". Each run is a real model call on the user's account.
- **History shape (D-15):** hand-written in the record shape of phase 1's `evals/replay/history.jsonl`:
  - a `parentUuid` chain
  - a fresh UUID-shaped `sessionId` per case, so `evals/.gitignore` ignores the session file a run writes
  - `cwd` set to `/tmp/seldon-<case>`
  - `version`, `type` and `message`
  - Each history ends on an assistant question in plain prose, in SKILL.md's voice, with the recommendation line in SKILL.md's exact form. No `/home/` path or personal detail goes in.
- **Brief content (Plan 1):** the graders look for two things FORMAT.md sets:
  - the refusal bullet: a `- ` line naming what the product won't do, then `because` and the reason
  - the quote line: `> `, indented two spaces under a bullet
- **Docs:** eval facts come from https://code.claude.com/docs/en/plugin-evals.md:
  - grader types and the `{ source: file, path }` target
  - regex graders run JavaScript patterns
  - `file_exists` counts only files Claude created
  - a run removes a write tool it wasn't granted, and offers only the read-only tools a case lists
- **Held:** no `claude plugin install`, no `marketplace add`, and no push, tag, PR or GitHub change.

## Tasks

### Task 1: Add the fast-path brief case and settle the eval grant on its first run

- **Files:** evals/fast-path-brief/case.yaml, evals/fast-path-brief/prompt.md, evals/fast-path-brief/history.jsonl, evals/fast-path-brief/graders/writes-brief.md, evals/fast-path-brief/graders/runs-check.md, evals/fast-path-brief/graders/check-passes.md, evals/fast-path-brief/graders/tags-assumption.md, evals/fast-path-brief/graders/states-refusal.md
- **Reads:** evals/replay/case.yaml, evals/replay/history.jsonl, evals/fast-path/prompt.md, skills/seldon/SKILL.md, lib/check.mjs#main, samples/brief.md
- **Decisions:** D-01, D-04, D-13, D-15, D-16, D-17
- **Action:** Write the AC2 case. It's the first run of the brief step from confirmation to check.
  - **history.jsonl:** two records.
    - The user's `/seldon` plus a dump for a coined project, distinct from Shelfmark and Brindlewick. The dump states three things:
      - who the project serves
      - at least one thing the project won't do, with the reason
      - that the stakes are modest

      It leaves at least one other section unstated but inferable from the rest (D-13), so SKILL.md's sort gives a tagged guess and no blocking question. Who it serves and what it refuses are stated because the fast path asks about either one when the dump leaves it out (D-01).
    - Seldon's reply: it names the project, gives `Recommended path: fast path` on its own line with a reason or two from the dump, and asks the confirm question in plain prose.
  - **prompt.md:** the user confirming the fast path, and nothing else.
  - **case.yaml:**
    - `schema_version: "1.1"`, `name`, `runs: 1` and `context.history_file: history.jsonl`.
    - Under `execution`: `max_turns: 20` and `timeout_seconds: 600`, enough room for loading the skill, the reads, the write, the check and one fix.
    - `allowed_tools: [Skill, Read, Glob, Grep, Write, Edit, Bash]`. Listing Write, Edit and Bash means a grant the harness didn't honor shows as `not granted` instead of hiding (D-16).
  - **Graders:**
    - `writes-brief.md`: `file_exists` on `.planning/seldon/brief.md`.
    - `runs-check.md`: `tool_used` on Bash, with an `input_match` on `lib/check\.mjs --brief` and `min: 1` (phase 1 D-05).
    - `check-passes.md`: `regex` on `last_message`, matching `seldon check: brief\.md conforms`.
    - `tags-assumption.md`: `regex` with target `{ source: file, path: .planning/seldon/brief.md }` and pattern `\[ASSUMPTION\]`.
    - `states-refusal.md` (AC2's refusal clause): `regex` with target `{ source: file, path: .planning/seldon/brief.md }` and `flags: i`.
      - Its pattern finds a `- ` bullet carrying the word `because` inside the `## What it refuses` section, and never reaches past the next `## ` heading.
      - It needs no `m` flag. A pattern such as `## What it refuses[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?[ \t]*- [^\n]*\bbecause\b` does it.
  - **First run:** this is the first run of the D-16 grant, so add `--keep-temp` before `--allow-tools`.
  - **Fail closed (D-16):** stop and return a checkpoint carrying the run's output for John if either of these happens:
    - the output shows `not granted` for any tool
    - `writes-brief` fails because the Write was refused or `.planning/seldon/` couldn't be created

    Widen nothing: no plain Write, no `Bash(node:*)`, and no extra rule to make the directory.
  - **The record:** put in the plan report what `.planning/seldon/**` resolved against:
    - the absolute path of the brief the Write tool created, taken from the kept run
    - whether that's inside the run's workspace or the directory the command ran from
  - **If `file_exists` misses:** if it fails only because the run lists created paths in a form the glob doesn't match, change the glob to that form, still pinned to `.planning/seldon/brief.md`, and note it in the report.
- **Verify:**
  - **Testing scope:** the outcomes are two: confirming the fast path writes a conforming, tagged brief whose refusals carry reasons and reports the check (AC2), and D-16's grant behaves as ruled. Nothing covers it today. This case's five graders and one run are the evidence, and testing stops there.
  - (1) The run command with `--case fast-path-brief` exits 0, the case scores 1.00, and the output has no `not granted`. Today it fails, because there's no such case.
  - (2) The plan report states what `.planning/seldon/**` resolved against, with the brief's absolute path from the kept run.
  - (3) A `node -e` script shows three things:
    - `check-passes`'s pattern matches the line `node lib/check.mjs --brief samples` prints, and doesn't match the line `node lib/check.mjs samples` prints.
    - `runs-check`'s `input_match` matches the JSON-encoded Bash input of SKILL.md's command with `/code/seldon` as the plugin root.
    - `states-refusal`'s pattern matches `samples/brief.md`. It doesn't match a copy whose What it refuses bullets have their `because` clauses removed, or a copy whose only `because` sits in Vision.
  - (4) `grep -c '/home/' evals/fast-path-brief/history.jsonl` prints 0, and its `sessionId` is UUID-shaped and differs from phase 1's.
  - (5) `git status --porcelain` lists only this case's eight files: no session `.jsonl`, no `results/`, and no `.planning/seldon/` in the repository itself.

### Task 2: Add the case where Seldon asks for the dump, then recommends

- **Files:** evals/asks-for-dump/case.yaml, evals/asks-for-dump/prompt.md, evals/asks-for-dump/history.jsonl, evals/asks-for-dump/graders/recommends-a-path.md, evals/asks-for-dump/graders/no-write.md
- **Reads:** evals/fast-path-brief/case.yaml, skills/seldon/SKILL.md#1. The dump
- **Decisions:** D-04, D-13, D-15
- **Action:** Write the AC1 case.
  - **history.jsonl:**
    - The user's `/seldon` with nothing after it.
    - Seldon's request, in plain prose and in SKILL.md's wording, to paste or describe the idea, any notes, and who it's for.
  - **prompt.md:** the dump, for another coined project.
  - **case.yaml:**
    - The same fields as Task 1, with `max_turns: 10` and `timeout_seconds: 300`.
    - `allowed_tools: [Skill, Read, Glob, Grep, Write]`. Write is listed so a premature write is possible and gets caught (D-13).
  - **Graders:**
    - `recommends-a-path.md`: `regex` on `last_message` with `flags: i`, matching SKILL.md's recommendation line naming either path. Allow the markup characters phase 1's fast-path pattern allows.
    - `no-write.md`: `tool_used` on Write, with `min: 0` and `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is a recommendation from a dump given on the turn after Seldon asked for it, with no write until confirmation (AC1). Task 6's no-dump case covers the ask itself. Nothing covers this turn today. Two graders and one run are the evidence, and testing stops there.
  - (1) The run command with `--case asks-for-dump` exits 0 at 1.00, with no `not granted`.
  - (2) A `node -e` script shows the pattern matches SKILL.md's recommendation line filled in with each path, and doesn't match the history's text.
  - (3) `grep -c '/home/' evals/asks-for-dump/history.jsonl` prints 0, its `sessionId` is new and UUID-shaped, and `git status --porcelain` lists only this case's files.

### Task 3: Add the case where the dump never says who the project is for

- **Files:** evals/asks-who-for/case.yaml, evals/asks-who-for/prompt.md, evals/asks-who-for/history.jsonl, evals/asks-who-for/graders/asks-who-its-for.md, evals/asks-who-for/graders/no-write.md
- **Reads:** evals/fast-path-brief/history.jsonl, skills/seldon/SKILL.md
- **Decisions:** D-01, D-04, D-13, D-15
- **Action:** Write the AC3 case.
  - **history.jsonl:**
    - The user's `/seldon` plus a low-stakes dump for another coined project. It answers everything a brief needs except who the project is for: no users, customers or audience anywhere, not even "me". It states at least one thing the project won't do, with the reason, so who it's for is the only section D-01 makes Seldon ask about.
    - Seldon's reply, recommending the fast path and asking the confirm question.
  - **prompt.md:** the user confirming the fast path.
  - **case.yaml:** the same fields as Task 2, with `allowed_tools: [Skill, Read, Glob, Grep, Write]`, so a premature write is possible and caught.
  - **Graders:**
    - `asks-who-its-for.md`: `regex` on `last_message` with `flags: i`, matching a question about who the project is for or serves. It accepts phrasings such as "who is it for", "who it's for", "who will use" and "who it serves", followed within the sentence by a question mark.
    - `no-write.md`: `tool_used` on Write, with `min: 0` and `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is the fast path stopping to ask who the project is for, with nothing written in that turn (AC3, FLOW-07). Nothing covers it today. Two graders and one run are the evidence, and testing stops there.
  - (1) The run command with `--case asks-who-for` exits 0 at 1.00, with no `not granted`.
  - (2) A `node -e` script shows the grader's pattern matches each of the four phrasings above as questions, and doesn't match the dump or the prompt.
  - (3) The dump contains none of "for me", "users", "customers", "audience" or "serves", and it states a refusal with its reason.
  - (4) `grep -c '/home/' evals/asks-who-for/history.jsonl` prints 0, its `sessionId` is new and UUID-shaped, and `git status --porcelain` lists only this case's files.

### Task 4: Add the coaching case that ends in a written brief

- **Files:** evals/coaching-brief/case.yaml, evals/coaching-brief/prompt.md, evals/coaching-brief/history.jsonl, evals/coaching-brief/graders/writes-brief.md, evals/coaching-brief/graders/runs-check.md, evals/coaching-brief/graders/check-passes.md, evals/coaching-brief/graders/quotes-answer.md
- **Reads:** evals/replay/history.jsonl, evals/fast-path-brief/graders/runs-check.md, skills/seldon/SKILL.md, samples/brief.md
- **Decisions:** D-04, D-09, D-10, D-14, D-15, D-18
- **Action:** Write the AC5 case. Its history is the whole coaching interview up to the last question.
  - **history.jsonl:**
    1. The user's `/seldon` plus a dump for another coined project. It leaves several brief decisions open and carries real stakes, so coaching fits.
    2. Seldon's coaching recommendation and its confirm question.
    3. The user confirming coaching.
    4. Seldon naming the project and asking about the first open decision (D-14).
    5. Single answers and single questions alternating, one per turn (D-09), until Seldon asks about the last open decision. The history ends on that question (D-15).

    The dump and the answers together settle all eight sections plainly, including what the project refuses and why, so nothing is left to ask after the final answer.
  - **The quoted answer (D-18):** one of the user's answers in the history is a short single sentence carrying a distinctive phrase of at least five lowercase words.
    - The phrase appears nowhere else: not in the dump, Seldon's turns, the prompt or SKILL.md.
    - The answer settles one brief item, and it's short so that a word-for-word quote of it carries the phrase.
  - **prompt.md:** the user's answer to that last question.

  This reads D-04 together with D-10. The confirmation sits in the history, a turn after the recommendation, and the case prompt is the last coaching answer.
  - **case.yaml:** the same fields as Task 1, with `max_turns: 20`, `timeout_seconds: 600` and `allowed_tools: [Skill, Read, Glob, Grep, Write, Edit, Bash]`.
  - **Graders:**
    - `writes-brief.md`, `runs-check.md` and `check-passes.md`, as in Task 1.
    - `quotes-answer.md` (AC5's quote clause): `regex` with target `{ source: file, path: .planning/seldon/brief.md }` and no flags, so the match is word for word.
      - It matches that phrase, exactly as the answer has it, on a quoted line.
      - A pattern such as `(?:^|\n)[ \t]*> [^\n]*` followed by the phrase, with any regex characters escaped, does it without the `m` flag.
- **Verify:**
  - **Testing scope:** the outcome is coaching ending in a written, conforming brief that quotes the user's answer word for word (AC5). Nothing covers it today. This case's four graders and one run are the evidence, and testing stops there. Phase 1's replay rerun, which covers D-14, is Task 7's.
  - (1) The run command with `--case coaching-brief` exits 0 at 1.00, with no `not granted`.
  - (2) A `node -e` script shows three things about `quotes-answer`'s pattern:
    - It matches `> ` followed by the answer, and `  > ` followed by the answer.
    - It doesn't match the answer as a plain body line, or the answer with one word of the phrase changed.
    - The phrase occurs in exactly one user record of `history.jsonl`, and in no other record.
  - (3) `grep -c '/home/' evals/coaching-brief/history.jsonl` prints 0, its `sessionId` is new and UUID-shaped, and `git status --porcelain` lists only this case's files.

### Task 5: Add the write-scope case

- **Files:** evals/write-scope/case.yaml, evals/write-scope/prompt.md, evals/write-scope/history.jsonl, evals/write-scope/graders/no-write-outside.md, evals/write-scope/graders/no-edit-outside.md
- **Reads:** evals/fast-path-brief/case.yaml, skills/seldon/SKILL.md
- **Decisions:** D-03, D-15, D-16
- **Action:** Write AC4's second case, which proves the scope of D-16's grant holds.
  - **history.jsonl:**
    - The user's `/seldon` plus a low-stakes dump for another coined project. It states every brief section, so the confirmation goes straight to the write. That includes who it serves, and what it refuses with the reason.
    - The dump also asks for the brief to go in `docs/brief.md`, beside the project's other docs, and for a link to it in `README.md`.
    - Seldon's fast-path recommendation and its confirm question.
  - **prompt.md:** the user confirming, and repeating the ask for `docs/brief.md` and the README link.
  - **case.yaml:** the same fields as Task 1, with `max_turns: 20`, `timeout_seconds: 600` and `allowed_tools: [Skill, Read, Glob, Grep, Write, Edit, Bash]`.
  - **Graders (D-03):**
    - `no-write-outside.md`: `tool_used` on Write with `min: 0` and `max: 0`. Its `input_match` matches a `file_path` that isn't a file directly inside a `.planning/seldon/` folder, including a path that climbs out with `..`.
    - `no-edit-outside.md`: the same pattern on Edit.

    Plan 4's design-folder case reuses this pattern.
- **Verify:**
  - **Testing scope:** the outcome is no write or edit outside `.planning/seldon/` when the user asks for one, in a run that completes normally (AC4's second case). Nothing covers it today. Two graders, one run and a look at the kept workspace are the evidence, and testing stops there.
  - (1) The run command with `--case write-scope` exits 0 at 1.00, with no `not granted`. The case's run in that run's `aggregate-result.json` under `evals/results/` carries no `error` (AC4: the run doesn't error).
  - (2) A second run with `--keep-temp` leaves a workspace holding `.planning/seldon/brief.md`, with no `docs/brief.md` and no `README.md`. So the case passes with the brief written, not by writing nothing.
  - (3) A `node -e` script shows the `input_match`:
    - matches the JSON-encoded Write inputs for `<workspace>/docs/brief.md`, `<workspace>/README.md` and `<workspace>/.planning/seldon/../../docs/brief.md`
    - doesn't match the one for `<workspace>/.planning/seldon/brief.md`
  - (4) `grep -c '/home/' evals/write-scope/history.jsonl` prints 0, its `sessionId` is new and UUID-shaped, and `git status --porcelain` lists only this case's files.

### Task 6: Add the case where a bare /seldon asks for the dump

- **Files:** evals/no-dump/case.yaml, evals/no-dump/prompt.md, evals/no-dump/graders/asks-for-dump.md, evals/no-dump/graders/no-write.md, evals/no-dump/graders/no-ask-user-question.md
- **Reads:** evals/asks-for-dump/case.yaml, evals/fast-path/graders/no-ask-user-question.md, skills/seldon/SKILL.md#1. The dump
- **Decisions:** D-04, D-13
- **Action:** Write the case for AC1's first clause. In it, `/seldon` with no dump asks for one, and the model has to produce the ask itself. In asks-for-dump the ask sits in a hand-written history, so nothing there tests it.
  - **Single turn:** no history file. The run's workspace is empty, so SKILL.md's start-of-run check finds no brief and `$ARGUMENTS` is empty.
  - **prompt.md:** `/seldon` and nothing else.
  - **case.yaml:**
    - `schema_version: "1.1"`, `name` and `runs: 1`.
    - Under `execution`: `max_turns: 10` and `timeout_seconds: 300`.
    - `allowed_tools: [Skill, Read, Glob, Grep, Write, AskUserQuestion]`, for three reasons:
      - Read, Glob and Grep let SKILL.md's start-of-run brief check run.
      - Write is listed so a premature write is possible and gets caught (D-13).
      - AskUserQuestion is listed so a menu is possible and gets caught.
  - **Graders:**
    - `asks-for-dump.md`: `regex` on `last_message` with `flags: i`. It matches the request for the dump ending in a question: one of `paste`, `describe` or `share`, then the message ending on a question mark with nothing after it but whitespace. A pattern such as `(?:paste|describe|share)[\s\S]*\?\s*$` does it.
    - `no-write.md`: `tool_used` on Write, with `min: 0` and `max: 0`.
    - `no-ask-user-question.md`: `tool_used` on AskUserQuestion, with `min: 0` and `max: 0`, as phase 1's fast-path case has it.
- **Verify:**
  - **Testing scope:** the outcome is a bare `/seldon` asking for the dump in a plain-prose question and writing nothing. Nothing covers it today, because every other case either starts with a dump or carries the ask in its history. Three graders and one run are the evidence, and testing stops there.
  - (1) The run command with `--case no-dump` exits 0 at 1.00, with no `not granted`.
  - (2) A `node -e` script shows `asks-for-dump`'s pattern:
    - matches "Paste or describe what you have so far - the idea, any notes, who it's for. What have you got?"
    - doesn't match the same request ending with a full stop, or one with a sentence after the question
  - (3) `git status --porcelain` lists only this case's five files.

### Task 7: Rerun phase 1's two cases under the brief step

- **Files:** evals/fast-path/prompt.md
- **Reads:** evals/fast-path/prompt.md, evals/replay/case.yaml, skills/seldon/SKILL.md
- **Decisions:** D-04, D-14, D-16
- **Action:** Phase 1's fast-path case allows only `[Skill, AskUserQuestion]`. Plan 2's SKILL.md now does two reads on every new run:
  - it checks for an existing brief with Read or Glob before it reads the dump
  - it reads `docs/design/` when the folder exists

  So the `allowed_tools` line in `evals/fast-path/prompt.md`'s frontmatter becomes `[Skill, AskUserQuestion, Read, Glob, Grep]`.
  - **Nothing else changes:** the description, limits, prompt and graders stay as they are.
  - **No Write, Edit or Bash:** under D-04 the case stays phase 1's "recommends and writes nothing" check.

  Then rerun both of phase 1's cases with the run command, next to each other: fast-path, and replay as it stands (D-14).

  If either fails on the new SKILL.md, return a checkpoint with the run's output:
  - Don't change SKILL.md from this plan.
  - Don't add any other tool to either case.
- **Verify:**
  - **Testing scope:** the outcome is phase 1's two cases still passing under the brief step and the grant. Both cases already exist. This task's evidence is one changed line and one rerun of each, and testing stops there.
  - (1) `grep -cF 'allowed_tools: [Skill, AskUserQuestion, Read, Glob, Grep]' evals/fast-path/prompt.md` prints 1. It prints 0 today.
  - (2) The run command with `--case fast-path` exits 0 at 1.00, with no `not granted`.
  - (3) The run command with `--case replay` exits 0 at 1.00.
  - (4) `git diff evals/fast-path/prompt.md` changes only the `allowed_tools` line, and `git status --porcelain` lists only that file.

## Notes

- **Phase 1 evidence:** the session phase 1's replay run left at `evals/replay/7d3c2a91-5b6e-4f08-9c1d-2e4f6a8b0c13.jsonl` shows three things:
  - the run's cwd was `/tmp/claude-eval-*/home/cwd`
  - the plugin loaded in place from `/code/seldon`
  - the resumed turn called the Skill tool with a summary of the user's choice

  That suggests the relative `.planning/seldon/**` lands in the run's workspace and that `/code/seldon` is the plugin root the Bash rule needs. Task 1's run is still what settles and records it, as the flagged assumption says.
- **A resumed turn that skips the skill:** if a resumed turn answers without loading the skill (no Skill call in a kept run), the case can't prove SKILL.md's behavior. Stop with a checkpoint rather than changing D-15's hand-written shape.
- **Refusals in the dumps:** each dump that leads straight to a write (fast-path-brief, write-scope) or to one question (asks-who-for) states a refusal with its reason. Under D-01 an unstated refusal is asked about, which would add a question those cases don't expect.
- **Cost:** about nine model runs, all at `runs: 1`:
  - one for each of the six new cases
  - Task 5's kept rerun
  - Task 7's two reruns of phase 1's cases
- **Prior art from memory:**
  - From phases/2/CONTEXT.md, phase 2: D-03 (the write boundary is proven by `tool_used` with `input_match`) and D-04 (every case producing a brief replays a history ending at the recommendation).
  - From phases/1/CONTEXT.md, phase 1: D-07 (eval security).
