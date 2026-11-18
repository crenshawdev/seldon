---
phase: 6
plan: 8
depends_on: [1, 2, 3, 4, 5, 6, 7]
requirements:
  - FLOW-05
  - ARCH-03
files:
  - README.md
---

# Phase 6: Existing projects and design folders - Plan 8: The README and the full suite

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan does three things:

- the README says what `/seldon` now does on a project under Cadence and with more than one design
- the README lists every case
- the whole suite passes with the README's own command, every earlier phase's cases included

## Must be true when done

- The README's "What it writes" says a project's first design sits at the top of `.planning/seldon/` and each later body of work gets its own folder, `.planning/seldon/<name>/`.
- The README's "Using it" covers:
  - `/seldon` on a project under Cadence designing the next body of work, with Cadence's files never written and never read for the brief or the PRD
  - the name a new design's folder gets
  - the which-design question when there's more than one design
  - the spine reading the code on a project under Cadence, quoting the conventions it records with their file, and asking who relies on what today
- The README's Evals section has a line for every case in `evals/` and none for a case that's gone.
- The README's eval command, run verbatim from the repository root, exits 0 with every case at 1.00. There is no `not granted`, no `scaffold failed`, and no Bash command but the four checks.
- AC5 holds: each check mode passes `samples/`, `allowed-tools` is still the pinned five, and the unit suite passes under the coverage gate.

## Context

- **Locked:** D-14: the README's eval command and its two `--allow-tools` rules don't change, and neither does the paragraph on the grant and the seeds. The decisions each README sentence describes are Plans 1 to 7's: D-01 to D-13.
- **Words:** a new body of work's folder is "its own folder" or a named design, never a bare "design folder", which in the README already means a project's own design notes (Plan 1's choice).
- **Why README.md is last:** it's the record each case-adding plan feeds, so it's edited once here, after Plans 1 to 7.
- **Eval runs (SECURITY):** on the approval Plan 2 recorded for phase 6, which names this plan's one full-suite run. If Plan 2's report records no approval, or records one that covers per-case runs only, stop at a checkpoint marked SECURITY before the run and ask for approval of this one full run. Anything off these terms is a checkpoint marked SECURITY.
  - Run from `/code/seldon`, never a worktree. The full run is the README's command, with `--keep-temp` added before `--allow-tools` for the Bash audit only.
  - **Bash audit:** report every Bash command in every kept trace. Only `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon`, `.planning/seldon/repair-log` or `.planning/seldon/sowlist`, is allowed. Anything else is a SECURITY checkpoint.
  - **Retries:** at most three tries per case. A case whose miss the trace shows is model variance may be rerun alone with `--case <name>`. Any other failing case, or one still failing after its third try, is a checkpoint, not a fix, because this plan leases only `README.md`.
  - **Cleanup:** before the plan finishes, remove only the folders the run printed as kept, by their exact paths, never by a glob such as `/tmp/claude-eval-*`.
  - **Suite size:** phase 5's 32 cases plus this phase's 8 make 40.
- **Owner's words:** committed files never carry the owner's own words. Keep the "inspired by BMad" credit.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Describe projects under Cadence and named designs

- **Files:** README.md
- **Reads:** README.md#What it writes, README.md#Using it, skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#15. The spine step, docs/FORMAT.md#Location and ownership
- **Decisions:** D-01, D-02, D-03, D-04, D-05, D-06, D-07, D-09, D-10, D-11, D-13
- **Action:** the README says what `/seldon` does now, in its plain style.
  - **"What it writes":** "Everything goes in `.planning/seldon/`" stays true, and the section adds the layout. A project's first design sits at the top of `.planning/seldon/`, and each later body of work gets its own folder, `.planning/seldon/<name>/`, holding the same files. The sentence on a design folder the project already has keeps its words.
  - **"Using it", projects under Cadence:** one paragraph.
    - `/seldon` runs on a project already under Cadence, one with `.planning/PROJECT.md`, and designs the next body of work there.
    - It never writes Cadence's files, and the brief and PRD steps never read them.
  - **"Using it", a new design:** in the paragraph on a dump given while a brief is there.
    - Seldon writes nothing and offers to start the text as a new body of work in its own folder: reply with a short name of lowercase letters, digits and hyphens.
    - With one design it also asks the rerun-or-go-on question, as today.
    - The design already there is left as it is.
  - **"Using it", several designs:** with more than one design, a bare `/seldon` or a step name first asks which design, then goes on with that one.
  - **"Using it", the spine:** the spine step's paragraph says what changes on a project under Cadence.
    - It also reads the existing code.
    - It records the code's conventions that touch what this body of work builds, or the whole project, as decisions of the six kinds, each quoting the code with its file.
    - It doesn't ask about a stack or host the code already settles.
    - It always asks who relies on what today, and records each answer under the decision for the part it names.
  - **Kept:** the eval command, the grant paragraph, the BMad credit, and every other paragraph apart from the edits above.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) Inside "Using it" only (`sed -n '/^## Using it/,/^## Evals/p' README.md`), each of these prints at least 1, and each prints 0 today:
    - `grep -c 'PROJECT\.md'`
    - `grep -c 'lowercase letters, digits and hyphens'`
    - `grep -ci 'which design'`
    - `grep -ci 'who relies on what'`
  - (2) `grep -c '\.planning/seldon/<name>/' README.md` prints at least 1. It prints 0 today.
  - (3) `grep -c 'inspired by BMad' README.md` prints at least 1, and the eval command line is unchanged: `git diff README.md` shows no `-` line starting `claude plugin eval`.

### Task 2: List every case and run the full suite

- **Files:** README.md
- **Reads:** README.md#Evals, .github/workflows/test.yml
- **Decisions:** D-14, D-15
- **Action:**
  - **Add lines:** one plain line per case this phase added, each saying what the case gives Seldon and what it checks, in the list's existing style: `cadence-project`, `cadence-dump`, `new-design-name`, `new-design-brief`, `which-design`, `which-design-answer`, `spine-who-relies` and `spine-conventions`.
  - **Unchanged:** the other case lines, the command, and the paragraph on the grant and the seeds.
- **Verify:**
  - **Testing scope:** this is the phase's regression gate, AC5. One full run, the unit suite under the coverage gate and the checks below are enough, and testing stops there.
  - (1) A `node -e` script compares the case directories under `evals/`, except `results/`, with the backticked names in the README's list. Every directory is listed, and no listed name lacks a directory. Today the eight new names are missing.
  - (2) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0.
    - Every case scores 1.00, all 40 of them, with no `not granted` and no `scaffold failed`.
    - The Bash audit covers every trace.
    - Afterwards, `ls -d` fails on each exact path the run printed as kept.
  - (3) `node lib/check.mjs samples` and `node lib/check.mjs --brief samples`, `--prd samples`, `--spine samples` and `--epics samples` each exit 0 with their pass line.
  - (4) `node --test tests/skill.test.mjs` passes, so `allowed-tools` is still phase 2 D-02's five.
  - (5) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards.
  - (6) `git diff --name-only` for this plan's commits lists only `README.md`.

## Notes

- **CI:** AC5's node-test and coverage jobs run on push. This phase doesn't push, so `/cad-verify` reads them later through `ci-status`.
- **At phase close, outside this plan:** the `.planning/CAPTURE.md` phase 6 todos (FLOW-05 and ARCH-03, and the design-already-there decision) are closed the way phase 5's were, after the phase. No task here touches them.
