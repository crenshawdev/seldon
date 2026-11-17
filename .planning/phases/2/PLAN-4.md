---
phase: 2
plan: 4
depends_on: [1, 2, 3]
requirements:
  - DOCS-03
files:
  - tests/scaffold.test.mjs
  - samples/design/overview.md
  - evals/design-folder/case.yaml
  - evals/design-folder/prompt.md
  - evals/design-folder/seed.sh
  - evals/design-folder/graders/names-design-fact.md
  - evals/design-folder/graders/no-edit.md
  - evals/design-folder/graders/no-write-outside.md
  - evals/design-folder/graders/no-bash-but-check.md
  - evals/existing-brief/case.yaml
  - evals/existing-brief/prompt.md
  - evals/existing-brief/seed.sh
  - evals/existing-brief/graders/no-write.md
  - evals/existing-brief/graders/no-edit.md
  - evals/existing-brief/graders/says-rerun-later.md
  - README.md
  - evals/fast-path/prompt.md
---

# Phase 2: The brief - Plan 4: Scaffolded cases, their guard and the README

## Goal

A user runs `/seldon` on a new project, dumps what they have, confirms fast path or coaching, and gets a brief in `.planning/seldon/`, proven by eval cases this phase adds. This plan adds:

- the first scaffold scripts and the test that guards them
- the design-folder and existing-brief cases
- a README whose eval command runs the whole suite under the scoped grant

## Must be true when done

- `node --test tests/scaffold.test.mjs` passes on every scaffold script a case names. It fails on a planted script holding a network call, `rm`, `mv`, `git` or a `$HOME` read.
- **design-folder** scores 1.00 under `--scaffold`. Seldon's reply carries a fact only `samples/design/` holds, with no Edit, no Write outside `.planning/seldon/`, and no Bash except the check.
- **existing-brief** scores 1.00 under `--scaffold`. With a brief already in place, `/seldon` writes and edits nothing and says rerunning a step comes later.
- The README's eval command carries `--scaffold` and exactly D-16's two grants. Run from the repository root, it passes all ten cases.
- The README says what `/seldon` does in this release.

## Context

- **Locked:** D-01, D-03, D-04, D-08, D-11, D-12, D-15, D-16 (SECURITY) and D-17. Phase 1 D-07 also holds:
  - `--scaffold` only for scripts that copy fixture files from `samples/` into the run directory and do nothing else, each one guarded by a Node test that greps it
  - `--trust-plugin` only for this plugin, always with `--no-publish`
- **The run command:** `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node /code/seldon/lib/check.mjs:*)"`. `--allow-tools` goes last, and nothing goes broader.
- **Scaffold environment:** a scaffold runs as the user, outside the agent's sandbox. It starts in the run's empty workspace with only PATH, a temporary HOME and TMPDIR (https://code.claude.com/docs/en/plugin-evals.md). `file_exists` can't see a file a scaffold created.
- **Where it runs:** in the main working tree at `/code/seldon`, never a worktree, because of phase 1's worktree guard on "eval".
- **Held:** no `claude plugin install`, no `marketplace add`, and no push, tag, PR or GitHub change.

## Tasks

### Task 1: Guard every scaffold script with a Node test

- **Files:** tests/scaffold.test.mjs
- **Reads:** tests/check.test.mjs#root, evals/replay/case.yaml
- **Decisions:** D-12
- **Action:** Write `tests/scaffold.test.mjs` with `node:test` and `node:` builtins only, working on Node 22 as the CI matrix needs, so no `fs.glob`.
  - **Finding scripts:** the test finds every `case.yaml` under `evals/`, skipping `results/`, and reads its `context.scaffold_script`. It asserts the named file exists in that case's folder, then scans the file.
  - **Failures:** a hit fails the test, naming the script, the line and what matched. The scan looks for:
    - **Network clients:** curl, wget, nc, ncat, netcat, ssh, scp, sftp, rsync, ftp and telnet, plus `/dev/tcp` and `/dev/udp`.
    - **git.**
    - **rm and mv, anywhere.** A copy-only script needs neither, and a grep can't tell inside the run directory from outside it. Matching both outright is how this test holds phase 1 D-07's "no `rm` or `mv` outside the run directory".
    - **Home reads:** `$HOME`, `${HOME}` and a `~` that starts a word.
  - **Matching:** match commands as whole words, so `cp` or `mkdir -p` never trip the `rm` or `mv` check. Comments get no exemption.
  - **Planted-script test:** a second test plants scripts in a temp folder, each holding one forbidden line from each group above, and asserts the scan reports every one. A copy-only script (`set -euo pipefail`, `mkdir -p`, `cp` from `samples/`) reports nothing. That's AC7's planted-script proof, run in CI.

  No case names a scaffold yet, so the scan over real scripts covers none until Tasks 2 and 3 add theirs.
- **Verify:**
  - **Testing scope:** the outcome is a scaffold holding a forbidden command failing CI. Nothing covers it today. The planted-script test plus the scan over real scripts is the whole check. The evidence is the suite passing and the planted cases being caught, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes. The file doesn't exist today.
  - (2) Plant a folder `evals/zz-plant/` with a `case.yaml` naming a script that holds `curl https://example.com`. With it in place, `node --test tests/*.test.mjs` fails, naming that script and `curl`. With `evals/zz-plant/` removed, it passes.
  - (3) The coverage job's command in `.github/workflows/test.yml` passes, along with both lcov guards.

### Task 2: Add the design-folder case, its fixture and its scaffold

- **Files:** samples/design/overview.md, evals/design-folder/case.yaml, evals/design-folder/prompt.md, evals/design-folder/seed.sh, evals/design-folder/graders/names-design-fact.md, evals/design-folder/graders/no-edit.md, evals/design-folder/graders/no-write-outside.md, evals/design-folder/graders/no-bash-but-check.md
- **Reads:** skills/seldon/SKILL.md, evals/write-scope/graders/no-write-outside.md, evals/replay/case.yaml
- **Decisions:** D-03, D-11, D-12, D-16
- **Action:** Write AC4's first case.
  - **Fixture `samples/design/overview.md`:** a short design note for a coined project whose name appears nowhere else in the repository: not in the prompt, SKILL.md, the other cases or the other samples. The name is the fact the reply has to carry, because SKILL.md names the project the way the dump or the design folder names it (Plan 2).
  - **`seed.sh`:**
    - A bash script with `set -euo pipefail`.
    - It finds the repository from its own path. The case folder is `evals/design-folder/`, so the root is two levels up.
    - It copies `samples/design/` into `docs/design/` in the current directory, which is the run's empty workspace, and does nothing else (D-12, phase 1 D-07).
    - How the script reaches `samples/` is a flagged assumption marked Unclear, and this run settles it.
  - **case.yaml:**
    - `schema_version: "1.1"`, `name`, `runs: 1` and `context.scaffold_script: seed.sh`.
    - Under `execution`: `max_turns: 10` and `timeout_seconds: 300`.
    - `allowed_tools: [Skill, Read, Glob, Grep, Write, Edit, Bash]`. The write tools are listed so a write is possible and gets caught.
  - **prompt.md:** `/seldon` plus a dump that points at the design notes in `docs/design/` and describes the idea without naming the project.
  - **Graders (D-03):**
    - `names-design-fact.md`: `regex` on `last_message`, matching the coined name.
    - `no-edit.md`: `tool_used` on Edit, with `min: 0` and `max: 0`.
    - `no-write-outside.md`: Plan 3 write-scope's Write grader, with the same pattern.
    - `no-bash-but-check.md`: `tool_used` on Bash, with `min: 0` and `max: 0`. Its `input_match` matches any command that isn't `node <path>/lib/check.mjs --brief <dir>` on its own. That includes the check chained with `;`, `&&` or `|`, and one carrying `$(` or a backtick.
  - **Fail closed:** if the run reports `scaffold failed`, stop and return a checkpoint with the error, because fixture placement then goes to John. Don't move the fixture into the case folder, don't use `add_dirs`, and don't make the script read any other path.
- **Verify:**
  - **Testing scope:** the outcome is Seldon reading a design folder as input without writing to it (AC4, DOCS-03). Nothing covers it today. Four graders and one run are the evidence, with the guard covering the script, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes with `evals/design-folder/seed.sh` scanned.
  - (2) The run command with `--case design-folder` exits 0 at 1.00, with no `not granted` and no `scaffold failed`.
  - (3) `git grep --untracked -l` on the coined name lists only `samples/design/overview.md` and `evals/design-folder/graders/names-design-fact.md`. `--untracked` makes it search this task's new files before they're staged, `prompt.md` and `seed.sh` included.
  - (4) A `node -e` script shows `no-bash-but-check`'s pattern:
    - matches the JSON-encoded Bash inputs for `cat docs/design/overview.md`, `node -e "1"` and the check command followed by `; touch x`
    - doesn't match the check command alone
  - (5) `node lib/check.mjs samples` still prints `seldon check: all four documents conform`, and `node --test tests/*.test.mjs` passes.

### Task 3: Add the existing-brief case and its scaffold

- **Files:** evals/existing-brief/case.yaml, evals/existing-brief/prompt.md, evals/existing-brief/seed.sh, evals/existing-brief/graders/no-write.md, evals/existing-brief/graders/no-edit.md, evals/existing-brief/graders/says-rerun-later.md
- **Reads:** evals/design-folder/seed.sh, skills/seldon/SKILL.md
- **Decisions:** D-08, D-12
- **Action:** Write the AC6 case.
  - **`seed.sh`:** copies only `samples/brief.md` to `.planning/seldon/brief.md` in the workspace, making that folder first, and does nothing else (D-12).
  - **prompt.md:** `/seldon` plus a fresh dump.
  - **case.yaml:** the same fields as Task 2, with `context.scaffold_script: seed.sh` and `allowed_tools: [Skill, Read, Glob, Grep, Write, Edit]`. Write and Edit are both listed, so either one touching the seeded brief is possible and gets caught. The `Edit(.planning/seldon/**)` grant covers that folder.
  - **Graders:**
    - `no-write.md`: `tool_used` on Write, with `min: 0` and `max: 0`.
    - `no-edit.md`: `tool_used` on Edit, with `min: 0` and `max: 0` (AC6: Write and Edit at 0).
    - `says-rerun-later.md`: `regex` on `last_message`, with pattern `re-?run` and `flags: i`. SKILL.md's stop message uses the word "rerun" (Plan 2, Task 7).
  - **Why the case grades Seldon, not the file:** `file_exists` can't see a file the scaffold made, so the case grades what Seldon did.
- **Verify:**
  - **Testing scope:** the outcome is `/seldon` neither writing nor editing an existing brief, and saying rerun comes later (AC6). Nothing covers it today. Three graders and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, with both scaffold scripts scanned.
  - (2) The run command with `--case existing-brief` exits 0 at 1.00, with no `not granted` and no `scaffold failed`.
  - (3) A `node -e` script shows `re-?run` matches SKILL.md's stop sentence and doesn't match the prompt.

### Task 4: Describe the brief step in the README's usage section

- **Files:** README.md
- **Reads:** README.md#What it writes, README.md#Using it, skills/seldon/SKILL.md
- **Decisions:** D-01, D-08, D-11, D-17
- **Action:** Rewrite the release paragraph in "Using it" for what `/seldon` now does:
  - It reads the dump, plus `docs/design/` or a folder the dump names, which it never writes to.
  - It recommends a path and writes nothing until the user confirms.
  - On the fast path, it asks only what the dump left that only the user can decide. That always includes who the project is for and what it refuses, when the dump doesn't say. Then it drafts, tagging each guess `[ASSUMPTION]`.
  - Coaching asks one question per turn.
  - Either way it writes `.planning/seldon/brief.md` and runs the format check on it.
  - When a brief already exists, it stops, and rerunning a step comes in a later release.

  Remove "It doesn't write anything yet. The brief step comes next." Keep the paragraph about plain-prose questions and the "inspired by BMad" credit. Use the README's plain style.

  In "What it writes", the `brief.md` line lists what it refuses between scope and vision, so the README names the same eight sections FORMAT.md does (D-17).
- **Verify:**
  - (1) `grep -c 'anything yet\|comes next' README.md` prints 0. It prints 1 today.
  - (2) "Using it" mentions `.planning/seldon/brief.md` and `[ASSUMPTION]`.
  - (3) `grep -ci 'what it refuses' README.md` prints at least 2: the "What it writes" line and the fast-path sentence. It prints 0 today.
  - (4) `grep -c 'inspired by BMad' README.md` prints at least 1.
  - (5) `claude plugin validate --strict .` exits 0.

### Task 5: Give the README the full eval command and run the whole suite with it

- **Files:** README.md, evals/fast-path/prompt.md
- **Reads:** README.md#Evals, evals/fast-path/prompt.md
- **Decisions:** D-04, D-15, D-16
- **Action:** The Evals section's command becomes `claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`.
  - `$PWD` inside the double quotes is the repository's absolute path when the command runs from the root, which is also where the plugin loads from. So the Bash rule names the same `check.mjs` the skill runs (D-16).
  - Say in a sentence or two that:
    - the grant lets Seldon write only inside `.planning/seldon/` and run only its check, and nothing broader
    - `--scaffold` runs only the copy-from-`samples/` scripts that `tests/scaffold.test.mjs` checks
  - Describe each case in a line, keeping phase 1's two as they are.
  - Keep the note that results go to `evals/results/`, which git ignores.

  **Phase 1's fast-path case:** Plan 3 added Read, Glob and Grep to its `allowed_tools`. If this full run still shows fast-path failing because a read tool SKILL.md calls is missing from that list, add that tool to `evals/fast-path/prompt.md` and change nothing else in the case.
  - The tool must be one of the read-only tools the docs list.
  - Never add Write, Edit or Bash. Under D-04 the case stays the "recommends and writes nothing" check.
  - Any other failure is a checkpoint, not a fix.
- **Verify:**
  - **Testing scope:** the outcome is the README's command running the whole suite green under the scoped grant. The individual cases already pass, and this full run, once, is the regression check across all ten. Testing stops there.
  - (1) `grep -c -- '--scaffold' README.md` prints at least 1, where today it prints 0. The command carries both rules exactly, with no bare `Write` and no `Bash(node:*)`.
  - (2) Run that command verbatim from `/code/seldon`. It exits 0 with all ten cases at 1.00, with no `not granted` and no `scaffold failed`. The ten cases are fast-path, replay, fast-path-brief, no-dump, asks-for-dump, asks-who-for, coaching-brief, write-scope, design-folder and existing-brief.
  - (3) `git status --porcelain` lists only `README.md`, plus `evals/fast-path/prompt.md` when the fast-path fix above was needed. In that case, `git diff evals/fast-path/prompt.md` changes only its `allowed_tools` line.

## Notes

- **Fixture location:** the design fixture lives at `samples/design/`, beside the conforming set. That place was chosen because `checkDir` reads only the four named files, the CI install check runs the check on `samples/` unaffected, and the scaffold copies the folder as it is.
- **Flagged assumption:** a scaffold finding `samples/` from its own path is unclear. Task 2's run is where the answer lives, and a `scaffold failed` goes to John as a checkpoint.
- **AC6:** AC6 now reads "Write and Edit at 0", so Task 3 grades both. An Edit to the seeded brief would sit inside the `Edit(.planning/seldon/**)` grant, so only the grader catches it.
- **The final gate and fast-path:** Plan 3 owns the fast-path `allowed_tools` change and reruns that case. Task 5 leases `evals/fast-path/prompt.md` only so the full run can still be fixed if a read tool turns out missing. Its `git status` gate allows that one file.
- **Prior art from memory:** phase 1 D-07 (eval security and the copy-only scaffold rule), cited from phases/1/CONTEXT.md, phase 1. Also D-03 (the write boundary is proven with `input_match`), cited from phases/2/CONTEXT.md, phase 2.
