---
phase: 5
plan: 7
depends_on: [1, 2, 3, 4, 5, 6]
requirements:
  - FLOW-01
  - EPIC-01
  - EPIC-02
files:
  - README.md
---

# Phase 5: Epics and the full walk - Plan 7: The README and the full suite

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan does three things:

- the README says what `/seldon` now does
- the README lists every case
- the whole suite passes with the README's own command, phase 1 to 4 cases included

## Must be true when done

- The README's "Using it" covers:
  - the walk through all four steps
  - the epics step: built from the PRD and the spine alone, in build order, with the limits and the split along a boundary
  - the stop that points to `/seldon spine`
  - the resume into the epics step, and the `/seldon epics` rerun
  - the later-release line once all four documents are there

  It no longer says `/seldon epics` comes in a later release.
- The README's Evals section has a line for every case in `evals/` and none for a case that's gone.
- The README's eval command, run verbatim from the repository root, exits 0 with every case at 1.00, with no `not granted`, no `scaffold failed`, and no Bash command but the four checks.
- AC5 and AC6 hold:
  - `--epics` passes `samples/` and fails each of AC6's faults, as the full check does
  - `allowed-tools` is still the pinned five
  - a grep for the retired line finds nothing
  - the suite passes under the coverage gate

## Context

- **Locked:** D-17, D-18 and D-19. The README's eval command and its two `--allow-tools` rules don't change (D-18), and neither does the paragraph on the grant and the seeds.
- **Why README.md is last:** it's the record each case-adding plan feeds, so it's edited once here, after Plans 1 to 6.
- **Runs:** from `/code/seldon`, never a worktree.
  - The full run is the README's command, with `--keep-temp` added before `--allow-tools` for the Bash audit only.
  - Report every Bash command in every kept trace. Anything but `--brief`, `--prd`, `--spine` or `--epics` on `.planning/seldon` is a checkpoint.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
  - A failing case is a checkpoint, not a fix, because this plan leases only `README.md`.
  - **This plan runs the whole suite, all 32 cases.**
- **Owner's words:** committed files never carry the owner's own words. Keep the "inspired by BMad" credit.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Describe the epics step in "Using it"

- **Files:** README.md
- **Reads:** README.md#Using it, skills/seldon/SKILL.md#18. The epics step, skills/seldon/SKILL.md#2. Where a run starts, docs/FORMAT.md#epics.md
- **Decisions:** D-17, D-19, D-18
- **Action:** Rewrite the release text in "Using it" for what `/seldon` does now, in the README's plain style.
  - **The opening:** "In this release `/seldon` writes the brief, then the PRD, then the spine" now ends with the epics.
  - **Resuming:** with a brief, a PRD and a spine there, a bare `/seldon` resumes at the epics step and first names the spine it builds from. With all four there, it writes nothing and says the readiness check and the handoff to Cadence come in a later release.
  - **The epics step:** one new paragraph after the spine step's. It says:
    - it builds from `prd.md` and `spine.md` alone, asks no questions, and writes `.planning/seldon/epics.md`
    - the epics come in build order, MVP first, each with its outcome, boundaries, done-when, dependencies, requirement IDs and the spine decision IDs it relies on
    - each epic carries at most 5 requirement IDs and 2 to 5 done-when items, one of which says everything built so far works end to end
    - an epic covers one capability. One over a limit is split along a boundary in the spine, and both sides cite it. When no boundary cuts it, Seldon writes nothing and points to `/seldon spine`.
    - then it runs the epics check
  - **Reruns:** `/seldon epics` reruns the epics the way `/seldon spine` reruns the spine. It keeps every epic the change doesn't touch, with its ID, and lists a dropped epic's ID on a `Retired:` line.
  - **Remove:** "`/seldon epics` comes in a later release, and until then it writes nothing."
  - **Kept:** the paragraphs on plain-prose questions, the `/clear` suggestion, the brief, PRD and spine steps and `/seldon architecture`, apart from the edits above. "What it writes" already describes `epics.md` and stays as it is.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c 'comes in a later release, and until then it writes nothing' README.md` prints 0. It prints 1 today.
  - (2) Inside "Using it" only (`sed -n '/^## Using it/,/^## Evals/p' README.md`), each of these prints at least 1, and each prints 0 today:
    - `grep -c 'readiness check'`
    - `grep -c 'at most 5'`
    - `grep -c 'resumes at the epics'`, or whatever exact words Task 1 uses for resuming into the epics step, named in the task's report
    - `grep -c '/seldon epics.*Retired:\|Retired:.*/seldon epics'`, so the `Retired:` line is tied to the epics rerun sentence
  - (3) `grep -c 'inspired by BMad' README.md` prints at least 1.

### Task 2: List every case and run the full suite

- **Files:** README.md
- **Reads:** README.md#Evals
- **Decisions:** D-19, D-18
- **Action:**
  - **Rewrite two lines:**
    - `epics-later`'s line becomes `epics-from-spine`'s: `/seldon epics` with the brief, the PRD and the spine there writes epics that pass the check, every one with the six fields and the integrated item, each requirement on exactly one epic, citing only the spine's IDs and every stack, hosting and design-approach decision.
    - `resume-later` now seeds all four documents, and checks that Seldon writes and edits nothing and ends on the line naming the readiness check and the handoff.
  - **Add lines:** one plain line per case Plans 4 to 6 added, each saying what the case gives Seldon and what it checks: `epics-split`, `epics-no-boundary`, `epics-rerun`, `full-walk`, `epics-confirm` and `epics-no-spine`.
  - **Unchanged:** the other case lines, the command, and the paragraph on the grant and the seeds.
- **Verify:**
  - **Testing scope:** this is the phase's regression gate, with AC5 and AC6. Seven checks are enough, and testing stops there:
    - one full run with the README's command
    - the unit suite under the coverage gate
    - the checks below
  - (1) Every case directory under `evals/`, except `results/`, has its name in backticks in the README's list, and no listed name lacks a directory. A `node -e` script compares the two sets. Today `epics-later` is listed with no directory, and the seven new names are missing.
  - (2) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0.
    - Every case scores 1.00, all 32 of them, with no `not granted` and no `scaffold failed`.
    - The Bash audit covers every trace.
    - Afterwards, `ls -d /tmp/claude-eval-*` matches nothing.
  - (3) AC6's checks, each on a copy of `samples/`:
    - `node lib/check.mjs --epics samples` exits 0 and prints exactly `seldon check: epics.md conforms`.
    - Five copies each exit non-zero through `--epics` and through the full check, naming the epic and the problem: an epic with 6 requirement IDs, one with 1 done-when item, one with 6, one whose `**Depends on:**` names a later epic, and one missing a field.
  - (4) `node --test tests/skill.test.mjs` passes, so `allowed-tools` is still phase 2 D-02's five.
  - (5) `git grep -n 'The epics step comes in a later release' -- skills/ docs/ README.md evals/` prints nothing. It's `git grep` so the git-ignored eval results under `evals/results/` don't count.
  - (6) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards.
  - (7) `git diff --name-only` for this plan's commits lists only `README.md`.

## Notes

- **CI:** the node-test and coverage jobs (AC6's `ci:` tag) run on push. This phase doesn't push, so `/cad-verify` reads them later through `ci-status`.
- **Suite size:** phase 4's 26 cases, with `epics-later` replaced by `epics-from-spine`, plus the three new cases in Plans 4 and 5 and Plan 6's three, make 32.
- **At phase close, outside this plan:** FLOW-03's row points to Phase 5, so `planning.mjs phase-done` flips it to Complete with this phase's rows, which is what D-10 asks. The `.planning/CAPTURE.md` phase 5 todo is closed the way phase 4's were, after the phase. No task here touches either.
