---
phase: 4
plan: 3
depends_on: [1, 2]
requirements:
  - ARCH-01
files:
  - skills/seldon/SKILL.md
  - samples/spine-from-prd/brief.md
  - samples/spine-from-prd/prd.md
  - evals/spine-from-prd/case.yaml
  - evals/spine-from-prd/prompt.md
  - evals/spine-from-prd/seed.sh
  - evals/spine-from-prd/graders/names-prd-first.md
  - evals/spine-from-prd/graders/writes-spine.md
  - evals/spine-from-prd/graders/runs-check.md
  - evals/spine-from-prd/graders/check-passes.md
  - evals/spine-from-prd/graders/every-decision-has-kind.md
  - evals/spine-from-prd/graders/every-decision-quoted-or-tagged.md
  - evals/spine-from-prd/graders/no-write-but-spine.md
  - evals/spine-from-prd/graders/no-edit-but-spine.md
  - samples/spine-rerun/brief.md
  - samples/spine-rerun/prd.md
  - evals/spine-rerun/case.yaml
  - evals/spine-rerun/prompt.md
  - evals/spine-rerun/seed.sh
  - evals/spine-rerun/graders/keeps-untouched-decisions.md
  - evals/spine-rerun/graders/retires-dropped-id.md
  - evals/spine-rerun/graders/no-reused-id.md
  - samples/spine.md
---

# Phase 4: The architecture spine - Plan 3: The spine step's cases

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. This plan proves Plan 2's spine step with two cases:

- a bare `/seldon` over a brief and a PRD resumes into the spine step and writes a conforming `spine.md` (AC1), touching no other `.planning/seldon/` file (AC5's negative half)
- `/seldon spine` over an existing spine reruns it in place, keeping its IDs (AC6)

## Must be true when done

- The spine-from-prd case scores 1.00. From a brief and PRD with no unattended work and no outside input, a bare `/seldon`:
  - first says the fixed spine resume line naming `prd.md` and `/seldon prd`
  - writes `.planning/seldon/spine.md`
  - repeats `seldon check: spine.md conforms` from `--spine`
  - gives every decision an `S-NN` heading, one `Kind:` line naming one of the six kinds, and a `> ` quote or an `[ASSUMPTION]` tag
  - writes and edits no `.planning/seldon/` file but `spine.md`
- The spine-rerun case scores 1.00. `/seldon spine` over `samples/spine.md`, after the PRD dropped reminders, keeps every other decision byte-identical, lists S-03 on a `Retired:` line under the title, and never brings S-03 back.
- `node --test tests/scaffold.test.mjs` passes with both new `seed.sh` files scanned.

## Context

- **Locked:** D-01, D-03, D-04, D-05, D-06, D-07 and D-15. From Plan 1: the token `--spine`, the pass line `seldon check: spine.md conforms`, the `Kind: ` line form and the six kinds' spelling. From Plan 2: the spine step, its rerun and SKILL.md's spine resume line.
- **Fixed words:** Plan 2 fixed the sentences these graders match in SKILL.md, each on a line of its own in a fenced block. The case tasks copy each line from SKILL.md, never from a plan.
- **Eval runs:** the owner approved them per phase, as a security item.
  - Run from `/code/seldon`, the main tree, never a worktree.
  - Run one case at a time with `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants and nothing broader.
  - `--keep-temp` is for the Bash audit only and goes in no committed file.
  - **This plan runs exactly two cases: `spine-from-prd` and `spine-rerun`.**
- **Seed vetting:** a new `seed.sh` holds nothing but these lines:
  - the shebang, `set -euo pipefail`, the repo line and comments
  - `mkdir -p .planning/seldon`
  - `cp` lines from `"$repo/samples/..."`

  The coordinator vets each new `seed.sh` before its first run. The task stops at a checkpoint quoting the file, and runs the case only once the coordinator clears it.
- **The Bash audit:** after every run, read each kept `/tmp/claude-eval-*/out/trace.jsonl` and report every Bash command in it.
  - Only three commands are allowed: `node /code/seldon/lib/check.mjs` with `--brief`, `--prd` or `--spine`, then `.planning/seldon`.
  - Any other command is a checkpoint: stop.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:**
  - `allowed_tools` is `[Skill, Read, Glob, Grep]` and nothing else.
  - No line of a `case.yaml` or `prompt.md` may say "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none may hold a double-quoted backslash. `tests/scaffold.test.mjs` flags both.
  - Every new grader must fail when the behavior it claims is missing (phase 3 D-21). Each case task says how that's checked.
- **Owner's words:** committed files never carry the owner's own words. Fixtures use coined projects and invented user words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Add the spine-from-prd case and its fixture

- **Files:** samples/spine-from-prd/brief.md, samples/spine-from-prd/prd.md, evals/spine-from-prd/case.yaml, evals/spine-from-prd/prompt.md, evals/spine-from-prd/seed.sh, evals/spine-from-prd/graders/names-prd-first.md, evals/spine-from-prd/graders/writes-spine.md, evals/spine-from-prd/graders/runs-check.md, evals/spine-from-prd/graders/check-passes.md, evals/spine-from-prd/graders/every-decision-has-kind.md, evals/spine-from-prd/graders/every-decision-quoted-or-tagged.md, evals/spine-from-prd/graders/no-write-but-spine.md, evals/spine-from-prd/graders/no-edit-but-spine.md
- **Reads:** evals/resume/graders/names-brief-first.md, evals/prd-from-brief/graders/every-item-quoted-or-tagged.md, evals/prd-from-brief/graders/runs-check.md, evals/brief-rerun/graders/prd-not-written.md, evals/prd-from-brief/seed.sh, samples/prd-from-brief/brief.md
- **Decisions:** D-15, D-01, D-02, D-03, D-05, D-06, D-07
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC1's case, which also carries AC5's negative half. A confirmed brief and PRD are seeded, and the prompt is `/seldon`.
  - **The fixture pair, a coined project:**
    - **`brief.md`:** passes `--brief`, and every item carries a quote or a tag, as in `samples/brief.md`. Its user quotes name the stack and the hosting (D-15, D-06), and every section is answered.
    - **No unattended work, per D-02:** nothing happens on a schedule or with no person present. No reminders, no scheduled sends, no syncs, no imports.
    - **No outside input, per D-02:** only the operator enters data, and it's their own. No members, no public, no other service sends anything.
    - **`prd.md`:** the PRD the PRD step would build from that brief. It passes `--prd`, quotes every requirement and non-goal from the brief's `> ` lines or tags it, carries the refusals into Non-goals, and names none of the brief's technology words.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy the pair to `.planning/seldon/brief.md` and `.planning/seldon/prd.md`, and nothing else.
  - **`prompt.md`:** exactly `/seldon`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description says what the case seeds and checks, without the word "scaffold".
  - **Graders:**
    - **`names-prd-first.md`:** `regex` on `trace`, `resume`'s `names-brief-first` adapted. It finds an assistant text holding the spine resume line, exactly as SKILL.md fixes it, followed later by a Write whose `file_path` ends `.planning/seldon/spine.md`. The match is bounded so no `tool_use` sits between the look's last tool result and the resume-line text, so a Read of `brief.md` or `prd.md` before the line fails it. If one regex can't express that bound, stop at a decision checkpoint with what it can express, rather than narrowing the must-be-true on your own.
    - **`writes-spine.md`:** `file_exists` on `.planning/seldon/spine.md`.
    - **`runs-check.md`:** `tool_used` on Bash, with `input_match` `lib/check\.mjs --spine` and `min: 1`.
    - **`check-passes.md`:** `regex` on `last_message`, matching `seldon check: spine\.md conforms`.
    - **`every-decision-has-kind.md`:** `regex` on the file `.planning/seldon/spine.md`, with `match: not_contains` and `flags: m`. It matches any `## S-NN:` section whose body, up to the next `## ` or the end of the file, has no column-0 line that's `Kind: ` plus exactly one of the six kinds and nothing after it.
    - **`every-decision-quoted-or-tagged.md`:** the same target and mode. It matches any `## S-NN:` section whose body holds neither a `> ` line nor `[ASSUMPTION]`.
    - **`no-write-but-spine.md` and `no-edit-but-spine.md`:** `tool_used` on Write and on Edit, each with `max: 0`. The `input_match` matches a `file_path` under `.planning/seldon/` whose file isn't `spine.md`. This is brief-rerun's `prd-not-written` adapted (D-15).
- **Verify:**
  - **Testing scope:** the outcomes are AC1 and AC5's negative half, which nothing covers today. Eight graders, their D-21 checks and one passing run are the evidence, and testing stops there.
  - (1) The fixture is valid:
    - `node lib/check.mjs --brief samples/spine-from-prd` and `node lib/check.mjs --prd samples/spine-from-prd` each exit 0.
    - The brief's `> ` lines name a stack choice and a hosting choice.
    - A grep of `prd.md` for those words finds none.
  - (2) `node --test tests/scaffold.test.mjs` passes, with the new `seed.sh` scanned.
  - (3) D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - **`names-prd-first`:** it matches a hand-made trace with the line and then a `spine.md` Write. It doesn't match when the Write comes first, when the line is missing, when the line is the PRD's resume line, or when a Read of `brief.md` comes between the look and the line.
    - **`every-decision-has-kind`:** it matches, which fails the grader, a spine where one decision has no `Kind:` line, one where it has `Kind: storage`, and one where it has `Kind: stack [ASSUMPTION]`. It doesn't match `samples/spine.md`.
    - **`every-decision-quoted-or-tagged`:** it matches a spine where one decision has neither a quote nor a tag. It doesn't match `samples/spine.md`, or a spine whose only unquoted decision is tagged.
    - **`no-write-but-spine` and `no-edit-but-spine`:** each `input_match` matches the JSON-encoded input for `prd.md`, `brief.md` and `architecture.md` under `.planning/seldon/`, and doesn't match it for `spine.md`.
    - **`check-passes`:** it doesn't match the brief, PRD or all-four pass lines.
    - **`runs-check`:** it matches the `--spine` command's input and not the `--prd` one.
    - **`writes-spine`:** its path is `.planning/seldon/spine.md`, and `seed.sh` creates no spine, so the seed can't satisfy it.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case spine-from-prd` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (6) Before the kept folder is removed, `node lib/check.mjs --spine <kept workspace>/.planning/seldon` exits 0.

### Task 2: Add the spine-rerun case and its fixture

- **Files:** samples/spine-rerun/brief.md, samples/spine-rerun/prd.md, evals/spine-rerun/case.yaml, evals/spine-rerun/prompt.md, evals/spine-rerun/seed.sh, evals/spine-rerun/graders/keeps-untouched-decisions.md, evals/spine-rerun/graders/retires-dropped-id.md, evals/spine-rerun/graders/no-reused-id.md
- **Reads:** evals/prd-rerun/graders/keeps-unchanged-lines.md, evals/prd-rerun/graders/retires-dropped-id.md, evals/prd-rerun/graders/no-reused-id.md, evals/prd-rerun/seed.sh, samples/prd-rerun/brief.md, samples/prd.md, samples/spine.md
- **Decisions:** D-04, D-12, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC6's case. A brief, a PRD and a spine are seeded, the PRD has since dropped what one decision rests on, and the prompt is `/seldon spine`.
  - **`samples/spine-rerun/brief.md`:** a byte-identical copy of `samples/prd-rerun/brief.md`, the Toolshed brief that dropped reminders and gained a refusal to send them. Each case keeps its pair in its own folder, which is my choice, recorded here.
  - **`samples/spine-rerun/prd.md`:** what a PRD rerun makes of `samples/prd.md` over that brief:
    - LOAN-03 removed, with its quote
    - `Retired: LOAN-03` directly under `## Requirements`
    - the reminder refusal added to Non-goals with the brief's quote
    - MVP scope no longer naming LOAN-03
    - every other line byte-identical to `samples/prd.md`

    It passes `--prd`. With no reminders, S-03, the daily reminder job, no longer applies. Every other decision in `samples/spine.md` still does.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy:
    - the brief and PRD from `samples/spine-rerun/`
    - `samples/spine.md` to `.planning/seldon/spine.md`
  - **`prompt.md`:** exactly `/seldon spine`.
  - **`case.yaml`:** `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description doesn't say "scaffold".
  - **Graders:**
    - **`keeps-untouched-decisions.md`:** `regex` on the file `.planning/seldon/spine.md`, with `flags: m`. One lookahead for each decision in `samples/spine.md` except S-03 matches its heading line and every line of its body exactly as `samples/spine.md` holds them. Build the lookaheads from the file's text with regex metacharacters escaped, the way prd-rerun's `keeps-unchanged-lines` pins each requirement. Each lookahead ends by requiring that the next line is a `## ` heading, a blank line followed by one, or the end of the file, matching `samples/spine.md`'s layout, so a line appended to a kept decision's body fails it.
    - **`retires-dropped-id.md`:** `regex` on the same file. It finds a `Retired:` line holding `S-03` between the `# ` title and the first `## ` heading.
    - **`no-reused-id.md`:** `regex` on the same file, with `match: not_contains` and `flags: m`, on `^## S-03:`.
- **Verify:**
  - **Testing scope:** the outcome is AC6, which nothing covers today. Three graders, their D-21 checks and one passing run are enough, and testing stops there.
  - (1) The fixture is valid:
    - `cmp samples/prd-rerun/brief.md samples/spine-rerun/brief.md` exits 0.
    - `node lib/check.mjs --prd samples/spine-rerun` exits 0.
    - `diff samples/prd.md samples/spine-rerun/prd.md` shows only the LOAN-03, `Retired:`, Non-goals and MVP scope changes.
    - Every `> ` line in each kept decision of `samples/spine.md`, with its `> ` stripped, is a substring of a `> ` line in `samples/spine-rerun/brief.md`, so no kept decision quotes words the rerun brief dropped (D-03).
  - (2) `node --test tests/scaffold.test.mjs` passes.
  - (3) D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - **`keeps-untouched-decisions`:** it matches `samples/spine.md` itself. It doesn't match when any one kept decision's line changes by one character, its `Kind:` line or its tag included, when a line is appended to the end of a kept decision's body, or when a kept decision is removed.
    - **`retires-dropped-id`:** it matches a spine with `Retired: S-03` under the title. It doesn't match when that line sits after the first decision, or when it names a different ID.
    - **`no-reused-id`:** it matches, which fails the grader, `samples/spine.md`, which still has S-03, and a spine that gives a new decision `## S-03:`. It doesn't match a spine with no S-03 heading.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case spine-rerun` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.
  - (6) Before the kept folder is removed, `node lib/check.mjs --spine <kept workspace>/.planning/seldon` exits 0.

## Notes

- **After Plan 2:** these two cases were Plan 2's last two tasks until its brief passed the size ceiling. Both need the whole spine step, the resume line and the rerun route included, so this plan follows Plan 2 through `depends_on`.
- **SKILL.md in the lease:** it's declared so a run that fails on the skill's text can be fixed inside this plan, as phase 3's case plans did. No task here edits it unless a run fails because of it.
