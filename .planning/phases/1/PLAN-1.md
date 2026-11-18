---
phase: 1
plan: 1
requirements:
  - DOCS-04
files:
  - .github/workflows/test.yml
  - .github/cadence/coverage-policy.json
  - .gitignore
  - docs/FORMAT.md
  - samples/brief.md
  - samples/prd.md
  - samples/spine.md
  - samples/epics.md
  - lib/check.mjs
  - tests/check.test.mjs
---

# Phase 1: The document format and eval harness - Plan 1: The format, its check and the CI gate

## Goal

Seldon's four documents have a fixed, documented format with sample files Cadence's reader can be built against, the plugin installs, and the eval harness runs locally. This plan delivers the format, the samples, the check that enforces the format, and the CI workflow that tests the check and installs the plugin.

## Must be true when done

- `docs/FORMAT.md` defines `brief.md`, `prd.md`, `spine.md` and `epics.md` under `.planning/seldon/`: the sections each carries, the ID spellings `**CAT-01**`, `S-01` and `E-01`, and the six epic field labels.
- `node lib/check.mjs samples` exits 0. The same command on a copy of `samples/` whose epic lacks one field exits non-zero and prints a line naming that field and that epic.
- The accepted coverage command passes locally at 85% lines and 85% branches over `lib/**`, and both LCOV guards pass.
- `node /code/cadence-run/cadence-core/bin/planning.mjs test-policy check --root .` returns `ok:true`.
- `.github/workflows/test.yml` defines `node-test`, `coverage` and `plugin-validate`. It runs on push to any branch and on pull requests, never runs the eval suite, and references no secret or model key. Its `plugin-validate` job installs the plugin from the repository's own marketplace and runs the installed check on the installed samples (ci: plugin-validate, proved by the pushed run).

## Context

- Locked: D-01 (four files under `.planning/seldon/`), D-02 (PRD IDs in Cadence's bolded grammar), D-03 (`S-01` and `E-01`, whose one-letter prefix falls outside Cadence's requirement-ID admission test), D-04 (six epic field labels), D-05 (the check is `node lib/check.mjs <dir>`, covered by Node tests in CI).
- CI model: `/code/cadence/.github/workflows/test.yml`, jobs `node-test`, `coverage` and `plugin-validate`, read-only. The policy values come from `.github/cadence/coverage-policy.json`, which is already tracked and matches the config.
- Out of scope: the epic size and requirement-trace checks (phases 5 and 8), any eval job in CI, and a local plugin install or marketplace add (both held).
- This plan shares no file with Plan 2. The `plugin-validate` job needs Plan 2's manifests and skill, and it first runs on the push after both plans land.

## Tasks

### Task 1: Add the node-test, coverage and plugin-validate CI jobs

- **Files:** .github/workflows/test.yml, .github/cadence/coverage-policy.json, .gitignore
- **Reads:** .github/cadence/coverage-policy.json#coverage.commands, /code/cadence/.github/workflows/test.yml#coverage, /code/cadence/.github/workflows/test.yml#plugin-validate
- **Decisions:** D-05
- **Action:** Create `.github/workflows/test.yml` on the model of Cadence's `test.yml`, with only the three required jobs, named exactly `node-test`, `coverage` and `plugin-validate`.
  - Triggers are `push` with no branch filter, plus `pull_request`. The integration branch `cadence/v0.1.0` is what gets pushed, and a main-only filter would leave AC5 unproved. Keep Cadence's `permissions: contents: read` and its concurrency group. Every checkout uses Cadence's pinned `actions/checkout` SHA with `persist-credentials: false`, and setup-node uses Cadence's pinned SHA.
  - `node-test` runs `node --test tests/*.test.mjs` on a Node 22 and 24 matrix. This is my choice, the same Node lines Cadence's own `node-test` covers. The repository has no dependencies, so there's no install step.
  - `coverage` runs on Node 26, because the accepted command needs `--test-coverage-include-all`, which arrived in 26.7. Copy the three commands from `coverage.commands` in `coverage-policy.json` with `{lines}` and `{branches}` filled in as 85 and 85. The measuring command is one step and each guard is its own step, the way Cadence's coverage job splits them. A folded `run: >-` block is fine, because the policy check collapses whitespace. Leave out Cadence's upload and sonar steps, since this repository has no scan.
  - `plugin-validate` follows Cadence's job step for step:
    - Set up Node 22.
    - Install `@anthropic-ai/claude-code` globally, pinned to 2.1.326, with `--ignore-scripts` and Cadence's zizmor ignore comment. Pin 2.1.326 because those commands were run against that version locally. Then run its `install.cjs` through `npm explore`. The 2.1.326 postinstall in the registry is `node install.cjs`.
    - Run `claude plugin validate --strict .` and `claude plugin validate --strict .claude-plugin/plugin.json`.
    - Run `claude plugin marketplace add ./`, then `claude plugin install seldon@seldon`.
    - From `runner.temp`, outside the checkout, read `seldon@seldon`'s `installPath` from `claude plugin list --json` the way Cadence does, and fail if it's absent. Confirm the installed copy has `skills/seldon/SKILL.md`, and run `node "$INSTALL/lib/check.mjs" "$INSTALL/samples"`, which must exit 0.

    That last step covers the packaging rule's "exercise its entry point". The check is the plugin's code entry, and `/seldon` itself needs a model, which CI never has.
  - No job runs `claude plugin eval`, and no step reads a secret or sets a model key. Evals run locally under `/cad-verify` (the project's Testing constraint).
  - `.github/cadence/coverage-policy.json` stays byte-identical. A plan never changes thresholds, commands or required jobs.
  - Create `.gitignore` with `lcov.info`, the report the coverage command writes at the repository root, so a local run leaves the tree clean.
- **Verify:** Testing scope: the outcomes are that the policy check finds the three jobs and the accepted commands, the workflow is well formed with no persisted credentials, it triggers on every push, and CI has no eval and no key. Nothing covers these yet. The four checks below are enough. The jobs first run on the pushed integration branch, where `plugin-validate` proves the install (AC5, ci: plugin-validate), and testing stops there, with no local install because installs are held.
  (1) `node /code/cadence-run/cadence-core/bin/planning.mjs test-policy check --root .` prints a `problems` list with exactly one entry, `coverage.include "lib/**" matches no tracked file`, which Task 4 closes. Today the list has seven entries.
  (2) `zizmor --offline --min-severity medium .github/workflows/test.yml` exits 0.
  (3) `grep -nE 'secrets\.|ANTHROPIC|plugin eval' .github/workflows/test.yml` prints nothing, and the `push:` trigger has no `branches:` key.
  (4) `git diff --exit-code -- .github/cadence/coverage-policy.json` exits 0, and `git check-ignore -q lcov.info` exits 0.

### Task 2: Document the four-file format in docs/FORMAT.md

- **Files:** docs/FORMAT.md
- **Reads:** BRIEF.md#What it writes, /code/cadence-run/cadence-core/references/req-traceability.md#Active, /code/cadence-run/cadence-core/bin/lib/planning-files.mjs#REQ_ID_EXACT
- **Decisions:** D-01, D-02, D-03, D-04, D-05
- **Action:** Write the format document Cadence's reader is built against. It must settle each of these with no choice left open:
  - **Location and ownership:** Seldon writes exactly four files, `.planning/seldon/brief.md`, `prd.md`, `spine.md` and `epics.md`, and nothing outside `.planning/seldon/`. It reads a design folder the project already has as input and never writes to it.
  - **brief.md:** a `# ` title line, then the `## ` sections Problem, Solution, Who it serves, What's different, Success criteria, Scope and Vision (BRIEF.md "What it writes"). Each section is present and not empty.
  - **prd.md:** the `## ` sections Requirements, Non-functional requirements, User journeys, Non-goals and MVP scope, each present and not empty. Requirements groups its bullets under `### <Category>` subheadings.
    - Every column-0 bullet in Requirements and in Non-functional requirements is a requirement in Cadence's bullet form, `- **CAT-01**: <one line>`. Only the ID goes inside the bold span, with punctuation and text outside it, so the bullet carries into an `## Active` section of Cadence's REQUIREMENTS.md unchanged (D-02).
    - The ID's prefix follows Cadence's admission test (`REQ_ID_EXACT`): 2 to 8 uppercase letters or digits, at least one of them a letter. Seldon writes the number as two or more digits, zero-padded. Non-functional requirements use the same grammar so they carry over as well.
  - **spine.md:** one `## S-01: <decision>` section per decision, spelled `S`, a dash, then two or more digits. Each section has a body that states the decision, and the file has no other `## ` sections.
  - **epics.md:** one `## E-01: <name>` section per epic, in build order, and no other `## ` sections.
    - Each epic carries six fields, each on a line that starts with its bold label and a colon, in this order: Outcome, Boundaries, Done when, Depends on, Requirements, Spine decisions. None is empty. A value may continue on the lines below its label up to the next label or heading, so Done when can be a list.
    - Depends on is `None` or a comma-separated list of epic IDs. Requirements is a comma-separated list of requirement IDs, not bolded. Spine decisions is `None` or a comma-separated list of spine IDs.
  - **IDs:** they're stable. An ID is never renumbered or reused, and a removed item's ID stays retired. Say why spine decisions and epics use a one-letter prefix: Cadence's audit admits 2 to 8 characters before the dash, so it never counts a spine decision or an epic as a requirement (D-03).
  - **The check:** `node lib/check.mjs <dir>`, where `<dir>` holds the four files (`.planning/seldon/` in a project, `samples/` in this repository).
    - It exits 0 when all four conform.
    - It exits 1 with one line per problem. Each line names the file, the epic or decision ID when there is one, and the section or field.
    - It exits 2 when the directory argument is missing or isn't a directory.

    State that the check covers what this document defines and nothing more.

  Write it for someone building a parser: the rules first, then one short example per file. Leave out `/seldon`'s interview and the Cadence handoff, which later phases define.
- **Verify:** `docs/FORMAT.md` exists (it doesn't today), and a loop of `grep -qF` over this list reports no miss: `.planning/seldon/`, `brief.md`, `prd.md`, `spine.md`, `epics.md`, the seven brief section names, the five PRD section names, `**CAT-01**`, `S-01`, `E-01`, `**Outcome:**`, `**Boundaries:**`, `**Done when:**`, `**Depends on:**`, `**Requirements:**`, `**Spine decisions:**` and `node lib/check.mjs`.

### Task 3: Write the sample set in samples/

- **Files:** samples/brief.md, samples/prd.md, samples/spine.md, samples/epics.md
- **Reads:** docs/FORMAT.md
- **Decisions:** D-01, D-02, D-03, D-04
- **Action:** Write one complete set of the four documents for a small invented project, following `docs/FORMAT.md` exactly, so Cadence's reader can be built and tested against it.
  - The set exercises every rule the format states: at least two requirement categories and one non-functional requirement, at least two spine decisions, and at least three epics. Among the epics, one has Depends on `None` and another depends on an earlier epic.
  - The set is internally consistent. Each requirement ID an epic names is declared in `prd.md`, each spine ID in `spine.md`, each epic ID is an earlier epic, and every requirement is named by some epic. The check doesn't enforce cross-references in this phase (the requirement trace is phase 8), but a reader built against inconsistent samples would learn the wrong thing.
  - The project is neutral: it's not Seldon or Cadence and has no "BMad" in it. Keep each file short, because the samples show the format, not depth.
- **Verify:** The four files exist (none do today). A `node -e` one-liner checks samples/epics.md:
  - It collects every ID named on the `**Requirements:**`, `**Spine decisions:**` and `**Depends on:**` lines and looks each one up: requirement IDs as `- **ID**:` bullets in samples/prd.md, spine IDs as `## S-NN:` headings in samples/spine.md, and epic IDs as `## E-NN:` headings. It prints no missing ID.
  - It finds at least three `## E-` headings and at least two `## S-` headings, and each of the six labels exactly once per epic.

  The full format check runs on these files in Task 4.

### Task 4: Enforce the format with lib/check.mjs and its Node tests

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** docs/FORMAT.md, samples/epics.md
- **Decisions:** D-02, D-03, D-04, D-05
- **Action:** Implement `node lib/check.mjs <dir>` as `docs/FORMAT.md` describes it.
  - It reads the four files from `<dir>` and reports every problem it finds rather than stopping at the first. It exits 0, 1 or 2 as the document says.
  - On success it prints one stable line saying the four files conform, which later eval graders can match with a regex (D-05). Each problem line names the file, the ID when there is one, and the missing or malformed section, field or ID.
  - It checks only what FORMAT.md defines: no epic size, no requirement trace and no cross-reference between files. Phases 5 and 8 add those, so the check stays a mirror of the format.
  - It uses Node builtins only, as ESM with no dependencies. Keep the checking logic importable separately from the command-line entry, so tests can run it in the test process, where `node --test` coverage measures. Spawn the script only for the exit-code checks.

  Write `tests/check.test.mjs` with `node:test` and `node:assert`. Each negative case copies `samples/` into a fresh temporary directory and changes one thing, so no broken fixture is committed and every case starts from a set known to pass.
- **Verify:** Testing scope: the outcomes are these.
  - The samples pass.
  - An epic missing any one of the six fields fails, naming that field and its epic.
  - Each of these fails, naming what's wrong: a missing file, a missing brief or PRD section, and a malformed ID (a PRD bullet whose bold span isn't an ID, a `## S-1:` or `## E-1:` heading, a bad ID in an epic field).
  - A missing or non-directory argument exits 2.

  Nothing covers these yet. The smallest set is one test file holding one test that runs the script on `samples/`, one table over the six labels that removes each label's line from a copy, one case for each other problem kind, and one usage case. This evidence is enough:
  (1) The accepted coverage command, run exactly as `coverage-policy.json` gives it with `{lines}` and `{branches}` as 85, exits 0, and `grep -q '^LF:[1-9]' lcov.info` and `! grep -qx 'LH:0' lcov.info` both pass.
  (2) `node lib/check.mjs samples` exits 0.
  (3) On a temporary copy of `samples/` with the `**Done when:**` line deleted from E-02, `node lib/check.mjs <copy>` exits 1, and its output contains both `Done when` and `E-02`.
  (4) With `lib/check.mjs` and `tests/check.test.mjs` staged, `node /code/cadence-run/cadence-core/bin/planning.mjs test-policy check --root .` returns `ok:true` (AC7).

  Testing stops there, with no tests for size or trace rules, which don't exist yet. If coverage falls short, measure it, name the uncovered branch, and add the one case that reaches it.

## Notes

- Plan shape follows the CONTEXT directive (multiple plans). The split is by slice: this plan is the format, its check and the CI gate. Plan 2 is the plugin, `/seldon` and the evals, and the two plans share no file.
- Prior art from memory, cited from phases/1/CONTEXT.md, phase 1: D-05 (the check is code tested in CI) shapes Tasks 1 and 4, and D-01 and D-04 (the four files and the six epic labels) shape Tasks 2 to 4.
- `plugin-validate` launches the installed check on the installed samples. It can't pass until both plans have landed, and it first runs on the push, which happens outside these plans.
