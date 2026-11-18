---
phase: 4
plan: 4
depends_on: [1, 2, 3]
requirements:
  - ARCH-01
files:
  - skills/seldon/SKILL.md
  - evals/resume-later/case.yaml
  - evals/resume-later/seed.sh
  - evals/resume-later/graders/says-later-release.md
  - evals/spine-later/case.yaml
  - evals/spine-later/prompt.md
  - evals/spine-later/seed.sh
  - evals/spine-later/graders/no-edit.md
  - evals/spine-later/graders/no-write.md
  - evals/spine-later/graders/says-later-release.md
  - evals/epics-later/case.yaml
  - evals/epics-later/prompt.md
  - evals/epics-later/seed.sh
  - evals/epics-later/graders/no-edit.md
  - evals/epics-later/graders/no-write.md
  - evals/epics-later/graders/says-later-release.md
---

# Phase 4: The architecture spine - Plan 4: The epics-only later-release cases

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. Once the spine step exists, only the epics step comes later. This plan rewrites the two cases whose graders pin the retired "spine and epics" line (D-14):

- `resume-later` becomes a bare `/seldon` over a brief, a PRD and a spine
- `spine-later` becomes `epics-later`, on `/seldon epics`

## Must be true when done

- The resume-later case scores 1.00. With a brief, a PRD and a spine seeded, a bare `/seldon` writes and edits nothing and ends on the epics-only later-release line.
- The epics-later case scores 1.00. With the same three seeded, `/seldon epics` writes and edits nothing and ends on the same line.
- `evals/spine-later/` no longer exists, and `grep -rn 'The spine and epics steps come in a later release' evals/` finds nothing.

## Context

- **Locked:** D-07 and D-14. Plan 2 Task 6 fixed the epics-only line in SKILL.md §2. The graders copy it from there.
- **Eval runs:** the same as Plan 3's Context.
  - Run from `/code/seldon`, the main tree, never a worktree, one `--case` per run.
  - Use `--trust-plugin --no-publish --ablation none --scaffold --keep-temp`, then `--allow-tools` last with exactly the two grants.
  - **This plan runs exactly two cases: `resume-later` and `epics-later`.**
- **Seed vetting:** both seeds change in this plan, so the coordinator vets each one before its first run. The task stops at a checkpoint quoting the file. A seed holds only `mkdir -p .planning/seldon` and `cp` lines from `"$repo/samples/..."`, besides the shebang, `set -euo pipefail`, the repo line and comments.
- **Bash audit:** report every Bash command in each kept trace. These two cases should run none. Any command but the three checks on `.planning/seldon` is a checkpoint. Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:** as in Plan 3:
  - the read-only `allowed_tools`
  - no "scaffold" in a `case.yaml` or `prompt.md` except the plain `scaffold_script: seed.sh`
  - no double-quoted backslash
  - every changed grader must fail when the behavior it claims is missing (phase 3 D-21)
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Rewrite resume-later for a brief, a PRD and a spine

- **Files:** evals/resume-later/case.yaml, evals/resume-later/seed.sh, evals/resume-later/graders/says-later-release.md
- **Reads:** evals/resume-later/case.yaml, evals/resume-later/seed.sh, evals/resume-later/graders/says-later-release.md, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-14, D-07
- **Pins:** tests/scaffold.test.mjs
- **Action:** `resume-later` now seeds all three documents and asserts the epics-only line (D-14).
  - **`seed.sh`:** keeps its brief and PRD copies and adds a copy of `samples/spine.md` to `.planning/seldon/spine.md`.
  - **`case.yaml`:** the description says that with a brief, a PRD and a spine already there, a bare `/seldon` has to write and edit nothing and end on the fixed line saying the epics step comes in a later release. It doesn't say "scaffold".
  - **`says-later-release.md`:** keeps its shape, `regex` on `last_message` matching the line on a line of its own with nothing after it but blanks or a closing fence. The line is now the epics-only line, copied exactly from SKILL.md §2 with regex metacharacters escaped and the apostrophe matched loosely as today's pattern does.
  - **Unchanged:** `prompt.md` (`/seldon`), `no-write.md` and `no-edit.md`.
- **Verify:**
  - **Testing scope:** the outcome is the epics-only line on a bare resume. The rewritten grader's D-21 checks plus one passing run are enough, and testing stops there.
  - (1) D-21, checked with a `node -e` script reading the pattern from the file. It matches a message ending on the epics-only line. It doesn't match:
    - a message ending on the retired spine-and-epics line
    - the epics-only line followed by another sentence
    - a message without the line
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) The coordinator vets the changed `seed.sh` before its first run. This is a checkpoint.
  - (4) The run command with `--case resume-later` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (5) `grep -rc 'The spine and epics steps come in a later release' evals/resume-later` prints 0 for every file. Today `graders/says-later-release.md` prints 1.

### Task 2: Turn spine-later into epics-later

- **Files:** evals/spine-later/case.yaml, evals/spine-later/prompt.md, evals/spine-later/seed.sh, evals/spine-later/graders/no-edit.md, evals/spine-later/graders/no-write.md, evals/spine-later/graders/says-later-release.md, evals/epics-later/case.yaml, evals/epics-later/prompt.md, evals/epics-later/seed.sh, evals/epics-later/graders/no-edit.md, evals/epics-later/graders/no-write.md, evals/epics-later/graders/says-later-release.md
- **Reads:** evals/spine-later/case.yaml, evals/spine-later/seed.sh, evals/resume-later/graders/says-later-release.md, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-14, D-07
- **Pins:** tests/scaffold.test.mjs
- **Action:** `spine-later` becomes the epics-later case (D-14).
  - **Rename:** `git mv evals/spine-later evals/epics-later`, so the history shows the rename.
  - **`prompt.md`:** exactly `/seldon epics`.
  - **`case.yaml`:** `name: epics-later`. The description says that `/seldon epics`, with a brief, a PRD and a spine already there, has to write and edit nothing and end on the fixed line saying the epics step comes in a later release, rather than drafting epics from the three documents. It doesn't say "scaffold".
  - **`seed.sh`:** the comment names `evals/epics-later/`. It copies the brief, the PRD and `samples/spine.md`, which is exactly when drafting epics is tempting.
  - **`says-later-release.md`:** the same pattern as Task 1's.
  - **Unchanged:** `no-write.md` and `no-edit.md`.
- **Verify:**
  - **Testing scope:** the outcome is the epics-only line on `/seldon epics`. The grader's D-21 checks, which are Task 1's patterns again, plus one passing run are enough, and testing stops there.
  - (1) `test ! -e evals/spine-later` succeeds, and `grep -rn 'The spine and epics steps come in a later release' evals/` prints nothing. Today it prints two lines.
  - (2) `cmp evals/resume-later/graders/says-later-release.md evals/epics-later/graders/says-later-release.md` exits 0, so Task 1's D-21 checks cover this grader too.
  - (3) `node --test tests/scaffold.test.mjs` passes.
  - (4) The coordinator vets the changed `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case epics-later` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

## Notes

- **D-14's Bash grader:** design-folder's `no-bash-but-check` is the only grader of its kind, and no case reuses it. This phase's spine cases rely on the run's Bash audit instead. design-folder's own run stops at the recommendation and never reaches a check, so its grader stays as it is. D-14's `--spine` allowance therefore has no case to apply to.
- **README:** the case list's spine-later and resume-later lines change in Plan 7, which edits the README once, after every case exists.
