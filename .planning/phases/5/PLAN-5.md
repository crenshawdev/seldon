---
phase: 5
plan: 5
depends_on: [1, 2, 3, 4]
requirements:
  - EPIC-02
files:
  - skills/seldon/SKILL.md
  - samples/epics-split/brief.md
  - samples/epics-split/prd.md
  - samples/epics-split/spine.md
  - evals/epics-split/case.yaml
  - evals/epics-split/prompt.md
  - evals/epics-split/seed.sh
  - evals/epics-split/graders/writes-epics.md
  - evals/epics-split/graders/splits-category.md
  - evals/epics-split/graders/no-mixed-epic.md
  - evals/epics-split/graders/at-most-five-ids.md
  - evals/epics-split/graders/at-most-five-done-when.md
  - evals/epics-split/graders/both-halves-cite-boundary.md
  - samples/epics-no-boundary/spine.md
  - evals/epics-no-boundary/case.yaml
  - evals/epics-no-boundary/prompt.md
  - evals/epics-no-boundary/seed.sh
  - evals/epics-no-boundary/graders/no-write.md
  - evals/epics-no-boundary/graders/no-edit.md
  - evals/epics-no-boundary/graders/names-spine-command.md
  - evals/epics-no-boundary/graders/names-capability.md
---

# Phase 5: Epics and the full walk - Plan 5: The epics split cases

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan proves the epics step's split along a boundary, and its stop when no boundary cuts an oversized capability.

## Must be true when done

- The epics-split case scores 1.00. One PRD category of 8 requirements, and a boundary decision that a first-five split and a split into halves would each cross, come out as at least two epics. None has more than 5 requirement IDs or 5 done-when items, none mixes the two sides, and every epic for the category cites the boundary's S- ID.
- The epics-no-boundary case scores 1.00. With no boundary cutting an oversized category, `/seldon epics` writes and edits nothing, names the category and names `/seldon spine`.
- `node --test tests/scaffold.test.mjs` passes with every new `seed.sh` scanned.

## Context

- **Locked:** D-04, D-07, D-08, D-12 and D-21. From Plan 1: the `--epics` token and pass line and the integrated item. From Plans 2 and 3: the epics step, its draft and check, and the `/seldon epics` route.
- **Fixed words:** every line a grader matches is copied from SKILL.md, never from a plan.
- **Eval runs:** phase 4 recorded the owner's approval of eval runs per phase, as a security item. The first run in this phase is a checkpoint unless the coordinator confirms that approval for phase 5.
  - Run from `/code/seldon`, the main tree, never a worktree.
  - Run one case at a time with `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants and nothing broader.
  - `--keep-temp` is for the Bash audit only and goes in no committed file.
  - **This plan runs two cases: `epics-split` and `epics-no-boundary`.**
- **Seed vetting:** a new or changed `seed.sh` holds nothing but these lines:
  - the shebang, `set -euo pipefail`, the repo line and comments
  - `mkdir -p .planning/seldon`
  - `cp` lines from `"$repo/samples/..."`

  The coordinator vets each one before its first run. The task stops at a checkpoint quoting the file, and runs the case only once the coordinator clears it.
- **The Bash audit:** after every run, read each kept `/tmp/claude-eval-*/out/trace.jsonl` and report every Bash command in it.
  - Only four commands are allowed: `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine` or `--epics`, then `.planning/seldon`.
  - Any other command is a checkpoint: stop.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:**
  - `allowed_tools` is `[Skill, Read, Glob, Grep]` and nothing else.
  - No line of a `case.yaml` or `prompt.md` may say "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none may hold a double-quoted backslash. `tests/scaffold.test.mjs` flags both.
  - Every new grader must fail when the behavior it claims is missing (phase 3 D-21). Each case task says how that's checked, with a `node -e` script that reads each pattern from its grader file. Hand-made test inputs live in the scratch area and are never committed.
- **SKILL.md in the lease:** it's declared so a run that fails on the skill's text can be fixed inside this plan, as phase 4 Plan 3 did. No task edits it unless a run fails because of it.
- **Owner's words:** committed files never carry the owner's own words. Fixtures use coined projects and invented user words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add the epics-split case and its fixture

- **Files:** samples/epics-split/brief.md, samples/epics-split/prd.md, samples/epics-split/spine.md, evals/epics-split/case.yaml, evals/epics-split/prompt.md, evals/epics-split/seed.sh, evals/epics-split/graders/writes-epics.md, evals/epics-split/graders/splits-category.md, evals/epics-split/graders/no-mixed-epic.md, evals/epics-split/graders/at-most-five-ids.md, evals/epics-split/graders/at-most-five-done-when.md, evals/epics-split/graders/both-halves-cite-boundary.md
- **Reads:** samples/spine-from-prd/brief.md, samples/spine-from-prd/prd.md, samples/spine.md, evals/spine-from-prd/seed.sh, skills/seldon/SKILL.md#18. The epics step
- **Decisions:** D-21, D-07, D-04, D-01
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC3's split case (D-21). A brief, a PRD and a spine are seeded, and the prompt is `/seldon epics`.
  - **The fixture, a coined project, in `samples/epics-split/`:**
    - **`brief.md`:** passes `--brief`, and every item carries a quote or a tag, as in `samples/brief.md`.
    - **`prd.md`:** passes `--prd` and follows the PRD rules.
      - Requirements holds exactly one `### ` category with exactly 8 requirements, all with one ID prefix, so the IDs don't show the sides.
      - In PRD order, the first three sit on one side of the boundary and the last five on the other. A split by count (the first five, then the rest) and a split into halves (the first four, then the last four) each cross it, so only a split that reads the boundary gets the sides right.
      - Non-functional requirements holds exactly one NFR, which plainly constrains the three-requirement side. That side plus its NFR is 4 IDs and the other side is 5, so each stays at 5 or fewer (D-04).
      - MVP scope names the first three.
    - **`spine.md`:** passes `--spine`, and every decision is quoted or tagged.
      - Exactly one decision is `Kind: boundaries`. Its text names the two parts so plainly that a reader can place each of the eight requirements on one side from that text alone.
      - Further decisions of kind `design approach`, `stack` and `hosting`. No other `Kind: boundaries` decision.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy the three files to `.planning/seldon/`, and nothing else.
  - **`prompt.md`:** exactly `/seldon epics`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description doesn't say "scaffold".
  - **Graders** (each on the file `.planning/seldon/epics.md`, the IDs pinned to the fixture per D-12):
    - **`writes-epics.md`:** `file_exists`.
    - **`splits-category.md`:** `regex`. Two different `**Requirements:**` lines, one naming an ID from the first three and another naming an ID from the last five, in either order.
    - **`no-mixed-epic.md`:** `not_contains`, `flags: m`. It matches a `**Requirements:**` line naming an ID from each side.
    - **`at-most-five-ids.md`:** `not_contains`, `flags: m`. It matches a `**Requirements:**` line with six or more comma-separated items.
    - **`at-most-five-done-when.md`:** `not_contains`, `flags: m`. It matches a `**Done when:**` field holding six or more lines that start `- `, before the next bold label or `## `.
    - **`both-halves-cite-boundary.md`:** `not_contains`, `flags: m`. It matches any epic section whose `**Requirements:**` line names one of the eight IDs and whose `**Spine decisions:**` line lacks the boundary's S- ID.
- **Verify:**
  - **Testing scope:** the outcome is AC3's split half, which nothing covers today. Six graders, their phase 3 D-21 checks and one passing run are enough, and testing stops there.
  - (1) The fixture is valid:
    - `node lib/check.mjs --brief samples/epics-split`, `--prd` and `--spine` each exit 0.
    - A `node -e` script confirms the PRD has one `### ` category of exactly 8 requirements and exactly one NFR.
    - `grep -c '^Kind: boundaries$' samples/epics-split/spine.md` prints 1.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) Phase 3 D-21, checked with a `node -e` script over hand-made epics files:
    - **A correct split** (the first three and the NFR in one epic, the last five in another, both citing the boundary, each done-when holding 2 to 5 items) passes all six graders and passes `--epics`.
    - **A count-only split** (the first five, then the last three) matches `no-mixed-epic`, which fails it.
    - **A split into halves** (the first four, then the last four) matches `no-mixed-epic`, which fails it.
    - **One epic with all eight** fails `splits-category` and matches `at-most-five-ids`.
    - **An epic with six done-when bullets** matches `at-most-five-done-when`. An epic with five doesn't.
    - **A correct split with the S- ID removed from one half** matches `both-halves-cite-boundary`.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case epics-split` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. Before the kept folder is removed, `node lib/check.mjs --epics <kept workspace>/.planning/seldon` exits 0.

### Task 2: Add the epics-no-boundary case and its fixture

- **Files:** samples/epics-no-boundary/spine.md, evals/epics-no-boundary/case.yaml, evals/epics-no-boundary/prompt.md, evals/epics-no-boundary/seed.sh, evals/epics-no-boundary/graders/no-write.md, evals/epics-no-boundary/graders/no-edit.md, evals/epics-no-boundary/graders/names-spine-command.md, evals/epics-no-boundary/graders/names-capability.md
- **Reads:** samples/epics-split/spine.md, samples/epics-split/prd.md, evals/spine-job/graders/no-write.md, evals/spine-job/graders/no-edit.md, skills/seldon/SKILL.md#18. The epics step
- **Decisions:** D-08, D-21, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC3's second half (D-08). The same brief and PRD as Task 1, with a spine that has no boundary cutting the 8-requirement category. The prompt is `/seldon epics`.
  - **`samples/epics-no-boundary/spine.md`:** every decision of `samples/epics-split/spine.md` but its `Kind: boundaries` one, numbered from S-01 with none skipped. Each kept decision's `Kind:` line, text and quote or tag lines are unchanged. It holds no `Kind: boundaries` line at all and passes `--spine`. Only the spine differs, so the case holds everything else equal to the split case, which is why the brief and PRD aren't copied (my choice).
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy `samples/epics-split/brief.md` and `samples/epics-split/prd.md`, and `samples/epics-no-boundary/spine.md`, to `.planning/seldon/`, and nothing else.
  - **`prompt.md`:** exactly `/seldon epics`.
  - **`case.yaml`:** as Task 1's, with its own name and description.
  - **Graders:**
    - **`no-write.md` and `no-edit.md`:** `tool_used` on Write and on Edit, each with `min: 0` and `max: 0`, as spine-job's are.
    - **`names-spine-command.md`:** `regex` on `last_message`, matching `/seldon spine` as a whole command.
    - **`names-capability.md`:** `regex` on `last_message`, case-insensitive, matching the 8-requirement category's name as `samples/epics-split/prd.md` spells it.
- **Verify:**
  - **Testing scope:** the outcome is AC3's no-boundary half, which nothing covers today. Four graders, their phase 3 D-21 checks and one passing run are enough, and testing stops there.
  - (1) `node lib/check.mjs --spine samples/epics-no-boundary` exits 0, and `grep -c '^Kind: boundaries$' samples/epics-no-boundary/spine.md` prints 0. A `node -e` script confirms each decision's body equals a decision body in `samples/epics-split/spine.md`.
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) Phase 3 D-21, with a `node -e` script:
    - `names-spine-command` matches a message that points to `/seldon spine`, and doesn't match one naming only `/seldon epics` or `/seldon prd`.
    - `names-capability` matches a message naming the category, and doesn't match one that doesn't.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case epics-no-boundary` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. The kept workspace has no `.planning/seldon/epics.md`.

## Notes

- **The split from Plan 4:** Plans 4 and 5 were one plan, whose brief passed the 32 KB ceiling. This plan holds the split and no-boundary pair, which share a fixture: Task 2 seeds Task 1's brief and PRD and derives its spine from Task 1's. Plan 4 holds the epics-from-spine and epics-rerun cases.
- **Why the split fixture is 3 and 5:** with 4 and 4, a split into halves would score the same as a split along the boundary. With 3 and 5, a split by count (the first five) and a split into halves (the first four) each hold a requirement from the second side, so `no-mixed-epic` fails both. The NFR on the three side keeps each side at 5 or fewer, so a correct split never runs into D-08.
- **D-04's grader:** Plan 4's `every-requirement-once` proves it on the Toolshed case. Here `no-mixed-epic` and `splits-category` cover the split's share of it.
