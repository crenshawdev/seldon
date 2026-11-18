---
phase: 8
plan: 4
depends_on: [1]
requirements:
  - CHECK-01
  - CHECK-02
files:
  - samples/readiness/prd.md
  - samples/readiness/spine.md
  - samples/readiness/epics.md
  - samples/readiness-uncovered/epics.md
  - tests/samples.test.mjs
---

# Phase 8: Readiness check and handoff - Plan 4: The readiness fixtures

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan writes the two designs Plan 6's cases seed. One has exactly one finding, an epic crossing a boundary the spine didn't fix. The other adds a PRD requirement no epic names.

## Must be true when done

- `samples/readiness/` holds a Toolshed PRD with one more category, Repairs, and a spine that decides nothing about repairs. Its epics put Repairs and Loans requirements on E-02. Every PRD requirement ID sits on exactly one epic.
- `samples/readiness-uncovered/epics.md` is those epics with CAT-01 on no epic.
- Each new PRD, spine and epics file passes its check mode and carries its parent's current stamp, and `node --test tests/samples.test.mjs` passes.
- A folder seeded with `samples/brief.md` beside either design reads `seldon check: no stale link` under `--stale`, so a bare `/seldon` over it goes to the readiness check and not to a rerun.

## Context

- **Locked:** D-07 (the kinds the fixtures must raise, and what isn't a finding), D-10 (`readiness-fix` needs a report whose only finding is a crossed boundary) and D-19 (a replay's history must be one the skill can produce from these files).
- **The rules the fixtures are cut to** are Plan 2 Task 1's:
  - a crossing is an epic whose requirement IDs span two or more `### ` categories with no `Kind: boundaries` decision between them
  - an uncovered requirement is an ID no `**Requirements:**` line lists
  - the clean samples raise neither
- **Pattern:** every sample PRD, spine and epics is stamped with its parent's hash, and a folder that borrows its parent from another sample folder is listed in `ELSEWHERE` in `tests/samples.test.mjs`, the way `epics-rerun/` and `epics-no-boundary/` are.
- **Hashes:** copied from a `stamp for <file>:` line of `node lib/check.mjs --stale` over a scratch folder seeded as the cases will seed it, never worked out by hand.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Write the design with one crossed boundary

- **Files:** samples/readiness/prd.md, samples/readiness/spine.md, samples/readiness/epics.md, tests/samples.test.mjs
- **Reads:** samples/prd.md, samples/spine.md, samples/epics.md, docs/FORMAT.md, tests/samples.test.mjs
- **Decisions:** D-07, D-10, D-19
- **Pins:** tests/samples.test.mjs
- **Action:** Each file starts as a byte copy of its clean sample, with only these changes.
  - **`prd.md`:** a new `### Repairs` category after `### Loans`, holding one requirement, REP-01, tagged `[ASSUMPTION]`. A volunteer logs what's wrong with a tool that comes back broken, and a tool logged broken can't be checked out until a volunteer logs it fixed.
    - REP-01 writes only the repair log, and nothing another epic owns, so no second finding rides on it.
    - The stamp stays `samples/brief.md`'s. The other sections stay as they are.
  - **`spine.md`:** `samples/spine.md`'s decisions unchanged, with the stamp of `samples/readiness/prd.md`. No decision mentions repairs, so no `Kind: boundaries` decision draws a line between Loans and Repairs.
  - **`epics.md`:** `samples/epics.md`, stamped with `samples/readiness/spine.md`'s hash, with E-02 changed:
    - `**Requirements:**` is `LOAN-01, LOAN-02, REP-01, NFR-01, NFR-02`, five IDs, the limit
    - Outcome and Boundaries add the repair log
    - Done when gains one item, that a tool logged broken can't be checked out until it's logged fixed, for five items in all

    E-01 and E-03 stay byte-identical.
  - **The pin:** `samples/readiness/` has no `brief.md` of its own, so its PRD borrows `samples/brief.md` the way the seeds put it beside it. `ELSEWHERE` in `tests/samples.test.mjs` gains `'readiness/prd.md': 'brief.md'`, and the comment above `ELSEWHERE` says "These folders" instead of "These two folders". `readiness/spine.md` and `readiness/epics.md` find their parents beside them and need no entry.
- **Verify:**
  - **Testing scope:** the outcome is a design whose one finding is E-02's crossing. The stamp test, the three check modes and the ID checks below prove that from the text. Plan 6's runs prove the agent reads it that way, and testing stops there.
  - (1) `node lib/check.mjs --prd samples/readiness`, `--spine` and `--epics` each exit 0 with their pass line. Today the folder doesn't exist.
  - (2) `node --test tests/samples.test.mjs` passes, so each stamp is its parent's hash. Without the `'readiness/prd.md'` entry it fails with `samples/readiness/prd.md: stamped, but no parent found`, which shows the entry is needed.
  - (3) A `node -e` script over the PRD and the epics shows three things:
    - every requirement ID in the PRD is on exactly one `**Requirements:**` line
    - E-02 is the only epic whose IDs span two `### ` categories
    - `grep -ci repair samples/readiness/spine.md` prints 0
  - (4) A scratch folder holding `samples/brief.md` and the three files under the names a seed gives them reads `seldon check: no stale link` under `node lib/check.mjs --stale`.

### Task 2: Write the epics that leave one requirement out

- **Files:** samples/readiness-uncovered/epics.md, tests/samples.test.mjs
- **Reads:** samples/readiness/epics.md, tests/samples.test.mjs#ELSEWHERE
- **Decisions:** D-07, D-19
- **Pins:** tests/samples.test.mjs
- **Action:**
  - **The file:** a copy of `samples/readiness/epics.md`, with the same stamp, since it's built from the same spine. E-01 changes:
    - its `**Requirements:**` is `CAT-02` alone
    - the done-when item about adding a tool goes, and the item about finding one reads "a tool" rather than "that tool", so two items remain
    - nothing else changes

    CAT-01 is then on no epic's requirement line, and E-02's crossing stays as it was.
  - **The pin:** `ELSEWHERE` in `tests/samples.test.mjs` gains `'readiness-uncovered/epics.md': 'readiness/spine.md'`, beside Task 1's entry, so the stamp test finds the parent the seed puts beside it.
- **Verify:**
  - **Testing scope:** the outcome is a design with exactly two findings, CAT-01 and E-02. The stamp test, the epics check and the ID check prove that from the text, and testing stops there.
  - (1) `node lib/check.mjs --epics samples/readiness-uncovered` exits 0.
  - (2) `node --test tests/samples.test.mjs` passes. Without the `ELSEWHERE` entry it fails with `stamped, but no parent found` for this file, which shows the entry is needed.
  - (3) A `node -e` script shows CAT-01 on no `**Requirements:**` line, every other PRD ID on exactly one, and E-02 still the one epic spanning two categories.
  - (4) A scratch folder holding `samples/brief.md`, `samples/readiness/prd.md`, `samples/readiness/spine.md` and this file reads `seldon check: no stale link` under `--stale`.
