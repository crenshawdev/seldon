---
phase: 3
plan: 1
requirements:
  - DOCS-02
files:
  - lib/check.mjs
  - tests/check.test.mjs
  - docs/FORMAT.md
  - samples/prd.md
---

# Phase 3: The PRD, resume and rerun - Plan 1: The PRD check and its format

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan gives the PRD step a contract to write against:

- a PRD-only check that requires ID'd requirements
- the PRD's quote, refusal and retired-ID rules in `docs/FORMAT.md`
- a sample PRD that follows those rules

## Must be true when done

- `node lib/check.mjs --prd samples` exits 0 and prints exactly `seldon check: prd.md conforms`. It also passes a folder that holds only `prd.md`.
- `--prd` exits 1 and names what's missing on a PRD that lacks a section, and on one whose `## Requirements` or `## Non-functional requirements` holds no ID'd `- **CAT-01**:` bullet. The full check holds `prd.md` to the same rule.
- `docs/FORMAT.md` documents five things: the PRD-only check, the one-ID'd-bullet rule, the PRD's quote-or-tag rule, refusals as non-goal bullets and the `Retired:` line.
- Every requirement and non-goal line in `samples/prd.md` carries a quote from `samples/brief.md` or an `[ASSUMPTION]` tag. Its Non-goals carry the brief's three refusals, and the full check still passes on `samples/`.
- The suite passes under the coverage gate.

## Context

- **Locked:** D-03, D-10, D-11, D-12, D-13 and D-20. `lib/check.mjs` mirrors `docs/FORMAT.md` and nothing past it (its header comment). Phase 2's `--brief` mode (phase 2 D-05) is the pattern `--prd` follows.
- **Fixed here for Plans 2 to 4:** the mode token is `--prd` and its pass line is `seldon check: prd.md conforms`. SKILL.md and the eval graders depend on both, so neither changes after this plan.
- **Tests:** `node:test` and `node:` builtins only, on Node 22 as well, because the CI matrix runs 22 and 24 and coverage runs on 26. The coverage gate is the coverage job's command in `.github/workflows/test.yml` plus both lcov guards, with thresholds as they stand.
- **Out of this plan:** no SKILL.md change, no eval run, and no change to `samples/brief.md`, `samples/spine.md` or `samples/epics.md`.

## Tasks

### Task 1: Add the PRD-only check mode

- **Files:** lib/check.mjs, tests/check.test.mjs, docs/FORMAT.md
- **Reads:** lib/check.mjs#main, lib/check.mjs#BRIEF_OK_LINE, lib/check.mjs#checkFiles, tests/check.test.mjs#briefOnly, docs/FORMAT.md#The brief alone
- **Decisions:** D-10
- **Pins:** tests/check.test.mjs
- **Action:** `node lib/check.mjs --prd <dir>` reads only `<dir>/prd.md` and holds it to the PRD rules the full check already applies through `checkPrd`, just as `--brief` reads only `brief.md`. Right after the PRD step the full check could only fail on the missing spine and epics, so this mode is what that step runs (D-10).
  - **Mode switch:** only the exact first token `--prd` switches mode, like `--brief`. Anything else in first place is still the directory, as `main`'s comment says.
  - **Pass:** with no problems it exits 0 and prints exactly `seldon check: prd.md conforms`. Export that line next to `BRIEF_OK_LINE`, so the tests import it and never retype it.
  - **Failure:** it reports exactly as the full check does. That means one line per problem with exit 1, `prd.md: missing file` when there's no PRD, and exit 2 when the directory argument is missing or isn't a directory.
  - **Usage and header:** the usage line names both modes, and so does the file's header comment.
  - **Tests:** mirror the `--brief` tests.
    - `--prd` on `samples` exits 0 with the PRD line.
    - A folder holding only a copy of `samples/prd.md` passes.
    - A PRD missing `## Non-goals` exits 1 and names only that section.
    - A folder with no `prd.md` exits 1 with `prd.md: missing file`.
    - `--prd` with no directory exits 2.
    - Update the usage assertion in "a missing or non-directory argument exits 2" to match the new usage line.
  - **FORMAT.md:** "The check" gains a subsection for the PRD alone, next to "The brief alone" and in the same shape. It says what the mode is for, that it reads only `prd.md`, what each exit code means and the exact pass line. It also says the full check still needs all four files.
- **Verify:**
  - **Testing scope:** the outcomes are the mode's pass line, its failure lines and its exit 2. The `--brief` tests already cover the shared reading and reporting code. The mirrored tests above are the smallest set that pins the new mode. The suite passing under the coverage gate is enough evidence, and testing stops there.
  - (1) `node lib/check.mjs --prd samples` exits 0 and prints exactly `seldon check: prd.md conforms`. Today it exits 2, because `--prd` is read as the directory.
  - (2) Make a temp folder holding only a copy of `samples/prd.md`. `--prd` on it exits 0. After deleting `## Non-goals` and its body, it exits 1 and prints only `prd.md: Non-goals: missing section`.
  - (3) `node --test tests/*.test.mjs` passes.
  - (4) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards.
  - (5) `grep -c -- '--prd' docs/FORMAT.md` prints at least 1. It prints 0 today.

### Task 2: Require an ID'd requirement in both requirement sections

- **Files:** lib/check.mjs, tests/check.test.mjs, docs/FORMAT.md
- **Reads:** lib/check.mjs#checkPrd, lib/check.mjs#checkBullets, tests/check.test.mjs#cases, docs/FORMAT.md#Requirement bullets
- **Decisions:** D-11
- **Pins:** tests/check.test.mjs
- **Action:** The PRD rules require at least one valid `- **CAT-01**: text` bullet in `## Requirements` and at least one in `## Non-functional requirements`. Today a section that holds only prose or `### ` lines passes.
  - **Where the rule lives:** in `checkPrd`, so both the full check and `--prd` apply it. FORMAT.md states it as a rule of `prd.md`, and each mode holds a file to that file's own rules, the way `--brief` holds the brief to the brief rules. Say so in a one-line code comment.
  - **Which sections it applies to:** a section that is present, isn't empty, and holds no valid ID'd bullet gets exactly one problem line. The line names `prd.md`, the section and the missing `- **CAT-01**: text` requirement.
    - A missing section keeps its existing single line and gets no second one. So does an empty section.
    - A valid bullet that comes before the first `### ` category still counts as a requirement. The category rule reports it on its own.
  - **Malformed bullets:** each keeps its own line. When none of a section's bullets is valid, the missing-requirement line is added as well.
  - **Existing tests:** every expectation in `cases` stays as it is, because each broken PRD there still has valid bullets in both sections. If one changes, the rule is wrong.
  - **New tests:**
    - `## Requirements` keeps its `### ` lines and one prose line but loses every bullet. It fails with exactly the new line.
    - `## Non-functional requirements` holds one prose line and no bullet. It fails with exactly the new line.
    - A section whose only bullet is malformed reports both the malformed bullet and the missing requirement.
    - `--prd` on a prose-only `## Requirements` exits 1 and names Requirements.
  - **FORMAT.md:** "Requirement bullets" says each of the two sections holds at least one requirement in that form, that prose alone doesn't count, and that the check reports it.
- **Verify:**
  - **Testing scope:** the outcome is a prose-only requirement section failing, by name, in both modes. Nothing covers it today: the analyzer's probe passed such a PRD with exit 0. The four new tests and the unchanged `cases` expectations are the evidence, and testing stops there.
  - (1) Make a temp copy of `samples/prd.md` whose `## Requirements` has its `### ` lines and one prose line but no `- **` line. `node lib/check.mjs --prd <dir>` exits 1 and names `Requirements`. On the tree before this task, the same file exits 0.
  - (2) The same check on `## Non-functional requirements` exits 1 and names `Non-functional requirements`.
  - (3) `node lib/check.mjs samples` prints `seldon check: all four documents conform`, and `--prd samples` prints the PRD line.
  - (4) `node --test tests/*.test.mjs` passes. The coverage job's command and both lcov guards pass.

### Task 3: Extend the user's-own-words rule to the PRD

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#The user's own words, docs/FORMAT.md#Words from a design folder, docs/FORMAT.md#The [ASSUMPTION] tag, docs/FORMAT.md#Examples
- **Decisions:** D-13
- **Action:** "The user's own words" covers `prd.md` as well as `brief.md`:
  - **The rule:** every requirement bullet, in both requirement sections, and every line in `## Non-goals` carries one of two things.
    - A `> ` quote directly under it. Under a `- ` bullet the quote is indented two spaces.
    - An inline `[ASSUMPTION]` tag.
  - **Quote sources in a PRD:**
    - The brief's `> ` lines, word for word. A quote can be one unbroken run of a `> ` line's exact words. It keeps the design-file source line under it wherever the brief's quote had one.
    - The user's own replies during the PRD step.
    - The brief's item text is Seldon's wording, so it is never a source.
  - **Guesses:** a requirement with no source words is a guess and carries the tag, never inside the bold ID span. The tag section already says that, so point to it rather than repeating it.
  - **The check:** it neither requires nor rejects a quote line, as now.
  - **Out of the rule:** user journeys and MVP scope aren't held to it, because D-13 names only requirement and non-goal lines. The bullet shape of Non-goals is Task 4's job.
  - **The covers line:** replace "This covers `brief.md` only. The PRD and spine take the same rule when their steps are built." with a line saying the rule covers `brief.md` and `prd.md`, and the spine takes it when its step is built.
  - **Examples:** give each requirement line in the Examples' `prd.md` a `> ` line. It quotes the example brief's own `> ` lines word for word, or the line takes a tag where that brief has no words for it, so the example follows the rule it sits under.
- **Verify:**
  - **Testing scope:** documentation only. A grep that fails today and one script over the example are enough, and testing stops there.
  - (1) `grep -c 'covers .brief.md. only' docs/FORMAT.md` prints 0. It prints 1 today.
  - (2) A `node -e` script takes the Examples' `prd.md` code block. It finds that every `- **` line is followed by a `  > ` line or holds `[ASSUMPTION]`. It also finds every `  > ` line's text inside a `> ` line of the Examples' `brief.md` block. Today no requirement line in the block has either.
  - (3) `node lib/check.mjs samples` still passes.

### Task 4: Carry the brief's refusals into the PRD's Non-goals

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#prd.md, docs/FORMAT.md#Refusals, docs/FORMAT.md#Examples
- **Decisions:** D-12
- **Action:** Add a short Non-goals subsection under `prd.md`:
  - **The bullet:** each refusal in the brief's `## What it refuses` is carried into `## Non-goals` as a `- <what it won't do> because <reason>` bullet. That's the brief refusal's own shape, and the brief's quote for that refusal sits under it word for word.
  - **Sections:** the PRD keeps exactly its five sections, with no refusals section.
  - **Other non-goals:** Non-goals can hold other non-goals too, each under Task 3's quote-or-tag rule.
  - **A brief that refuses nothing:** when its refusal section holds only the refuses-nothing quote, no refusal is carried and none is invented.
  - **The check:** it still reads Non-goals only for being present and not empty.
  - **Example:** the Examples' `prd.md` Non-goals becomes the example brief's refusal, as a bullet with that brief's quote under it.
- **Verify:**
  - **Testing scope:** documentation only. One script over the example plus a grep are enough, and testing stops there.
  - (1) A `node -e` script takes the Examples' `prd.md` block. It finds a `- ` bullet holding `because` inside `## Non-goals`, followed by `  > no invoices, we do those from the bank`. Today that section reads "Invoicing and payment processing."
  - (2) The `prd.md` part of FORMAT.md has a `### ` subsection about Non-goals that names the `because` bullet form. Today there's none.
  - (3) `node lib/check.mjs samples` still passes.

### Task 5: Document the Retired line for dropped requirement IDs

- **Files:** docs/FORMAT.md, tests/check.test.mjs
- **Reads:** docs/FORMAT.md#IDs are stable, docs/FORMAT.md#Requirement IDs, lib/check.mjs#checkBullets
- **Decisions:** D-03
- **Action:** When a rerun drops a requirement, its ID goes on one prose line, `Retired: CAT-03, LOAN-02`. The IDs are plain, not bold, separated by commas and listed in the order they were retired.
  - **Placement (my choice):** directly under `## Requirements`, before the first `### ` category. That way it belongs to no category and a reader finds it in one place.
  - **Lifecycle:** the line is absent until an ID is retired. A later retirement extends the same line.
  - **Never reused:** a retired ID is never reused, by a requirement or a non-functional requirement. IDs carry into Cadence's `REQUIREMENTS.md` unchanged.
  - **How the check sees it:** the check reads only `- ` bullets, so it treats the line as prose.
  - **Where the rule goes:** "IDs are stable", with "Requirement IDs" pointing to it.
  - **Test:** add one check test. A copy of the samples with a `Retired:` line placed as above passes both the full check and `--prd`. This pins what FORMAT.md now promises Cadence's reader: if the bullet reader ever starts rejecting the line, CI fails before any rerun PRD does.
- **Verify:**
  - **Testing scope:** the outcome is a documented `Retired:` line the check accepts. The check accepts it today, as the analyzer's probe showed. The new test keeps it that way, and testing stops there.
  - (1) `grep -c 'Retired:' docs/FORMAT.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/*.test.mjs` passes, with the new test among those run.

### Task 6: Make samples/prd.md follow the PRD's quote and refusal rules

- **Files:** samples/prd.md
- **Reads:** samples/brief.md, samples/epics.md, docs/FORMAT.md#The user's own words
- **Decisions:** D-20, D-12, D-13
- **Action:** Update `samples/prd.md` in place so it stays the one conforming set with `samples/brief.md` (D-20).
  - **IDs and wording:** keep every ID and every requirement's wording, because `samples/epics.md` names those IDs. Under each requirement, add a `  > ` line holding one unbroken run of exact words from a `> ` line of `samples/brief.md`. Where that brief has no words for the requirement, append ` [ASSUMPTION]` instead.
  - **LOAN-03:** the reminder requirement quotes the reminder words from the brief's Scope `> ` line, and no other requirement quotes that line at all. A brief change that rewrites Scope to drop reminders then touches LOAN-03 alone, which Plan 4's rerun case relies on. The other requirements quote other lines, such as Problem's or Solution's, or carry a tag.
  - **Non-goals:** the three refusals from `samples/brief.md` become `- ... because ...` bullets, each with the brief's quote line for that refusal under it, word for word. The brief's bullet text can be reused. The current prose line goes.
  - **Unchanged:** user journeys and MVP scope stay as they are. No library, framework or hosting word comes in (D-14).
- **Verify:**
  - **Testing scope:** the outcome is a sample PRD that follows every rule a PRD now has and still passes both checks. Nothing checks the quotes today. One script plus the two checks are the evidence, and testing stops there.
  - (1) `node lib/check.mjs samples` prints `seldon check: all four documents conform`, and `node lib/check.mjs --prd samples` prints `seldon check: prd.md conforms`.
  - (2) A `node -e` script over `samples/prd.md` finds four things. Today the file has no `  > ` line.
    - Every `- **` line is followed by a `  > ` line or holds `[ASSUMPTION]`.
    - Every non-blank line in `## Non-goals` is either a `- ` bullet holding `because` that is followed by a `  > ` line, or such a quote line.
    - Every `  > ` line's text appears inside a `> ` line of `samples/brief.md`.
    - All three refusal quotes in `samples/brief.md` appear in Non-goals.
  - (3) The IDs on `- **` lines are exactly CAT-01, CAT-02, LOAN-01, LOAN-02, LOAN-03, NFR-01 and NFR-02, as today.
  - (4) In `## Requirements` and `## Non-functional requirements`, LOAN-03's quote is the only one found inside the Scope `> ` line of `samples/brief.md`.
  - (5) `node --test tests/*.test.mjs` passes.

## Notes

- **Prior art:**
  - D-03 (retired IDs on a prose `Retired:` line under `## Requirements`), from phases/3/CONTEXT.md, phase 3. It informs Task 5.
  - D-12 and D-13 (refusals and quotes in the PRD), from phases/3/CONTEXT.md, phase 3. They inform Tasks 3, 4 and 6.
- **D-11 applies to both modes:** the one-ID'd-bullet rule goes into the PRD rules, which both modes share, rather than a rule only `--prd` applies. This is Task 2's choice, recorded in its Action.
- **Flagged assumption left alone:** it is unclear whether Cadence's reader tolerates `> ` quote lines, design-file lines and a `Retired:` line under PRD requirement bullets. That can't be seen from this repository. FORMAT.md documents the forms, and the Cadence-side phase after 4.4.0 handles them. No task here probes Cadence.
