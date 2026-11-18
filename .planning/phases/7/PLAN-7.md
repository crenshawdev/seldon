---
phase: 7
plan: 7
depends_on: [3, 5, 6]
requirements:
  - CHECK-03
  - CHECK-04
files:
  - skills/seldon/SKILL.md
  - evals/prd-conflict/case.yaml
  - evals/prd-conflict/prompt.md
  - evals/prd-conflict/seed.sh
  - evals/prd-conflict/graders/names-decision.md
  - evals/prd-conflict/graders/ends-on-question.md
  - evals/prd-conflict/graders/no-write.md
  - evals/prd-conflict/graders/no-edit.md
  - evals/prd-conflict-decline/case.yaml
  - evals/prd-conflict-decline/prompt.md
  - evals/prd-conflict-decline/seed.sh
  - evals/prd-conflict-decline/history.jsonl
  - evals/prd-conflict-decline/graders/says-decline-line.md
  - evals/prd-conflict-decline/graders/no-write.md
  - evals/prd-conflict-decline/graders/no-edit.md
  - evals/prd-conflict-apply/case.yaml
  - evals/prd-conflict-apply/prompt.md
  - evals/prd-conflict-apply/seed.sh
  - evals/prd-conflict-apply/history.jsonl
  - evals/prd-conflict-apply/graders/retires-dropped-id.md
  - evals/prd-conflict-apply/graders/stamps-brief-hash.md
  - evals/prd-conflict-apply/graders/check-passes.md
  - evals/prd-conflict-apply/graders/ends-on-confirm.md
  - evals/prd-conflict-apply/graders/no-reused-id.md
  - evals/prd-conflict-apply/graders/keeps-unchanged-lines.md
  - evals/prd-conflict-apply/graders/scope-drops-id.md
  - evals/prd-change-conflict/case.yaml
  - evals/prd-change-conflict/prompt.md
  - evals/prd-change-conflict/seed.sh
  - evals/prd-change-conflict/history.jsonl
  - evals/prd-change-conflict/graders/names-decision.md
  - evals/prd-change-conflict/graders/ends-on-question.md
  - evals/prd-change-conflict/graders/no-write.md
  - evals/prd-change-conflict/graders/no-edit.md
  - evals/prd-change-decline/case.yaml
  - evals/prd-change-decline/prompt.md
  - evals/prd-change-decline/seed.sh
  - evals/prd-change-decline/history.jsonl
  - evals/prd-change-decline/graders/says-decline-line.md
  - evals/prd-change-decline/graders/no-brief-command.md
  - evals/prd-change-decline/graders/no-write.md
  - evals/prd-change-decline/graders/no-edit.md
  - evals/stale-prd/case.yaml
  - evals/stale-prd/prompt.md
  - evals/stale-prd/seed.sh
  - evals/stale-prd/graders/says-stale-line.md
  - evals/stale-prd/graders/no-epics-line.md
  - evals/stale-prd/graders/names-decision.md
  - evals/stale-prd/graders/ends-on-question.md
  - evals/stale-prd/graders/no-write.md
  - evals/stale-prd/graders/no-edit.md
---

# Phase 7: PRD changes flow downstream - Plan 7: The conflict cases

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan proves the conflict check live: success criterion 1, AC1, AC2 and AC5. It covers the check at the rerun, at the confirm question and on a bare `/seldon`'s stale route, and both the go-ahead and the declines.

## Must be true when done

- `prd-conflict` scores 1.00. `/seldon prd`, over a brief that dropped reminders, names S-03 and ends on the conflict question, with Write and Edit at 0 (AC1).
- `prd-conflict-decline` scores 1.00. A decline writes and edits nothing, and ends on the brief decline line, which names `/seldon brief` (AC1).
- `prd-conflict-apply` scores 1.00. A go-ahead puts LOAN-03 on the `Retired:` line, stamps `prd.md` with the seeded brief's hash, repeats `seldon check: prd.md conforms`, and ends on the PRD confirm question (AC2).
- `prd-change-conflict` and `prd-change-decline` score 1.00 (AC2):
  - a change named at the PRD confirm question that drops LOAN-03 gets the report naming S-03, with Write and Edit at 0
  - its decline ends on the nothing-changed line, without `/seldon brief`
- `stale-prd` scores 1.00. A bare `/seldon` with a stale PRD and no epics says the PRD stale line, not the epics resume line, then ends on the conflict question naming S-03, with Write and Edit at 0 (AC5).
- Every Bash command in every kept trace passed the audit, and `node --test tests/scaffold.test.mjs` passes.

## Context

- **Locked:** D-05, D-06, D-07, D-14 and D-15. From Plans 3, 4 and 6: the stamped samples, the stale PRD route, the conflict check, its route and the three fixed lines.
- **Seeds:** `prd-conflict`, `prd-conflict-decline`, `prd-conflict-apply` and `stale-prd` copy the same three files: `samples/prd-rerun/brief.md`, `samples/prd.md` and `samples/spine.md`. S-03 and LOAN-03 share the quote `> a reminder when something's due`, which that brief drops (D-07). The two `prd-change-*` cases copy `samples/brief.md`, `samples/prd.md` and `samples/spine.md`, all fresh.
- **Fixed words:** every line a grader or a history matches is copied from SKILL.md, never from a plan.
- **Hashes:** copied from a `stamp for <file>:` line of `node lib/check.mjs --stale` over a scratch folder seeded as the case seeds it.
- **Shared grader forms:**
  - **`names-decision`:** `last_message` holds `S-03` as a whole ID.
  - **`ends-on-question`:** `last_message` ends on the conflict question, on a line of its own, allowing only blanks and a closing code fence after it, as `full-walk`'s `ends-on-confirm` does.
  - **`no-write` and `no-edit`:** `tool_used`, `max: 0`.
  - Within this plan, each of these four shared graders has the same content wherever it appears, and `cmp` shows it. The two `says-decline-line.md` graders differ, one per decline line.
- **Eval runs (SECURITY):** these run on Plan 1's recorded approval and terms. If none is recorded, stop at a checkpoint marked SECURITY before the first run.
  - **The command:** one case at a time, from `/code/seldon`: `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`.
  - **Bash audit:** report every Bash command in each kept trace. Only Plan 1's approved commands are allowed, and anything else is a SECURITY checkpoint.
  - **Retries and cleanup:** at most three tries per case. Remove kept folders by their exact paths, never by a glob.
- **Seed vetting, case rules and histories:** the same as Plan 5's Context.
  - Each new `seed.sh` is vetted by the coordinator at a checkpoint before its first run.
  - `allowed_tools` is `[Skill, Read, Glob, Grep]`, and no "scaffold" wording appears except `scaffold_script: seed.sh`.
  - Histories are text-only, with chained `parentUuid`, a fresh `sessionId`, `cwd` set to `/tmp/seldon-<case>` and invented user words.
  - Every grader passes its phase 3 D-21 check in a `node -e` script over scratch inputs.
  - Cases that write nothing use `max_turns: 10` and `timeout_seconds: 300`. A case that edits uses 20 and 600.
- **SKILL.md in the lease:** it's declared only so a run failing on the skill's text can be fixed here. After any such edit:
  - rerun every case this plan has passed
  - keep SKILL.md at or under 90,000 bytes
  - run `node --test tests/*.test.mjs`
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Add the prd-conflict case

- **Files:** evals/prd-conflict/case.yaml, evals/prd-conflict/prompt.md, evals/prd-conflict/seed.sh, evals/prd-conflict/graders/names-decision.md, evals/prd-conflict/graders/ends-on-question.md, evals/prd-conflict/graders/no-write.md, evals/prd-conflict/graders/no-edit.md
- **Reads:** evals/prd-rerun/seed.sh, evals/full-walk/graders/ends-on-confirm.md, evals/resume-later/graders/no-write.md, skills/seldon/SKILL.md#13. The PRD draft
- **Decisions:** D-06, D-07, D-14
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC1's report.
  - **The case:** the shared seed, the prompt `/seldon prd`, no history, and the four shared graders.
  - **`case.yaml`:** says the brief dropped reminders beside a PRD and a spine built before it did, and that Seldon has to name the decision the change hits before writing anything.
- **Verify:**
  - **Testing scope:** the outcome is AC1's report, which no case covers. Four graders, their D-21 checks and one passing run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) **D-21:**
    - `names-decision` fails on a message naming only S-01 or `S-031`
    - `ends-on-question` fails on a message with text after the question, and on one with a word of the question changed
  - (3) The coordinator vets `seed.sh`. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and the Bash audit is reported.

### Task 2: Add the prd-conflict-decline case

- **Files:** evals/prd-conflict-decline/case.yaml, evals/prd-conflict-decline/prompt.md, evals/prd-conflict-decline/seed.sh, evals/prd-conflict-decline/history.jsonl, evals/prd-conflict-decline/graders/says-decline-line.md, evals/prd-conflict-decline/graders/no-write.md, evals/prd-conflict-decline/graders/no-edit.md
- **Reads:** evals/prd-conflict/seed.sh, evals/epics-confirm/history.jsonl, evals/resume-later/graders/says-later-release.md
- **Decisions:** D-14, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC1's decline.
  - **`seed.sh`:** Task 1's lines, with only the folder comment changed.
  - **`history.jsonl`:** two lines. The user runs `/seldon prd`. Seldon answers with a conflict report naming S-03, saying what it quotes and that the change drops LOAN-03, ending on the conflict question.
  - **`prompt.md`:** a plain decline in invented words, such as `/seldon no, leave the PRD as it is`.
  - **Graders:**
    - **`says-decline-line`:** `last_message` ends on the brief decline line, in `says-later-release`'s form.
    - the shared `no-write` and `no-edit`
- **Verify:**
  - **Testing scope:** the outcome is AC1's decline. One line grader, its D-21 check and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and the history parses with `parentUuid` chained.
  - (2) **D-21:** `says-decline-line` fails on the nothing-changed line, and on the brief decline line followed by more text.
  - (3) The coordinator vets `seed.sh`. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and the Bash audit is reported.

### Task 3: Add the prd-conflict-apply case

- **Files:** evals/prd-conflict-apply/case.yaml, evals/prd-conflict-apply/prompt.md, evals/prd-conflict-apply/seed.sh, evals/prd-conflict-apply/history.jsonl, evals/prd-conflict-apply/graders/retires-dropped-id.md, evals/prd-conflict-apply/graders/stamps-brief-hash.md, evals/prd-conflict-apply/graders/check-passes.md, evals/prd-conflict-apply/graders/ends-on-confirm.md
- **Reads:** evals/prd-conflict-decline/history.jsonl, evals/prd-rerun/graders/retires-dropped-id.md, evals/prd-from-brief/graders/check-passes.md, evals/resume/graders/stamps-brief-hash.md
- **Decisions:** D-14, D-02
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC2's go-ahead.
  - **`seed.sh`:** Task 2's lines, with only the folder comment changed.
  - **`history.jsonl`:** the same turns as Task 2's, with only `sessionId`, `cwd` and the uuids changed, so the history rule in Context holds. A `node -e` comparison of the two parsed histories shows every other field equal.
  - **`prompt.md`:** a go-ahead in invented words, such as `/seldon yes, go ahead and change it`.
  - **`case.yaml`:** `max_turns: 20` and `timeout_seconds: 600`.
  - **Graders:**
    - **`retires-dropped-id`:** `prd-rerun`'s pattern.
    - **`stamps-brief-hash`:** `prd.md`'s line 2 is exactly the `stamp for prd.md:` line over this seed, which carries `samples/prd-rerun/brief.md`'s hash.
    - **`check-passes`:** `seldon check: prd\.md conforms` in `last_message`.
    - **`ends-on-confirm`:** the last line of `last_message` is a question holding `confirm` and `PRD`.
- **Verify:**
  - **Testing scope:** the outcome is AC2's go-ahead, which no case covers. Four graders, their D-21 checks, one run and the chain check in (5) are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) **D-21:**
    - `stamps-brief-hash` fails on `samples/prd.md`, which carries the old brief's hash
    - `retires-dropped-id` fails on `samples/prd.md`
    - `ends-on-confirm` fails on the conflict question, and on a message whose last line isn't a question
  - (3) The coordinator vets `seed.sh`. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and the Bash audit is reported.
  - (5) Before the kept folder is removed, `node lib/check.mjs --stale <kept workspace>/.planning/seldon` prints `stale: spine.md was built from an earlier prd.md` and no other stale line. That's the applied change marking the spine stale, which is where Plan 5's `stale-spine` picks up.

### Task 4: Add the prd-change-conflict case

- **Files:** evals/prd-change-conflict/case.yaml, evals/prd-change-conflict/prompt.md, evals/prd-change-conflict/seed.sh, evals/prd-change-conflict/history.jsonl, evals/prd-change-conflict/graders/names-decision.md, evals/prd-change-conflict/graders/ends-on-question.md, evals/prd-change-conflict/graders/no-write.md, evals/prd-change-conflict/graders/no-edit.md
- **Reads:** evals/epics-confirm/history.jsonl, evals/prd-conflict/graders/names-decision.md, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#14. The PRD check
- **Decisions:** D-06, D-07
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC2's second replay, the report half: a change named at the PRD's confirm question.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then `cp` from `samples/brief.md`, `samples/prd.md` and `samples/spine.md`.
  - **`history.jsonl`:** two lines. The user runs `/seldon prd`. Seldon names `.planning/seldon/prd.md` as in line with the brief, repeats `seldon check: prd.md conforms`, and ends on a plain-prose question asking whether the user confirms the PRD or wants changes.
  - **`prompt.md`:** a change in invented words that drops the email reminders, such as `/seldon drop the email reminders, we won't be sending those after all`.
  - **Graders:** the four shared graders.
- **Verify:**
  - **Testing scope:** the outcome is AC2's report at the confirm question, the route D-06 added beyond the rerun. Shared graders, their D-21 checks carried over by `cmp`, and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, the history parses with `parentUuid` chained, and `cmp` shows `names-decision.md` and `ends-on-question.md` equal to Task 1's.
  - (2) The coordinator vets `seed.sh`. This is a checkpoint.
  - (3) The run exits 0 at 1.00, and the Bash audit is reported.

### Task 5: Add the prd-change-decline case

- **Files:** evals/prd-change-decline/case.yaml, evals/prd-change-decline/prompt.md, evals/prd-change-decline/seed.sh, evals/prd-change-decline/history.jsonl, evals/prd-change-decline/graders/says-decline-line.md, evals/prd-change-decline/graders/no-brief-command.md, evals/prd-change-decline/graders/no-write.md, evals/prd-change-decline/graders/no-edit.md
- **Reads:** evals/prd-change-conflict/history.jsonl, evals/prd-change-conflict/prompt.md, evals/prd-conflict-decline/graders/says-decline-line.md
- **Decisions:** D-14, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC2's second replay, the decline half.
  - **`seed.sh`:** Task 4's lines.
  - **`history.jsonl`:** four lines. Task 4's two lines, then Task 4's prompt as the user's turn, then Seldon's conflict report naming S-03 and ending on the conflict question.
  - **`prompt.md`:** a decline in invented words, such as `/seldon no, keep the reminders then`.
  - **Graders:**
    - **`says-decline-line`:** `last_message` ends on the nothing-changed line.
    - **`no-brief-command`:** `last_message` doesn't contain `/seldon brief` (`match: not_contains`).
    - the shared `no-write` and `no-edit`
- **Verify:**
  - **Testing scope:** the outcome is D-15's split: a change from the conversation never points to the brief. Two graders, their D-21 checks and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and the history parses with `parentUuid` chained.
  - (2) **D-21:**
    - `says-decline-line` fails on the brief decline line
    - `no-brief-command` matches, and so fails the grader, on the brief decline line
  - (3) The coordinator vets `seed.sh`. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and the Bash audit is reported.

### Task 6: Add the stale-prd case

- **Files:** evals/stale-prd/case.yaml, evals/stale-prd/prompt.md, evals/stale-prd/seed.sh, evals/stale-prd/graders/says-stale-line.md, evals/stale-prd/graders/no-epics-line.md, evals/stale-prd/graders/names-decision.md, evals/stale-prd/graders/ends-on-question.md, evals/stale-prd/graders/no-write.md, evals/stale-prd/graders/no-edit.md
- **Reads:** evals/prd-conflict/seed.sh, evals/resume/graders/names-brief-first.md, evals/full-walk/graders/names-spine-first.md, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-05, D-06, D-12
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC5, and the PRD stale line's own case (D-05).
  - **The case:** the shared seed, no `epics.md`, the prompt `/seldon`, and no history.
  - **Graders:**
    - **`says-stale-line`:** on the trace, an assistant text holding the PRD stale line, in `names-brief-first`'s form.
    - **`no-epics-line`:** on the trace, `match: not_contains` for an assistant text holding the epics resume line's opening words.
    - the four shared graders
- **Verify:**
  - **Testing scope:** the outcome is AC5. The earliest stale link outranks a missing later document, and the stale route reaches the conflict check. Two new graders, their D-21 checks and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) **D-21:**
    - `says-stale-line` fails on a trace holding the spine stale line or the PRD resume line instead
    - `no-epics-line` matches, and so fails the grader, on a hand-made trace whose assistant text says the epics resume line
  - (3) The coordinator vets `seed.sh`. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and the Bash audit is reported. The audit shows `--stale .planning/seldon` before any Read of `prd.md`.
