---
phase: 2
plan: 1
requirements:
  - DOCS-01
files:
  - lib/check.mjs
  - tests/check.test.mjs
  - docs/FORMAT.md
  - samples/brief.md
---

# Phase 2: The brief - Plan 1: The brief's check and its format contract

## Goal

A user runs `/seldon` on a new project, dumps what they have, confirms fast path or coaching, and gets a brief in `.planning/seldon/`, proven by eval cases this phase adds. This plan gives the brief step a check it can pass with only `brief.md` on disk, makes both checks require the brief's "What it refuses" section, and writes the check, the guess tag, the refusals and the quoted answers into the format contract.

## Must be true when done

- `node lib/check.mjs --brief samples` prints `seldon check: brief.md conforms` and exits 0. A folder holding nothing but a conforming `brief.md` passes the same way.
- On a brief missing a section, `--brief` exits 1 and prints a line naming that section. On a folder with no `brief.md` it exits 1 with `brief.md: missing file`.
- `node lib/check.mjs <dir>` without the flag still requires all four files, and prints `seldon check: all four documents conform` only when all four conform.
- Both checks require a `## What it refuses` section, not empty, between `## Scope` and `## Vision`. `samples/brief.md` carries one, and the out-of-order message names it in its place.
- `docs/FORMAT.md`:
  - documents the brief-only mode in "The check"
  - lists What it refuses among the brief's eight sections, with each refusal giving its reason, and its brief example still conforms
  - documents the `[ASSUMPTION]` tag as part of the contract: free text only, never inside an ID-list field, and not enforced by the check
  - sets the quote format for an item written from a user answer, which `samples/brief.md` shows
- The suite passes under the accepted coverage command and its two guards.

## Context

- Locked: D-05 (a brief-only mode with its own result line; FORMAT.md's check section and the Node tests change with it; the full check still requires all four files) and D-06 (the tag is exactly `[ASSUMPTION]`, inline after the guessed text, documented in FORMAT.md, not enforced by `lib/check.mjs`).
- Also locked: D-17 (a "What it refuses" section after Scope and before Vision, each item naming something the product won't do and the reason; FORMAT.md lists it, the brief-only check requires it and requires it not empty, `samples/brief.md` carries one) and D-18 (each item drafted from the user's own words, in the dump or a reply, keeps the exact phrase it came from word for word on a quoted line under it, never the whole dump; an item with no source words is an `[ASSUMPTION]` with no quote; FORMAT.md sets the format and `samples/brief.md` shows it).
- This plan fixes the command shape Plans 2 to 4 use: `node lib/check.mjs --brief <dir>`, which reads only `<dir>/brief.md` and passes with the line `seldon check: brief.md conforms`.
- Patterns to follow: `lib/check.mjs` has no dependencies and prints one line per problem. `tests/check.test.mjs` starts every broken case from a copy of `samples/` (`copy`, `edit`) and runs the script through `run`.
- Out of scope: the epic size and trace checks (phases 5 and 8) and any partial mode besides the brief.

## Tasks

### Task 1: Add the brief-only mode to the check

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** lib/check.mjs#main, lib/check.mjs#checkDir, lib/check.mjs#CHECKS, tests/check.test.mjs#run
- **Decisions:** D-05
- **Pins:** tests/check.test.mjs
- **Action:** `main` accepts `--brief <dir>` as well as `<dir>`, with the flag first. Seldon's brief step runs this on a project whose `.planning/seldon/` holds only the brief, where the full check would report three missing files.
  - **Brief-only behavior:** with the flag, the check holds `<dir>/brief.md` to the same brief rules the full check applies (the `brief.md` entry in `CHECKS`, through `checkNamed` and `BRIEF_SECTIONS`) and reads no other file.
  - **Problems** print exactly as the full check prints them, one line each. A missing or unreadable `brief.md` gives the same `brief.md: missing file` or `brief.md: cannot read (...)` line that `checkDir` gives.
  - **Pass line:** on a pass it prints `seldon check: brief.md conforms`. Export that line beside `OK_LINE` so tests compare against the constant.
  - **Exit codes** match the full check: 0 on a pass, 1 on problems, 2 when the directory argument is missing or isn't a directory, `--brief` given alone included. Only the exact `--brief` token switches the mode, and any other first argument is the directory, as it is today.
  - **Sharing:** reuse `checkDir`'s read-and-report loop rather than copying it. Keep `checkDir(dir)` behaving exactly as it does now for its current callers, so the full check still requires all four files (D-05).
  - **Text:** update the usage line and the header comment to show both forms.

  Tests in `tests/check.test.mjs`, each catching a different defect:
  - `--brief` on `samples/` exits 0 with the brief line.
  - `--brief` on a folder holding only a copy of `samples/brief.md` exits 0.
  - With `## Vision` removed from that copy, `--brief` exits 1 and prints exactly `brief.md: Vision: missing section`.
  - `--brief` on an empty folder exits 1 with `brief.md: missing file`.
  - The full check on the brief-only folder exits 1, naming `prd.md`, `spine.md` and `epics.md` as missing.
  - `--brief` with no directory exits 2.

  Update the existing usage assertion to match the new usage text.
- **Verify:**
  - **Testing scope:** the outcomes are a brief-only pass, a brief-only failure naming the section, a missing brief, the usage exit, and the full check unchanged.
    - The existing table of brief cases already covers every brief rule through `checkDir`. They aren't repeated under the flag.
    - The six tests in Action are the additional checks. The suite plus the coverage gate is sufficient evidence, and testing stops there.
  - (1) `node lib/check.mjs --brief samples` prints exactly `seldon check: brief.md conforms` and exits 0. Today it exits 2, because `--brief` isn't a directory.
  - (2) In a temp folder holding only a copy of `samples/brief.md`:
    - `node lib/check.mjs --brief <tmp>` exits 0.
    - `node lib/check.mjs <tmp>` exits 1 and prints `prd.md: missing file`, `spine.md: missing file` and `epics.md: missing file`.
  - (3) With `## Vision` and its body removed from that copy, `--brief` exits 1 and prints `brief.md: Vision: missing section` and nothing else.
  - (4) `node --test tests/*.test.mjs` passes.
  - (5) The coverage job's command in `.github/workflows/test.yml` passes at lines 85 and branches 85. After it, `grep -q '^LF:[1-9]' lcov.info` and `! grep -qx 'LH:0' lcov.info` both succeed.

### Task 2: Document the brief-only mode in FORMAT.md's check section

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#The check, lib/check.mjs#main
- **Decisions:** D-05
- **Action:** "The check" shows both commands: the full check as it stands, and `node lib/check.mjs --brief <dir>`. For the brief-only mode, say:
  - It reads only `<dir>/brief.md`, holds it to the brief rules above, and ignores whether the other three files exist.
  - It prints `seldon check: brief.md conforms` and exits 0 when the brief conforms.
  - Otherwise it reports exactly as the full check does: exit 1 with one line per problem, `brief.md: missing file` when there's no brief, and exit 2 when the directory is missing or isn't one.
  - What it's for: a step that has written only the brief checks what it wrote.

  Keep the full check's text true: it still requires all four files. Touch the opening paragraph's `node lib/check.mjs <dir>` mention only if it would otherwise read as the only form. Keep FORMAT.md's plain style.
- **Verify:**
  - (1) `grep -c -- '--brief' docs/FORMAT.md` prints at least 1. It prints 0 today.
  - (2) A `node -e` script does the following and exits 0:
    - runs `node lib/check.mjs --brief samples` and `node lib/check.mjs samples`
    - takes each one's stdout line
    - finds both lines verbatim in FORMAT.md's "The check" section (from `## The check` to the next `## ` heading)
  - (3) The section still says the full check needs all four files.

### Task 3: Document the [ASSUMPTION] tag in FORMAT.md

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#Rules for every file, docs/FORMAT.md#Epic fields, lib/check.mjs#checkEpic, BRIEF.md#How it runs
- **Decisions:** D-06
- **Action:** Add a `## ` section before "The check" that documents the tag as part of the contract Cadence's reader gets:
  - It's spelled exactly `[ASSUMPTION]`, uppercase with square brackets, and has no other spelling.
  - It goes inline, right after the guessed text it marks, and only in free text: prose or a bullet's text in a section body, or the value of a free-text epic field (`**Outcome:**`, `**Boundaries:**`, `**Done when:**`).
  - It never goes inside an ID-list field (`**Depends on:**`, `**Requirements:**`, `**Spine decisions:**`), on a `## ` heading line, inside a bold field label or inside a requirement's bold ID span. The check reads all of those exactly, so a tag there fails it. For example, `checkEpic` reports `**Depends on:** None [ASSUMPTION]` as not an epic ID. A guessed ID is noted in free text instead.
  - It means Seldon guessed that text on the fast path and the user hasn't confirmed it. A reader treats tagged text as a guess to confirm, and untagged text as the user's own.
  - In the places the tag is allowed, `lib/check.mjs` neither requires nor rejects it, so a document checks the same there with or without tags. Make that claim only for those places, never for the document as a whole.
  - Give one short example line.

  Leave `lib/check.mjs` alone. D-06 says the check doesn't enforce the tag.
- **Verify:**
  - (1) `grep -c '\[ASSUMPTION\]' docs/FORMAT.md` prints at least 1. It prints 0 today.
  - (2) In a temp folder holding a copy of `samples/brief.md` with ` [ASSUMPTION]` appended to the `## Scope` body line, `node lib/check.mjs --brief <tmp>` exits 0, which is what the new section says.
  - (3) In a temp copy of `samples/`:
    - with ` [ASSUMPTION]` appended to the first `**Outcome:**` line in `epics.md`, `node lib/check.mjs <tmp>` exits 0
    - with it appended to that epic's `**Depends on:**` line instead, the check exits 1, which is why the section rules ID-list fields out
  - (4) The new section names all three ID-list fields as places the tag never goes, and its "checks the same" sentence is limited to the allowed places.
  - (5) This task's diff touches only `docs/FORMAT.md`.

### Task 4: Require the "What it refuses" section in both brief checks

- **Files:** lib/check.mjs, tests/check.test.mjs, samples/brief.md
- **Reads:** lib/check.mjs#BRIEF_SECTIONS, lib/check.mjs#checkNamed, lib/check.mjs#CHECKS, tests/check.test.mjs#cases, samples/brief.md
- **Decisions:** D-17
- **Pins:** tests/check.test.mjs
- **Action:** The brief gains a required `## What it refuses` section, after Scope and before Vision (D-17).
  - **The check:** add `What it refuses`, spelled exactly that way, to `BRIEF_SECTIONS` between `Scope` and `Vision`. The full check and `--brief` both read the brief through the `brief.md` entry in `CHECKS`. So both then require the section to be present, not empty and in order, reporting it with the lines `checkNamed` already prints.
  - **Nothing else in the check changes.** It doesn't read the refusal bullets or look for a reason. D-17 asks the check for a present, non-empty section, and Plan 3's fast-path case checks the reason.
  - **The sample:** `samples/brief.md` gains the section between `## Scope` and `## Vision`.
    - Each refusal is a `- ` bullet that names what Toolshed won't do, then `because` and the reason. That's the form Task 5 writes into FORMAT.md.
    - Move the exclusions Scope names today (fees, reservations, member self-checkout) into the new section, each with a reason, and leave Scope saying what's in.
    - No body line in the section starts with `#`, so the tests' `[^#]*` edits still stop at the next heading.
  - **Tests:** the out-of-order row's expected line names What it refuses between Scope and Vision. Add one row to the `cases` table: a brief with `## What it refuses` and its body removed gives exactly `brief.md: What it refuses: missing section`. Every other brief rule already runs per section name through `checkNamed`, so it needs no new row.
- **Verify:**
  - **Testing scope:** the outcomes are both checks requiring the new section, the sample conforming with it, and the order rule naming it.
    - The existing rows already cover empty, repeated, misordered and misnamed sections for every name in the list.
    - The one new row (the missing section) and the updated order message are the additional checks.
    - The suite plus the coverage gate is sufficient evidence, and testing stops there.
  - (1) `grep -cx '## What it refuses' samples/brief.md` prints 1. It prints 0 today.
  - (2) `node lib/check.mjs samples` prints `seldon check: all four documents conform` and `node lib/check.mjs --brief samples` prints `seldon check: brief.md conforms`, both exiting 0.
  - (3) In a temp copy of `samples/`:
    - with `## What it refuses` and its body removed, `node lib/check.mjs <tmp>` and `node lib/check.mjs --brief <tmp>` each exit 1 and print exactly `brief.md: What it refuses: missing section`
    - with only its body emptied, each prints exactly `brief.md: What it refuses: empty section`
  - (4) `node --test tests/*.test.mjs` passes.
  - (5) The coverage job's command in `.github/workflows/test.yml` passes at lines 85 and branches 85. After it, `grep -q '^LF:[1-9]' lcov.info` and `! grep -qx 'LH:0' lcov.info` both succeed.

### Task 5: List "What it refuses" among the brief's sections in FORMAT.md

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#brief.md, docs/FORMAT.md#Examples, samples/brief.md
- **Decisions:** D-17
- **Action:** FORMAT.md's "brief.md" section lists eight `## ` sections, with `## What it refuses` seventh, between `## Scope` and `## Vision`. Its count changes from seven to eight.
  - **What the section holds:** each item names something the product won't do and the reason. Each refusal is a `- ` bullet: what it won't do, then `because` and the reason, in the same bullet.
    - This plan picks that bullet form. D-17 fixes what an item holds but not its shape.
    - One shape gives Cadence's reader and Plan 3's eval grader a single place to find the reason.
  - **The check:** say it requires the section present and not empty, like every brief section, and doesn't read its bullets.
  - **The example:** the brief example under "Examples" gains the section between Scope and Vision, with one bullet in that form, so it still passes the check. Phase 1's verifier ran FORMAT.md's examples through the check.
  - Keep FORMAT.md's plain style.
- **Verify:**
  - (1) A `node -e` script reads FORMAT.md's "## brief.md" section (to the next `## ` heading) and finds eight numbered `## ` entries, with `## What it refuses` seventh. Today it finds seven.
  - (2) The brief example block under "Examples", written to a temp folder as `brief.md`, passes `node lib/check.mjs --brief <tmp>` with exit 0. After Task 4 and before this task, it exits 1 with `brief.md: What it refuses: missing section`.
  - (3) The "## brief.md" section says each refusal gives its reason after `because`, and that the check doesn't read the bullets.

### Task 6: Set the quote format for an item written from a user answer

- **Files:** docs/FORMAT.md, samples/brief.md
- **Reads:** docs/FORMAT.md#Rules for every file, docs/FORMAT.md#The check, samples/brief.md
- **Decisions:** D-18
- **Action:** Add a `## ` section to FORMAT.md, after the `[ASSUMPTION]` section and before "The check", that sets how the brief keeps the user's own words (D-18):
  - **The rule:** each item Seldon writes in `brief.md` from the user's own words keeps the exact phrase it came from, word for word, on a quoted line directly under the item. No paraphrase, no summary, no tidied wording.
  - **The line:** it starts with `> `. Under a `- ` bullet it's indented two spaces (`  > `), so it stays with its bullet. An answer that runs over several lines keeps its line breaks, each line starting the same way. This plan picks the `> ` form, since D-18 fixes the words and leaves the format to FORMAT.md.
  - **One answer, several items:** each item quotes the part of the answer it rests on, as one run of the user's exact words. This plan picks that too: D-18 fixes the words, not how a long answer is split.
  - **What counts as the user's own words:** anything the user wrote, in the dump or in a reply to a question Seldon asked. An item quotes only the exact phrase it came from, never the whole dump. An item with no source words is a guess, so it carries `[ASSUMPTION]` and no quote.
  - **The check:** it neither requires nor rejects a quoted line. To the check, a `> ` line is body text.
  - Give one short example: an item, then its quote.
  - The section covers the brief only. The PRD and spine take the same rule in phases 3 and 4.

  `samples/brief.md` shows the format. At least one item carries the quoted answer it was written from, in the form above, and one quote sits under a `## What it refuses` bullet. The sample still conforms, and no quoted line starts with `#`.
- **Verify:**
  - (1) `grep -c 'word for word' docs/FORMAT.md` prints at least 1. It prints 0 today.
  - (2) `grep -cE '^ *> ' samples/brief.md` prints at least 1. It prints 0 today. A `node -e` script also finds a `  > ` line inside the sample's `## What it refuses` section.
  - (3) `node lib/check.mjs samples` and `node lib/check.mjs --brief samples` still print their pass lines and exit 0, and `node --test tests/*.test.mjs` passes.

## Notes

- Plans 2 to 4 depend on the `--brief <dir>` form and the exact pass line, so Task 1's Verify pins both.
- **Order:** Task 4 runs before Tasks 5 and 6, because both build on the sample and the check it changes. The only phase 1 test the new required section changes is the out-of-order row's expected line. Every other brief row edits the sample with patterns that stop at the next `#`.
- **Choices this plan makes:**
  - the refusal bullet form (Task 5, under D-17)
  - the `> ` quote line (Task 6, under D-18)

  Plan 2's SKILL.md and Plan 3's graders follow both.
- **D-18's reading, settled by John:** "a user answer" means the user's own words wherever they appear, in the dump or in a reply. An item drafted from them quotes the exact phrase it came from, never the whole dump, and an item with no source words is an `[ASSUMPTION]` with no quote.
- Prior art from memory: phase 1 D-05 (the format check is code that Seldon's own steps run), cited from phases/1/CONTEXT.md, phase 1.
