---
phase: 2
plan: 2
depends_on: [1]
requirements:
  - FLOW-06
  - FLOW-07
  - DOCS-01
  - DOCS-03
files:
  - skills/seldon/SKILL.md
  - tests/skill.test.mjs
---

# Phase 2: The brief - Plan 2: The brief step in /seldon

## Goal

A user runs `/seldon` on a new project, dumps what they have, confirms fast path or coaching, and gets a brief in `.planning/seldon/`, proven by eval cases this phase adds. This plan builds that brief step in `skills/seldon/SKILL.md`, on phase 1's skeleton.

## Must be true when done

- SKILL.md's `allowed-tools` is exactly Read, Glob, Grep, `Edit(.planning/seldon/**)` and `Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*)`, and a CI test fails on any other entry.
- On a bare `/seldon`, it asks for the dump in a plain-prose question that ends its message, and writes nothing.
- Once the user confirms a path in a later turn, `/seldon` writes `.planning/seldon/brief.md`:
  - It has a title and the eight sections in FORMAT.md's order, What it refuses among them, with each refusal giving its reason.
  - Every guess is tagged `[ASSUMPTION]`.
  - Each item drafted from the user's own words, in the dump or a reply, keeps the exact phrase it came from word for word on a quoted line under it, never the whole dump. An item with no source words is a guess: `[ASSUMPTION]`, no quote.
  - Nothing is written anywhere else.
- It then runs the plugin's own brief-only check and repeats the check's result line in its final message.
- On the fast path, it asks every blocking question in one prose turn before drafting. That always includes who the project is for, and what it refuses, when the dump never says.
- On coaching, it names the project and asks one question per turn until every section is settled, then writes.
- It stops without writing when `.planning/seldon/brief.md` already exists, and says that rerunning a step comes later.
- It reads `docs/design/`, and any folder the dump names, as input, and never writes there.

## Context

- **Locked:** D-01, D-02 (SECURITY), D-04, D-06, D-07, D-08, D-09, D-10, D-11, D-14, D-17 and D-18 bind this plan. Phase 1 D-06 also holds: every question is plain prose that ends the turn, never AskUserQuestion or a menu.
- **Plan 1** fixed the check's brief-only form, `node lib/check.mjs --brief <dir>`, which passes with `seldon check: brief.md conforms`. Read FORMAT.md as Plan 1 left it:
  - "The check"
  - the eight brief sections, with the refusal bullet form
  - the `[ASSUMPTION]` section
  - the quote format for answers

  `samples/brief.md` shows the refusal bullets and a quoted answer.
- **Order and proof:** every task edits `skills/seldon/SKILL.md`, so the tasks run in order. Behavior is proven by Plans 3 and 4's eval cases, which run in the main tree. This plan's checks are structural, and none of them runs `claude plugin eval`.
- **Constraints:** Seldon's own words, with no persona and nothing copied from BMAD.
- **Out of scope:** the PRD, spine and epics steps (phases 3 to 5), and resume after `/clear` or a `/seldon <step>` rerun (phase 3).

## Tasks

### Task 1: Grant the brief step's tools in allowed-tools, pinned by a test

- **Files:** skills/seldon/SKILL.md, tests/skill.test.mjs
- **Reads:** skills/seldon/SKILL.md, tests/check.test.mjs#root
- **Decisions:** D-02, D-07
- **Action:** Add `allowed-tools` to SKILL.md's frontmatter as a YAML block list, one entry per line, so a reviewer sees each grant. It holds exactly:
  - Read
  - Glob
  - Grep
  - `Edit(.planning/seldon/**)`
  - `Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*)`

  Nothing else goes in the list:
  - No Write. A `Write(path)` rule never matches, and `Edit(.planning/seldon/**)` already covers every file-editing tool inside that folder (permissions docs, "What `Read` and `Edit` rules cover").
  - No bare Edit or Bash.
  - No `Bash(node:*)`, because `node -e` runs anything.
  - No AskUserQuestion (phase 1 D-06).

  The Bash rule goes through `${CLAUDE_PLUGIN_ROOT}`, so it names the plugin's installed check and never a file in the user's project (D-07). Claude Code substitutes that variable in a plugin skill's allowed-tools Bash rules and in its text alike. Leave the rest of SKILL.md unchanged in this task.

  Write `tests/skill.test.mjs` with `node:test` and `node:` builtins only, working on Node 22 as the CI matrix needs.
  - It reads SKILL.md's frontmatter, collects the allowed-tools list, and asserts the list equals that five-entry set.
  - It fails, naming the entry, when the field is missing, written in a form it can't read, or holds any other entry.

  This is AC7's allowed-tools check, read the way D-02 settled it: the one Edit allowed is the scoped rule, and no Bash is broader than the check.

  If `claude plugin validate --strict` rejects one of D-02's entries, stop and return a checkpoint with its output. Don't change the list to get past it.
- **Verify:**
  - **Testing scope:** the outcome is SKILL.md granting exactly D-02's tools, and nothing covers it today. This one test is the check, CI runs it under node-test and coverage, and testing stops there.
  - (1) `node --test tests/skill.test.mjs` passes. It can't pass on the base tree, where SKILL.md has no allowed-tools.
  - (2) Each of these mutations makes the test fail, naming the entry:
    - adding a `Write` line to the list
    - replacing the Bash rule with `Bash(node:*)`

    Reverting each one makes it pass again.
  - (3) `claude plugin validate --strict .` exits 0 and lists `seldon:seldon`.
  - (4) `node --test tests/*.test.mjs` passes.

### Task 2: Continue from where the conversation stands

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. The dump, skills/seldon/SKILL.md#4. After the answer, evals/replay/history.jsonl
- **Decisions:** D-04, D-09
- **Action:** Add a first step to `<process>` that places Seldon in the conversation before it does anything else, so each turn of the interview picks up at the right step.
  - **Why:** the skill can be loaded again on a later turn with a summary of the conversation as its arguments, not a dump. Phase 1's replay run did exactly that: on the resumed turn, the Skill tool was called with a summary of the user's choice. Those arguments must not be taken as a new dump.
  - **The positions:**
    - **New run:** no recommendation yet and no dump asked for. Start at the beginning.
    - **Dump given:** Seldon asked for the dump and the user's message gives it. That's the dump, so go to the judgment.
    - **Path chosen:** Seldon gave its recommendation and the user answered. Go to after-the-answer with the path the user chose, and never recommend again.
    - **Interview under way:** Seldon asked fast-path questions or a coaching question and the user answered. Carry on from there.
  - **Conversation only:** it finds its place from the conversation alone, never from a file. Rebuilding state after `/clear` is phase 3's resume and isn't built here.
  - **D-04:** state it plainly. The recommendation turn writes nothing, and drafting starts only on a later turn, after the user confirms a path.
  - **The dump request:** in "1. The dump", the request on an empty `$ARGUMENTS` becomes one plain-prose question that ends the message. It asks the user to paste or describe the idea, any notes and who it's for, and nothing is written in that turn. Plan 3's no-dump case grades that the message ends on a question.
- **Verify:**
  - (1) The new step is the first one in `<process>`, covers the four positions above, and says it reads only the conversation to find its place. Today the process starts at "1. The dump".
  - (2) It says that arguments on a later turn are a summary, not a new dump.
  - (3) "1. The dump" says the request for the dump is a question that ends the message. Today it only says to ask and end the turn.
  - (4) `claude plugin validate --strict .` exits 0, and `node --test tests/skill.test.mjs` passes.
  - Behavior is proven by Plan 3's no-dump, asks-for-dump, fast-path-brief and coaching-brief cases, and by phase 1's replay case.

### Task 3: Write the brief once the user confirms

- **Files:** skills/seldon/SKILL.md
- **Reads:** docs/FORMAT.md#brief.md, docs/FORMAT.md#The check, skills/seldon/SKILL.md#2. The judgment, skills/seldon/SKILL.md#4. After the answer, samples/brief.md
- **Decisions:** D-01, D-04, D-06, D-17, D-18
- **Action:** Replace "drafting the documents isn't built yet", in the rules and in after-the-answer, with the brief step's write.
  - **The draft:** after the user confirms a path (D-04), Seldon drafts `.planning/seldon/brief.md`.
    - It opens with a `# ` title naming the project.
    - Then come exactly eight `## ` sections, in FORMAT.md's order and spelling: Problem, Solution, Who it serves, What's different (straight apostrophe), Success criteria, Scope, What it refuses, Vision.
    - Each section has a body that isn't empty. There's no other `## ` heading, and no body line starts with `## `.
    - State this shape in SKILL.md itself. The check is what holds the brief to it.
  - **Refusals (D-17):** each item under What it refuses names something the product won't do and the reason, as a `- ` bullet in FORMAT.md's form: what it won't do, then `because` and the reason. Seldon never invents a refusal. One the user hasn't stated is asked about, never guessed (D-01, Task 5).
  - **The user's own words (D-18):** each item drafted from the user's own words, in the dump or in a reply to a question Seldon asked, keeps the exact phrase it came from word for word on a quoted line directly under it, in FORMAT.md's form, never the whole dump. That's a `> ` line, indented two spaces under a bullet. There's no paraphrase, and the words aren't tidied. An item with no source words is a guess, so it carries `[ASSUMPTION]` and no quote.
  - **Guesses:**
    - Every guess is tagged `[ASSUMPTION]`, spelled exactly that way, inline right after the guessed text, and never on a heading line (D-06). A guess has no quote.
    - No section is left empty. A section with nothing from the user gets a tagged guess (D-01), except What it refuses, which is asked about.
  - **The judgment list:** the list in "2. The judgment" names what it refuses, and why, between the scope and the vision, so both paths read the dump against all eight sections.
  - **The write:** Seldon writes the file with the Write tool.
  - **The rules section** changes from "write nothing" to these rules:
    - The only file Seldon writes is `.planning/seldon/brief.md`.
    - It never writes, edits or creates anything else, in the project or outside it, and a design folder is input only.
    - When the user asks for the brief, or anything else, somewhere else (a `docs/` file, the README), Seldon says it writes only inside `.planning/seldon/` and doesn't do it (DOCS-03, D-02).
  - **Frontmatter and objective:** update `<objective>` and the frontmatter `description` to say `/seldon` now writes the brief. Leave out the PRD, spine and epics, which phases 3 to 5 add.

  In this task both paths draft right after the confirmation. Tasks 5 and 6 put the fast-path questions and the coaching walk in front of the draft.
- **Verify:**
  - (1) A `node -e` script reading SKILL.md finds `.planning/seldon/brief.md`, and finds the eight strings `## Problem`, `## Solution`, `## Who it serves`, `## What's different`, `## Success criteria`, `## Scope`, `## What it refuses` and `## Vision` in that order. None of them is there today.
  - (2) `grep -c 'built yet' skills/seldon/SKILL.md` prints 0. It prints 2 today.
  - (3) The rules section names `.planning/seldon/brief.md` as the only file Seldon writes, and says Seldon declines a write anywhere else.
  - (4) `grep -c 'word for word' skills/seldon/SKILL.md` and `grep -c 'because' skills/seldon/SKILL.md` each print at least 1. Both print 0 today. The draft step states the refusal bullet form and the `> ` quote line, and "2. The judgment" lists what it refuses.
  - (5) `claude plugin validate --strict .` exits 0, and `node --test tests/skill.test.mjs` passes.

### Task 4: Run the plugin's brief-only check and report its line

- **Files:** skills/seldon/SKILL.md, tests/skill.test.mjs
- **Reads:** docs/FORMAT.md#The check, lib/check.mjs#main
- **Decisions:** D-02, D-07
- **Pins:** tests/skill.test.mjs
- **Action:** After writing the brief, Seldon runs exactly `node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --brief .planning/seldon` from the project root.
  - **The command:**
    - The path stays unquoted and goes through the variable, so the command starts with the allowed-tools Bash rule's command and runs without a prompt (D-02).
    - It's the plugin's installed check, never `lib/check.mjs` in the user's project, which has none (D-07).
  - **Failures:** if the check exits 1, Seldon fixes each problem it names in `brief.md` with Edit, inside `.planning/seldon/`, and runs the check again until it passes.
  - **Final message:** name the file written and repeat the check's result line verbatim, on a line of its own, then end.
  - **Rules:** add that this command is the only one Seldon runs.

  Add one test to `tests/skill.test.mjs`:
  - The check command in SKILL.md's body begins with the Bash rule's command (the rule with `Bash(` and `:*)` taken off).
  - The body has no `node lib/check.mjs` without the plugin root in front of it.

  The defect this catches is the body and the rule drifting apart, which would make the command prompt or be refused.
- **Verify:**
  - **Testing scope:** the outcome is the skill's check command matching its own grant. Task 1's test covers the grant but not the body. One added test closes that gap, and testing stops there.
  - (1) `grep -cF 'node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --brief .planning/seldon' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes. The new test fails when the body's command is changed to `node lib/check.mjs --brief .planning/seldon`, and passes again once that's reverted.
  - (3) Copy `samples/brief.md` to `.planning/seldon/brief.md` in a temp folder. From that folder, SKILL.md's command, with `${CLAUDE_PLUGIN_ROOT}` replaced by `/code/seldon`, prints `seldon check: brief.md conforms` and exits 0.
  - (4) `claude plugin validate --strict .` exits 0.

### Task 5: Ask the fast path's blocking questions before drafting

- **Files:** skills/seldon/SKILL.md
- **Decisions:** D-01, D-04, D-09, D-18
- **Action:** On the fast path, between the confirmation and the draft, Seldon sorts the eight sections by what the dump says, and any design folder it read:
  - **Stated:** written from the user's words.
  - **Touched but thin, or never mentioned but inferable** from the rest of the dump: drafted as a guess tagged `[ASSUMPTION]`.
  - **Never mentioned, and only the user can decide:** asked before drafting. "Who it serves" and "What it refuses" are always in this group when the dump never states them (D-01). An unstated refusal is asked about, never guessed.

  These are the decisions the dump left open that the brief needs, so the questions cover what the user didn't write, not only what they did (FLOW-07).
  - All the questions go in one plain-prose message that ends the turn, and nothing is written in that turn (D-09).
  - Ask about who it serves plainly, as who the project is for. Ask about refusals as what the project won't do, and why.
  - Once the user answers, draft with those answers. Each item an answer settles carries that answer word for word on its quoted line (Task 3, D-18). Anything still thin gets a tag.
  - When nothing blocks, draft right away in the confirmation turn.
- **Verify:**
  - Reading the fast-path step shows:
    - the three-way sort over eight sections
    - who it serves and what it refuses always asked when they're never mentioned, and a refusal never guessed
    - all questions in one message that writes nothing
    - answers carried into the brief with their quotes
    - drafting right away when nothing blocks

    None of this is in SKILL.md today, where after-the-answer only names the path.
  - `claude plugin validate --strict .` exits 0, and `node --test tests/skill.test.mjs` passes.
  - Behavior is proven by Plan 3's asks-who-for case (AC3) and fast-path-brief case (AC2).

### Task 6: Walk the coaching path through to the written brief

- **Files:** skills/seldon/SKILL.md
- **Decisions:** D-09, D-10, D-14, D-18
- **Action:** On coaching, Seldon names the project the way the dump names it, then asks its first coaching question in the same message (D-14). That keeps phase 1's replay grader on `Brindlewick` passing.
  - It walks the decisions the dump left open that the brief needs, most consequential first. It asks one plain-prose question per turn (D-09, FLOW-07).
  - It carries each answer into the brief word for word, on the quoted line under the item the answer settles (Task 3, D-18).
  - Once all eight sections are settled, it drafts and writes the brief in that same turn, without asking for another go-ahead, since the path was already confirmed (D-04). Then it runs the check as Task 4 says.
  - A section the user left thin still gets a tagged guess rather than an empty body. What it refuses is never guessed: it's one of the decisions the walk asks about when the dump doesn't state it (D-01).
- **Verify:**
  - Reading the coaching step shows:
    - the project named before the first question
    - one question per turn
    - each answer carried into the brief with its quote
    - the write happening once all eight sections are settled, with no extra confirmation

    Today the step only names the path and says drafting isn't built.
  - `claude plugin validate --strict .` exits 0, and `node --test tests/skill.test.mjs` passes.
  - Behavior is proven by Plan 3's coaching-brief case (AC5, including its quote grader), and by phase 1's replay case under D-14.

### Task 7: Stop when a brief already exists

- **Files:** skills/seldon/SKILL.md
- **Decisions:** D-08
- **Action:** At the start of a new run, before asking for or reading the dump, Seldon looks for `.planning/seldon/brief.md` in the project with Read or Glob. An error or no match means there isn't one.
  - **If it exists:**
    - Seldon writes nothing and says a brief is already there.
    - It says that rerunning a step comes in a later release, using the word "rerun", which Plan 4's existing-brief case grades on.
    - Then it ends.
    - It doesn't edit or replace the existing brief.
  - **When it runs:** this check happens only when a run starts. On later turns of the same run, the brief Seldon just wrote is expected.
- **Verify:**
  - (1) `grep -ci 'rerun' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) The step comes before the dump step and tells Seldon to write nothing.
  - (3) `claude plugin validate --strict .` exits 0, and `node --test tests/skill.test.mjs` passes.
  - Behavior is proven by Plan 4's existing-brief case (AC6).

### Task 8: Read the design folder as read-only input

- **Files:** skills/seldon/SKILL.md
- **Decisions:** D-11
- **Action:** With the dump, Seldon reads `docs/design/` when it exists, plus any folder the dump points to, using only Read, Glob and Grep.
  - What it finds there is input to the judgment and the brief, just like the dump.
  - Seldon names the project the way the dump or the design folder names it, and says which folder it read.
  - It never writes, edits, moves or tidies the folder, and creates nothing in it (DOCS-03).
  - It looks nowhere beyond `docs/design/` and the folders the dump names.
- **Verify:**
  - (1) `grep -c 'docs/design' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) The step says the folder is read-only input, and the recommendation names the project from the dump or the design folder.
  - (3) `claude plugin validate --strict .` exits 0, and `node --test tests/skill.test.mjs` passes.
  - Behavior is proven by Plan 4's design-folder case (AC4).

## Notes

- AC7 says a grep of allowed-tools "finds no Edit". D-02 corrected the earlier "No Edit" to mean no unscoped write power. So Task 1's test allows exactly one Edit entry, the scoped rule, and no Bash broader than the check.
- The skills docs say an allowed-tools grant clears when the user sends their next message. In an interactive session, the brief's Write and the check run on a later turn. They go through the normal permission prompt there unless the skill is loaded again on that turn. Eval runs aren't affected, because their grant comes from `--allow-tools` (D-16), which a skill can't widen. Nothing in this plan changes D-02 because of it.
- Task 2 reads only the conversation, never a file. It isn't phase 3's resume after `/clear`.
- **Where D-17 and D-18 land:** both are part of what the drafted brief looks like, so the refusal bullets and the quoted answers go in Task 3's draft rules. Tasks 5 and 6 carry answers into the draft by those rules.
- **Phase 1's fast-path case:** Task 7's start-of-run check uses Read or Glob, and Task 8 reads `docs/design/`. Phase 1's fast-path case allows only Skill and AskUserQuestion. Plan 3 adds Read, Glob and Grep to that case and reruns it.
- Prior art from memory: D-01 (interview), D-02 (permissions) and D-04 (confirmation), cited from phases/2/CONTEXT.md, phase 2. Also phase 1 D-06 (plain-prose questions), cited from phases/1/CONTEXT.md, phase 1.
