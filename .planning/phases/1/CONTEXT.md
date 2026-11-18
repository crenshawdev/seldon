# Phase 1: The document format and eval harness - Context

Gathered: 2026-11-17
Feeds: /cad-plan 1

## Scope boundary

In: The `.planning/seldon/` document format, documented in `docs/FORMAT.md` with a sample set in `samples/` and a format check in `lib/check.mjs`. A `/seldon` skeleton that reads the user's dump and says which path it would take. The eval harness under `evals/` with two smoke cases, one fast-path and one history_file replay. The plugin manifest and a self-marketplace for the CI install test. The CI workflow carrying the accepted coverage commands and the `node-test`, `coverage` and `plugin-validate` jobs, with `plugin-validate` running on every push to main. A README crediting "inspired by BMad". `BRIEF.md` and `LICENSE` committed with this phase's work.
Out: The real brief, PRD, spine and epics steps (phases 2 to 5). The epic size and requirement-trace checks in `lib/check.mjs` (phases 5 and 8). Any scaffold script and its guard test (the first arrives in phase 3). A local plugin install, which is held, so the install is proven only by the pushed CI run. Pushing, which mother does from her session after a "push ready" message.
Deferred: None
Plan shape: multiple plans - several plans inside this phase; four requirements in an empty repo fit one planner.

## Durable decisions

- D-01 (format): Seldon writes four files, `.planning/seldon/brief.md`, `prd.md`, `spine.md` and `epics.md`. Evidence: BRIEF.md "What it writes"; `.planning/REQUIREMENTS.md` DOCS-04.
- D-02 (IDs): PRD requirement IDs use Cadence's bolded `**CAT-01**` grammar, so they carry into Cadence's REQUIREMENTS.md unchanged at the handoff. Evidence: `/code/cadence-run/cadence-core/templates/REQUIREMENTS.md` (REQ-ID notes).
- D-03 (IDs): Spine decisions are `S-01` and epics are `E-01`. A one-letter prefix falls outside Cadence's requirement-ID grammar (2 to 8 characters before the dash), so Cadence's audit never counts a spine decision or an epic as a requirement. Evidence: `/code/cadence-run/cadence-core/templates/REQUIREMENTS.md` (the audit's admission test).
- D-04 (format): `epics.md` holds one `## E-01: name` section per epic with six fixed field labels: Outcome, Boundaries, Done when, Depends on, Requirements, Spine decisions. Evidence: BRIEF.md "Epics"; `.planning/REQUIREMENTS.md` EPIC-01.
- D-05 (checks): The format check is code, `node lib/check.mjs <dir>`. Node tests cover it in CI, Seldon's own steps run it on what they write, and eval cases grade it with a `tool_used` grader on the command plus a regex on its output. Eval graders can't run code ("There are no custom-code graders"), and llm graders aren't deterministic. Evidence: https://code.claude.com/docs/en/plugin-evals.md (grader types).
- D-06 (interview): Every Seldon question is plain prose that ends the turn, so a `context.history_file` replay can supply each answer. This trades away AskUserQuestion menus so the interview can be tested: eval runs are non-interactive, and the docs give no way to answer a menu inside a run. Evidence: https://code.claude.com/docs/en/plugin-evals.md ("Runs never stop to ask for permission"; history_file makes the case prompt the next user turn).
- D-07 (eval security): Eval runs pass `--trust-plugin` only for this repository's own plugin, and always pass `--no-publish`. `--scaffold` is allowed only for scripts that copy fixture files from `samples/` into the run directory and do nothing else: no network, no `rm` or `mv` outside the run directory, no git, nothing reading `$HOME`. Each scaffold script gets a Node test that greps it for those and fails on a hit. A case that needs more than copying fixtures stops and goes to John through mother. Evidence: `claude plugin eval --help` (trust prompt, `--scaffold` runs author-supplied bash as you); ruling relayed by mother under John's overnight go.

## Decisions

- D-08 (skeleton): Phase 1 ships a `/seldon` skeleton that reads the user's dump and says which path it would take (fast path or coaching), writing nothing. Phase 2 builds the brief step on it. Evidence: ROADMAP.md phase 1 criterion 3; phase 2 goal.
- D-09 (smoke cases): Two sample cases. The fast-path case gives a full project description, and its graders find the reply naming the fast path and 0 AskUserQuestion calls (`tool_used` with `max: 0`). The replay case resumes a saved transcript through `context.history_file`, and its grader finds a fact present only in that transcript. Evidence: `.planning/REQUIREMENTS.md` EVAL-01, EVAL-03; https://code.claude.com/docs/en/plugin-evals.md.
- D-10 (cost): Phase 1's smoke cases use `runs: 1` and `--ablation none`, with no dollar ceiling, since there's no data to pick one and `max_turns` and `timeout_seconds` already bound each run. Evidence: https://code.claude.com/docs/en/plugin-evals.md (defaults: 3 runs, baseline arm for path targets).

## Acceptance criteria

- [ ] AC1: `docs/FORMAT.md` defines the four files under `.planning/seldon/`, the sections each carries, the ID spellings (`**CAT-01**`, `S-01`, `E-01`), and the six epic field labels.
- [ ] AC2: `node lib/check.mjs` exits 0 on the sample set in `samples/`, and exits non-zero, naming the field, on a copy whose epic lacks a required field.
- [ ] AC3: `claude plugin eval . --trust-plugin --no-publish --ablation none` exits 0 with the two D-09 cases passing.
- [ ] AC4: `claude plugin validate --strict .` exits 0.
- [ ] AC5: The plugin installs from the repository's own marketplace in the `plugin-validate` job, which runs on every push to main. (ci: plugin-validate)
- [ ] AC6: `README.md` contains "inspired by BMad", and "BMad" appears in no plugin name, command name or manifest field.
- [ ] AC7: `node /code/cadence-run/cadence-core/bin/planning.mjs test-policy check --root .` returns `ok:true`: the workflow carries the accepted coverage commands and names `node-test`, `coverage` and `plugin-validate`, and `.github/cadence/coverage-policy.json` is tracked.

## Flagged assumptions

- The layout follows Cadence's own: `.claude-plugin/plugin.json` and `marketplace.json` (a self-marketplace for the CI install test, not the Foundation listing), `skills/seldon/SKILL.md`, JS in `lib/`, tests in `tests/`, cases in `evals/`, the format doc at `docs/FORMAT.md`, samples in `samples/` - Likely; if wrong: the coverage include (`lib/**`) and every path above move, and the testing policy needs an adjustment through `/cad-config --testing`.
- The history_file `.jsonl` line format isn't documented on the eval docs page - Unclear; if wrong: the replay case fails to load, and the planner should produce the transcript from a real session rather than hand-writing it.
- How AskUserQuestion behaves inside a non-interactive eval run isn't documented - Unclear; if wrong: nothing, since D-06 keeps Seldon off menus.
