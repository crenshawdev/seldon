---
phase: 4
plan: 7
depends_on: [1, 2, 3, 4, 5, 6]
requirements:
  - ARCH-01
  - ARCH-02
  - ARCH-04
files:
  - README.md
  - skills/seldon/SKILL.md
---

# Phase 4: The architecture spine - Plan 7: The README and the full suite

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. This plan does three things:

- the README says what `/seldon` now does
- the README lists every case
- the whole suite passes with the README's own command, phase 1 to 3 cases included

## Must be true when done

- The README's "What it writes" names `architecture.md` as the one file written only on `/seldon architecture`, beside the four documents.
- The README's "Using it" covers:
  - the spine step: built from the brief and the PRD alone, holding only the six kinds, each decision with a stable ID
  - the questions it asks only when the design has the part
  - the resume into it, the `/seldon spine` rerun, and `/seldon architecture`
  - the epics step coming in a later release
- The README's Evals section has a line for every case in `evals/`.
- The README's eval command, run verbatim from the repository root, exits 0 with every case at 1.00, with no `not granted`, no `scaffold failed`, and no Bash command but the three checks.
- AC7's checks pass:
  - `--spine` on `samples` passes, and fails each of the three spine faults
  - `allowed-tools` is still the pinned five
  - a grep for the retired line finds nothing
  - the suite passes under the coverage gate

## Context

- **Locked:** D-05, D-07, D-13, D-14 and D-17. The README's eval command and its two `--allow-tools` rules don't change (D-13), and neither does the paragraph on the grant and the seeds.
- **Why README.md is last:** it's the record each case-adding plan feeds, so it's edited once here, after Plans 1 to 6.
- **Runs:** from `/code/seldon`, never a worktree.
  - The full run is the README's command, with `--keep-temp` added before `--allow-tools` for the Bash audit only.
  - Report every Bash command in every kept trace. Anything but `--brief`, `--prd` or `--spine` on `.planning/seldon` is a checkpoint.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
  - A failing case is a checkpoint, not a fix, because this plan leases only `README.md`.
  - **This plan runs the whole suite, all 26 cases.**
- **Owner's words:** committed files never carry the owner's own words. Keep the "inspired by BMad" credit.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Name architecture.md in "What it writes"

- **Files:** README.md
- **Reads:** README.md#What it writes, docs/FORMAT.md#Location and ownership
- **Decisions:** D-05, D-17
- **Action:** "What it writes" stops saying everything goes in four files (D-05).
  - **The four:** the four documents stay listed as they are.
  - **The fifth:** one more line names `architecture.md`, a full architecture document Seldon writes only when you ask with `/seldon architecture`. It expands on the spine's decisions by their IDs and adds none of its own.
  - **Kept:** "Seldon writes nowhere else" and the design-folder sentence stay.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c 'in four files' README.md` prints 0. It prints 1 today.
  - (2) `grep -c 'architecture.md' README.md` prints at least 1. It prints 0 today.

### Task 2: Describe the spine step in "Using it"

- **Files:** README.md
- **Reads:** README.md#Using it, skills/seldon/SKILL.md
- **Decisions:** D-07, D-17, D-13
- **Action:** Rewrite the release text in "Using it" for what `/seldon` does now, in the README's plain style.
  - **The opening:** "In this release `/seldon` writes the brief and then the PRD" now names the brief, the PRD and the spine.
  - **The spine step:** it builds from `brief.md` and `prd.md` alone and writes `.planning/seldon/spine.md`. The spine holds only the decisions that would clash if two parts were built separately: design approach, boundaries, how state changes, who owns shared data, stack and hosting. Each decision has a stable `S-` ID and quotes your words or tags a guess. Then it runs the spine check.
  - **Its questions:** it asks how far to trust input from outside only when the design takes some. It asks what runs with nobody there, and who is told when that breaks, only when the design runs something unattended. It asks all of them in one turn.
  - **Resuming:** with a brief and a PRD there, a bare `/seldon` resumes at the spine step and first names the PRD it builds from.
  - **Reruns:** `/seldon spine` reruns the spine. It keeps every decision the change doesn't touch and its ID, and lists a dropped ID on a `Retired:` line.
  - **The full document:** `/seldon architecture` writes the full architecture document, and nothing else ever writes it.
  - **Later steps:** replace "`/seldon spine` and `/seldon epics` come in a later release" with words saying only `/seldon epics` does.
  - **Kept:** the paragraphs on plain-prose questions, the `/clear` suggestion and the brief and PRD steps, apart from the edits above.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) Two strings print 0, and each prints 1 today:
    - `grep -c 'writes the brief and then the PRD' README.md`
    - ``grep -c '`/seldon spine` and `/seldon epics` come in a later release' README.md``
  - (2) Inside "Using it" only (`sed -n '/^## Using it/,/^## Evals/p' README.md`), each of these prints at least 1, and each prints 0 today:
    - `grep -c '/seldon architecture'`
    - `grep -c -i 'unattended'`
    - `grep -c 'resumes at the spine'`, or whatever exact words Task 2 uses for resuming into the spine step, named in the task's report
    - `grep -c 'how state changes'`
    - a grep for the new epics-only later-release wording, named in the task's report, that matches `/seldon epics` and `later release` on one line and doesn't match `/seldon spine`
    - `grep -c '/seldon spine.*Retired:\|Retired:.*/seldon spine'`, so the `Retired:` line is tied to the spine rerun sentence
  - (3) `grep -c 'inspired by BMad' README.md` prints at least 1.

### Task 3: List every case and run the full suite

- **Files:** README.md
- **Reads:** README.md#Evals
- **Decisions:** D-14, D-13
- **Action:**
  - **Rewrite two lines:**
    - `resume-later` now seeds a brief, a PRD and a spine, and checks for the epics-only later-release line.
    - `spine-later`'s line becomes `epics-later`'s: `/seldon epics` with all three there writes and edits nothing and says the epics step comes in a later release.
  - **Add lines:** one plain line per case Plans 3, 5 and 6 added, each saying what the case gives Seldon and what it checks: `spine-from-prd`, `spine-rerun`, `spine-job`, `spine-outside-input`, `spine-answers` and `architecture-on-request`.
  - **Unchanged:** the other case lines, the command, and the paragraph on the grant and the seeds.
- **Verify:**
  - **Testing scope:** this is the phase's regression gate and AC7. Seven checks are enough, and testing stops there:
    - one full run with the README's command
    - the unit suite under the coverage gate
    - the checks below
  - (1) Every case directory under `evals/`, except `results/`, has its name in backticks in the README's list, and no listed name lacks a directory. A `node -e` script compares the two sets. Today `epics-later` and the six new names are missing and `spine-later` is extra.
  - (2) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0.
    - Every case scores 1.00, all 26 of them, with no `not granted` and no `scaffold failed`.
    - The Bash audit covers every trace.
    - Afterwards, `ls -d /tmp/claude-eval-*` matches nothing.
  - (3) `node lib/check.mjs --spine samples` exits 0 and prints exactly `seldon check: spine.md conforms`. Three copies of `samples/` each exit non-zero, and each names the decision and the problem:
    - one with a decision's `Kind:` line removed
    - one with a kind outside the six
    - one with a decision's body emptied
  - (4) `node --test tests/skill.test.mjs` passes, so `allowed-tools` is still phase 2 D-02's five.
  - (5) `grep -rn 'The spine and epics steps come in a later release' skills/ docs/ README.md evals/` prints nothing.
  - (6) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards.
  - (7) `git status --porcelain` lists only `README.md`.

## Notes

- **CI:** the node-test and coverage jobs (AC7's `ci:` tag) run on push. This phase doesn't push, so `/cad-verify` reads them later through `ci-status`.
- **Suite size:** the 20 cases phase 3 left, with `spine-later` replaced by `epics-later`, plus 6 new, make 26.
