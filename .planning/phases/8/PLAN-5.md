---
phase: 8
plan: 5
depends_on: [3]
requirements:
  - FLOW-08
  - CHECK-01
files:
  - evals/handoff-cadence/case.yaml
  - evals/handoff-cadence/prompt.md
  - evals/handoff-cadence/seed.sh
  - evals/handoff-cadence/graders/says-no-findings.md
  - evals/handoff-cadence/graders/asks-nothing.md
  - evals/handoff-cadence/graders/ends-on-already-built.md
  - evals/handoff-cadence/graders/no-milestone.md
  - evals/handoff-cadence/graders/no-write.md
  - evals/handoff-cadence/graders/no-edit.md
  - evals/handoff-named/case.yaml
  - evals/handoff-named/prompt.md
  - evals/handoff-named/seed.sh
  - evals/handoff-named/graders/says-no-findings.md
  - evals/handoff-named/graders/ends-on-named-command.md
  - evals/handoff-named/graders/no-write.md
  - evals/handoff-named/graders/no-edit.md
  - evals/readiness-not-run/case.yaml
  - evals/readiness-not-run/prompt.md
  - evals/readiness-not-run/seed.sh
  - evals/readiness-not-run/graders/says-not-run.md
  - evals/readiness-not-run/graders/no-findings-line.md
  - evals/readiness-not-run/graders/asks-nothing.md
  - evals/readiness-not-run/graders/ends-on-unchecked-handoff.md
  - skills/seldon/SKILL.md
  - agents/readiness.md
---

# Phase 8: Readiness check and handoff - Plan 5: The handoff cases

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan proves the rest of success criterion 4 and the line for a check that didn't run (AC4, AC5). `resume-later` already holds AC4's first sentence.

## Must be true when done

- `handoff-cadence` scores 1.00 (AC4). With `.planning/PROJECT.md` seeded beside the clean samples, a bare `/seldon`:
  - says the no-findings line and asks nothing, with Write and Edit at 0
  - ends on `/cad-phase add --brief .planning/seldon` followed by the already-built sentence
  - never prints `/cad-milestone`
- `handoff-named` scores 1.00 (AC4). With the one design in `.planning/seldon/repair-log/`, it says the no-findings line and ends on `/cad-phase add --brief .planning/seldon/repair-log` and the already-built sentence.
- `readiness-not-run` scores 1.00 (AC5). With the agent tool withheld from its allowed tools, a bare `/seldon`:
  - says the did-not-run line, never the no-findings line, and asks nothing
  - ends on the not-checked line and `/cad-new-project --brief .planning/seldon`
- Every kept trace passed the Bash audit and the agent-start audit, and `node --test tests/scaffold.test.mjs` passes.

## Context

- **Locked:** D-12, D-13, D-14, D-15, D-17, D-18 and D-20.
- **Seeds:**
  - `handoff-cadence`: `samples/brief.md`, `samples/prd.md`, `samples/spine.md` and `samples/epics.md` into `.planning/seldon/`, plus `cp -R "$repo/samples/cadence-project/planning/." .planning/`, as `evals/new-design-name/seed.sh` does
  - `handoff-named`: `mkdir -p .planning/seldon/repair-log`, the same four files into it and nothing at the top of `.planning/seldon/`, plus Cadence's files the same way. One design makes `repair-log/` the working folder, and its name is one the Bash audit already allows.
  - `readiness-not-run`: `evals/resume-later/seed.sh`'s lines
- **Case rules:**
  - A case that starts the agent has `allowed_tools: [Skill, Read, Glob, Grep, "<the entry Plan 1 recorded>"]` and the `max_turns` and `timeout_seconds` Plan 3 Task 3 gave `resume-later`.
  - `readiness-not-run` has `[Skill, Read, Glob, Grep]` and nothing more (D-18), with `max_turns: 10` and `timeout_seconds: 300`.
  - No line of a `case.yaml` or `prompt.md` says "scaffold" except `scaffold_script: seed.sh`, and none holds a double-quoted backslash.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Shared graders:** `says-no-findings`, `asks-nothing`, `no-write` and `no-edit` are byte copies of `resume-later`'s, which `cmp` shows. They carry its D-21 checks.
- **D-21:** every new grader must fail when the behavior it claims is missing. Check that with a `node -e` script that reads each pattern from its grader file, over hand-made inputs kept in the scratch area and never committed.
- **Eval runs (SECURITY):** on Plan 1's recorded approval and terms. If none is recorded, stop at a checkpoint marked SECURITY before the first run.
  - **Seed vet:** each new `seed.sh` is vetted at a checkpoint quoting it before its first run (D-04 e).
  - **Audits:** the per-case command, the Bash audit, the agent-start audit, the retries, the cleanup with trace copies, and the rule against reading the Claude binary are Plan 1's Context, unchanged.
- **SKILL.md and the agent in the lease:** they're declared only so a run that fails on their text can be fixed here. After any such edit:
  - rerun `resume-later` and every case this plan has passed
  - keep SKILL.md at or under 90,000 bytes
  - run `node --test tests/*.test.mjs`
  - run `claude plugin validate --strict .` after an edit to the agent
- **Held:** no push, tag, PR or GitHub change, no install of any kind, and nothing published (D-16).

## Tasks

### Task 1: Add the handoff-cadence case

- **Files:** evals/handoff-cadence/case.yaml, evals/handoff-cadence/prompt.md, evals/handoff-cadence/seed.sh, evals/handoff-cadence/graders/says-no-findings.md, evals/handoff-cadence/graders/asks-nothing.md, evals/handoff-cadence/graders/ends-on-already-built.md, evals/handoff-cadence/graders/no-milestone.md, evals/handoff-cadence/graders/no-write.md, evals/handoff-cadence/graders/no-edit.md
- **Reads:** evals/new-design-name/seed.sh, evals/resume-later/graders/ends-on-new-project.md, skills/seldon/SKILL.md#23. The handoff
- **Decisions:** D-12, D-14, D-15, D-17, D-18
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC4's second sentence.
  - **The case:** Context's seed, the prompt `/seldon`, and no history.
  - **`case.yaml`:** the description says the clean design sits beside Cadence's files, so a bare `/seldon` has to run the check, find nothing and end on the under-Cadence command and the already-built sentence.
  - **Graders:**
    - **`ends-on-already-built`:** `last_message` ends with `/cad-phase add --brief .planning/seldon` on a line of its own, then the already-built sentence on a line of its own. Between the command and the sentence only blank lines or a closing code fence may sit, and after the sentence only blank lines or a closing fence. So the command may be fenced alone with the sentence as prose after it, and both may share one fence.
    - **`no-milestone`:** `last_message` doesn't contain `/cad-milestone` (`match: not_contains`).
    - the four shared graders
- **Verify:**
  - **Testing scope:** the outcome is D-12's choice landing on the under-Cadence command, with D-15's sentence after it. Two new graders, their D-21 checks and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and `cmp` shows the four shared graders equal to `resume-later`'s.
  - (2) **D-21:**
    - `ends-on-already-built` fails on `/cad-new-project --brief .planning/seldon`, on the command with no sentence after it, on the sentence followed by more text, and on a line of prose between the command and the sentence
    - it passes on three correct endings: the command and the sentence as plain lines, the command in a fence of its own with the sentence as prose after the closing fence, and both inside one fence
    - `no-milestone` matches, and so fails the grader, on a message holding `/cad-milestone`
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported.

### Task 2: Add the handoff-named case

- **Files:** evals/handoff-named/case.yaml, evals/handoff-named/prompt.md, evals/handoff-named/seed.sh, evals/handoff-named/graders/says-no-findings.md, evals/handoff-named/graders/ends-on-named-command.md, evals/handoff-named/graders/no-write.md, evals/handoff-named/graders/no-edit.md
- **Reads:** evals/handoff-cadence/seed.sh, evals/handoff-cadence/graders/ends-on-already-built.md, skills/seldon/SKILL.md#Designs and the working folder
- **Decisions:** D-13, D-14, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC4's third sentence: a named design prints its own folder.
  - **The case:** Context's seed, the prompt `/seldon`, and no history.
  - **Graders:**
    - **`ends-on-named-command`:** Task 1's `ends-on-already-built` with the command `/cad-phase add --brief .planning/seldon/repair-log`, with no trailing slash.
    - the shared `says-no-findings`, `no-write` and `no-edit`
- **Verify:**
  - **Testing scope:** the outcome is the named folder in the printed command. One grader, its D-21 check and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and `cmp` shows the shared graders equal to `resume-later`'s.
  - (2) **D-21:** `ends-on-named-command` fails on `.planning/seldon` alone, on `.planning/seldon/repair-log/`, and on the command with no already-built sentence after it. It passes on the command in a fence of its own with the sentence as prose after the closing fence.
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported. The Bash audit shows `--stale .planning/seldon/repair-log`, and the agent-start audit shows the three paths under `.planning/seldon/repair-log/`.

### Task 3: Add the readiness-not-run case

- **Files:** evals/readiness-not-run/case.yaml, evals/readiness-not-run/prompt.md, evals/readiness-not-run/seed.sh, evals/readiness-not-run/graders/says-not-run.md, evals/readiness-not-run/graders/no-findings-line.md, evals/readiness-not-run/graders/asks-nothing.md, evals/readiness-not-run/graders/ends-on-unchecked-handoff.md
- **Reads:** evals/resume-later/seed.sh, evals/resume-later/graders/says-no-findings.md, skills/seldon/SKILL.md#22. The readiness check
- **Decisions:** D-18, D-20
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC5. The case withholds the agent tool, so the start can't run (D-18). Plan 1's run 2 showed how such a start is refused.
  - **The case:** `resume-later`'s seed lines, the prompt `/seldon`, no history, and Context's allowed tools for this case.
  - **Graders:**
    - **`says-not-run`:** `last_message` holds a line starting with the did-not-run line's fixed words up to its colon, followed by a reason.
    - **`no-findings-line`:** `last_message` doesn't contain the no-findings line (`match: not_contains`).
    - **`ends-on-unchecked-handoff`:** the not-checked line comes before the lead-in, and the message ends on `/cad-new-project --brief .planning/seldon` in `ends-on-new-project`'s form.
    - the shared `asks-nothing`
- **Verify:**
  - **Testing scope:** the outcome is D-20's line instead of a false all-clear. Three new graders, their D-21 checks and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and `case.yaml`'s `allowed_tools` holds no agent entry.
  - (2) **D-21:**
    - `says-not-run` fails on the no-findings line, and on the did-not-run words with no reason after the colon
    - `no-findings-line` matches, and so fails the grader, on a message holding the no-findings line
    - `ends-on-unchecked-handoff` fails when the not-checked line is missing, and when it comes after the command
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported. The agent-start audit shows no start that ran, and lists any refused attempt with its permission record.
