---
phase: 4
plan: 1
requirements:
  - ARCH-01
  - ARCH-04
files:
  - docs/FORMAT.md
  - samples/spine.md
  - lib/check.mjs
  - tests/check.test.mjs
---

# Phase 4: The architecture spine - Plan 1: The spine's format and its check

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. This plan gives the spine step a contract to write against:

- the spine's `Kind:` line, its quote-or-tag rule and its `Retired:` line in `docs/FORMAT.md`
- `architecture.md` named as the one file Seldon writes only on request
- a spine-only check that enforces the `Kind:` line and fails closed
- a sample spine that follows all of it

## Must be true when done

- `node lib/check.mjs --spine samples` exits 0 and prints exactly `seldon check: spine.md conforms`. It also passes a folder that holds only `spine.md`.
- `--spine` exits 1 and names the decision and the problem on a decision with no `Kind:` line, with a kind outside the six, or with an empty body. The full check holds `spine.md` to the same rules.
- `docs/FORMAT.md` documents five things:
  - the `Kind:` line and the six kinds
  - quotes and tags in the spine
  - the spine's `Retired:` line under its title
  - `architecture.md` as the one file written only on request, with no check
  - the spine-only check
- Every decision in `samples/spine.md` carries one `Kind:` line and a quote or a tag. S-01 to S-03 keep their headings, and the full check still passes on `samples/`.
- The suite passes under the coverage gate.

## Context

- **Locked:** D-01, D-03, D-04 (its format half), D-05 (its format half), D-10, D-11, D-12 and D-13. `lib/check.mjs` mirrors `docs/FORMAT.md` and nothing past it (its header comment). `--brief` and `--prd` are the pattern `--spine` follows (phase 3 Plan 1).
- **Fixed here for Plans 2 to 7:** the mode token `--spine`, its pass line `seldon check: spine.md conforms`, the `Kind: ` line form and the six kinds' spelling. SKILL.md and the eval graders depend on all of them, so none changes after this plan.
- **Tests:** `node:test` and `node:` builtins only. They have to run on Node 22 as well, because the CI matrix runs 22 and 24 and coverage runs on 26. The coverage gate is the coverage job's command in `.github/workflows/test.yml` plus both lcov guards, with thresholds as they stand. Local Node is 26.13, so the gate runs here.
- **Owner's words:** committed files never carry the owner's own words. Example text uses Tally, Toolshed or another coined project.
- **Out of this plan:** no SKILL.md change, no eval run, and no change to `samples/brief.md`, `samples/prd.md` or `samples/epics.md`.

## Tasks

### Task 1: Document the spine's Kind line

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#spine.md, docs/FORMAT.md#The [ASSUMPTION] tag, docs/FORMAT.md#Examples
- **Decisions:** D-01, D-11
- **Action:** The `spine.md` section gains the `Kind:` line, so a reader and the check can tell a decision's kind without guessing from its heading (D-01).
  - **The line:** each decision's body holds exactly one line that starts at column 0 with `Kind: `. The rest of that line is exactly one of the six kinds, spelled lowercase as ARCH-01 names them: `design approach`, `boundaries`, `how state changes`, `who owns shared data`, `stack`, `hosting`. Nothing else goes on the line.
  - **Exact reading, fail closed:** the line is read exactly, like section names. A seventh kind, another spelling, a second `Kind:` line or a tag on the line fails the check. Say so in the section.
  - **Why only these six:** one sentence says they are the decisions that would clash if two parts were built separately, which is all a spine holds. A spine doesn't have to use all six.
  - **Position and body:** the line can sit anywhere in the body (my choice, recorded here). It names the kind and doesn't state the decision, so the body also holds the decision's text. A body holding only its `Kind:` line counts as empty. That keeps "the body states the decision" meaningful once the line exists (my choice).
  - **Kept as is:** the heading form, the ID rule, each ID once and at least one decision (D-11).
  - **The tag:** "The [ASSUMPTION] tag" adds the `Kind:` line to the places the tag never goes, next to the `## ` heading line.
  - **Example:** the Tally example's `S-01` gains a `Kind:` line naming one of the six.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c 'how state changes' docs/FORMAT.md` prints at least 1. It prints 0 today. Each of the six kinds appears, spelled as above, inside the `## spine.md` section (`perl -ne 'print if /^## spine\.md/../^## epics\.md/' docs/FORMAT.md`).
  - (2) `grep -c '^Kind: ' docs/FORMAT.md` prints at least 1, from the Tally spine example. It prints 0 today.
  - (3) The `## The [ASSUMPTION] tag` section names the `Kind:` line among the places the tag never goes.

### Task 2: Document quotes and tags in the spine

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#The user's own words, docs/FORMAT.md#In the PRD, docs/FORMAT.md#Words from a design folder
- **Decisions:** D-03
- **Action:** The quote-or-tag rule now covers the spine (D-03).
  - **New subsection:** "The user's own words" gains `### In the spine`, after `### In the PRD` and in its shape. Every decision carries one of two things in its body:
    - a `> ` quote directly under the decision's text
    - an inline `[ASSUMPTION]` tag, never on the `## ` heading and never on the `Kind:` line
  - **Quote sources:** a spine quote comes from two sources and nowhere else:
    - the brief's `> ` lines, word for word: a whole line or one unbroken run of that line's exact words, keeping any design-file source line under it, as the PRD does
    - the user's replies to the spine step's own questions

    The brief's item text and the PRD's text are Seldon's wording, so neither is ever a quote source.
  - **The check:** in the spine, as in the brief and the PRD, the check neither requires nor rejects a quoted line or a tag.
  - **The pointer:** replace "The spine takes it when its step is built." so the rule's opening says it covers `brief.md`, `prd.md` and `spine.md`, and points to "In the spine".
  - **Example:** the Tally example's `S-01` gets a quote from a `> ` line in the Tally brief example, or a tag.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c '^### In the spine' docs/FORMAT.md` prints 1. It prints 0 today.
  - (2) `grep -c 'The spine takes it when its step is built' docs/FORMAT.md` prints 0. It prints 1 today.
  - (3) The Tally example's `S-01` body holds either a `> ` line that's a run of a `> ` line in the Tally brief example, or `[ASSUMPTION]`.

### Task 3: Bring samples/spine.md up to the spine rules

- **Files:** samples/spine.md, tests/check.test.mjs
- **Reads:** samples/spine.md, samples/brief.md, samples/prd.md, samples/epics.md, tests/check.test.mjs#cases
- **Decisions:** D-12, D-01, D-03, D-02
- **Pins:** tests/check.test.mjs
- **Action:** `samples/spine.md` stays the one conforming Toolshed spine and is updated in place (D-12).
  - **Kept:** S-01, S-02 and S-03 keep their IDs and their heading lines byte-identical. `samples/epics.md` cites all three, and `tests/check.test.mjs` quotes the S-01 and S-02 headings.
  - **Kinds:** each decision gets exactly one `Kind:` line, as Task 1 documents. S-01 is `how state changes`, S-02 `design approach` and S-03 `boundaries`. That assignment is my choice, recorded here.
  - **One kind each:** S-02's body names a stack (one Node app with one database). That part moves into a new decision of kind `stack`, and S-02 keeps the rest. The reason is D-01's one kind per decision.
  - **Nothing left open:** the sample has to leave nothing a spine step would still ask about for the Toolshed brief and PRD. Plan 3's rerun case (AC6) runs `/seldon spine` over this file, and a gap there would make the rerun stop and ask. So:
    - Add a `hosting` decision. The brief names no host, so it's tagged.
    - Add a `boundaries` decision for the outside input the PRD takes: members searching the catalog from home (CAT-02), with member contact details kept to volunteers (NFR-02). It's tagged.
    - S-03, the daily job, says in its own body who is told when the job fails and how, tagged, because D-02 puts that answer in the job's own decision.
  - **Numbering:** added decisions take S-04 onward, after S-03 in file order.
  - **Quotes and tags:** each decision carries a quote or a tag under Task 2's rule. A quote is a whole `> ` line of `samples/brief.md` or one unbroken run of one. A decision with no source words carries `[ASSUMPTION]` in its body.
  - **The empty-decision test:** "an empty decision" in `tests/check.test.mjs` empties S-03 with a pattern that assumes S-03 is the last decision. Change only that case's edit so it still empties S-03's body alone and still expects exactly `spine.md: S-03: decision: empty section`. Every other spine case keeps its expected lines.
- **Verify:**
  - **Testing scope:** the outcome is a sample that follows the new rules and still passes today's check. A shape script, the existing suite and the full check are enough, and testing stops there.
  - (1) `node lib/check.mjs samples` exits 0 with `seldon check: all four documents conform`.
  - (2) A `node -e` script over `samples/spine.md` confirms four things. Today it fails on the first, since no decision has a `Kind:` line.
    - Every `## S-NN:` section holds exactly one line matching `^Kind: (design approach|boundaries|how state changes|who owns shared data|stack|hosting)$`, plus a `> ` line or `[ASSUMPTION]`.
    - IDs run S-01 upward with none skipped.
    - The S-01, S-02 and S-03 heading lines equal those in `git show HEAD:samples/spine.md`.
    - Kinds `stack` and `hosting` each appear once, and S-03's body holds a tag.
  - (3) The same script confirms that every `> ` line in `samples/spine.md`, once its `> ` is stripped, is a substring of a `> ` line in `samples/brief.md`.
  - (4) `node --test tests/check.test.mjs` passes.

### Task 4: Hold every spine decision to one Kind line

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** lib/check.mjs#checkSpine, lib/check.mjs#idSections, lib/check.mjs#blank, lib/check.mjs#checkEpic, tests/check.test.mjs#cases
- **Decisions:** D-01, D-10, D-11
- **Pins:** tests/check.test.mjs
- **Action:** `checkSpine` enforces Task 1's `Kind:` rule on every well-formed decision, on top of today's heading, ID and body rules.
  - **Both checks:** it's a `spine.md` rule, so the full check applies it, and so will Task 5's `--spine`. Phase 3 did the same for the PRD's bullet rule.
  - **The kinds:** keep the six as a constant beside `BRIEF_SECTIONS`, `PRD_SECTIONS` and `FIELDS`. Match exactly: no trim, no case folding, no tag stripping. Anything else fails, so a seventh kind is caught when the spine step writes it (D-01).
  - **Problem lines:** one line per problem, in the existing `file: ID: field: problem` shape. Each names `spine.md`, the decision ID, `Kind` and what's wrong. Three cases:
    - no `Kind:` line
    - a kind that isn't one of the six, its value shown through the file's `quote` helper like other values
    - more than one `Kind:` line
  - **Empty bodies:** a body that's blank, or holds nothing but its `Kind:` line and tags, gets only today's `spine.md: <ID>: decision: empty section`, with no `Kind` line beside it. That's how a missing or empty PRD section gets one line, not two.
  - **Bad headings:** a heading that fails today (not `S-NN`, a repeated ID, a tag on it) keeps its single line, and its body gets no `Kind` check.
  - **Tests:** add to the `cases` table, each starting from the samples:
    - a decision with its `Kind:` line removed
    - a kind outside the six
    - a second `Kind:` line
    - a decision whose body is only its `Kind:` line
  - **Existing cases:** every existing spine case keeps its expected lines unchanged.
- **Verify:**
  - **Testing scope:** the outcomes are the three `Kind` problems and the empty-body rule. Nothing checks a kind today. The four table cases are the smallest set that reaches every new branch, and the suite under the coverage gate is enough evidence. Testing stops there.
  - (1) `node --test tests/*.test.mjs` passes.
  - (2) Copy `samples/` to a temp folder and delete S-01's `Kind:` line. `node lib/check.mjs <copy>` exits 1, with one line naming `S-01` and `Kind`. On the tree before this task the same copy exits 0.
  - (3) "an empty decision", "a one-digit spine heading", "a repeated spine ID" and "a tagged spine heading" still expect exactly their old single lines.
  - (4) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards.

### Task 5: Add the spine-only check mode

- **Files:** lib/check.mjs, tests/check.test.mjs, docs/FORMAT.md
- **Reads:** lib/check.mjs#MODES, lib/check.mjs#main, lib/check.mjs#PRD_OK_LINE, tests/check.test.mjs, docs/FORMAT.md#The PRD alone
- **Decisions:** D-10
- **Pins:** tests/check.test.mjs
- **Action:** `node lib/check.mjs --spine <dir>` reads only `<dir>/spine.md` and holds it to `checkSpine`, with Task 4's `Kind:` rule. The spine step runs it before the epics exist (D-10).
  - **Mode switch:** only the exact first token `--spine` switches mode, like `--brief` and `--prd`.
  - **Pass:** with no problems it exits 0 and prints exactly `seldon check: spine.md conforms`. Export that line next to `PRD_OK_LINE`, so the tests import it and never retype it.
  - **Failure:** it reports exactly as the full check does. One line per problem with exit 1, `spine.md: missing file` when there's no spine, and exit 2 when the directory argument is missing or isn't a directory.
  - **Usage and header:** the usage line becomes `usage: node lib/check.mjs [--brief | --prd | --spine] <dir>`, and the file's header comment names `--spine` too.
  - **Tests:** mirror the `--prd` tests:
    - `--spine` on `samples` exits 0 with the spine line.
    - A folder holding only a copy of `samples/spine.md` passes.
    - Each of AC7's three spine faults exits 1 and names the decision ID and the problem: a decision with no `Kind:` line, a kind outside the six, and an empty body.
    - A folder with no `spine.md` exits 1 with `spine.md: missing file`.
    - `--spine` with no directory exits 2.
    - Update the usage assertion in "a missing or non-directory argument exits 2" to match the new usage line.
  - **FORMAT.md:** "The check" gains `### The spine alone`, after "The PRD alone" and in its shape. It says:
    - the mode is for the spine step
    - it reads only `spine.md` and holds it to the spine rules, `Kind:` line included
    - what each exit code means, and the exact pass line
    - the full check still needs all four files
- **Verify:**
  - **Testing scope:** the outcomes are the mode's pass line, AC7's three failures through `--spine`, its missing file and its exit 2. Task 4's table covers the rule itself through the full check, and the `--prd` tests cover the shared reading code. The mirrored tests are the smallest set that pins the mode as AC7 names it. The suite under the coverage gate is enough, and testing stops there.
  - (1) `node lib/check.mjs --spine samples` exits 0 and prints exactly `seldon check: spine.md conforms`. Today it exits 2 with the usage line.
  - (2) `node --test tests/*.test.mjs` passes.
  - (3) `grep -c '^### The spine alone' docs/FORMAT.md` prints 1. It prints 0 today.
  - (4) The coverage job's command and both lcov guards pass.

### Task 6: Document the spine's Retired line

- **Files:** docs/FORMAT.md, tests/check.test.mjs
- **Reads:** docs/FORMAT.md#IDs are stable, tests/check.test.mjs
- **Decisions:** D-04, D-11
- **Pins:** tests/check.test.mjs
- **Action:** "IDs are stable" gains the spine's retired IDs, so the rerun has somewhere to put them (D-04).
  - **Where:** when a spine rerun drops a decision, `spine.md` keeps its ID on one prose line directly under the `# ` title, before the first `## ` decision, in the form `Retired: S-03`.
  - **Rules:** the same as the PRD's line. The IDs are plain and comma-separated, in the order they were retired. The line is absent until the first retirement, and a later one extends it. A retired ID is never reused.
  - **The check:** to the check this is text before the first decision, which no rule reads.
  - **Test:** add one test beside "a Retired line under Requirements passes the full check and --prd". A copy of the samples with a `Retired:` line under the spine's title passes both the full check and `--spine`. It pins the promise this task makes to Cadence's reader.
- **Verify:**
  - **Testing scope:** one regression test for a documented promise. It's enough, and testing stops there.
  - (1) `grep -c 'Retired: S-' docs/FORMAT.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/check.test.mjs` passes, including the new test.

### Task 7: Name architecture.md as the one file written on request

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#Location and ownership, docs/FORMAT.md#The check
- **Decisions:** D-05, D-13
- **Action:** FORMAT.md stops saying Seldon writes exactly four files (D-05).
  - **Where it changes:** the opening paragraph and "Location and ownership".
  - **What they say:** the four documents are the contract. Seldon also writes one more file, `.planning/seldon/architecture.md`, and only when the user asks for it with `/seldon architecture`.
  - **The document:** it expands on the spine's decisions by their S- IDs, drawing on the brief, the PRD and the spine. It adds no decision and no ID of its own, so the spine's S- IDs stay the only decisions a reader locks.
  - **No shape, no check:** this document defines no shape for it, and no check reads it. The full check ignores it, as it ignores any other file in the folder.
  - **Kept:** "It writes nothing outside `.planning/seldon/`" and the design-folder sentence stay as they are.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c 'exactly four files' docs/FORMAT.md` prints 0. It prints 1 today.
  - (2) `grep -c 'architecture.md' docs/FORMAT.md` and `grep -c '/seldon architecture' docs/FORMAT.md` each print at least 1. Each prints 0 today.
  - (3) `node lib/check.mjs samples` still exits 0.

## Notes

- **D-16:** the FLOW-03 row was already moved back to Pending and re-pointed to Phase 5 before planning (`.planning/REQUIREMENTS.md` shows `| FLOW-03 | Phase 5 | Pending |`). No task in this phase touches it.
- **Why the sample grows:** Task 3 adds stack, hosting and trust-boundary decisions so Plan 3's `/seldon spine` rerun over `samples/spine.md` finds nothing open. That rerun happens in AC6's case, and from Plan 5 on the step asks about anything left open. D-12 allows added decisions as long as they take the next number.
- **Test edits stay here:** `tests/check.test.mjs` changes in this plan, not in a final plan, even though the plan-graph reference sends edits to pinned tests to the last plan. Two reasons:
  - Task 5's new usage line breaks the existing usage assertion, and Task 3's sample change breaks "an empty decision". Moving those edits to the last plan would leave this plan's commits red.
  - No other plan touches the file, so there's no shared file for the rule to protect.
