---
phase: 1
plan: 2
requirements:
  - EVAL-01
  - EVAL-03
  - REL-01
files:
  - BRIEF.md
  - LICENSE
  - .claude-plugin/plugin.json
  - .claude-plugin/marketplace.json
  - skills/seldon/SKILL.md
  - evals/.gitignore
  - evals/fast-path/prompt.md
  - evals/fast-path/graders/recommends-fast-path.md
  - evals/fast-path/graders/no-ask-user-question.md
  - evals/replay/case.yaml
  - evals/replay/prompt.md
  - evals/replay/history.jsonl
  - evals/replay/graders/recalls-transcript-fact.md
  - README.md
---

# Phase 1: The document format and eval harness - Plan 2: The plugin, the /seldon skeleton and the eval harness

## Goal

Seldon's four documents have a fixed, documented format with sample files Cadence's reader can be built against, the plugin installs, and the eval harness runs locally. This plan delivers the plugin and its self-marketplace, the `/seldon` skeleton, the two smoke eval cases and the README.

## Must be true when done

- `claude plugin validate --strict .` exits 0, and its output lists the skill `seldon:seldon`.
- `claude plugin eval . --trust-plugin --no-publish --ablation none` exits 0 with both cases passing:
  - fast-path: Seldon names the fast path and makes no AskUserQuestion call.
  - replay: Seldon, resumed from a saved transcript, names a fact that only the transcript holds.
- `/seldon` reads the user's dump, recommends the fast path or coaching, asks its question in plain prose, and writes nothing.
- `README.md` contains "inspired by BMad", and "BMad" appears in no plugin name, command name or manifest field.
- `BRIEF.md` and `LICENSE` are tracked, unchanged.

## Context

- Locked decisions:
  - D-06: every question is plain prose that ends the turn.
  - D-07: `--trust-plugin` only for this plugin, always `--no-publish`. This phase has no scaffold script, so there's no `--scaffold`.
  - D-08: the skeleton writes nothing.
  - D-09: the two cases and their graders, exactly as listed.
  - D-10: `runs: 1`, `--ablation none`, no cost ceiling.
- Model: `/code/cadence/.claude-plugin/plugin.json` and `marketplace.json`, read-only. Eval facts: https://code.claude.com/docs/en/plugin-evals.md.
- Held: no local `claude plugin install` and no `claude plugin marketplace add`. Plan 1's `plugin-validate` job proves the install on the pushed run. No push, tag, PR or GitHub change of any kind.
- Every eval run in this plan passes `--trust-plugin --no-publish --ablation none`, against this repository's plugin only. This plan shares no file with Plan 1.

## Tasks

### Task 1: Track BRIEF.md and LICENSE as they stand

- **Files:** BRIEF.md, LICENSE
- **Action:** Both files are untracked in the main checkout at `/code/seldon`, and they go into this phase's commits unchanged. `BRIEF.md` is the design brief the roadmap was built from. `LICENSE` is the MIT license, copyright John Crenshaw, that the manifest declares.
  - Make no edits, including to BRIEF.md's testing paragraph that later decisions revised. The brief is the record of what was settled on 2026-11-16.
  - If this plan runs in a worktree, which starts without untracked files, copy both files byte for byte from `/code/seldon`.
- **Verify:** Once the files are staged, `git ls-files --error-unmatch BRIEF.md LICENSE` exits 0 (it exits 1 today), and `cmp BRIEF.md /code/seldon/BRIEF.md && cmp LICENSE /code/seldon/LICENSE` exits 0.

### Task 2: Declare the plugin and its self-marketplace

- **Files:** .claude-plugin/plugin.json, .claude-plugin/marketplace.json
- **Reads:** /code/cadence/.claude-plugin/plugin.json, /code/cadence/.claude-plugin/marketplace.json
- **Action:** Write `.claude-plugin/plugin.json` with Cadence's set of fields:
  - name `seldon` and displayName `Seldon`
  - a description of what Seldon does: it interviews the developer and writes a brief, a PRD, an architecture spine and epics into `.planning/seldon/` for Cadence to build from
  - version `0.1.0`, the milestone
  - author John Crenshaw
  - homepage and repository pointing at crenshawdev/seldon on GitHub
  - license `MIT`
  - a few keywords

  Write `.claude-plugin/marketplace.json` as a self-marketplace for the CI install test, as Cadence's is:
  - name `seldon`
  - owner John Crenshaw
  - a description, because strict validation fails a marketplace without one (probed)
  - one plugin entry: `seldon` with source `./` and a description

  This makes the CI install id `seldon@seldon`. It isn't the Foundation marketplace listing, which waits until Seldon is published. "BMad" appears in no field of either file (naming constraint).
- **Verify:**
  - `claude plugin validate --strict .` and `claude plugin validate --strict .claude-plugin/plugin.json` both exit 0. Both fail today because there's no manifest.
  - `grep -ci bmad .claude-plugin/plugin.json .claude-plugin/marketplace.json` reports 0 for each file.
  - A `node -e` that reads both files confirms plugin.json has name `seldon`, version `0.1.0` and license `MIT`, and marketplace.json has name `seldon` with `plugins[0]` as name `seldon`, source `./`.

### Task 3: Build the /seldon skeleton that recommends a path and writes nothing

- **Files:** skills/seldon/SKILL.md
- **Reads:** BRIEF.md#How it runs, /code/cadence/skills/cad-help/SKILL.md
- **Decisions:** D-06, D-08
- **Action:** Write the skill behind `/seldon` (`/seldon:seldon` also works), in Seldon's own words, with no persona and nothing copied from BMAD.
  - **Frontmatter:** name `seldon`; a description of when to use it, which is starting a project's design before Cadence; and an argument-hint for the dump. Grant no tool that writes or runs anything, so no Write, Edit or Bash, and don't grant AskUserQuestion (D-06).
  - **Behavior in this phase (D-08):**
    - **The dump:** the text after `/seldon` is the user's dump. If there isn't one, ask the user in plain prose to paste or describe what they have, and end the turn.
    - **The judgment:** read the dump against what a brief needs (problem, solution, who it serves, what's different, success criteria, scope, vision) and against the stakes it describes. Recommend the fast path when the dump already answers most of that and the stakes are modest. On that path Seldon drafts and tags its guesses. Recommend coaching, which walks through each decision with the user, when the dump leaves much open or the stakes are high.
    - **The recommendation line:** state it on one line of a fixed form, written once in SKILL.md, that names exactly one path. A grader can then tell a fast-path recommendation from a coaching one that mentions the fast path in passing. Give one or two reasons taken from the dump, and name the project the way the dump names it. Then ask in plain prose whether the user confirms or wants the other path, and end the turn.
    - **After the answer:** state the path Seldon will take, name the project again, and say that drafting the documents isn't built yet, so nothing is written. It writes no file at all in this phase. Phase 2 builds the brief step on this skeleton.
    - **Questions:** every question is plain prose that ends the turn, never AskUserQuestion or any menu, so a `context.history_file` replay can supply each answer (D-06).
- **Verify:**
  - `claude plugin validate --strict .` exits 0 and its output lists `seldon:seldon`. It lists no skill today.
  - `awk '/^---$/{n++; next} n==1' skills/seldon/SKILL.md | grep -E 'Write|Edit|Bash|AskUserQuestion'` prints nothing, and that same frontmatter has `name: seldon`.
  - `grep -ci bmad skills/seldon/SKILL.md` prints 0.

  The behavior is proved by the eval cases in Tasks 4 and 5, which run the skill in a real session.

### Task 4: Add the fast-path eval case

- **Files:** evals/.gitignore, evals/fast-path/prompt.md, evals/fast-path/graders/recommends-fast-path.md, evals/fast-path/graders/no-ask-user-question.md
- **Reads:** skills/seldon/SKILL.md
- **Decisions:** D-06, D-07, D-09, D-10
- **Action:** Write the case EVAL-01 asks for.
  - **prompt.md frontmatter:**
    - `runs: 1` (D-10).
    - Explicit `max_turns` and `timeout_seconds` within the documented limits, since they are the run's only bound, with no cost ceiling (D-10).
    - `allowed_tools: [Skill, AskUserQuestion]`. Listing AskUserQuestion makes the tool available, so the zero-calls grader proves Seldon chose not to call it, rather than that it couldn't.
  - **prompt.md body:** `/seldon` followed by a full description of a small invented project that answers everything a brief needs, so the fast path is right and there's nothing to ask.
  - **Graders:** exactly the two D-09 names, with no third. A `tool_used: Skill` check isn't in D-09.
    - `recommends-fast-path.md` is a `regex` grader on `last_message`. Its pattern matches SKILL.md's fixed recommendation line when it names the fast path, and doesn't match that line when it names coaching.
    - `no-ask-user-question.md` is `tool_used` with tool `AskUserQuestion`, `min: 0` and `max: 0`.
  - `evals/.gitignore` ignores `results/`, which every run writes under `evals/`.
  - There's no `scaffold_script` (D-07).
- **Verify:** Testing scope: the outcome is that Seldon, given a full description, names the fast path without a menu. Nothing covers it yet. This one case with its two graders is the check, and a single run is the evidence (D-10). Testing stops there.
  (1) `claude plugin eval . --case fast-path --trust-plugin --no-publish --ablation none` exits 0 with fast-path scoring 1.00. Today it exits 1, because there's no case.
  (2) With `node -e`, the recommends-fast-path pattern matches SKILL.md's recommendation line filled in with the fast path, and doesn't match it filled in with coaching.
  (3) `git status --porcelain evals` lists no `results/` path.

### Task 5: Add the history_file replay eval case

- **Files:** evals/replay/case.yaml, evals/replay/prompt.md, evals/replay/history.jsonl, evals/replay/graders/recalls-transcript-fact.md
- **Decisions:** D-06, D-07, D-09, D-10
- **Action:** Write the case EVAL-03 asks for: one interview turn replayed through `context.history_file`.
  - **history.jsonl:** a `/seldon` session that reads a dump and ends on Seldon's plain-prose question. The dump carries one distinctive invented fact that appears nowhere else in the case, nor in SKILL.md or the fast-path case. A coined project name is the natural choice, since the skeleton names the project in its answer.
  - **prompt.md:** the body is the user's next turn. It answers that question without restating the fact.
  - **case.yaml:** sets `schema_version: "1.1"`, `name: replay`, `runs: 1` and `context.history_file: history.jsonl`, with execution limits like Task 4's and `Skill` granted as the fast-path case does.
  - **Grader:** exactly one, `recalls-transcript-fact.md`, a `regex` on `last_message` that matches the fact (D-09).
  - There's no `scaffold_script` (D-07).

  The `.jsonl` line format isn't documented (flagged assumption). Hand-write a minimal transcript first. If the eval run reports that the case or its history failed to load, or the grader misses the fact because the history was ignored, replace it with a real session's transcript saved by the CLI:
  - Take that session from a run where no personal configuration loads, so nothing private ends up in this public repository. The eval harness's isolated `claude -p` child is that source.
  - Create a temporary seed case under `evals/` whose prompt is `/seldon` plus the dump, with one throwaway grader (for example `graders/any.md`, a `regex` on `last_message` matching `.`), because a case with no grader fails to load and its pass or fail doesn't matter here. Run it once with `claude plugin eval . --case <seed> --trust-plugin --no-publish --ablation none --keep-temp`.
  - Copy the session `.jsonl` out of the kept run directory into `evals/replay/history.jsonl`, then delete the seed case before the commit.
  - Don't use a plain `claude -p` session on this machine as the source. It loads the user's own settings and memory, and those can end up in the transcript.
- **Verify:** Testing scope: the outcome is a resumed `/seldon` turn that uses what only the saved conversation holds. Nothing covers it yet. This case's one grader is the check and one run is the evidence. The full-suite run below closes AC3, and testing stops there.
  (1) `claude plugin eval . --trust-plugin --no-publish --ablation none` exits 0 with both fast-path and replay at 1.00 (AC3).
  (2) The grader's pattern matches `evals/replay/history.jsonl` and nothing in `evals/replay/prompt.md`, `evals/fast-path/prompt.md` or `skills/seldon/SKILL.md`, so the replay can only pass by reading the history.
  (3) `grep -c '/home/' evals/replay/history.jsonl` and `grep -ci 'claude\.md' evals/replay/history.jsonl` both print 0.
  (4) `ls -A evals` shows only `.gitignore`, `fast-path` and `replay`, plus the ignored `results`.

### Task 6: Write the README, crediting the method as inspired by BMad

- **Files:** README.md
- **Reads:** BRIEF.md#What it is
- **Action:** Write `README.md`. Cover:
  - what Seldon is and who it's for
  - what it writes and where: `.planning/seldon/`, with a link to `docs/FORMAT.md`, which Plan 1 adds
  - how to install it from this repository's marketplace as `seldon@seldon`
  - what `/seldon` does in this release: it reads the dump, recommends the fast path or coaching, and writes nothing yet
  - how its evals run locally with `claude plugin eval . --trust-plugin --no-publish --ablation none`
  - the MIT license, pointing to `LICENSE`

  Credit the method with the exact phrase "inspired by BMad", with the lower-case "i". That's the one place BMad appears. Seldon's name, command and manifests never carry it, because BMAD's trademark terms permit the credit but not the branding. Use plain, specific prose, at least 40 words, which is the validator's floor for a README.
- **Verify:**
  - `grep -c 'inspired by BMad' README.md` prints at least 1. README.md doesn't exist today.
  - `grep -rli --exclude-dir=results bmad .claude-plugin skills evals` prints nothing, and no directory name under `skills/` contains "bmad" (AC6).
  - `claude plugin validate --strict .` still exits 0, and its output no longer contains `README_MISSING`.

## Notes

- `BRIEF.md` and `LICENSE` are untracked in the main checkout. If this plan runs in a worktree, merging Task 1's commit back meets those untracked copies, and git refuses to overwrite untracked files. The copies are byte-identical (Task 1's `cmp`), so the orchestrator can remove them from the main checkout before the merge.
- Each eval run is a real model call on the user's account. The two cases run once each.
- How AskUserQuestion behaves in a non-interactive run isn't documented (flagged assumption). It doesn't affect this plan, because D-06 keeps Seldon off menus, and the fast-path grader only counts calls.
- Prior art from memory, cited from phases/1/CONTEXT.md, phase 1: D-07 (eval security) sets the flags in every eval command here, and D-06 (plain-prose questions) shapes Tasks 3 to 5.
