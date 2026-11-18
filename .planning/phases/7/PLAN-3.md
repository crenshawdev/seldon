---
phase: 7
plan: 3
depends_on: [2]
requirements:
  - CHECK-04
files:
  - samples/prd.md
  - samples/spine.md
  - samples/epics.md
  - samples/spine-rerun/prd.md
  - samples/epics-rerun/spine.md
  - samples/epics-split/prd.md
  - samples/epics-split/spine.md
  - samples/epics-no-boundary/spine.md
  - samples/spine-conventions/prd.md
  - samples/spine-from-prd/prd.md
  - samples/spine-job/prd.md
  - samples/spine-outside-input/prd.md
  - tests/samples.test.mjs
---

# Phase 7: PRD changes flow downstream - Plan 3: The stamped samples

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan stamps every sample PRD, spine and epics file so that the fixtures tell their own story. The cases that seed agreeing files read fresh, and the three rerun cases read stale at exactly the link they exercise. A unit test pins all of it.

## Must be true when done

- Each of the 12 PRD, spine and epics files under `samples/` carries one stamp, on the line right after its title. The stamp holds the hash of the parent its cases seed it with.
- `node lib/check.mjs --stale samples` exits 0 with `seldon check: no stale link`. The full check and each per-file mode still pass `samples/`.
- A folder seeded the way an eval case seeds it reads fresh, with three exceptions. Each prints exactly one `stale:` line, its own, followed by the `stamp for` lines Plan 2's output always carries:
  - `prd-rerun` reads the PRD stale
  - `spine-rerun` reads the spine stale
  - `epics-rerun` reads the epics stale
- `tests/samples.test.mjs` fails when any sample's stamp doesn't match its parent's hash, and it pins the fresh samples and the three stale stories.
- `node --test tests/*.test.mjs` passes. So does the coverage job's command, with both lcov guards.

## Context

- **Locked:** D-16, D-04 and D-08. From Plan 2: the stamp form and `--stale`.
- **The story, each file and the parent its cases seed beside it** (from every `evals/*/seed.sh`):
  - `samples/prd.md` from `samples/brief.md`, `samples/spine.md` from `samples/prd.md`, and `samples/epics.md` from `samples/spine.md`
  - `samples/spine-rerun/prd.md` from `samples/spine-rerun/brief.md`
  - `samples/epics-rerun/spine.md` from `samples/spine-rerun/prd.md` (`evals/epics-rerun/seed.sh`)
  - `samples/epics-split/prd.md` from `samples/epics-split/brief.md`, and `samples/epics-split/spine.md` from `samples/epics-split/prd.md`
  - `samples/epics-no-boundary/spine.md` from `samples/epics-split/prd.md` (`evals/epics-no-boundary/seed.sh`)
  - each `prd.md` in `spine-conventions/`, `spine-from-prd/`, `spine-job/` and `spine-outside-input/` from the `brief.md` beside it
- **Stale by design (D-16):** each rerun case pairs a newer parent with an older child.
  - `prd-rerun` pairs `samples/prd-rerun/brief.md` with `samples/prd.md`. That brief is byte-identical to `samples/spine-rerun/brief.md`.
  - `spine-rerun` pairs `samples/spine-rerun/prd.md` with `samples/spine.md`.
  - `epics-rerun` pairs `samples/epics-rerun/spine.md` with `samples/epics.md`.
- **Hashes:** every stamp is copied from a `stamp for <file>:` line of `node lib/check.mjs --stale`, run over a scratch folder seeded as above, and never worked out by hand. Stamp a parent before its child, since the hash covers the parent's own stamp.
- **Unchanged:** every `brief.md`, since a brief carries no stamp (D-01). No duplicate folders are added (D-16). No eval file changes.

## Tasks

### Task 1: Stamp every sample PRD, spine and epics file

- **Files:** samples/prd.md, samples/spine.md, samples/epics.md, samples/spine-rerun/prd.md, samples/epics-rerun/spine.md, samples/epics-split/prd.md, samples/epics-split/spine.md, samples/epics-no-boundary/spine.md, samples/spine-conventions/prd.md, samples/spine-from-prd/prd.md, samples/spine-job/prd.md, samples/spine-outside-input/prd.md
- **Reads:** evals/prd-rerun/seed.sh, evals/spine-rerun/seed.sh, evals/epics-rerun/seed.sh, evals/epics-no-boundary/seed.sh, samples/epics-rerun/spine.md, lib/check.mjs#main
- **Decisions:** D-16, D-01, D-03, D-08
- **Pins:** tests/check.test.mjs
- **Action:** Stamp each of the 12 files with the stamp of the parent the Context story gives it.
  - **Source of each stamp:** build a scratch folder holding the parent and the child under their bare names, run `node lib/check.mjs --stale` on it, and copy that file's `stamp for` line exactly.
  - **Order:** work top-down: the top-level `prd.md`, then `spine.md`, then `epics.md`; `spine-rerun/prd.md` before `epics-rerun/spine.md`; and `epics-split/prd.md` before both spines built from it.
  - **Placement:** the stamp goes on the line right after the `# ` title, and the blank line that followed the title stays. In `samples/epics-rerun/spine.md`, the stamp goes between the title and the existing `Retired: S-03` line.
  - **Leave alone:** change no other line. The rerun cases' graders pin these files' bodies byte for byte.
  - This is one concern across 12 files. Each edit is the same one line.
- **Verify:**
  - **Testing scope:** the outcome is D-16's fixture story: agreeing seeds read fresh and the three rerun pairs read stale at their own link. The checks below cover every seeded combination, Task 2 turns them into unit tests, and testing stops there.
  - (1) Each of the 12 files has exactly one line starting `Built from: `, and it's line 2: `sed -n 2p` shows it, and `grep -c '^Built from: '` prints 1. Each prints 0 today.
  - (2) `node lib/check.mjs samples` exits 0, and so do `--prd`, `--spine` and `--epics` on `samples/`. Each mode runs only where its file is: on scratch folders seeded like `epics-split`, `epics-no-boundary` and each `spine-*` case, `--prd` exits 0 on every one, and `--spine` exits 0 on the `epics-split` and `epics-no-boundary` seeds. `--epics` runs on `samples/` only.
  - (3) Scratch folders seeded from the `cp` lines of each `evals/*/seed.sh` that copies a PRD, spine or epics file give these results under `--stale`:
    - `prd-rerun` exits 1, and its only `stale:` line is `stale: prd.md was built from an earlier brief.md`
    - `spine-rerun` exits 1, and its only `stale:` line is `stale: spine.md was built from an earlier prd.md`
    - `epics-rerun` exits 1, and its only `stale:` line is `stale: epics.md was built from an earlier spine.md`
    - every other one exits 0. That includes `full-walk`, `resume-later`, `spine-from-prd`, `spine-job`, `spine-outside-input`, `which-design` (top-level folder), `epics-split` and `epics-no-boundary`.
  - (4) `node --test tests/*.test.mjs` passes, including Plan 2's tests on stripped copies.

### Task 2: Pin the samples' stamps and stale stories in the unit suite

- **Files:** tests/samples.test.mjs
- **Reads:** tests/check.test.mjs#run, tests/scaffold.test.mjs#SAMPLE, evals/prd-rerun/seed.sh, evals/spine-rerun/seed.sh, evals/epics-rerun/seed.sh
- **Decisions:** D-16, D-01
- **Action:** Add a new test file that `node --test tests/*.test.mjs` picks up, as CI's jobs already run it:
  - **The stamp pin:** walk every `prd.md`, `spine.md` and `epics.md` under `samples/`. For each one that carries a stamp, find its parent:
    - the parent-named file in the same folder
    - or, where the folder has none, the two cross-folder entries in the Context story (`epics-rerun/spine.md` from `spine-rerun/prd.md`, and `epics-no-boundary/spine.md` from `epics-split/prd.md`)

    Assert that the stamp's hash equals the parent's current hash, which the test works out itself with `node:crypto`. A stamped file with no parent found fails, naming the file.
  - **Fresh samples:** `--stale samples` exits 0 with `seldon check: no stale link`.
  - **The three stale stories:** a temp folder for each of `prd-rerun`, `spine-rerun` and `epics-rerun`, built from the `cp` lines of that case's own `seed.sh`, so the test follows the seed. Each exits 1 with its own stale line as its only `stale:` line. The test asserts the `stale:` lines, not the whole stdout, since the `stamp for` lines follow them.
- **Verify:**
  - **Testing scope:** the outcome is AC3's sample clauses: the samples read fresh, the three rerun seeds read stale at their own link, and a unit test fails when a sample's stamp doesn't match its parent. Task 1's checks become five tests, and testing stops there.
  - (1) `node --test tests/samples.test.mjs` passes. The file doesn't exist today.
  - (2) With one byte appended to `samples/spine.md`, the stamp pin fails and names `samples/epics.md`. Afterwards, `git checkout -- samples/spine.md` puts it back and `git diff --exit-code -- samples/` exits 0.
  - (3) `node --test tests/*.test.mjs` passes, and so does the coverage job's command from `.github/workflows/test.yml`, with both lcov guards.
