---
phase: 7
plan: 5
depends_on: [2, 3, 4]
requirements:
  - CHECK-04
files:
  - skills/seldon/SKILL.md
  - evals/full-walk/graders/names-spine-first.md
  - evals/spine-from-prd/graders/names-prd-first.md
  - evals/resume/graders/stamps-brief-hash.md
  - evals/spine-answers/graders/stamps-prd-hash.md
  - evals/epics-from-spine/graders/stamps-spine-hash.md
  - evals/stale-spine/case.yaml
  - evals/stale-spine/prompt.md
  - evals/stale-spine/seed.sh
  - evals/stale-spine/history.jsonl
  - evals/stale-spine/graders/says-stale-line.md
  - evals/stale-spine/graders/retires-dropped-id.md
  - evals/stale-spine/graders/stamps-prd-hash.md
  - evals/stale-spine/graders/check-passes.md
  - evals/stale-spine/graders/ends-on-confirm.md
  - evals/stale-spine/graders/no-write-epics.md
  - evals/stale-spine/graders/no-edit-epics.md
  - evals/stale-epics/case.yaml
  - evals/stale-epics/prompt.md
  - evals/stale-epics/seed.sh
  - evals/stale-epics/history.jsonl
  - evals/stale-epics/graders/says-stale-line.md
  - evals/stale-epics/graders/stamps-spine-hash.md
  - evals/stale-epics/graders/check-passes.md
  - evals/stale-epics/graders/no-read-outside.md
---

# Phase 7: PRD changes flow downstream - Plan 5: The stamp and stale cases

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan proves three things live:

- the stamps each step writes
- the resume routes, with the stale check now running in front of them
- the spine and epics rewalk after a PRD change: success criterion 2 and AC4, in D-13's two replays

## Must be true when done

- `full-walk` and `spine-from-prd` score 1.00. Their resume graders now allow the stale check's one Bash call before the resume line, and still fail when the line is missing, or when a document Read or any other Bash call comes first.
- `resume`, `spine-answers` and `epics-from-spine` each score 1.00 with a new grader. Each new grader proves that the document the step created carries, on the line after its title, the stamp of the parent it was seeded with (D-02).
- `stale-spine` scores 1.00. After a replayed conversation that applied a PRD change and ended on the `/clear` words, a bare `/seldon`:
  - says the spine stale line
  - retires S-03
  - records the PRD's hash
  - repeats the spine check's pass line and ends on the spine confirm question
  - never writes or edits `epics.md` (AC4)
- `stale-epics` scores 1.00. After the `/clear` words, a bare `/seldon`:
  - says the epics stale line
  - records the spine's hash in `epics.md`
  - repeats the epics check's pass line
  - Reads nothing outside `.planning/seldon/` (AC4, D-13)
- `resume-later` and `which-design-answer` still score 1.00 with the stale check in front of their routes, and every Bash command in every kept trace passed the audit.

## Context

- **Locked:** D-02, D-03, D-05, D-12, D-13 and D-16. From Plans 2 to 4: `--stale`, the stamped samples, the stale routes and their fixed lines, and "Stamps and stale links".
- **Fixed words:** every line a grader or a history matches is copied from SKILL.md, never from a plan.
- **Hashes:** every hash a grader pins is copied from a `stamp for <file>:` line of `node lib/check.mjs --stale`, run over a scratch folder seeded exactly as the case seeds it. Never work one out by hand.
- **The trace-shape assumption:** CONTEXT flags as Likely that a Bash call shows in a trace as one JSON line, shaped like the Glob and Read lines the resume graders match. No kept trace survives from earlier phases, so Task 1 settles it from its own kept trace.
- **Eval runs (SECURITY):** these run on the approval Plan 1 recorded. If Plan 1's report records none, stop at a checkpoint marked SECURITY before the first run. Anything off these terms is a checkpoint marked SECURITY.
  - **The command:** run from `/code/seldon`, never a worktree, one case at a time: `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last.
  - **Bash audit:** after every run, report every Bash command in the kept `out/trace.jsonl`, with its permission record. Allowed: the commands in Plan 1's approved terms, which are `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine`, `--epics` or `--stale` on `.planning/seldon` or `.planning/seldon/sowlist`, plus whatever read-only listing the owner approved. Anything else is a SECURITY checkpoint.
  - **Retries and cleanup:** at most three tries per case, and a retry comes only after a fix or after variance the trace shows. Remove only the folders a run printed as kept, by their exact paths.
  - **Where things are:** a kept run's workspace is `<kept>/sealed/home/cwd/`.
- **Seed vetting:** a new `seed.sh` holds only these lines:
  - the shebang, `set -euo pipefail`, the repo line and comments
  - `mkdir -p .planning/seldon`
  - `cp` lines from `"$repo/samples/..."`

  The coordinator vets each new seed before its first run, so the task stops at a checkpoint quoting the file.
- **Case rules:**
  - `allowed_tools` is `[Skill, Read, Glob, Grep]`.
  - No line of a `case.yaml` or `prompt.md` says "scaffold", in any letter case, except the plain `scaffold_script: seed.sh`, and none holds a double-quoted backslash.
  - A history is text-only user and assistant lines with chained `parentUuid`, a fresh `sessionId` and `cwd` set to `/tmp/seldon-<case>`, like `evals/epics-confirm/history.jsonl`. Its user words are invented, never the owner's.
  - Every new or changed grader must fail when the behavior it claims is missing (phase 3 D-21). Check that with a `node -e` script that reads each pattern from its grader file, over hand-made inputs kept in the scratch area and never committed.
- **SKILL.md in the lease:** it's declared so a run that fails on the skill's text can be fixed inside this plan. No task edits it otherwise. If any task does edit it:
  - rerun every case this plan has already passed
  - keep SKILL.md at or under 90,000 bytes
  - run `node --test tests/*.test.mjs`
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Widen the two resume graders for the stale check

- **Files:** evals/full-walk/graders/names-spine-first.md, evals/spine-from-prd/graders/names-prd-first.md
- **Reads:** evals/full-walk/graders/names-spine-first.md, evals/spine-from-prd/graders/names-prd-first.md, evals/resume/graders/names-brief-first.md
- **Decisions:** D-12
- **Action:**
  - **The widening (D-12):** both patterns have a group listing the tool-call lines allowed before the resume line: Glob, Skill and one Read. Add one more kind of line to that group: a tool_use line naming Bash whose command runs `lib/check.mjs --stale`. Widen nothing else: no other check mode and no other Bash command. Keep the rest of each pattern byte-identical.
  - **The regression runs:** run `full-walk`, `spine-from-prd`, `resume-later` and `which-design-answer`. These are the resume routes the stale check now runs in front of, and the last one runs it on `.planning/seldon/sowlist`.
- **Verify:**
  - **Testing scope:** the outcome is D-12's widening and the resume routes still working behind the stale check. Two D-21-checked patterns and four runs are the evidence, and the stale routes themselves are Tasks 3 and 4's. Testing stops there.
  - (1) **Trace shape:** in `full-walk`'s kept `out/trace.jsonl`, the stale check's call is one line holding `"type":"tool_use"`, `"name":"Bash"` and the `--stale` command, in the shape the widened alternative matches. If it isn't, rewrite both widenings to the shape the trace shows and redo (2). This settles CONTEXT's flagged assumption.
  - (2) **D-21,** with hand-made trace lines modeled on that kept trace:
    - each widened pattern matches Glob, the Bash `--stale` call, their results, the resume line and then the Write
    - it doesn't match the same input with the Bash command changed to `--spine` or to `ls`
    - it doesn't match when a Read of the PRD (`spine-from-prd`) or of the spine (`full-walk`) comes before the line
    - it doesn't match with no line at all
    - the unwidened pattern from `git show HEAD:<file>` doesn't match the first input, which shows the widening is needed
  - (3) `full-walk`, `spine-from-prd`, `resume-later` and `which-design-answer` each exit 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported, `--stale .planning/seldon/sowlist` included.

### Task 2: Prove each step stamps the document it creates

- **Files:** evals/resume/graders/stamps-brief-hash.md, evals/spine-answers/graders/stamps-prd-hash.md, evals/epics-from-spine/graders/stamps-spine-hash.md
- **Reads:** evals/resume/seed.sh, evals/spine-answers/seed.sh, evals/epics-from-spine/seed.sh, evals/spine-rerun/graders/retires-dropped-id.md
- **Decisions:** D-02, D-03
- **Action:** Add one regex grader per case, on the file the case writes (`target: source: file`). Each grader requires the file's first line to be its `# ` title and its second line to be exactly the stamp `--stale` prints for that file, over a scratch folder seeded as the case seeds it:
  - `resume`: `prd.md` from `samples/brief.md`
  - `spine-answers`: `spine.md` from `samples/spine-job/prd.md`
  - `epics-from-spine`: `epics.md` from `samples/spine.md`

  The three cases cover the three ways into a create: a bare resume reusing the stale check's output, an answers route that runs the command in the turn it writes, and a named step that runs it only for its stamp.
- **Verify:**
  - **Testing scope:** the outcome is D-02's create half, which no AC names and no grader covers. A create that forgets the stamp leaves a document reading fresh forever, which is exactly the alternative D-02 rejected. One grader per step is the smallest check, and testing stops there.
  - (1) **D-21:**
    - each grader matches a hand-made file with the title and its stamp on line 2. `samples/prd.md` and `samples/epics.md` serve as two of them.
    - it doesn't match the same file with no stamp, with one hash digit changed, with the parent named wrongly, or with a blank line between the title and the stamp
  - (2) `resume`, `spine-answers` and `epics-from-spine` each exit 0 at 1.00, and the Bash audit is reported.

### Task 3: Add the stale-spine case

- **Files:** evals/stale-spine/case.yaml, evals/stale-spine/prompt.md, evals/stale-spine/seed.sh, evals/stale-spine/history.jsonl, evals/stale-spine/graders/says-stale-line.md, evals/stale-spine/graders/retires-dropped-id.md, evals/stale-spine/graders/stamps-prd-hash.md, evals/stale-spine/graders/check-passes.md, evals/stale-spine/graders/ends-on-confirm.md, evals/stale-spine/graders/no-write-epics.md, evals/stale-spine/graders/no-edit-epics.md
- **Reads:** evals/full-walk/case.yaml, evals/epics-confirm/history.jsonl, evals/resume/graders/names-brief-first.md, evals/spine-rerun/graders/retires-dropped-id.md, evals/full-walk/graders/no-write-but-epics.md, skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#17. The spine check
- **Decisions:** D-05, D-13, D-02, D-16
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC4's first replay (D-13): the next bare `/seldon` after an applied PRD change.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then `cp` from `samples/spine-rerun/brief.md`, `samples/spine-rerun/prd.md`, `samples/spine.md` and `samples/epics.md` into their bare names.
  - **`history.jsonl`:** four lines telling the change.
    - The user runs `/seldon prd`.
    - Seldon names `.planning/seldon/prd.md` as brought in line with the brief, with LOAN-03 retired, repeats `seldon check: prd.md conforms`, and asks whether the user confirms the PRD.
    - The user answers `/seldon Yes, that's right.`
    - Seldon ends on the `/clear` words.
  - **`prompt.md`:** `/seldon`.
  - **`case.yaml`:** `name: stale-spine`, `history_file: history.jsonl`, `scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description says what's seeded and what's checked.
  - **Graders:**
    - **`says-stale-line`:** on the trace, an assistant text holding the spine stale line and then an Edit whose `file_path` is `.planning/seldon/spine.md`, in `names-brief-first`'s form with `'` matched as `.`.
    - **`retires-dropped-id`:** `spine-rerun`'s pattern, which requires S-03 on a `Retired:` line between the title and the first decision.
    - **`stamps-prd-hash`:** `spine.md`'s line 2 is exactly the `stamp for spine.md:` line over this seed.
    - **`check-passes`:** `last_message` matches `seldon check: spine\.md conforms`.
    - **`ends-on-confirm`:** the last line of `last_message` is a question holding `confirm` and `/seldon architecture`, the spine confirm question's mark.
    - **`no-write-epics` and `no-edit-epics`:** `tool_used` on Write and on Edit, with `input_match` on a `file_path` ending `.planning/seldon/epics.md`, `max: 0`.
- **Verify:**
  - **Testing scope:** the outcome is AC4's first half, which no case covers. Seven D-21-checked graders, one passing run and the chain check in (5) are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and each `history.jsonl` line parses with `parentUuid` chained.
  - (2) **D-21:**
    - `says-stale-line` fails without the line, and when an Edit of `spine.md` comes before it
    - `stamps-prd-hash` fails on `samples/spine.md` itself, which carries the old PRD's hash
    - `retires-dropped-id` fails on `samples/spine.md`
    - `ends-on-confirm` fails on a message whose last line isn't a question, and on the PRD confirm question
    - the epics graders match a Write or Edit to `.planning/seldon/epics.md`, relative or absolute, and not one to `spine.md`
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run exits 0 at 1.00, with no `not granted` and no `scaffold failed`, and the Bash audit is reported.
  - (5) Before the kept folder is removed, `node lib/check.mjs --stale <kept workspace>/.planning/seldon` prints `stale: epics.md was built from an earlier spine.md` and no other stale line, which shows the change carried down the chain. `--spine` on that folder exits 0.

### Task 4: Add the stale-epics case

- **Files:** evals/stale-epics/case.yaml, evals/stale-epics/prompt.md, evals/stale-epics/seed.sh, evals/stale-epics/history.jsonl, evals/stale-epics/graders/says-stale-line.md, evals/stale-epics/graders/stamps-spine-hash.md, evals/stale-epics/graders/check-passes.md, evals/stale-epics/graders/no-read-outside.md
- **Reads:** evals/epics-rerun/seed.sh, evals/stale-spine/history.jsonl, evals/stale-spine/graders/says-stale-line.md, evals/cadence-project/graders/no-write-outside.md, skills/seldon/SKILL.md#19. The epics draft
- **Decisions:** D-05, D-13, D-02
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC4's second replay (D-13): the next bare `/seldon` after the spine was rewalked and confirmed.
  - **`seed.sh`:** the same four `cp` lines as `evals/epics-rerun/seed.sh`.
  - **`history.jsonl`:** four lines.
    - The user runs `/seldon`.
    - Seldon says the spine stale line, names `.planning/seldon/spine.md` as updated with S-03 retired, repeats `seldon check: spine.md conforms`, and ends on the spine confirm question.
    - The user answers `/seldon Yes, that's right.`
    - Seldon ends on the `/clear` words.
  - **`prompt.md`:** `/seldon`.
  - **`case.yaml`:** `name: stale-epics`, with the history, the seed, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools.
  - **Graders:**
    - **`says-stale-line`:** the epics stale line, then an Edit of `.planning/seldon/epics.md`, in Task 3's form.
    - **`stamps-spine-hash`:** `epics.md`'s line 2 is exactly the `stamp for epics.md:` line over this seed.
    - **`check-passes`:** `seldon check: epics\.md conforms` in `last_message`.
    - **`no-read-outside`:** `tool_used` on Read, `max: 0`, with an `input_match` that matches a `file_path` outside `.planning/seldon/`, a path climbing out with `..` included. This is D-13's "never Cadence's roadmap".
- **Verify:**
  - **Testing scope:** the outcome is AC4's second half, which no case covers. Four D-21-checked graders, one passing run and the chain check in (5) are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and the history parses with `parentUuid` chained.
  - (2) **D-21:**
    - `says-stale-line` fails on a trace holding only the spine stale line
    - `stamps-spine-hash` fails on `samples/epics.md`
    - `no-read-outside` matches a Read of `.planning/ROADMAP.md`, of `/abs/.planning/ROADMAP.md`, of `src/server.mjs` and of `.planning/seldon/../ROADMAP.md`, and not one of `.planning/seldon/epics.md`, relative or absolute
  - (3) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and the Bash audit is reported.
  - (5) Before the kept folder is removed, `node lib/check.mjs --stale <kept workspace>/.planning/seldon` exits 0 with `seldon check: no stale link`, so the whole chain reads fresh after the rewalk. `--epics` on that folder exits 0.
