---
phase: 9
plan: 3
depends_on: [1]
requirements:
  - EVAL-02
  - EVAL-04
files:
  - skills/seldon/SKILL.md
  - evals/stale-spine/graders/ends-on-confirm.md
  - evals/readiness-fix/graders/ends-on-confirm.md
  - evals/readiness-fix-answer/graders/ends-on-confirm.md
  - tests/graders.test.mjs
  - evals/stale-spine/history.jsonl
  - evals/results/phase-9-traces/
  - README.md
---

# Phase 9: The full graders - Plan 3: The spine confirm form and stale-spine's back-story

## Goal

The full graders check every run that writes what they grade, and a unit test proves the README's suite command covers every case, with nothing for a person to check by hand. This plan settles the spine confirm question's form and makes stale-spine replay a history the skill at HEAD can produce, so every case that ends on that question passes.

## Must be true when done

- SKILL.md's "17. The spine check" lets `/seldon architecture` sit in a sentence just before a plain confirm question, with the question mark still last in the turn. SKILL.md is at or under 90,000 bytes.
- `evals/stale-spine/graders/ends-on-confirm.md` passes that form, with the sentence on the question's line or the line before it. It still passes today's form and fails a turn that ends on a statement. readiness-fix's and readiness-fix-answer's `ends-on-confirm.md` are byte copies of it, and a test holds the three equal.
- In `evals/stale-spine/history.jsonl`, `/seldon prd` ends on the conflict question naming S-03. A plain go-ahead follows, and only then the applied change with the check line and the PRD confirm question, then the confirm and the /clear words.
- spine-from-prd, spine-answers, spine-conventions, spine-rerun, stale-spine, readiness-fix and readiness-fix-answer each score 1.00 in a solo run, in at most three tries.

## Context

- **Locked:** D-13 (John's "yes option 2": "Allow the command in a sentence just before a plain question (recommended)."). On Daneel's ruling, the new grader also goes to readiness-fix and readiness-fix-answer as byte copies, a deviation from D-13 to record in the SUMMARY. D-13 named only stale-spine's grader because, when John ruled, stale-spine was the only case grading this ending; phase 8 then made the two copies. D-17 (the back-story), D-10 (where runs go), D-12 (no binary), D-26 (no grant change) and D-28 (at most 90,000 bytes, and a history the skill at HEAD can produce).
- **How a run is made:** these are phase 8 PLAN-1's standing terms, carried over.
  - **Where:** from `/code/seldon`, the main tree, never a worktree.
  - **The command:** `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. That's the README's command with `--case` and `--keep-temp` added, and `--allow-tools` kept last with exactly those two grants.
  - **Audits:** after every run, report every Bash command and every agent start in the kept trace, each with its permission record. The only Bash allowed is the check on `.planning/seldon`. The only agent allowed is `seldon:readiness`. Anything else is a SECURITY checkpoint to Daneel.
  - **Traces:** copy each kept `out/trace.jsonl` into `evals/results/phase-9-traces/<case>-try-<n>.trace.jsonl`. That folder is git-ignored and never committed (D-27). Then remove the kept folder by the exact path the run printed.
  - **Tries:** at most three per case. Any miss goes to Daneel with the failing grader and the trace's last message, and a retry happens only on Daneel's word.
  - **No binary:** nothing is read or copied out of the Claude binary (D-12).
- **Out:** the README, every case.yaml and every other grader.

## Tasks

### Task 1: Let `/seldon architecture` sit in a sentence just before the spine confirm question

- **Files:** skills/seldon/SKILL.md, evals/stale-spine/graders/ends-on-confirm.md, evals/readiness-fix/graders/ends-on-confirm.md, evals/readiness-fix-answer/graders/ends-on-confirm.md, tests/graders.test.mjs
- **Reads:** skills/seldon/SKILL.md#17. The spine check, evals/stale-spine/graders/ends-on-confirm.md#pattern, evals/readiness-fix/graders/ends-on-confirm.md#pattern
- **Decisions:** D-08, D-10, D-13, D-26, D-28
- **Pins:** tests/skill.test.mjs, tests/graders.test.mjs
- **Action:** Section 17's closing rules change to D-13's form.
  - **How the turn ends:** name the file and repeat the check line on its own line. Then a sentence may name `/seldon architecture` as the way to ask for the full architecture document once the spine is confirmed. It sits just before a plain question asking whether the user confirms the spine or wants changes.
  - **What goes:** the words saying that same question names the command, which hold 65dc09a's one-question form.
  - **What stays:** the question mark is the last thing in the turn, and nothing comes after the question, `/seldon architecture` included. The "Naming it writes nothing" paragraph stays as it is.
  - **The example (planner's choice):** the sentence and the question in one paragraph, such as "`/seldon architecture` can write the full architecture document once you confirm. Do you confirm the spine, or do you want changes?". The text still allows the sentence on a line of its own, as D-13 does.
  - **Limits:** section 17 is the only place that states the question's form. SKILL.md stays at or under 90,000 bytes; it's 80,798 now. `allowed-tools` doesn't change.
  - **The grader:** stale-spine's `ends-on-confirm.md` passes only when the last non-blank line of the last message is a question asking to confirm. That line holds "confirm" (either case for the `c`) and ends with `?`, with only whitespace after it. `/seldon architecture` must sit on that line or on the nearest non-blank line before it. readiness-fix's and readiness-fix-answer's `ends-on-confirm.md` become byte copies of this file, with no shared folder and no symlink.
  - **Proof:** add this grader's cases to `tests/graders.test.mjs`, which is where D-10 proves a changed grader. Use the test's grader runner, not the full-grader table: it isn't one of EVAL-02's full graders. Three forms pass: today's form with the command inside the question, the sentence and question on one line, and the sentence one paragraph above the question. Three fail: the phase 7 split, where the question is followed by a trailing sentence naming the command; a closing question with the command only in an earlier paragraph; and a message that ends on no question. Add an equal-copy check over the three `ends-on-confirm.md` files, using Plan 1's equal-copy comparison, which is already proven on a one-byte pair.
- **Verify:** `grep -c "That same question names" skills/seldon/SKILL.md` prints 0; it prints 1 before this task. Section 17's example has `/seldon architecture` in a sentence before the question and keeps the rule that the question mark is last. `wc -c < skills/seldon/SKILL.md` is at most 90000. `node --test tests/graders.test.mjs tests/skill.test.mjs` passes with the six stale-spine cases and the three copies equal. `cmp` between stale-spine's `ends-on-confirm.md` and each of readiness-fix's and readiness-fix-answer's exits 0. Add one byte to readiness-fix's copy and the test fails, then revert. Before this task, the sentence-a-paragraph-above input fails today's grader. Testing scope: the outcome is the new closing form, which passes while a statement ending fails. The six inputs are enough. Solo runs prove the behavior in Tasks 2 and 3, and testing stops there.

### Task 2: Recapture stale-spine's history through the conflict question

- **Files:** evals/stale-spine/history.jsonl, evals/results/phase-9-traces/
- **Reads:** evals/prd-conflict-apply/history.jsonl, evals/prd-conflict-apply/prompt.md, evals/prd-conflict-apply/seed.sh, evals/stale-spine/case.yaml, .planning/phases/8/PLAN-6.md#The capture run (D-19)
- **Decisions:** D-10, D-12, D-17, D-28
- **Action:**
  - **Stop first (Daneel's ruling):** before the capture run, stop once at a checkpoint and send Daneel Task 1's commit: the section 17 diff, stale-spine's `ends-on-confirm.md`, its two copies and the test result. No run starts until Daneel gives the go. This isn't a SECURITY checkpoint: the runs are approved under the standing grant on phase 8's carried terms in Context. Anything outside those terms still stops as SECURITY.
  - **The capture (D-10):** run prd-conflict-apply solo at HEAD, after Task 1, under the run terms. It must score 1.00. Its seed is stale-spine's back-story at the moment of the go-ahead: `samples/prd-rerun/brief.md`, which is byte-identical to `samples/spine-rerun/brief.md`, beside `samples/prd.md` and `samples/spine.md`, after the same conflict report, answered by `/seldon yes, go ahead and change it`. Keep its trace as `prd-conflict-apply-capture-try-<n>.trace.jsonl` and quote its last message in the report. Nothing gets written around a capture that didn't score 1.00.
  - **The history:** six lines, in the form the current file and phase 8's recaptures use.
    1. user: `/seldon prd`
    2. assistant: the text of prd-conflict-apply's history line 2, byte for byte. It's the report naming S-03, ending on "Do you want me to apply this change to the PRD anyway?".
    3. user: prd-conflict-apply's `prompt.md` text, `/seldon yes, go ahead and change it`.
    4. assistant: the passing capture's last message, byte for byte.
    5. user: `/seldon Yes, that's right.`
    6. assistant: the /clear words, as today's lines 3 and 4 carry them.

    `sessionId` and the uuids are fresh. `parentUuid` chains from null. `cwd` stays `/tmp/seldon-stale-spine`, and the timestamps rise.
  - **What stays:** the seed files. `samples/spine-rerun/prd.md` is the PRD that go-ahead produces. stale-spine's `case.yaml` and its README bullet also stay, because both are still true of the new back-story.
  - **The run:** after that, run stale-spine solo under the run terms. It must score 1.00. This run also counts as stale-spine's solo run for Task 1's change.
- **Verify:** A `node -e` check over `evals/stale-spine/history.jsonl` shows all of these. The file has 6 lines, alternating user and assistant from user; before this task it has 4. Line 1's content is `/seldon prd`. Line 2's text equals prd-conflict-apply's history line 2 text. Line 3 is `/seldon yes, go ahead and change it`. Line 4 equals the passing capture's last message byte for byte, holds `seldon check: prd.md conforms` and ends with `?`. Lines 5 and 6 equal the message text of the old lines 3 and 4. There's one `sessionId`, which isn't `107e932a-d181-48b4-b2eb-e237023eb3da`, and each `parentUuid` is the line before's `uuid`. Before the history is written, rebuild prd.md from the passing capture's Edit and Write inputs, applied in order over `samples/prd.md` with Plan 4's rebuild method, and it equals `samples/spine-rerun/prd.md` byte for byte. A mismatch is a miss: it goes to Daneel with the diff, no history is written, and a retry of the capture counts inside its three tries, on Daneel's word only. The capture scored 1.00 and so did stale-spine's solo run, every grader passed in both, both traces are kept, and both audits came back clean. Testing scope: the outcome is a back-story the skill at HEAD produces. The capture and the one stale-spine run are the evidence D-10 names, and testing stops there.

### Task 3: Solo-run the other six cases that end on the spine confirm question

- **Files:** evals/results/phase-9-traces/
- **Decisions:** D-10, D-12, D-13
- **Action:** Under the run terms, run spine-from-prd, spine-answers, spine-conventions, spine-rerun, readiness-fix and readiness-fix-answer solo, once each, with at most three tries each. Each of their graded turns ends on the spine confirm question in its kept full-run-3 trace. architecture-on-request isn't run. CONTEXT's flagged list named it, but its kept trace ends on the architecture document's closing sentence, and its one grader is `writes-architecture.md`. spine-rerun is run although that list didn't name it, because its kept trace ends on the spine confirm question. readiness-fix and readiness-fix-answer are graded by Task 1's byte copies.
- **Verify:** Each of the six cases scores 1.00. The report names each case, its try count and score, the kept trace's file name, its last message's closing two lines, and both audits. Testing scope: these are the solo runs D-10 asks of a SKILL.md change, and testing stops there.

## Notes

- **Phase 9's eval runs, all of them (D-10).** Ten cases, one passing run each, at most three tries each, so at most 30 tries. No full-suite run (D-04).
  - **This plan:** (1) prd-conflict-apply, the capture for stale-spine's history. (2) stale-spine, the history change's run and its solo run for Task 1. (3 to 8) spine-from-prd, spine-answers, spine-conventions, spine-rerun, readiness-fix and readiness-fix-answer.
  - **Plan 4:** (9) full-walk, for the trace and size graders. (10) readiness-agent, for both halves of readiness-passes.
- **Daneel's rulings on this plan:** readiness-fix and readiness-fix-answer get byte copies of stale-spine's new grader, a deviation from D-13 (Task 1). Without them SKILL.md would allow a form two graders fail. This also settles finding 3 of REVIEW-plan-plan-dae9e98.md. Finding 4 is fixed by Task 2's prd.md rebuild check, on Daneel's ruling; he rebuilt the kept full-run-3 capture's prd.md over samples/prd.md and it equals samples/spine-rerun/prd.md byte for byte. The executor stops once, before the capture run, with Task 1's commit for Daneel (Task 2). Plan 4's two runs need no stop. The solo-run list stands as written (Task 3).
- **Deviation, diff review finding 1 (REVIEW-diff-4cfa959-af0c7bc.md, low, README.md:61):** on Daneel's ruling, README.md joins this plan's files for one sentence only, against "Out: the README". "The spine's confirm question names the command so you know it's there, and nothing else ever writes the document." becomes "Just before the spine's confirm question, Seldon names the command so you know it's there, and nothing else ever writes the document." Nothing else in the README changes, and no eval runs for it.
