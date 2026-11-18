---
phase: 6
plan: 3
depends_on: [2]
requirements:
  - FLOW-05
files:
  - skills/seldon/SKILL.md
---

# Phase 6: Existing projects and design folders - Plan 3: Designs and the working folder

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan writes the design-folder half into SKILL.md: where each design lives, the name a new one gets, and the question that picks one when there are several. Plans 4 and 5 prove it.

## Must be true when done

- SKILL.md says where each design lives and which folder a run works in. With the top-level design every fixed line, check command and file path reads exactly as it does today. With a named design they name `.planning/seldon/<name>/`.
- A dump while a design is there writes nothing. With one design the message shows the name line and then ends on the documents question, unchanged. With more than one design it ends on the name line alone.
- A reply with a name that fits and isn't taken starts a new design in `.planning/seldon/<name>/` from that dump. A name that doesn't fit, or is taken, gets the name line again, and nothing is written.
- With more than one design, a bare `/seldon` or a step name writes nothing and ends on the which-design question, and the answer routes back to the run that asked. With one design it never asks.
- `tests/skill.test.mjs` passes, so `allowed-tools` is still the pinned five, and `claude plugin validate --strict .` exits 0.

## Context

- **Locked:** D-02, D-03, D-04 and D-05, with D-10 (Cadence's files never change where a run starts) and D-14 (no grant changes: `Edit(.planning/seldon/**)` already covers a named design's folder).
- **Words (my choice):** "a design", "the top-level design", "a named design" and "the working folder". Never "design folder" for these: "4. The design folder", `<rules>` and `docs/FORMAT.md` already use it for a project's own design notes, such as `docs/design/`, which stay input only.
- **When new work starts (my choice):** a dump while a design is there is either new work or a change to that design, and only the user can say which (phase 3 D-02). D-10 rules out reading Cadence's files to decide. So the dump turn asks:
  - With one design it shows the name line, then ends on the documents question with its words unchanged. That keeps `existing-brief`'s grader and `brief-rerun-dump`'s history matching.
  - With more than one design the documents question can't say which brief, so the turn ends on the name line alone.
- **Fixed words:** this plan fixes two lines, the name line in Task 2 and the which-design question in Task 3. Each goes in a fenced block introduced with "exactly these words", the way §2's resume lines are written. Plans 4 and 5 copy them from SKILL.md, never from this plan. Wording of the name rules and the which-design sentence is the planner's call within D-04 and D-05 (flagged assumption).
- **Existing lines:** every fenced line and check command SKILL.md holds today stays as written. The top-level design reads them exactly so, and the existing cases' graders match them.
- **Grepping prose:** SKILL.md wraps near 78 columns, so a phrase can break across lines. A Verify that counts a phrase joins the lines first: `tr -s '\n ' '  ' < skills/seldon/SKILL.md`, or one section's `perl -ne 'print if /^## 1\./../^## 2\./'` output through the same `tr`. A fenced line keeps its words on one line, so `grep -cxF` reads it.
- **Size:** SKILL.md is 55,644 bytes today, and where the skill loader starts cutting isn't known (flagged assumption). Write tight, and point to a section by name rather than restating it. Plan 4's first run checks the loaded size.
- **Eval runs:** none in this plan.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add designs and the working folder

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#rules, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#11. The check, skills/seldon/SKILL.md#13. The PRD draft
- **Decisions:** D-02, D-03
- **Pins:** tests/skill.test.mjs
- **Action:** A `### Designs and the working folder` subsection opens "2. Where a run starts" and says:
  - **A design:** one body of work's documents, in one folder.
    - The top-level design is the one at the top of `.planning/seldon/`. It stays there and works as it always has (D-03).
    - A named design sits in `.planning/seldon/<name>/`, holding the same files in the same format (D-02).
    - A folder holds a design when its `brief.md` is there.
  - **Finding them:** Glob for `.planning/seldon/brief.md` and `.planning/seldon/*/brief.md`, never Read. The spine-from-prd and full-walk graders allow only Glob and Skill before a resume line.
  - **The working folder:** the one folder a run reads its documents from and writes them to. With no design it's the top-level folder, so a project's first brief goes where it always has. With one design it's that design's folder. Task 3 adds more than one.
  - **Paths:** every `.planning/seldon/` file path in this skill, fixed lines and check commands included, names that file in the working folder. With the top-level design every line reads exactly as written. With a named design it names that folder. Give three examples in this form: the PRD resume line names `.planning/seldon/<name>/brief.md`, the PRD's create guard line names `.planning/seldon/<name>/prd.md`, and a check runs on `.planning/seldon/<name>`, unquoted.
  - **A step under way** keeps the working folder its run settled, which the conversation shows.
  - **Other designs:** a run writes and edits only inside its working folder and never touches another design.
  - **`<rules>`:** the first bullet's files are those in the working folder, naming "Designs and the working folder", and never another design's.
  - **§2's opening:** it settles the working folder first, then looks for that folder's four files with Read or Glob as now. The routes below it keep their words.
  - **Kept:** every fenced line and check command as written today.
- **Verify:**
  - **Testing scope:** the outcome is the working folder, with the top-level design unchanged. Plans 4 and 5 run it. Greps that fail today, a guard that nothing fenced changed, the pinned test and the validator are enough, and testing stops there.
  - (1) `grep -c '\.planning/seldon/<name>' skills/seldon/SKILL.md` prints at least 3. It prints 0 today.
  - (2) `perl -ne 'print if /^<rules>/../^<\/rules>/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -o 'working folder' | wc -l` prints at least 1. It prints 0 today.
  - (3) A `node -e` script finds every line that sits inside a fenced block in `git show HEAD:skills/seldon/SKILL.md` still present as a whole line of the file.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 2: Ask for a new design's name

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#A dump when documents are there, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#4. The design folder
- **Decisions:** D-04, D-02
- **Pins:** tests/skill.test.mjs
- **Action:** a dump while a design is there can start a new body of work in its own folder (D-04).
  - **"A dump when documents are there":** it still writes nothing, reads no design folder and judges no path. Then:
    - One design: the name line on a line of its own, then the documents question, unchanged, as the message's last line with nothing after it.
    - More than one design: one sentence saying `/seldon brief` reruns one design's brief and a bare `/seldon` goes on with one. Then the name line alone ends the message, on a line of its own, with nothing after it.
  - **The name line**, in a fenced block introduced as exactly these words: `To design this as a new body of work in its own folder under .planning/seldon/, reply with a short name for that folder, in lowercase letters, digits and hyphens.`
  - **A `### A new design's name` subsection under §2:**
    - A name fits when it's one or more lowercase letters, digits and hyphens, and nothing else (D-04).
    - It's taken when Glob finds anything in `.planning/seldon/<name>/`.
    - The five step names never reach here: "Where the conversation stands" reads such a reply as the step.
    - Never make up a name from the dump (D-04 rejected that).
  - **A `- **Name given:**` bullet in §1**, before "Documents question answered". It applies when your last turn ended on the name line, or on the documents question with the name line above it, and the reply is a folder name rather than a choice to rerun the brief or go on.
    - Fits and isn't taken: the working folder is `.planning/seldon/<name>/`. The dump is the text from the turn that first showed the name line. Go to "The design folder" with it, and the walk goes on in that folder as any new run's does.
    - Doesn't fit, or is taken: write nothing, say why in one sentence, and end on the name line alone, on a line of its own, with nothing after it.
  - **Kept:** the documents question's words and "Documents question answered"'s two branches.
- **Verify:**
  - **Testing scope:** the outcome is the name stop point and its route. Plan 4 runs both. Greps that fail today, the pinned test and the validator are enough, and testing stops there.
  - (1) `grep -cxF` with the name line exactly as this Action gives it prints 1. It prints 0 today.
  - (2) `grep -n '^- \*\*Name given:\*\*' skills/seldon/SKILL.md` prints one line, whose number is lower than the `- **Documents question answered:**` line's. Today it prints nothing.
  - (3) In `perl -ne 'print if /^### A dump when documents are there/../^## 3\./' skills/seldon/SKILL.md`, the name line comes before the documents question's line, and the documents question still appears exactly once in the file.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 3: Ask which design when there are several

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#rules
- **Decisions:** D-05
- **Pins:** tests/skill.test.mjs
- **Action:** with more than one design, a run that needs one asks which first (D-05).
  - **§2:** more than one design and an empty `$ARGUMENTS`: write nothing and ask the which-design question, unless the user just chose a design at it for this run. Then "Design chosen" has already settled the working folder, so §2 uses that folder and doesn't ask again. This is the same exemption the step routes carry, so a bare `/seldon` can't loop on the question.
  - **§1's five step routes:** each settles the working folder before it looks for files. More than one design: write nothing and ask the which-design question, unless the user just chose a design at it for this run, which stops the route from asking again. One design: its folder. None: the top-level folder.
  - **A `### Which design` subsection under §2:**
    - One prose sentence names each design by its folder: the top-level design as the one at the top of `.planning/seldon/`, and each named design as `.planning/seldon/<name>/`. No list or menu, since `<rules>` forbids a list of options.
    - Then, in a fenced block introduced as exactly these words, ending the message on a line of its own with nothing after it: `Which design do you want to work on?`
    - The question needs only the Glob, so read nothing else for it.
  - **A `- **Design chosen:**` bullet in §1.** It applies when your last turn ended on the which-design question and the user named one of the designs, by its folder or in their own words. That design's folder is the working folder. Go back to the run that asked:
    - For a bare `/seldon`, go to "Where a run starts" for that design, with `$ARGUMENTS` counted empty.
    - For a step name, take that name's route for that design.
    - A reply naming none of them writes nothing and ends on the same question again.
  - **The brief route keeps the dump (phase 3 D-02):** in §1's `brief` route, "After the documents question" also applies when the dump turn ended on the name line alone, the user then took `/seldon brief`, and a which-design exchange came between. The text from the dump turn is still the change, so the user never types it again.
  - **Call it "the which-design question"** wherever SKILL.md refers to it, as it says "the documents question".
  - **Kept:** with one design nothing asks (D-05), so every existing case reads as today. Phase 3 D-08's grammar stays: there's no `/seldon <name> <step>` form (D-05 rejected it).
- **Verify:**
  - **Testing scope:** the outcome is the which-design stop point and its route back. Plan 5 runs both. Greps that fail today, the pinned test and the validator are enough, and testing stops there.
  - (1) `grep -cxF 'Which design do you want to work on?' skills/seldon/SKILL.md` prints 1. It prints 0 today.
  - (2) `grep -c '^- \*\*Design chosen:\*\*' skills/seldon/SKILL.md` prints 1. It prints 0 today.
  - (3) `perl -ne 'print if /^## 1\./../^## 2\./' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -o 'which-design question' | wc -l` prints at least 2: the step routes and "Design chosen". It prints 0 today.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (5) `perl -ne 'print if /^## 2\./../^## 3\./' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -o 'just chose' | wc -l` prints at least 1, so §2 carries the exemption. It prints 0 today.
  - (6) `perl -ne 'print if /^- \*\*`brief`:\*\*/.../^- \*\*Step confirm answered/' skills/seldon/SKILL.md | tr -s '\n ' '  ' | grep -o 'name line' | wc -l` prints at least 1, so the brief route keeps the dump across the which-design exchange. It prints 0 today.

## Notes

- **Why the name line sits beside the documents question (my choice, for the owner to see):** AC2 has a dump for new work ask for a name in that same turn, while `existing-brief`, a dump given while a brief is there, must still end on the documents question. Only the user can tell new work from a change to the design there, and D-10 rules out letting Cadence's files decide. So the one-design turn offers both, and a dump on a project whose only design is unfinished shows the name line too.
- **Step names:** a folder can't be called `brief`, `prd`, `spine`, `epics` or `architecture`, since "Where the conversation stands" takes such a reply as the step. That follows from phase 3 D-08's grammar, which D-05 keeps.
