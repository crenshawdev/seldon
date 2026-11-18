---
phase: 9
plan: 2
requirements:
  - EVAL-04
files:
  - tests/eval-suite.test.mjs
  - tests/workflows.test.mjs
---

# Phase 9: The full graders - Plan 2: The suite-coverage and workflow guards

## Goal

The full graders check every run that writes what they grade, and a unit test proves the README's suite command covers every case, with nothing for a person to check by hand. This plan proves the coverage half and keeps the suite out of CI.

## Must be true when done

- `node --test tests/eval-suite.test.mjs` passes on the repo. It fails when README.md's eval command carries `--case`, `--tag` or `--eval-dir`, or when the README's case list and the case folders under `evals/` (with `results/` left out) differ by one name.
- `node --test tests/workflows.test.mjs` passes on `.github/workflows/test.yml`. It fails on any workflow file holding `claude plugin eval`, `ANTHROPIC_API_KEY`, or any `secrets.` reference other than `secrets.GITHUB_TOKEN`.
- SKILL.md's `allowed-tools` is still the pinned five, `claude plugin validate --strict .` passes, and the unit suite passes under the coverage gate.

## Context

- **Locked:** D-04 (coverage only, with no suite run in phase 9), D-11 (the suite is never wired as a test command), D-16 (criterion 4 already holds, so the test only guards it) and D-26 (no grant change).
- **What exists:** README.md's `## Evals` section holds one `claude plugin eval .` command in a fence and one bullet per case, each opening with the case name in backticks. Today there are 58 bullets and 58 case folders, and they match. `.github/workflows/` holds only `test.yml`.
- **Pattern to follow:** `tests/scaffold.test.mjs`. It has zero dependencies and uses node:test. Each checker is a function of text, proven on planted inputs as well as on the repo.
- **Out:** any change to README.md or `test.yml`. Running the suite.

## Tasks

### Task 1: Prove the README's eval command runs every case

- **Files:** tests/eval-suite.test.mjs
- **Reads:** README.md#Evals, tests/scaffold.test.mjs#plainStringProblems
- **Decisions:** D-04, D-11
- **Action:** Create `tests/eval-suite.test.mjs`. It reads README.md's `## Evals` section, from that heading to the next `## ` heading.
  - **The command:** the section's lines that start with `claude plugin eval`, of which there must be exactly one. It fails when that line carries `--case` in either spelling (`--case <glob>` or `--case=<glob>`), `--tag` in either spelling (`--tag <tag>` or `--tag=<tag>`), or `--eval-dir`. `claude plugin eval --help` lists two case filters, `--case <glob>` ("Filter cases by name glob") and `--tag <tag...>` ("Filter cases by tag (repeatable)"). `--eval-dir` changes which folder the cases come from, and counts as a filter on Daneel's ruling. `--max-cost-usd` stops a run on cost and selects no cases, so it isn't refused.
  - **The case list:** the section's bullets that open with a backticked name. Compare them as sorted lists with the directory names under `evals/`, directories only and `results/` left out. A missing, extra or repeated name fails, and the test names it.
  - **Planted inputs:** write both checks as functions of text and a list, and prove them. Take the real README text and add `--case fast-path`, then `--case=fast-path`, then `--tag spine`, then `--tag=spine`, then `--eval-dir other`. Take the real list and remove one bullet, add an invented one, and repeat one. Each of these must be flagged.
  - The test reads text only. It never runs the suite, and nothing wires the suite into `package.json` or `workflow.test_command` (D-11).
- **Verify:** `node --test tests/eval-suite.test.mjs` passes on the repo, with 58 names on each side, and each of the eight planted inputs is flagged by name. The file doesn't exist before this task. Testing scope: the outcomes are that the command has no case filter and that the list matches the folders. Nothing covers either today. The eight planted inputs and the repo pass are enough. Testing stops there, with no YAML or shell parse of the command.

### Task 2: Fail any workflow that runs the eval suite or sees a model key

- **Files:** tests/workflows.test.mjs
- **Reads:** .github/workflows/test.yml, tests/skill.test.mjs#allowedTools
- **Decisions:** D-16, D-26
- **Action:** Create `tests/workflows.test.mjs`. It reads every file under `.github/workflows/`, recursively, and fails when it finds none. For each file it fails, naming the file and line, on any of these:
  - `claude plugin eval`, with any whitespace between the words, since a folded `>-` block can spread one command over lines.
  - `ANTHROPIC_API_KEY` anywhere.
  - any `secrets.` reference other than `secrets.GITHUB_TOKEN`, in either the dot form or the `secrets['...']`/`secrets["..."]` form. This is John's ruling on AC6's "a `secrets.` reference to a key": he picked "Any secret fails (Recommended)", put to him as "Any `secrets.` reference fails, except `secrets.GITHUB_TOKEN`."

  Prove it on planted workflow texts: a `run:` line with `claude plugin eval .`, a folded block splitting `claude plugin` and `eval` across lines, an `env:` entry naming `ANTHROPIC_API_KEY`, `${{ secrets.MODEL_KEY }}`, `${{ secrets['CLAUDE_CODE_OAUTH_TOKEN'] }}` and `${{ secrets.SONAR_TOKEN }}` are each flagged. `claude plugin validate --strict .`, test.yml's comment that no eval runs there and `${{ secrets.GITHUB_TOKEN }}` aren't flagged.
- **Verify:** `node --test tests/workflows.test.mjs` passes on `test.yml`, and each planted input is flagged. The file doesn't exist before this task. The rest of AC6 is checked last. `node --test tests/skill.test.mjs` passes, so `allowed-tools` is still the pinned five. `claude plugin validate --strict .` exits 0. The coverage gate passes: `node --test --experimental-test-coverage --test-coverage-include-all --test-coverage-include='lib/**' --test-coverage-exclude='tests/**' --test-coverage-lines=85 --test-coverage-branches=85 --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=lcov.info tests/*.test.mjs`, then `grep -q '^LF:[1-9]' lcov.info` and `! grep -qx 'LH:0' lcov.info`. Testing scope: the outcome is that no workflow runs the suite or sees a model key. The six planted inputs, three clean lines and the repo pass are enough, and testing stops there.

## Notes

- **Rulings:** `--eval-dir` counts as a case filter (Daneel). Any `secrets.` reference other than `secrets.GITHUB_TOKEN` fails (John, through Daneel).
- **Plan review (REVIEW-plan-plan-dae9e98.md, finding 1):** `--tag` is refused too. `claude plugin eval --help` lists it as a case filter.
- **Departure from the plan shape:** this plan shares no file with Plan 1, so the two can run at the same time. CONTEXT's plan shape put this work in the same body as the graders. It has its own plan because that body comes to 9 tasks, past the ceiling of 8.
