---
phase: 6
plan: 6
depends_on: [2, 5]
requirements:
  - ARCH-03
files:
  - skills/seldon/SKILL.md
---

# Phase 6: Existing projects and design folders - Plan 6: The spine on a project under Cadence

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan writes ARCH-03 into SKILL.md: on a project under Cadence the spine step reads the code, records its conventions as decisions quoted from it, and asks who relies on what today. Plan 7 proves it.

## Must be true when done

- On a project under Cadence the spine step, its rerun included, reads the existing code outside `.planning/` as well as the brief and the PRD. Anywhere else it reads the brief and the PRD alone, as today.
- A convention from the code becomes a decision only as one of the six kinds, and only when it touches a part this body of work builds or is project-wide. It is quoted word for word from its file with a `(path)` line under it, and never tagged.
- A stack or host the code settles isn't asked about.
- On a project under Cadence the spine step always ends its first turn on the who-relies question in fixed words, routes the answer through its own bullet in "Where the conversation stands", and records each answer under the decision for the part it names. An answer naming no part, or only a part this work doesn't build, is said back and recorded nowhere. A rerun asks it too, and "The spine rerun" says so.
- `tests/skill.test.mjs` passes, so `allowed-tools` is still the pinned five, and `claude plugin validate --strict .` exits 0.

## Context

- **Locked:** D-06, D-07, D-08, D-09, D-12 and D-13, with D-01's test, which Plan 2 wrote into §2, and D-14: reading the code falls inside `Read`, `Glob` and `Grep`, so no grant changes.
- **Amended rule:** D-06 amends §15's "Read those two files and nothing more" and phase 4 D-06 for a project under Cadence only. A project's own design notes, such as `docs/design/`, still reach the spine only through the brief's quotes, and nothing in `.planning/` is read but this design's own files.
- **Fixed words (my choice):** the who-relies question is `Who relies on what in this project today?`. It is D-09's own phrase, and the answer names the part, which is where it gets recorded. It goes in a fenced block introduced with "exactly these words", as the spine's other questions are. Plan 7 copies it from SKILL.md, never from this plan.
- **Grepping prose:** SKILL.md wraps near 78 columns. A Verify that counts a phrase joins the lines first, for one section with `perl -ne 'print if /^## 15\./../^## 16\./' skills/seldon/SKILL.md | tr -s '\n ' '  '`. A paragraph is taken whole with `perl -00 -ne`.
- **Size:** SKILL.md grows again here, and where the loader starts cutting isn't known (flagged assumption). Write tight and point to sections by name. Plan 7's first run checks the loaded size.
- **Out:** no change to `lib/check.mjs` (D-07), and no seventh kind (D-08).
- **Eval runs:** none in this plan.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Read the code at the spine step on a project under Cadence

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#15. The spine step, skills/seldon/SKILL.md#16. The spine draft, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-06, D-01
- **Pins:** tests/skill.test.mjs
- **Action:** the spine step's inputs widen on a project under Cadence, and only there (D-06).
  - **§15's opening paragraph:** on a project under Cadence, found with Glob for `.planning/PROJECT.md` as §2 says and never Read, the step also reads the project's existing code: files outside `.planning/`, with Read, Glob and Grep, enough to find the conventions "What the spine holds" asks for. Otherwise the paragraph keeps its words, so a project not under Cadence reads the brief and the PRD alone.
  - **Still never read:** a design folder such as `docs/design/`, which reaches the spine only through the brief's quotes, and anything in `.planning/` but this design's brief, PRD and spine.
  - **"The spine rerun":** its "and nothing else" list gains the code, on a project under Cadence.
  - **The two other places that say "alone":** the `<objective>` says the spine step works "from the brief and the PRD alone", and §1's `spine` route says it's built from `.planning/seldon/brief.md` and `.planning/seldon/prd.md` "alone". Change both so neither contradicts §15. Either name the code as an input on a project under Cadence, or point to "The spine step" for the inputs and drop "alone".
- **Verify:**
  - **Testing scope:** the outcome is the widened input. Plan 7 runs it. Greps that fail today, the pinned test and the validator are enough, and testing stops there.
  - (1) `perl -ne 'print if /^## 15\./../^## 16\./' skills/seldon/SKILL.md | grep -c 'PROJECT\.md'` prints at least 1. It prints 0 today.
  - (2) `perl -00 -ne 'print if /^\*\*The spine rerun\.\*\*/' skills/seldon/SKILL.md | grep -cw code` prints at least 1. It prints 0 today.
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (4) `perl -ne 'print if /^<objective>/../^<\/objective>/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -c 'from the brief and the PRD alone'` prints 0. It prints 1 today.
  - (5) `perl -ne 'print if /^- \*\*`spine`:\*\*/.../^- \*\*`epics`:\*\*/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -cF 'prd.md` alone'` prints 0. It prints 1 today.

### Task 2: Record the code's conventions as decisions of the six kinds

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#15. The spine step, skills/seldon/SKILL.md#19. The epics draft
- **Decisions:** D-08, D-12
- **Pins:** tests/skill.test.mjs
- **Action:** "What the spine holds" gains the code's conventions, on a project under Cadence.
  - **What counts:** a convention the existing code follows becomes a decision when a part this body of work builds would clash with it if built separately.
  - **Kinds (D-08):** each convention recorded takes one of the six kinds. One that fits none stays out of the spine.
  - **Which ones (D-12):** only conventions that touch a part this body of work builds, or project-wide ones (design approach, stack, hosting). Say why in one sentence: every S- ID needs an epic that cites it, as "Citations" in "The epics draft" says.
- **Verify:**
  - **Testing scope:** the outcome is the selection rule. Plan 7 runs it. A grep that fails today, the pinned test and the validator are enough, and testing stops there.
  - (1) `perl -00 -ne 'print if /^\*\*What the spine holds\.\*\*/../^\*\*The spine.s questions\.\*\*/' skills/seldon/SKILL.md | grep -ci convention` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 3: Quote a convention from its file

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#16. The spine draft, skills/seldon/SKILL.md#10. The draft, docs/FORMAT.md#In the spine
- **Decisions:** D-07
- **Pins:** tests/skill.test.mjs
- **Action:** §16's "The user's own words" lists a third quote source (D-07).
  - **The source:** on a project under Cadence, the existing code, quoted word for word from the file. The line right after the quote names the file, relative to the project root, in parentheses and indented like the quote, the way "Words from a design folder" in "10. The draft" quotes a design note.
  - **"two sources":** "A spine quote comes from one of two sources" becomes three, and the other two keep their words.
  - **No tag:** a convention quoted from the code is never tagged `[ASSUMPTION]`, since what the code shows isn't a guess (D-07 rejected the tag).
  - **Example:** a short fenced example of one decision quoting one code line, with its `(path)` line under it. Every line of it stays clear of `## ` except its heading.
  - **Words:** `docs/FORMAT.md`'s "In the spine" holds the same rule since Plan 1. Match its terms.
- **Verify:**
  - **Testing scope:** the outcome is the quote form. Plan 7's grader holds a run to it. Greps that fail today, the pinned test and the validator are enough, and testing stops there.
  - (1) `perl -ne 'print if /^## 16\./../^## 17\./' skills/seldon/SKILL.md | grep -c '^ *([^)]*)$'` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 4: Take a stack or host the code settles as settled

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#15. The spine step
- **Decisions:** D-13
- **Pins:** tests/skill.test.mjs
- **Action:** the "Stack and hosting" bullet in "The spine's questions" gains one case (D-13). On a project under Cadence, a stack or hosting choice the code settles counts as settled even when the brief never quotes it, and isn't asked about. Its decision quotes the code as "The spine draft" says. The sentence in §15's opening paragraph saying a stack or hosting word reaches the spine only through the brief's quotes names this case too.
- **Verify:**
  - **Testing scope:** the outcome is one fewer question on a project under Cadence. Plan 7's history and run rest on it. A grep that fails today, the pinned test and the validator are enough, and testing stops there.
  - (1) `perl -00 -ne 'print if /^- \*\*Stack and hosting:\*\*/m' skills/seldon/SKILL.md | grep -cw code` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 5: Ask who relies on what today

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#15. The spine step, skills/seldon/SKILL.md#16. The spine draft, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-09
- **Pins:** tests/skill.test.mjs
- **Action:** on a project under Cadence the spine step always asks who relies on what today (D-09).
  - **The question:** "The spine's questions" lists it as always open on a project under Cadence, a rerun included, which is the one exception to "On a rerun" asking only what the spine doesn't decide yet. Ask it with the spine's other open questions, in the same message. Use exactly these words, in a fenced block, on a line of its own: `Who relies on what in this project today?`. Prose before it can say it means people and systems outside this repository. Such a step never drafts in the turn it starts.
  - **The route:** a `- **Who-relies question answered:**` bullet in §1, before "Spine questions answered". It applies when your last turn asked the who-relies question, alone or with the spine's other questions, and the user answered. Carry the step on with those answers just as "Spine questions answered" does: the rerun with Edit when the asking turn was a `/seldon spine` rerun over a `spine.md` that's there, otherwise "The spine draft".
  - **Recording:** "The answers to the spine's questions" in §16 gains a bullet. A who-relies answer goes, word for word on a `> ` line, into the decision for the part it names. An answer naming several parts puts each run of its words into the decision for the part that run names. The list's closing rule keeps holding: never a decision of a new kind or one that holds only the answer.
  - **An answer with nowhere to go (owner's ruling):** an answer that names no part, such as nothing outside the repository relying on the project, or names only a part this body of work doesn't build, whose conventions D-12 keeps out of the spine, goes into no decision. Say it back to the user in one sentence and record nothing, using the words "record nothing" in that rule. A dependent of code this work doesn't touch doesn't shape this design, and a new decision for it would carry an S- ID no epic can cite (phase 5 D-09).
  - **"The spine rerun" (§16):** its sentence that every decision in `spine.md` counts as answered, "so the rerun asks only about what it doesn't decide yet", names the who-relies question as the exception: on a project under Cadence the rerun always asks it, as "The spine's questions" says.
- **Verify:**
  - **Testing scope:** the outcome is the stop point, its route and where the answer lands. Plan 7 runs all three. Greps that fail today, the pinned test and the validator are enough, and testing stops there.
  - (1) `grep -cxF 'Who relies on what in this project today?' skills/seldon/SKILL.md` prints 1. It prints 0 today.
  - (2) `grep -n '^- \*\*Who-relies question answered:\*\*' skills/seldon/SKILL.md` prints one line, whose number is lower than the `- **Spine questions answered:**` line's. Today it prints nothing.
  - (3) `perl -ne 'print if /^\*\*The answers to the spine.s questions\.\*\*/../^Never put an answer/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -ci 'who-relies'` prints at least 1. It prints 0 today.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (5) `perl -ne 'print if /^\*\*The answers to the spine.s questions\.\*\*/../^Never put an answer/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -c 'record nothing'` prints at least 1. It prints 0 today.
  - (6) `perl -00 -ne 'print if /^\*\*The spine rerun\.\*\*/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -ci 'who relies\|who-relies'` prints at least 1. It prints 0 today.

## Notes

- **An answer with nowhere to go (settled by the owner at the plan review):** an answer naming no part, or only a part this body of work doesn't build, is said back and recorded nowhere (Task 5). Plan 7's case names a part the work touches, so the no-part answer goes untested by a case, and its rule is held by Task 5's grep.
- **A rerun asks again:** D-09 says the step always asks on a project under Cadence, so a `/seldon spine` rerun there asks even when the spine already records earlier answers.
