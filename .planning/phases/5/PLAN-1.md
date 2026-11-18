---
phase: 5
plan: 1
requirements:
  - EPIC-01
  - EPIC-02
files:
  - lib/check.mjs
  - tests/check.test.mjs
  - docs/FORMAT.md
  - samples/epics.md
---

# Phase 5: Epics and the full walk - Plan 1: The epics format and its check

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan gives the epics step a contract to write against:

- an epics-only check mode the step runs
- done-when as a 2-to-5 list holding one fixed integrated item
- the epic limits and build order in `docs/FORMAT.md`, enforced by the check so an oversized epic fails closed
- the epics `Retired:` line
- a sample epics file that follows all of it

## Must be true when done

- `node lib/check.mjs --epics samples` exits 0 and prints exactly `seldon check: epics.md conforms`. It also passes a folder that holds only `epics.md`.
- The full check and `--epics` both exit 1 and name the epic, the field and the problem on any of these:
  - an epic with 6 requirement IDs
  - an epic with 1 or 6 done-when items, or with done-when only on its label line
  - an epic whose `**Depends on:**` names a later epic or one the file doesn't have
  - an epic missing a field

  Today the first three all pass with exit 0.
- `docs/FORMAT.md` says file order is build order, puts done-when in its 2-to-5 list form with the integrated item, sets at most 5 requirement IDs, documents `--epics` and the epics `Retired:` line, and no longer says the check doesn't size epics.
- `samples/epics.md` keeps E-01 to E-03 and their headings. Every epic cites S-02, S-04 and S-05, E-02 and E-03 both cite S-03, S-06 is cited, and every done-when is a 2-to-5 list holding the integrated item. The full check passes on `samples/`.
- The suite passes under the coverage gate.

## Context

- **Locked:** D-01, D-02, D-03, D-06, D-10, D-11, D-12 and D-13, plus D-07 and D-09 for the sample's citations. `lib/check.mjs` mirrors `docs/FORMAT.md` and nothing past it (its header comment). `--spine` is the pattern `--epics` follows (phase 4 Plan 1).
- **Fixed here for Plans 2 to 7:** the token `--epics`, its pass line `seldon check: epics.md conforms`, the integrated item's words and the epics `Retired:` line under the title. SKILL.md copies the item from `docs/FORMAT.md`, and graders copy from SKILL.md, never from a plan.
- **The integrated item (my choice, per the flagged assumption):** one `- ` bullet with exactly these words: `Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.` It reads the same in the first epic and the last, which is why I chose it. It answers the `.planning/CAPTURE.md` phase 5 todo: main stays releasable, with tests green and nothing half-built showing.
- **Tests:** `node:test` and `node:` builtins only, running on Node 22 and 24 as well as 26. The coverage gate is the coverage job's command in `.github/workflows/test.yml` plus both lcov guards, with thresholds as they stand.
- **Out of this plan:** no SKILL.md change and no eval run. No check that an ID an epic names is declared in `prd.md` or `spine.md` (D-12), and no change to `samples/brief.md`, `samples/prd.md` or `samples/spine.md`.
- **Owner's words:** committed files never carry the owner's own words. Example text uses Tally, Toolshed or another coined project.

## Tasks

### Task 1: Add the epics-only check mode

- **Files:** lib/check.mjs, tests/check.test.mjs, docs/FORMAT.md
- **Reads:** lib/check.mjs#MODES, lib/check.mjs#main, lib/check.mjs#SPINE_OK_LINE, tests/check.test.mjs, docs/FORMAT.md#The spine alone
- **Decisions:** D-11
- **Pins:** tests/check.test.mjs
- **Action:** `node lib/check.mjs --epics <dir>` reads only `<dir>/epics.md` and holds it to `checkEpics`. The epics step runs it, never the full check (D-11).
  - **Mode switch:** only the exact first token `--epics` switches mode, like the other three.
  - **Pass:** with no problems it exits 0 and prints exactly `seldon check: epics.md conforms`. Export that line beside `SPINE_OK_LINE`, so the tests import it and never retype it.
  - **Failure:** it reports exactly as the full check does: one line per problem with exit 1, `epics.md: missing file` when there's no `epics.md`, and exit 2 when the directory argument is missing or isn't a directory.
  - **Usage and header:** the usage line becomes `usage: node lib/check.mjs [--brief | --prd | --spine | --epics] <dir>`, and the file's header comment names `--epics` too.
  - **Tests:** mirror the `--spine` tests:
    - `--epics` on `samples` exits 0 with the epics line.
    - A folder holding only a copy of `samples/epics.md` passes.
    - E-02 with its `**Done when:**` label line removed exits 1 with exactly `epics.md: E-02: Done when: missing field`.
    - A folder with no `epics.md` exits 1 with `epics.md: missing file`.
    - `--epics` with no directory exits 2.
    - The usage assertion in "a missing or non-directory argument exits 2" matches the new usage line.
  - **FORMAT.md:** "The check" gains `### The epics alone` after "The spine alone", in its shape. It says:
    - the mode is for the epics step
    - it reads only `epics.md` and holds it to the epics rules
    - what each exit code means, and the exact pass line
    - the full check still needs all four files
- **Verify:**
  - **Testing scope:** the outcomes are the mode's pass line, a failure through it, its missing file and its exit 2. The `--spine` tests already cover the shared reading code, so the mirrored tests are the smallest set that pins the mode. The suite under the coverage gate is enough, and testing stops there.
  - (1) `node lib/check.mjs --epics samples` exits 0 and prints exactly `seldon check: epics.md conforms`. Today it exits 2 and prints `check: "--epics" is not a directory`.
  - (2) `node --test tests/*.test.mjs` passes.
  - (3) `grep -c '^### The epics alone' docs/FORMAT.md` prints 1. It prints 0 today.
  - (4) The coverage job's command and both lcov guards pass.

### Task 2: Document done-when as a 2-to-5 list with the integrated item

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#Epic fields, docs/FORMAT.md#Examples, docs/FORMAT.md#The [ASSUMPTION] tag
- **Decisions:** D-02, D-03
- **Action:** "Epic fields" fixes done-when's shape and what it holds.
  - **Shape (D-03):** `**Done when:**` is always a `- ` list on the lines below its label, one item per bullet. Replace "So `**Done when:**` can hold a list on the lines below it."
  - **The counting rule (D-03):** an item is a line in the field's value that starts with `- ` at column 0. An indented line continues the bullet above it and isn't an item. Text on the label line is no item, so the one-line form goes, since a floor of 2 can't be met on one line.
  - **How many (D-02):** 2 to 5 items, matching the 2 to 5 success criteria `/cad-new-project` gives a phase.
  - **The integrated item (D-02):** every epic is shippable on its own, so one item is a bullet in fixed words, written exactly as this plan's Context gives them. Show it on a line of its own. At least one more item is the epic's own. The item's position in the list isn't fixed.
  - **Kept:** the tag stays allowed, not required, in done-when items, as "The [ASSUMPTION] tag" says.
  - **Examples (D-03):** in the Tally `epics.md` example, both epics' done-when become `- ` lists of 2 to 5 items, each holding the integrated item. E-02's one-line form becomes a bullet.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough. Task 6 runs the examples through the check, and testing stops there.
  - (1) `grep -c 'Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing\.' docs/FORMAT.md` prints at least 3: the rule and both Tally epics. It prints 0 today.
  - (2) `grep -c '^\*\*Done when:\*\* ' docs/FORMAT.md` prints 0, so no example keeps the one-line form. It prints 1 today.
  - (3) `perl -ne 'print if /^### Epic fields/../^## IDs are stable/' docs/FORMAT.md | grep -c '2 to 5'` prints at least 1. It prints 0 today.

### Task 3: Document the epic limits and build order

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#epics.md, docs/FORMAT.md#Epic fields, docs/FORMAT.md#The check, docs/FORMAT.md#IDs are stable
- **Decisions:** D-01, D-06, D-12
- **Action:** The epics section states build order and the ID-field limits as format rules the check enforces (D-01).
  - **Build order (D-06):** file order is build order, and Cadence's reader takes the epics in file order. An epic depends only on epics before it in the file. Epics carrying MVP-scope requirements come before the rest. E- numbers need not ascend through the file: a split-off epic takes the next unused number wherever it sits.
  - **Requirements (D-01):** at most 5 requirement IDs, NFR IDs included, since they share the ID space.
  - **Depends on (D-01):** names only epics whose headings come earlier in the file, or `None`.
  - **The check's reach:** replace "The format check reads the spelling of these IDs only." and the sentence after it. The check reads the spelling of all three ID fields, holds `**Requirements:**` to at most 5 IDs and holds `**Depends on:**` to earlier epics. Whether a requirement or spine ID is declared in `prd.md` or `spine.md` stays a cross-reference between files, which a later trace check covers (D-12).
  - **"The check":** replace "It doesn't size epics or trace requirements into epics." with words saying the check holds each epic to the three limits (at most 5 requirement IDs, 2 to 5 done-when items, `**Depends on:**` naming only earlier epics), and doesn't trace requirements into epics.
  - **Kept:** the ID spellings, the `None` rule and the six fields' order.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c "doesn't size epics" docs/FORMAT.md` and `grep -c 'reads the spelling of these IDs only' docs/FORMAT.md` each print 0. Each prints 1 today.
  - (2) Inside the epics section (`perl -ne 'print if /^## epics\.md/../^## IDs are stable/' docs/FORMAT.md`), each of these prints at least 1, and each prints 0 today:
    - `grep -ci 'file order'`
    - `grep -c 'MVP'`
    - `grep -c 'at most 5'`

### Task 4: Bring samples/epics.md up to the epic rules

- **Files:** samples/epics.md
- **Reads:** samples/epics.md, samples/spine.md, samples/prd.md, tests/check.test.mjs#cases, docs/FORMAT.md#Epic fields
- **Decisions:** D-13, D-07, D-09, D-02, D-03
- **Action:** `samples/epics.md` stays the one conforming Toolshed epics file and is updated in place (D-13).
  - **Kept byte-identical:** each epic's heading, `**Outcome:**`, `**Boundaries:**`, `**Depends on:**` and `**Requirements:**` lines, and the title. `tests/check.test.mjs` edits `## E-01: Catalog`, `## E-03:`, `**Depends on:** None` in E-01 and `**Requirements:** LOAN-03` in E-03 by their text.
  - **Done when (D-02, D-03):** each is a `- ` list of 2 to 5 items with the integrated item last, which is my choice, copied from `docs/FORMAT.md`.
    - E-01 keeps its two bullets and gains the item.
    - E-02 keeps its three and gains it.
    - E-03's one-line item becomes a bullet with the same words, followed by the item.
  - **Citations (D-07, D-09):** each `**Spine decisions:**` line lists its IDs in ascending order.
    - E-01: S-02, S-04, S-05, S-06. S-06 is the catalog boundary members reach.
    - E-02: S-01, S-02, S-03, S-04, S-05, S-06. S-03 is the boundary Loans splits along. S-06 covers NFR-02's member details.
    - E-03: S-01, S-02, S-03, S-04, S-05.

    Every epic then cites the design approach (S-02), stack (S-04) and hosting (S-05) decisions, both sides of the Loans split cite S-03, and every spine ID is cited at least once. The choice of S-06 on E-01 and E-02 is mine. Plan 4's rerun case depends on these exact lines.
- **Verify:**
  - **Testing scope:** the outcome is a sample that follows the new rules and still passes today's check. A shape script, the existing suite and the full check are enough, and testing stops there.
  - (1) `node lib/check.mjs samples` exits 0 with `seldon check: all four documents conform`.
  - (2) A `node -e` script over `samples/epics.md` confirms four things. Today it fails on the first, since E-03's done-when is on its label line.
    - Every epic's done-when has 2 to 5 lines starting `- `, and its last is the integrated item exactly as `docs/FORMAT.md` holds it.
    - The three `**Spine decisions:**` lines equal the three lists above.
    - Every line the Action keeps byte-identical equals its line in `git show HEAD:samples/epics.md`.
    - The file holds no line starting `**Done when:** ` with text after the label.
  - (3) `node --test tests/check.test.mjs` passes.

### Task 5: Hold each epic to 5 requirement IDs and 2 to 5 done-when items

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** lib/check.mjs#checkEpic, lib/check.mjs#ID_FIELDS, lib/check.mjs#empty, tests/check.test.mjs#cases, tests/check.test.mjs#inEpic
- **Decisions:** D-01, D-03
- **Pins:** tests/check.test.mjs
- **Action:** `checkEpic` enforces two of D-01's limits on every well-formed epic.
  - **Requirements:** at most 5 items, counted the way the spelling check splits the field on commas.
  - **Done when:** 2 to 5 items, counted by Task 2's rule. Only lines starting `- ` at column 0 in the field's value count, so text on the label line and indented lines don't.
  - **Both checks:** these are `epics.md` rules inside `checkEpic`, so the full check and `--epics` both apply them and fail closed.
  - **Problem lines:** one line per problem in the existing `epics.md: <ID>: <field>: <what's wrong>` shape, giving the count found and the limit. Values shown through the file's `quote` helper, as elsewhere.
  - **No double reports:** a missing or empty field keeps its single line, with no count line beside it, the way an empty spine body gets one line.
  - **Tests:** add to the `cases` table, each starting from the samples:
    - E-02 with 6 requirement IDs
    - an epic with 1 done-when item
    - an epic with 6 done-when items
    - E-03 with its done-when back on the label line and no bullets, the one-line form D-03 removes

    Add an `--epics` loop beside the `--spine` one, so 6 IDs, 1 item and 6 items each exit 1 through `--epics` with the same exact line.
  - **Existing cases:** every existing epic case keeps its expected lines unchanged.
- **Verify:**
  - **Testing scope:** the outcomes are the two limits, the one-line form failing and the no-double-report rule. Nothing counts either field today. The four table cases and three mode cases reach every new branch, and the suite under the coverage gate is enough evidence. Testing stops there.
  - (1) `node --test tests/*.test.mjs` passes.
  - (2) Copy `samples/` to a temp folder and append `, CAT-01, CAT-02` to E-02's `**Requirements:**` line. `node lib/check.mjs <copy>` exits 1, with one line naming `E-02` and `Requirements`. On the tree before this task the same copy exits 0.
  - (3) "an empty epic field", "a missing field" for each label, "a bad ID in an epic field" and "an epic field holding only the tag" still expect exactly their old lines.
  - (4) The coverage job's command and both lcov guards pass.

### Task 6: Hold Depends on to epics earlier in the file

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** lib/check.mjs#checkEpics, lib/check.mjs#idSections, lib/check.mjs#checkEpic, tests/check.test.mjs#cases
- **Decisions:** D-01, D-06
- **Pins:** tests/check.test.mjs
- **Action:** D-01's third limit. Each ID on `**Depends on:**`, other than `None`, must be the ID of an epic whose heading comes before this epic's in the file.
  - **What fails:** a later epic, the epic itself, or an ID no epic in the file has, each on its own line naming the epic, `Depends on` and the ID.
  - **Epic order:** the file order of every `## ` heading whose `E-NN` ID passes the spelling check, including one `idSections` rejects only for what follows the ID, such as a tag. A tagged heading's ID still counts as declared, so the existing "a tagged epic heading" case keeps its one line and E-02's `**Depends on:** E-01` adds none. A heading whose ID fails the spelling check names no epic.
  - **No double reports:** an item that fails the spelling check keeps only that line.
  - **No number order (D-06):** compare positions in the file, never ID numbers, since E- numbers need not ascend.
  - **Tests:** add to the `cases` table:
    - E-01 with `**Depends on:** E-02`, a later epic
    - E-02 depending on an ID no epic has

    Add one test that a copy of the samples with a new epic numbered `E-04` placed between E-01 and E-02, which E-02 then depends on, passes the full check. That pins position over number. Add the later-epic case to the `--epics` loop.
  - **The examples:** the Tally examples Task 2 changed must pass this check and Task 5's.
- **Verify:**
  - **Testing scope:** the outcomes are the order rule, the missing-ID branch and position over number. Nothing reads order today. The three cases are the smallest set that tells position from number and catches an ID no epic has. The suite under the coverage gate is enough, and testing stops there.
  - (1) `node --test tests/*.test.mjs` passes.
  - (2) Copy `samples/` to a temp folder and set E-01's `**Depends on:**` to `E-02`. `node lib/check.mjs --epics <copy>` exits 1, with one line naming `E-01`, `Depends on` and `E-02`. On the tree before this task the same copy exits 0 through the full check.
  - (3) Extract the four fenced examples under "## Examples" in `docs/FORMAT.md` into `brief.md`, `prd.md`, `spine.md` and `epics.md` in a temp folder. `node lib/check.mjs <folder>` exits 0.
  - (4) The coverage job's command and both lcov guards pass.
  - (5) "a tagged epic heading" and "a one-digit epic heading" still expect exactly their old lines, with no `Depends on` line added.

### Task 7: Document the epics Retired line

- **Files:** docs/FORMAT.md, tests/check.test.mjs
- **Reads:** docs/FORMAT.md#IDs are stable, tests/check.test.mjs
- **Decisions:** D-10
- **Pins:** tests/check.test.mjs
- **Action:** "IDs are stable" gains the epics' retired IDs, so the rerun has somewhere to put them (D-10).
  - **Where:** when an epics rerun drops an epic, `epics.md` keeps its ID on one prose line directly under the `# ` title, before the first `## ` epic, in the form `Retired: E-03`.
  - **Rules:** the spine line's rules. The IDs are plain and comma-separated, in the order they were retired. The line is absent until the first retirement, and a later one extends it. A retired ID is never reused.
  - **Why under the title:** after the last epic, the check would read the line as part of that epic's last field. Say so in one sentence.
  - **The check:** to it this is text before the first epic, which no rule reads.
  - **Test:** beside "a Retired line under the spine title passes the full check and --spine", one test shows a copy of the samples with `Retired: E-07, E-08` under the epics title passes the full check and `--epics`. It pins the promise this task makes to Cadence's reader.
- **Verify:**
  - **Testing scope:** one regression test for a documented promise. It's enough, and testing stops there.
  - (1) `grep -c 'Retired: E-' docs/FORMAT.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/check.test.mjs` passes, including the new test.

## Notes

- **Test edits stay here:** `tests/check.test.mjs` changes in this plan, not in a final plan, as phase 4 Plan 1 did. Task 1's new usage line breaks the existing usage assertion, so moving the edit to the last plan would leave this plan's commits red. No other plan touches the file.
- **Task order:** the mode comes first, so the step's command works from the first commit. The sample changes in Task 4, before Tasks 5 and 6 make the old one-line done-when fail.
- **The analyzer's probe:** an epic with 8 requirement IDs, 7 done-when items and `**Depends on:** E-03` passes the full check today. Tasks 5 and 6 make each of those fail, and a probe I ran confirms that 6 IDs plus a later `Depends on` exits 0 today. `S-99` in `**Spine decisions:**` still passes, since that's a cross-file question D-12 keeps out of the check.
