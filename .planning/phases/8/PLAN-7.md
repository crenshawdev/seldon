---
phase: 8
plan: 7
depends_on: [1, 2, 3, 4, 5, 6]
requirements:
  - CHECK-01
  - CHECK-02
  - FLOW-08
files:
  - README.md
  - skills/seldon/SKILL.md
  - agents/readiness.md
---

# Phase 8: Readiness check and handoff - Plan 7: The README and the full suite

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan does three things:

- the README says what the readiness check, the question and the handoff do
- the README's grant sentence and case list match what the phase built
- the whole suite passes with the README's own command, and a kept transcript shows the skill loaded whole at its final size

## Must be true when done

- The README's "Using it" says that a bare `/seldon` with all four documents there and nothing out of date runs the readiness check. It covers six things:
  - the check is a separate agent that only reads the PRD, the spine and the epics
  - its three kinds of finding
  - the fix-or-hand-off question, and what each answer does
  - the handoff command on a new project and under Cadence, a named design's folder included
  - the line when the check can't run
  - the handoff leaves no record
- The README's grant sentence names the one agent entry beside the two `--allow-tools` rules. The eval command block is unchanged.
- The README's Evals section has one line for every case in `evals/`, 56 in all, and none for a case that's gone. `resume-later`'s line says what the case now checks.
- `git grep "come in a later release" -- skills README.md evals` finds nothing.
- The README's eval command, run verbatim from the repository root with only `--keep-temp` added, exits 0 with all 56 cases at 1.00 (AC7).
- AC6 holds:
  - a kept session transcript from that run shows the loaded skill byte for byte equal to SKILL.md after the loader's substitutions
  - SKILL.md is at most 90,000 bytes
  - `allowed-tools` is the six pinned entries
  - `claude plugin validate --strict .` passes
  - the unit suite passes under the coverage gate

## Context

- **Locked:** D-02, D-05, D-18 and D-19. The behavior each new README sentence describes is Plans 2 to 6's, D-01 to D-20, and every behavior is taken from SKILL.md as it now stands.
- **Why README.md is last:** it's the record each case-adding plan feeds, so it's edited once, here.
- **Words:** a new body of work's folder is "its own folder", never a bare "design folder", as the README already says. Keep the "inspired by BMad" credit.
- **Eval runs (SECURITY):** the full-suite runs use the approval Plan 1 recorded. If none is recorded, or the recorded one doesn't cover full runs, stop at a checkpoint marked SECURITY before the run.
  - **The command:** run from `/code/seldon`, never a worktree. It's the README's command with `--keep-temp` added before `--allow-tools`.
  - **Audits:** report every Bash command and every agent start in every kept trace, on Plan 1's terms. Anything off them is a SECURITY checkpoint.
  - **Retries:** AC7 needs the README's full command to exit 0, so a solo `--case` run doesn't satisfy it.
    - When a case in the first full run misses on model variance the trace shows, run the full suite once more. Two full runs is the most.
    - A miss caused by SKILL.md's or the agent's text is a checkpoint marked SECURITY, because the runs that follow a fix aren't in Plan 1's approval. They're in this plan's lease only so a fix Daneel rules on can land here. The checkpoint names the fix and asks Daneel to approve exactly these runs, and nothing runs before that approval is recorded:
      - a solo rerun of each case the fix affects, named one by one, at most three tries per case, a retry only after a further ruled fix or a miss the trace shows is model variance
      - one full run after those pass, which is this plan's second and last
    - A third full run isn't in any approval. Needing one is a checkpoint to Daneel.
  - **Cleanup:** copy each kept trace into `evals/results/phase-8-traces/`, then remove only the folders the run printed as kept, by their exact paths.
  - **Where things are:** a kept run's session transcript is under `config/projects/` in its kept folder.
  - **No binary:** nothing is read or copied out of the Claude binary or the files it ships with.
- **Suite size:** phase 7's 48 cases, plus eight new ones, make 56. `resume-later` was rewritten in place. The new cases are `handoff-cadence`, `handoff-named`, `readiness-not-run`, `readiness-findings`, `readiness-crossing`, `readiness-hand-off`, `readiness-fix` and `readiness-agent`.
- **Held:** no push, tag, PR or GitHub change, no install of any kind, and nothing published (D-16).

## Tasks

### Task 1: Describe the readiness check and the handoff

- **Files:** README.md
- **Reads:** README.md#Using it, skills/seldon/SKILL.md#22. The readiness check, skills/seldon/SKILL.md#23. The handoff, skills/seldon/SKILL.md#1. Where the conversation stands, agents/readiness.md
- **Decisions:** D-05, D-07, D-08, D-09, D-10, D-11, D-13, D-14, D-15, D-17, D-20
- **Action:** Describe what Plans 2 to 6 built, in the README's existing plain voice.
  - **The resume paragraph:** the sentence saying the readiness check and the handoff come in a later release becomes one saying that, with all four there and none out of date, a bare `/seldon` runs the readiness check.
  - **"In this release":** the opening sentence of "Using it" adds the check and the handoff after the epics.
  - **A paragraph on the check, after the epics paragraph:**
    - a separate agent, which can only read, reads the PRD, the spine and the epics and nothing else
    - it reports three kinds of finding: a requirement no epic names, an epic that crosses a boundary the spine didn't fix, and a decision left open. A guess tagged `[ASSUMPTION]` isn't one.
    - each finding names its IDs and the step that fixes it
    - with none, Seldon asks nothing and gives the handoff command
    - with findings, it asks whether to fix them or hand off as is. Fixing reruns the earliest step a finding names, in the same turn, carrying the findings, and the next bare `/seldon` takes anything that leaves out of date, then checks again. Handing off changes nothing and gives the command.
    - when the check can't run, Seldon says so, says the design wasn't checked, and still gives the command, and the next bare `/seldon` tries again
  - **A paragraph on the handoff:**
    - `/cad-new-project --brief .planning/seldon` on a project not under Cadence
    - `/cad-phase add --brief .planning/seldon` on one that is, followed by a note that a design Cadence already built has nothing to hand off
    - a design in its own folder gives that folder
    - the handoff writes nothing and keeps no record, so a later bare `/seldon` checks and gives the command again
  - **Unchanged:** the Evals section, which Tasks 2 and 3 change.
- **Verify:**
  - **Testing scope:** documentation of CHECK-01, CHECK-02 and FLOW-08. These checks tie the text to SKILL.md, and testing stops there.
  - (1) `grep -c 'come in a later release' README.md` prints 0. Today it prints 1.
  - (2) `grep -cF '/cad-new-project --brief .planning/seldon' README.md` and `grep -cF '/cad-phase add --brief .planning/seldon' README.md` each print at least 1. Each prints 0 today.
  - (3) Every fixed line or command the new text quotes appears in SKILL.md, as `grep -F` shows, and `grep -c 'cad-milestone' README.md` prints 0.
  - (4) `git diff README.md` changes no line under `## Evals`.

### Task 2: Name the agent entry in the grant sentence

- **Files:** README.md
- **Reads:** README.md#Evals, skills/seldon/SKILL.md, evals/resume-later/case.yaml, evals/readiness-not-run/case.yaml
- **Decisions:** D-02, D-18
- **Action:** The paragraph under the eval command opens by calling the two `--allow-tools` rules the whole grant. That changes with D-02:
  - the readiness cases also allow, in their own `allowed_tools`, the one entry that lets Seldon start its readiness agent, and `readiness-not-run` withholds it
  - Seldon can write only inside `.planning/seldon/`, run its own check and start that one agent, which can only read
  - the skill's `allowed-tools` carries that same entry

  Name the entry exactly as SKILL.md's `allowed-tools` spells it. The command block, the rest of the paragraph and every case line stay word for word.
- **Verify:**
  - **Testing scope:** documentation of D-02's grant. These checks are enough, and testing stops there.
  - (1) `grep -cF '<the entry>' README.md` prints at least 1. It prints 0 today.
  - (2) `git diff README.md` changes only that paragraph's opening sentences, and no line of the command block.

### Task 3: List every case and run the full suite

- **Files:** README.md, skills/seldon/SKILL.md, agents/readiness.md
- **Reads:** README.md#Evals, .github/workflows/test.yml, .planning/phases/7/PLAN-8.md#Task 2: List every case and run the full suite, and for `resume-later` and each of the eight new cases its `evals/<case>/case.yaml` and every file under `evals/<case>/graders/`
- **Decisions:** D-05, D-18, D-19
- **Action:** SKILL.md and the agent are in the files only for a fix Daneel rules on at a checkpoint. This task otherwise writes only README.md.
  - **Add lines:** one plain line per new case, each saying what the case gives Seldon and what it checks, in the list's existing style. Each line is written from that case's `case.yaml` and graders as they stand, never from a plan.
  - **Rewrite `resume-later`'s line:** all four documents there and nothing stale, so Seldon runs the check, finds nothing, asks nothing, writes nothing and ends on `/cad-new-project --brief .planning/seldon`.
  - **Unchanged:** the other case lines, the command and the paragraph Task 2 changed.
- **Verify:**
  - **Testing scope:** this is the phase's regression gate, AC6 and AC7. One full run, the transcript check, the unit suite under the coverage gate and the checks below are enough, and testing stops there.
  - (1) A `node -e` script compares the case directories under `evals/`, except `results/`, with the backticked names in the README's list. Every directory is listed once, and no listed name lacks a directory. Today the eight new names are missing.
  - (1a) For `resume-later` and each new case, every check its README line claims is one a grader file in that case makes, shown by naming the grader beside each claim in the report.
  - (2) `git grep -n "come in a later release" -- skills README.md evals` prints nothing. It searches tracked files only. `evals/results/` is gitignored and still holds phase 7's old traces.
  - (3) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0 on the first full run, or on the second under Context's retry terms:
    - all 56 cases score 1.00, with no `scaffold failed`
    - the Bash audit and the agent-start audit cover every trace
  - (4) **AC6:** in one kept session transcript from that run, the loaded skill text equals SKILL.md byte for byte after the loader's substitutions, compared the way phase 7's Plan 1 compared it. Report the lengths and `wc -c skills/seldon/SKILL.md`, which is at most 90000. A cut, or any other difference, is a checkpoint.
  - (5) These each exit 0 with their pass line: `node lib/check.mjs samples`, and `--brief`, `--prd`, `--spine`, `--epics` and `--stale` on `samples`.
  - (6) `node --test tests/skill.test.mjs` passes, so `allowed-tools` is the six pinned entries. `claude plugin validate --strict .` passes (ci: plugin-validate).
  - (7) The coverage job's command from `.github/workflows/test.yml` passes, and so do both lcov guards (ci: node-test, coverage).
  - (8) After the run, `ls -d` fails on each exact path the run printed as kept, and the trace copies are in `evals/results/phase-8-traces/`.
  - (9) `git diff --name-only` for this plan's commits lists only `README.md`, unless a ruled fix touched SKILL.md or the agent.

## Notes

- **CI:** AC6's and AC7's node-test, coverage and plugin-validate jobs run on push. This phase doesn't push, so `/cad-verify` reads them later through `ci-status`.
- **D-16:** the README doesn't say the printed commands need a Cadence release after 4.4.1. D-16 holds the release instead, so a public README never points at commands that don't work yet.
- **For the phase summary's open items (Daneel's rulings):** at release time the README states the minimum Cadence version, once Cadence's reader of the Seldon folder ships (D-16). And `engines["claude-code"]`, set by Plan 2 to the version the probe ran on, is revisited at release. The task report carries both lines so the summary can.
