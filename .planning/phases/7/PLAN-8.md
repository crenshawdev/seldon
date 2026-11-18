---
phase: 7
plan: 8
depends_on: [1, 2, 3, 4, 5, 6, 7]
requirements:
  - CHECK-03
  - CHECK-04
files:
  - README.md
  - skills/seldon/SKILL.md
  - tests/skill.test.mjs
---

# Phase 7: PRD changes flow downstream - Plan 8: The README and the full suite

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan does three things:

- the README says what stamps, the stale walk and the conflict report do
- the README lists every case
- the whole suite passes with the README's own command, and a kept transcript shows the skill loaded whole at its final size

## Must be true when done

- The README's "What it writes" says that `prd.md`, `spine.md` and `epics.md` each record a stamp of the file they were built from, and that the brief and `architecture.md` carry none.
- The README's "Using it" covers four things:
  - a bare `/seldon` naming an out-of-date document and rerunning the earliest one first
  - a step name running without that check
  - the conflict report before a PRD change is applied
  - the two ways a decline ends
- The README's Evals section has a line for every case in `evals/` and none for a case that's gone.
- The README's eval command, run verbatim from the repository root with only `--keep-temp` added, exits 0 with all 48 cases at 1.00. That includes the widened `full-walk` and `spine-from-prd` graders and the rerun cases on stamped fixtures.
- A kept session transcript from that run shows the loaded skill byte for byte equal to SKILL.md as the phase leaves it (AC6).
- AC7 holds:
  - each check mode, `--stale` included, passes `samples/`
  - `allowed-tools` is still the pinned five
  - the unit suite passes under the coverage gate

## Context

- **Locked:** D-18 and D-19. The README's eval command, its two `--allow-tools` rules and the paragraph on the grant and the seeds don't change. The behavior each new README sentence describes is Plans 2 to 7's: D-01 to D-17.
- **Why README.md is last:** it's the record each case-adding plan feeds, so it's edited once, here.
- **Eval runs (SECURITY):** the full-suite runs use the approval Plan 1 recorded. If none is recorded, or the recorded one covers only per-case runs, stop at a checkpoint marked SECURITY before the run.
  - **The command:** run from `/code/seldon`, never a worktree. It's the README's command with `--keep-temp` added before `--allow-tools`.
  - **Bash audit:** report every Bash command in every kept trace, with its permission record. Only Plan 1's approved commands are allowed, and anything else is a SECURITY checkpoint.
  - **Retries:** AC7 needs the README's full command to exit 0, so a solo `--case` rerun doesn't satisfy it. When a case in the first full run misses on model variance the trace shows, run the full suite once more. Two full runs is the most, and Plan 1's approval covers the second only on that condition. Stop at a checkpoint when the second run also misses, or when a miss isn't model variance. A failing case is a checkpoint, not a fix, because this plan leases only `README.md`.
  - **Cleanup:** remove only the folders the run printed as kept, by their exact paths.
  - **Where things are:** a kept run's session transcript is under `config/projects/` in its kept folder.
- **Suite size:** phase 6's 40 cases plus this phase's 8 make 48.
- **Words:** a new body of work's folder is "its own folder", never a bare "design folder", as the README already says. Keep the "inspired by BMad" credit.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Describe stamps, the stale walk and the conflict report

- **Files:** README.md
- **Reads:** README.md#What it writes, README.md#Using it, skills/seldon/SKILL.md#Stamps and stale links, skills/seldon/SKILL.md#13. The PRD draft, docs/FORMAT.md#Stamps
- **Decisions:** D-01, D-02, D-05, D-06, D-09, D-10, D-14, D-15, D-18
- **Action:** Describe what Plans 2 to 7 built, in the README's existing plain voice, with every behavior taken from SKILL.md as it now stands.
  - **"What it writes":** one or two sentences:
    - `prd.md`, `spine.md` and `epics.md` each carry a stamp under the title, holding a hash of the file they were built from: the brief, the PRD and the spine
    - that's how Seldon tells when an earlier document has changed since, a hand edit included
    - the brief and `architecture.md` carry none
  - **"Using it", the resume paragraph:** a bare `/seldon` first checks those stamps.
    - When a document has changed since the next one was built from it, Seldon says so, then reruns the earliest out-of-date step first. The next `/seldon` takes the step after it.
    - The later-release line comes only when all four are there and none is out of date.
    - A step name such as `/seldon spine` runs that step without the check.
  - **"Using it", the rerun paragraph:**
    - After "leaves the PRD alone, even when the PRD is now out of date", say that the next bare `/seldon` brings the PRD in line.
    - Add the conflict report. With a spine there, a PRD change, whether from a rerun or named at the PRD's confirm question, that alters or drops something a spine decision states or quotes is reported first. Each such decision is named by its ID, and the change is applied only on a go-ahead.
    - A decline changes nothing. When the change came from the brief, Seldon points to `/seldon brief` to take it back out.
  - **Unchanged:** the Evals command and the grant paragraph stay word for word (D-18).
- **Verify:**
  - **Testing scope:** documentation of CHECK-03 and CHECK-04. The checks below tie the text to SKILL.md, and testing stops there.
  - (1) `grep -c 'stamp' README.md` and `grep -c 'conflict' README.md` each print at least 1. Each prints 0 today.
  - (2) Every fixed line or command the new text quotes appears in SKILL.md, as `grep -F` shows.
  - (3) `git diff README.md` changes no line of the Evals command block or the grant paragraph.

### Task 2: List every case and run the full suite

- **Files:** README.md
- **Reads:** README.md#Evals, .github/workflows/test.yml
- **Decisions:** D-18, D-19
- **Action:**
  - **Add lines:** one plain line per case this phase added, each saying what the case gives Seldon and what it checks, in the list's existing style: `stale-spine`, `stale-epics`, `prd-conflict`, `prd-conflict-decline`, `prd-conflict-apply`, `prd-change-conflict`, `prd-change-decline` and `stale-prd`.
  - **Update lines:** the `resume`, `spine-answers` and `epics-from-spine` lines each add that the document written carries the stamp of the file it was built from.
  - **Unchanged:** the other case lines, the command, and the paragraph on the grant and the seeds.
- **Verify:**
  - **Testing scope:** this is the phase's regression gate, AC6 and AC7. One full run, the transcript check, the unit suite under the coverage gate and the checks below are enough, and testing stops there.
  - (1) A `node -e` script compares the case directories under `evals/`, except `results/`, with the backticked names in the README's list. Every directory is listed, and no listed name lacks a directory. Today the eight new names are missing.
  - (2) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0 on the first full run, or on the second when the first missed only on model variance:
    - all 48 cases score 1.00, with no `not granted` and no `scaffold failed`
    - the Bash audit covers every trace
  - (3) **AC6:** in one kept session transcript from that run, the loaded skill text is byte for byte equal to SKILL.md as it stands, compared the way Plan 1 compared it. Report the lengths and `wc -c skills/seldon/SKILL.md`, which is at most 90000. A cut or any difference other than a loader substitution Plan 1 named is a checkpoint.
  - (4) After the run, `ls -d` fails on each exact path the run printed as kept.
  - (5) These each exit 0 with their pass line: `node lib/check.mjs samples`, and `--brief`, `--prd`, `--spine`, `--epics` and `--stale` on `samples`.
  - (6) `node --test tests/skill.test.mjs` passes, so `allowed-tools` is still phase 2 D-02's five.
  - (7) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards.
  - (8) `git diff --name-only` for this plan's commits lists only `README.md`.

## Notes

- **CI:** AC3's and AC7's node-test and coverage jobs run on push. This phase doesn't push, so `/cad-verify` reads them later through `ci-status`.
