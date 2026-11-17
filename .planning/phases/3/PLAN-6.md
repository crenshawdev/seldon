---
phase: 3
plan: 6
depends_on: [1, 2, 3, 4, 5]
requirements:
  - DOCS-02
  - FLOW-02
  - FLOW-03
  - FLOW-04
files:
  - README.md
---

# Phase 3: The PRD, resume and rerun - Plan 6: The README and the full suite

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan does two things:

- the README describes what `/seldon` now does and lists every case
- the whole suite passes with the README's own command, phase 2's cases included

## Must be true when done

- The README's "Using it" says what this release does:
  - the PRD step built from the brief alone
  - resuming from the files after a `/clear`
  - rerunning one step with `/seldon brief` or `/seldon prd`
  - the question when a new dump meets a brief already there
  - the `/clear` suggestion when a step is confirmed
  - the spine and epics coming in a later release
- The README's Evals section has a line for every case in `evals/`.
- The README's eval command, run verbatim from the repository root, exits 0 with every case at 1.00, with no `not granted`, no `scaffold failed`, and no Bash command but the check.
- `node lib/check.mjs --prd samples` exits 0, `tests/skill.test.mjs` still pins phase 2 D-02's five `allowed-tools` entries, and the suite passes under the coverage gate.

## Context

- **Locked:** D-20. This plan rewrites the existing-brief line and the "In this release" text for D-02 and D-06. Phase 2 D-16's grant stays the README's whole grant.
- **Why README.md is last:** it's the record each case-adding plan feeds, so it's edited once here, after Plans 1 to 5.
- **Runs:** from `/code/seldon`, never a worktree.
  - The full run is the README's command, with `--keep-temp` added before `--allow-tools` for the Bash audit only.
  - Report every Bash command in every kept trace. Anything but the `--brief` or `--prd` check on `.planning/seldon` is a checkpoint.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
  - A failing case is a checkpoint, not a fix. This plan leases only `README.md`.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Describe the PRD step, resume and reruns in the README

- **Files:** README.md
- **Reads:** README.md#Using it, README.md#What it writes, skills/seldon/SKILL.md
- **Decisions:** D-20
- **Action:** Rewrite the release paragraph in "Using it" for what `/seldon` does now. Keep its description of the brief step, then cover:
  - **Ending a step:** each step ends by running its check and asking the user to confirm or name changes. Once confirmed, Seldon suggests `/clear` and then `/seldon`, and never requires the clear.
  - **Resuming:** a bare `/seldon` starts at the first step whose document isn't in `.planning/seldon/` yet. It first names the file it's building from.
  - **The PRD step:** it builds from `brief.md` alone, never the conversation or a design folder, and writes `.planning/seldon/prd.md`. A rerun also reads the existing `prd.md`, to keep its IDs. Don't say the step reads only `brief.md`. The PRD holds:
    - requirements with stable IDs
    - non-functional requirements
    - user journeys
    - non-goals carrying the brief's refusals
    - MVP scope

    The PRD is sized to the stakes, quotes the user's words, tags guesses and names no technology. It runs the PRD check.
  - **Reruns:** `/seldon brief` and `/seldon prd` rerun one step. A brief rerun keeps untouched items and leaves the PRD alone. A PRD rerun keeps untouched requirements and their IDs, and lists a dropped ID on a `Retired:` line.
  - **A dump that meets a brief:** when a brief is already there, a new dump gets a question: rerun the brief with it, or go on.
  - **Later steps:** `/seldon spine` and `/seldon epics` come in a later release.

  Remove "If a brief is already there, it stops and changes nothing, because rerunning a step comes in a later release." Keep the paragraph about plain-prose questions and the "inspired by BMad" credit. Write in the README's plain style.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `grep -c 'stops and changes nothing' README.md` prints 0. It prints 1 today.
  - (2) `grep -c '/seldon prd' README.md` and `grep -c '/clear' README.md` each print at least 1. Each prints 0 today.
  - (3) `grep -c 'inspired by BMad' README.md` prints at least 1.
  - (4) `claude plugin validate --strict .` exits 0.
  - (5) The README's PRD text says the step builds from `brief.md` alone and that a rerun also reads the existing `prd.md`. `grep -c 'reads only .brief.md.' README.md` prints 0. Today the README has no PRD text.

### Task 2: List every case in the README and run the full suite

- **Files:** README.md
- **Reads:** README.md#Evals
- **Decisions:** D-20
- **Action:**
  - **Case lines:** in the Evals list, rewrite existing-brief's line. With a brief there, a new dump gets the question and nothing is written. Add one plain line per case that Plans 2 to 5 added: resume, prd-from-brief, confirm-clear, spine-later, prd-reads-brief (plus prd-ignores-talk if Plan 4 split it), prd-rerun, brief-rerun and brief-rerun-dump. Each line says what the case gives Seldon and what it checks.
  - **Unchanged:** the other case lines, the command and the paragraph on the grant and `--scaffold`.
- **Verify:**
  - **Testing scope:** this is the phase's regression gate. One full run with the README's command, the unit suite under the coverage gate and the AC7 checks are enough, and testing stops there.
  - (1) Every case directory under `evals/`, except `results/`, has its name in backticks in the README's list. A `node -e` script compares the two sets.
  - (2) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0. Every case scores 1.00, with no `not granted` and no `scaffold failed`. That's eighteen cases, or nineteen if Plan 4 split prd-reads-brief. The Bash audit covers every trace. Afterwards, `ls -d /tmp/claude-eval-*` matches nothing.
  - (3) `node lib/check.mjs --prd samples` exits 0 with `seldon check: prd.md conforms`. A copy of `samples/prd.md` whose Requirements section holds no ID'd bullet exits 1 and names Requirements (AC7).
  - (4) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards. `tests/skill.test.mjs` is among the passing tests.
  - (5) `git status --porcelain` lists only `README.md`.

## Notes

- **Plan order:** this plan names Plans 1 to 5 in `depends_on`. It shares no file with them except through `README.md`, and has to run after every case exists.
- **CI:** the node-test and coverage jobs (AC7's `ci:` tag) run on push. This phase doesn't push, so `/cad-verify` reads them later.
