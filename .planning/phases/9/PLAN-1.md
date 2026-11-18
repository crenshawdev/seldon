---
phase: 9
plan: 1
requirements:
  - EVAL-02
files:
  - tests/graders.test.mjs
  - evals/full-walk/graders/at-most-five-ids.md
  - evals/epics-from-spine/graders/at-most-five-ids.md
  - evals/full-walk/graders/every-requirement-traced.md
  - evals/epics-split/graders/every-requirement-traced.md
  - evals/resume-later/graders/says-no-findings.md
  - evals/handoff-cadence/graders/says-no-findings.md
  - evals/handoff-named/graders/says-no-findings.md
  - evals/readiness-agent/graders/says-no-findings.md
  - evals/resume-later/graders/agent-finds-nothing.md
  - evals/handoff-cadence/graders/agent-finds-nothing.md
  - evals/handoff-named/graders/agent-finds-nothing.md
  - evals/readiness-agent/graders/agent-finds-nothing.md
  - evals/fast-path/graders/recommends-fast-path.md
  - evals/cadence-dump/graders/recommends-fast-path.md
  - evals/asks-for-dump/graders/recommends-a-path.md
---

# Phase 9: The full graders - Plan 1: The graders and their unit tests

## Goal

The full graders check every run that writes what they grade, and a unit test proves the README's suite command covers every case, with nothing for a person to check by hand. This plan builds the graders and proves each one fails when it should.

## Must be true when done

- full-walk, epics-from-spine and epics-split each hold a size grader that fails an epic carrying 6 requirement IDs, and a trace grader that fails when any one of the case's seeded PRD IDs is on no `**Requirements:**` line or on two.
- resume-later, handoff-cadence, handoff-named and readiness-agent each hold both halves of readiness-passes. The agent-result half fails a trace whose Agent result reports a finding, even when the skill's last message says the no-findings line. The last-message half fails a last message holding any of the three finding labels.
- The recommendation graders in fast-path, cadence-dump and asks-for-dump fail a bold, a mid-sentence and a split recommendation, and pass the plain line.
- `node --test tests/graders.test.mjs` passes. It also fails when a full grader's pattern uses a form outside D-09, when two copies of the size grader or of either readiness-passes half differ by one byte, or when a full grader sits in a case folder D-14 doesn't name.
- The unit suite passes under the coverage gate.

## Context

- **Locked:** D-01 (byte copies per case), D-02 (graders grade what the graded turn wrote), D-05 (regex only here), D-06 (trace grader form), D-07 (two halves), D-08 (committed proof), D-09 (regex forms), D-14 (the seven cases), D-18 (anchoring). D-15 needs no task: the existing `writes-epics.md` and `writes-prd.md` graders already fail a missing document.
- **Full graders**, as AC1 and AC2 use the term, and as this plan's test table lists them: the size grader (`at-most-five-ids.md`), the trace grader (`every-requirement-traced.md`, and `every-requirement-once.md` in epics-from-spine), the last-message half (`says-no-findings.md`), the agent-result half (`agent-finds-nothing.md`) and the three anchored recommendation graders. The planner picked the two new file names.
- **Pattern to follow:** `tests/scaffold.test.mjs`. It has zero dependencies and uses node:test. A form it can't read fails rather than being skipped. Each checker is proven on planted inputs as well as on the repo.
- **Out:** `lib/check.mjs`, SKILL.md's five commands and `allowed-tools`, the README, every case.yaml, and stale-spine's grader (Plan 3).

## Tasks

### Task 1: Put the size grader in every case that writes epics, held equal by test

- **Files:** evals/full-walk/graders/at-most-five-ids.md, evals/epics-from-spine/graders/at-most-five-ids.md, tests/graders.test.mjs
- **Reads:** evals/epics-split/graders/at-most-five-ids.md#pattern, tests/scaffold.test.mjs#scaffoldNames, evals/full-walk/seed.sh, evals/epics-from-spine/seed.sh
- **Decisions:** D-01, D-02, D-05, D-08, D-14
- **Action:** full-walk and epics-from-spine each gain `graders/at-most-five-ids.md`, a byte copy of `evals/epics-split/graders/at-most-five-ids.md`. Use no shared folder and no symlink (D-01). The size grader is its `match: not_contains` pattern over `.planning/seldon/epics.md`. Neither case seeds an epics file, so the grader grades what the graded turn wrote (D-02). Create `tests/graders.test.mjs` in scaffold.test.mjs's style: node:test and node:assert/strict, no dependencies, and the repo root found from `import.meta.url`. It holds:
  - one table of the full graders, file by file with each file's case, starting with the size grader's three copies. Later tasks add to it. A file the table names but the tree lacks fails as missing.
  - a frontmatter reader that reads `type`, `pattern`, `flags` and `match` the way YAML does. `pattern` is accepted only as a single-quoted value on its key's line, with `''` read as one `'`. `flags` and `match` are plain values. Any other form fails the test and names the file: a double-quoted or block pattern, no pattern, or a `type` other than `regex`. The `regex`-only rule also holds D-05 for every full grader.
  - a way to run a grader on a text the way its frontmatter says: the pattern is compiled with its flags, and a match passes under `contains` (the default) and fails under `not_contains`.
  - the size check: each copy fails an epics text where one epic's `**Requirements:**` line holds 6 IDs, and passes the same text with 5.
  - the equal-copy check: the three copies' bytes are equal. The comparison is also run on an in-memory pair one byte apart and must flag it, so the check can't pass by comparing a file to itself.
- **Verify:** `cmp evals/epics-split/graders/at-most-five-ids.md evals/full-walk/graders/at-most-five-ids.md` and the same `cmp` for epics-from-spine exit 0. Neither file exists before this task. `node --test tests/graders.test.mjs` passes and its output shows the 6-ID failure, the 5-ID pass and the planted one-byte pair flagged. Add one byte to `evals/full-walk/graders/at-most-five-ids.md` and the test fails, then revert and it passes. `node --test tests/*.test.mjs` passes. Testing scope: the outcomes are that the size grader fails at 6 IDs and passes at 5, and that its copies stay equal. Nothing covers them today: scaffold.test.mjs checks only `tool_used` bounds and case.yaml keys. The two size inputs, the equal-copy assertion and its one-byte self-check are enough, and testing stops there with no sweep over other counts.

### Task 2: Fail any full grader whose pattern uses a form outside D-09

- **Files:** tests/graders.test.mjs
- **Reads:** evals/epics-from-spine/graders/every-requirement-once.md#pattern
- **Decisions:** D-08, D-09, D-14
- **Pins:** tests/graders.test.mjs
- **Action:** Add a form check over every grader in the full-grader table. Add `evals/epics-from-spine/graders/every-requirement-once.md` to the table as that case's trace grader (D-14). The check walks each pattern and its flags, and fails on anything outside D-09, naming the file and the form.
  - **Accepted:** these are D-09's forms and what they're written with.
    - literal characters, with a metacharacter only when escaped by `\`
    - the escapes `\n`, `\r` and `\t`, and the class escapes `\s`, `\S`, `\w`, `\W`, `\d` and `\D`
    - bracket classes, negated or not, with ranges, holding literals and those escapes, `[\s\S]` included
    - alternation, `(?:` groups to carry alternation and quantifiers, and the lookaheads `(?=` and `(?!`
    - the quantifiers `*`, `+`, `?`, `{n}`, `{n,}` and `{n,m}`, each greedy or lazy
    - `^` and `$`, but only when the flags hold `m`
    - the one lookbehind, as the exact sequence `^(?<![\s\S])`
    - flags `i` and `m` only
  - **Refused:**
    - backreferences (`\1`, `\k<name>`), named groups and `\p{...}`/`\P{...}`
    - any other lookbehind
    - a plain capturing `(`: D-09 lists no capture, and `(?:` carries every grouping its forms need
    - `.`: engines disagree on which line breaks it matches, which is why D-09 names `[\s\S]`
    - any flag other than `i` and `m`
  - **`\b` is accepted**, on Daneel's ruling, as a deviation from D-09's list. Record the deviation in the SUMMARY. every-requirement-once.md, D-09's evidence file and D-06's model, wraps each ID in `\b`, and epics-from-spine scored 1.00 with it in phase 8's full run 3, so the runner already reads it. With `u` refused, it reads the same in Node on ASCII IDs.
  - Prove the check on planted patterns in the same file. Each refused form, one per pattern, is flagged. `^` or `$` without `m` is flagged. A flag of `s`, `u`, `g`, `y`, `d` or `v` is flagged. One pattern that uses every accepted form passes.
- **Verify:** `node --test tests/graders.test.mjs` passes. The form check covers the three size copies and every-requirement-once.md, and every planted refused form is flagged by name. Change `flags: m` to `flags: ms` in `evals/epics-from-spine/graders/every-requirement-once.md`, which no equal-copy check holds. The test must fail with the D-09 form error naming that file and the `s` flag, and a failure from any other check doesn't count. Then revert. Testing scope: the outcome is that a full grader with a non-D-09 form fails the suite. One planted pattern per refused form and one all-accepted pattern are enough. Testing stops there, with no fuzzing and no engine comparison, since D-09 settles the engine question.

### Task 3: Give full-walk and epics-split a trace grader over their own seeded PRD IDs

- **Files:** evals/full-walk/graders/every-requirement-traced.md, evals/epics-split/graders/every-requirement-traced.md, tests/graders.test.mjs
- **Reads:** evals/epics-from-spine/graders/every-requirement-once.md#pattern, samples/prd.md#Requirements, samples/epics-split/prd.md#Requirements, evals/full-walk/seed.sh, evals/epics-split/seed.sh
- **Decisions:** D-01, D-02, D-06, D-08, D-09, D-14
- **Pins:** tests/graders.test.mjs
- **Action:** Each case gains `graders/every-requirement-traced.md`, with `type: regex`, a file target of `.planning/seldon/epics.md` and `flags: m`. The pattern takes every-requirement-once.md's listed-ID form: it opens on `^(?<![\s\S])`, then gives one lookahead per ID requiring that ID, wrapped in `\b`, on some `**Requirements:**` line. The IDs are exactly those of the PRD the case seeds:
  - full-walk (`samples/prd.md`): CAT-01, CAT-02, LOAN-01, LOAN-02, LOAN-03, NFR-01, NFR-02
  - epics-split (`samples/epics-split/prd.md`): PLOT-01 to PLOT-08 and NFR-01

  The grader keeps every-requirement-once.md's not-twice lookaheads, so each ID must sit on exactly one epic's `**Requirements:**` line. That's Daneel's ruling: SKILL.md:1347-1348 says every requirement ID "lands in exactly one epic", and D-06 gives the grader that file's form. It uses no backreference, and `lib/check.mjs` and the skill's five commands don't change (D-06). The two copies differ by their IDs and aren't held equal (D-01). Add both to the full-grader table. For each one, the test reads the case's seeded PRD fixture and takes its requirement IDs from the `- **ID**:` bullets. An epics text with every one of those IDs on exactly one `**Requirements:**` line passes. For each ID in turn, the same text with that ID moved off every `**Requirements:**` line and onto an Outcome line fails. That way a grader that drops or misspells an ID fails the test. One more input per grader has one seeded ID on two epics' `**Requirements:**` lines, and it fails.
- **Verify:** `node --test tests/graders.test.mjs` passes, with the all-IDs pass, one missing-ID failure per seeded ID (7 for full-walk and 9 for epics-split) and one twice-listed failure per grader. The D-09 form check covers both. Neither file exists before this task. Testing scope: the outcome is that each trace grader fails when any seeded ID is on no `**Requirements:**` line or on two. epics-from-spine already has every-requirement-once.md. The drop-each-ID loop and one twice-listed input per grader are enough, and testing stops there, with no ordering cases.

### Task 4: Make the last-message half refuse the three finding labels

- **Files:** evals/resume-later/graders/says-no-findings.md, evals/handoff-cadence/graders/says-no-findings.md, evals/handoff-named/graders/says-no-findings.md, evals/readiness-agent/graders/says-no-findings.md, tests/graders.test.mjs
- **Reads:** skills/seldon/SKILL.md#22. The readiness check, evals/resume-later/graders/says-no-findings.md#pattern
- **Decisions:** D-01, D-07, D-08, D-09, D-14
- **Pins:** tests/graders.test.mjs
- **Action:** `says-no-findings.md` is readiness-passes' last-message half. D-14 says the three cases already have it, and D-07 asks that half to refuse the labels too. It changes in resume-later, handoff-cadence and handoff-named, and readiness-agent gains a byte copy, so all four are equal bytes. It stays `type: regex` with `target: last_message`.
  - **What it passes:** only a last message that holds `The readiness check found nothing to fix.` on a line of its own and none of the three finding labels in SKILL.md's "The reply": `Requirement no epic names:`, `Epic crossing a boundary the spine didn't fix:` and `Decision left open:`.
  - **How it's written:** in D-09's forms. The line test uses `^` and `$` under `m`, because today's `(?:^|\n)` without `m` puts `^` outside D-09. The label test runs over the whole message from `^(?<![\s\S])`. The apostrophe in `didn't` is written as YAML's doubled `''` in the single-quoted value, which the test's reader decodes the way YAML does.
  - **Test:** add the four copies to the table and hold them equal. The kept passing form passes: the no-findings line, a blank line, `To hand this design to Cadence, run:`, a blank line and `/cad-new-project --brief .planning/seldon`. That message with any one of the three finding lines added, in SKILL.md's form, fails, which is three inputs. A message with the handoff and no no-findings line fails.
  - This half reads the last message only, never the trace or a `task_notification` (D-07).
- **Verify:** `node --test tests/graders.test.mjs` passes. It shows the three label failures, the missing-line failure, the pass, the four copies equal and the D-09 check over them. `cmp` between resume-later's copy and each of the other three exits 0. readiness-agent's copy doesn't exist before this task. Testing scope: the outcome is a failure on any label or a missing line. Presence of the line was already checked. The three label inputs, the missing line and one pass are enough, and testing stops there.

### Task 5: Add the agent-result half, read from the Agent tool's result

- **Files:** evals/resume-later/graders/agent-finds-nothing.md, evals/handoff-cadence/graders/agent-finds-nothing.md, evals/handoff-named/graders/agent-finds-nothing.md, evals/readiness-agent/graders/agent-finds-nothing.md, tests/graders.test.mjs
- **Reads:** evals/results/phase-8-traces/full-run-3/readiness-agent.trace.jsonl, evals/readiness-agent/graders/agent-reads-three.md#pattern, agents/readiness.md#Your reply
- **Decisions:** D-01, D-07, D-08, D-09, D-14
- **Pins:** tests/graders.test.mjs
- **Action:** Four byte-equal copies of a new `agent-finds-nothing.md`, with `type: regex`, `target: trace` and a pattern in D-09's forms under `m`.
  - **What it passes:** only a trace where one JSONL line is the Agent tool's result as the kept phase 8 traces carry it. That line is a `"type":"user"` event with a `"type":"tool_result"` item and the readiness agent's `"agentType":"seldon:readiness"`. In it, the agent's report holds `The readiness check found nothing to fix.` as a whole line of the report: it opens a JSON text value, or follows an escaped newline and the harness's indent. It ends at the value's closing quote or at an escaped newline.
  - **What it must not pass on:** the same words anywhere else. On a passing run, the skill's own assistant text and the `task_notification` event's `summary` both hold them too, and D-07 uses neither. A pattern that matched there would pass a run where the skill dropped a finding the agent raised.
  - **Test:** add the four copies to the table and hold them equal. The test inputs are hand-made JSONL modeled on readiness-agent.trace.jsonl's Agent start, `task_notification`, Agent result and final assistant lines, with invented ids. The test never reads `evals/results/`, which git ignores and CI doesn't have. The no-findings trace passes. A second trace fails: its Agent result and `task_notification` summary hold `Requirement no epic names: CAT-01. Fixed by rerunning /seldon epics.` and no no-findings line, while its final assistant text says the no-findings line.
  - If the kept traces carry the Agent result in a shape this can't match within D-09, stop and take it to Daneel (D-07). There's no fallback to the last message alone.
- **Verify:** `node --test tests/graders.test.mjs` passes. The no-findings trace passes, the dropped-finding trace fails, the four copies are equal and the D-09 check covers them. None of the four files exists before this task. Testing scope: the outcome is that the half reads the agent's own result. The dropped-finding trace is the one representative failure D-07 names, and testing stops there. Matching against the kept traces is Plan 4's.

### Task 6: Anchor the recommendation graders to a line of their own

- **Files:** evals/fast-path/graders/recommends-fast-path.md, evals/cadence-dump/graders/recommends-fast-path.md, evals/asks-for-dump/graders/recommends-a-path.md, tests/graders.test.mjs
- **Reads:** skills/seldon/SKILL.md#6. The recommendation
- **Decisions:** D-08, D-09, D-18
- **Pins:** tests/graders.test.mjs
- **Action:** Anchor each pattern with `^...$` under `m`, with flags `im`, so `i` stays. The recommendation then passes only as SKILL.md's "The recommendation" prints it, a whole line of `Recommended path: fast path`. asks-for-dump also takes `Recommended path: coaching`. Trailing blanks before the line's end are allowed. Drop the `[\s*_`]*` gap, which is what let bold and split lines through. Add the three files to the table for the D-09 check. They aren't held equal, because D-01 names only the size grader and the halves. In the test, the plain line inside a message passes, and so does asks-for-dump's plain coaching line. Each grader fails a bold line (`**Recommended path: fast path**` and `**Recommended path:** fast path`), a mid-sentence one (`I'd say the Recommended path: fast path, since ...`) and a split one (`Recommended path:` on one line, `fast path` on the next).
- **Verify:** `node --test tests/graders.test.mjs` passes, with the plain lines passing and the bold, mid-sentence and split inputs failing for all three graders. Before this task the bold input matches today's pattern, so the bold case fails at the base commit. Testing scope: these are the three failure forms D-18 names plus the plain pass, and testing stops there.

### Task 7: Hold every full grader to its own cases

- **Files:** tests/graders.test.mjs
- **Reads:** tests/scaffold.test.mjs#scaffolds
- **Decisions:** D-01, D-02, D-14, D-28
- **Pins:** tests/graders.test.mjs, tests/scaffold.test.mjs
- **Action:** Add a placement check for the size grader, the trace grader and both readiness-passes halves. Each case D-14 names holds its graders, read from the table. No other case folder under `evals/`, with `results/` left out, holds a file with one of their names (`at-most-five-ids.md`, `every-requirement-traced.md`, `every-requirement-once.md`, `says-no-findings.md`, `agent-finds-nothing.md`). No other case folder holds a file whose bytes match the size grader or either half. Prove it on a planted layout, an in-memory list of case, file name and bytes, the way scaffold.test.mjs plants lines. A size-grader copy in another case is flagged. A renamed byte copy of a half in another case is flagged. The recommendation graders stay out of this check, because AC2 names only the trace, size and two halves. The `tool_used` max-with-min rule needs no new test: every grader this plan adds is a regex, and `tests/scaffold.test.mjs` already holds that rule for all `tool_used` graders (D-28).
- **Verify:** `node --test tests/graders.test.mjs` passes on the repo, and both planted cases are flagged. Copy `evals/full-walk/graders/at-most-five-ids.md` into `evals/spine-from-prd/graders/` and the test fails, then remove it. The coverage gate then passes: `node --test --experimental-test-coverage --test-coverage-include-all --test-coverage-include='lib/**' --test-coverage-exclude='tests/**' --test-coverage-lines=85 --test-coverage-branches=85 --test-reporter=spec --test-reporter-destination=stdout --test-reporter=lcov --test-reporter-destination=lcov.info tests/*.test.mjs`, then `grep -q '^LF:[1-9]' lcov.info` and `! grep -qx 'LH:0' lcov.info`. Testing scope: the outcome is that no full grader sits outside its cases. The two planted cases and the repo pass are enough, and testing stops there.

## Notes

- **Daneel's rulings on this plan:** `\b` is accepted, as a deviation from D-09's list (Task 2). `says-no-findings.md` is the last-message half and changes in place. The trace grader keeps the not-twice lookaheads, so an ID on two epics fails (Task 3).
- **Plan review (REVIEW-plan-plan-dae9e98.md, finding 2):** Task 2's mutation moved off a byte-held size copy, because the equal-copy check alone would fail it there.
