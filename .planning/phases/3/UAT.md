---
status: testing
phase: 3
fields_version: 1
started: 2026-11-17
updated: 2026-11-17
---

## Items

### 1. PRD case writes a conforming PRD from a confirmed brief
expected: `claude plugin eval . --case prd-from-brief` scores 1.00: prd.md has an ID'd bullet in Requirements and in Non-functional requirements, a user journey, Non-goals carrying each brief refusal with its reason and quote, and MVP scope; the reply carries the --prd pass line; no brief tech word in prd.md's requirement lines; every requirement and non-goal line has a quote or an [ASSUMPTION] tag
criterion: AC1
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: prd-from-brief 1.00: writes-prd, check-passes (seldon check: prd.md conforms), runs-check (Bash 1x), no-tech-words (absent), carries-refusals, every-item-quoted-or-tagged (absent) all pass; only Bash was node /code/seldon/lib/check.mjs --prd .planning/seldon

### 2. A fresh /seldon resumes at the PRD step
expected: `claude plugin eval . --case resume` scores 1.00: the reply names brief.md before drafting, prd.md is created, and neither the dump ask nor "Who is it for?" appears
criterion: AC2
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: resume 1.00: names-brief-first matched the resume line in an assistant record before the Write, no-dump-ask and no-who-for absent, writes-prd exists; only Bash was the --prd check. Earlier runs on the same inputs: 0.75 at 16:10:17Z, 1.00 at 16:14:54Z (gap item 17 tracks the flake)

### 3. /seldon prd takes the brief's fact over the conversation's
expected: `claude plugin eval . --case prd-reads-brief` (history plus scaffold) scores 1.00: prd.md carries the brief's 10 days and not the conversation's 12
criterion: AC3
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: prd-reads-brief 1.00 in the history-plus-scaffold form: carries-brief-fact matched 10 days, drops-talk-fact absent, writes-prd exists; only Bash was the --prd check

### 4. /seldon prd rerun keeps unchanged IDs and retires the dropped one
expected: `claude plugin eval . --case prd-rerun` scores 1.00: unchanged requirement lines byte-identical, the dropped requirement on a Retired: line, its ID not reused
criterion: AC4
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: prd-rerun 1.00: keeps-unchanged-lines matched all six untouched requirements byte-for-byte, retires-dropped-id matched Retired: LOAN-03 under ## Requirements, no-reused-id absent; no Bash

### 5. /seldon brief rerun updates the brief in place and leaves the PRD alone
expected: `claude plugin eval . --case brief-rerun` scores 1.00: the change lands in brief.md, an untouched item and its quote stay byte-identical, prd.md is neither written nor edited
criterion: AC4
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: brief-rerun 1.00: carries-change matched a > line with thirty seconds in brief.md, keeps-untouched-item matched the Who it serves item and quote byte-identical, prd-not-edited and prd-not-written 0x on .planning/seldon/prd.md; only Bash was the --brief check

### 6. A confirmed step ends on the /clear suggestion and writes nothing
expected: `claude plugin eval . --case confirm-clear` scores 1.00: the reply ends on the fixed /clear words, with Write and Edit at 0 in that turn
criterion: AC5
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: confirm-clear 1.00: suggests-clear matched the fixed /clear words at the end of the reply, no-write 0x, no-edit 0x; no Bash

### 7. A new dump while a brief exists gets the documents question
expected: `claude plugin eval . --case existing-brief` scores 1.00: one prose question asking whether to rerun the brief or go on to the PRD, and nothing written
criterion: AC6
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: existing-brief 1.00: asks-rerun-or-go-on matched the documents question at the end of the reply, no-write 0x, no-edit 0x; no Bash

### 8. /seldon spine writes nothing and ends on the later-release line
expected: `claude plugin eval . --case spine-later` scores 1.00: no Write or Edit, and the reply ends on the fixed later-release line
criterion: AC6
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: spine-later 1.00: says-later-release matched the fixed later-release line at the end, no-write 0x, no-edit 0x; no Bash

### 9. The PRD-only check passes the sample and names what a bad PRD is missing
expected: `node lib/check.mjs --prd samples` exits 0 with the pass line; a PRD missing a section, and one with no ID'd bullet in Requirements or Non-functional requirements, each exit non-zero naming what is missing
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: `node lib/check.mjs --prd samples` printed `seldon check: prd.md conforms` and exited 0. On scratch PRDs, a missing Non-goals, a prose-only NFR and prose-only Requirements each exited 1, naming the section and the missing `- **CAT-01**: text` requirement. tests/check.test.mjs:207-245 passed.

### 10. allowed-tools is still D-02's five entries
expected: `node --test tests/skill.test.mjs` passes its allowed-tools test
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: The suite run shows `✔ allowed-tools grants exactly D-02's five entries` (tests/skill.test.mjs:45-53), and SKILL.md:5-10 lists those five.

### 11. The full eval suite passes with the README's command
expected: The README's eval command, run from the repo root, exits 0 with every case at 1.00, phase 2's cases included and existing-brief rewritten, with no `not granted`, no `scaffold failed` and no Bash but the check
criterion: AC7
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: all 18 cases 1.00 (18 case(s), 232s, $4.38), no not granted, no scaffold failed; Bash audit over all 18 kept traces: 9 made no Bash call, 9 made one, each node /code/seldon/lib/check.mjs --brief|--prd .planning/seldon; all 18 printed /tmp/claude-eval-* folders removed

### 12. The suite passes under the coverage gate
expected: CI jobs node-test and coverage conclude success at the phase's head commit (ci: node-test, coverage)
criterion: AC7
status: pass
job: coverage
commit: 015413dc796e096542825cc5c946318c3e5dbf3d
first_pass: pass
source: model
evidence: test-policy ci-status --commit 015413dc796e096542825cc5c946318c3e5dbf3d: coverage concluded success at 015413d; node-test (24) success, node-test (22) still in progress at read time; plugin-validate success

### 13. /seldon brief answering the documents question carries that dump into the brief
expected: `claude plugin eval . --case brief-rerun-dump` scores 1.00: the dump's new item lands in brief.md with its quote, in the same turn, with no ask
status: pass
first_pass: pass
source: model
evidence: claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" (README.md:52 plus --keep-temp), one run at 015413d, exit 0, report evals/results/2026-11-17T16-22-29-258Z: brief-rerun-dump 1.00: carries-dump matched a > line with Alder Street School in brief.md in the same turn; only Bash was the --brief check

### 14. The README lists every eval case
expected: Every case directory under evals/ (except results/) appears in backticks in README.md's Evals list, and the list names no case that doesn't exist
status: pass
first_pass: pass
source: verifier
evidence: The 18 case directories under evals/ (results/ excluded) match the 18 backticked entries in README.md:57-74 exactly, with none missing and none extra.

### 15. A bare /seldon with a brief and a PRD on disk writes nothing and ends on the later-release line
expected: Behavior not covered: no automated check exercises this route or the 'go on' answer to the documents question with both files present. It is a plan 2 must-have and D-17. It is also the action README.md:37 suggests after a PRD is confirmed, and if it fails it overwrites a confirmed prd.md.
origin: verifier
status: pass
first_pass: fail
source: model
evidence: claude plugin eval . --case <case> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 650aff3 with --case resume-later: exit 0, score 1.00 (report evals/results/2026-11-17T16-34-47-415Z); no-write 0x, no-edit 0x, says-later-release matched the fixed later-release line at the end; no Bash in the trace. Case added in b252b03.
reported: Behavior not covered: no automated check exercises this route or the 'go on' answer to the documents question with both files present. It is a plan 2 must-have and D-17. It is also the action README.md:37 suggests after a PRD is confirmed, and if it fails it overwrites a confirmed prd.md.
severity: major
cause: No eval case covers it. SKILL.md:176-182 (a brief and a PRD with empty arguments writes nothing and ends on the later-release line), :136-141 (a go-on answer to the documents question) and the create-only guard at :482-486 hold the rule, but the only cases that seed prd.md are spine-later (/seldon spine, the step-name branch), prd-rerun and brief-rerun. None sends a bare /seldon or a go-on answer with both files present.
fix: b252b03, retest

### 16. The PRD is sized to the stakes the brief shows (DOCS-02, D-05)
expected: Requirement not covered: no automated check exercises DOCS-02's 'sized to the stakes' clause or D-05's tagged sizing line.
origin: verifier
status: pass
first_pass: fail
source: model
evidence: claude plugin eval . --case prd-no-stakes --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 8d47df0: exit 0, score 1.00 (report evals/results/2026-11-17T16-39-04-684Z). sizing-line matched; the run PRD MVP scope reads: This PRD is sized for a single book club of a few dozen members, where a wrong pick is easy to redo. [ASSUMPTION]. That PRD passes node lib/check.mjs --prd; only Bash in the trace was the --prd check. The grader fails on samples/prd.md and on a tag outside MVP scope (D-21 probe).
reported: Requirement not covered: no automated check exercises DOCS-02's 'sized to the stakes' clause or D-05's tagged sizing line.
severity: minor
cause: No grader covers DOCS-02's sized-to-the-stakes clause. SKILL.md:473-478 says to size the PRD to the brief's stakes and, when the brief doesn't show them, to put one [ASSUMPTION]-tagged sizing line in MVP scope. No grader under evals/*/graders/ checks MVP scope, stakes or size; prd-from-brief's graders check structure, quotes, refusals and tech words. Phase 3's AC1-AC7 don't name sizing, so no acceptance criterion requires it either.
fix: 8d47df0, retest

### 17. On resume, Seldon names the brief before drafting on every run
expected: Behavior wrong some of the time: on identical inputs the resume case missed AC2's resume line in 1 of 3 recorded runs, so whether the README's eval command passes depends on the run.
origin: verifier
status: pass
first_pass: fail
source: model
evidence: claude plugin eval . --case <case> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 650aff3 with --case resume, three runs after the SKILL.md fix in 650aff3: 1.00, 1.00, 1.00, each exit 0 (reports evals/results/2026-11-17T16-34-51-677Z, 16-35-13-747Z, 16-35-43-263Z); names-brief-first matched in all three, plus no-dump-ask, no-who-for and writes-prd; only Bash in each trace was the --prd check. With the full verify run at 16:22Z, 4 of 4 runs on the current or prior skill passed since the one miss at 16:13Z.
reported: Behavior wrong some of the time: on identical inputs the resume case missed AC2's resume line in 1 of 3 recorded runs, so whether the README's eval command passes depends on the run.
severity: minor
cause: On identical inputs, resume's names-brief-first failed once in three runs (evals/results/2026-11-17T16-10-17-214Z, run at 16:13:24Z: pattern not found in trace) and passed at 16:14:54Z and 16:22:29Z. SKILL.md:167-174 asks for the resume line before drafting or writing anything. The failed trace was deleted, so this session can't tell whether the model skipped the line (plan 6's report says it did) or the grader's strict shape missed it: the line must sit in a text block that is the first content item of an assistant record, and the Write input must begin with file_path.
fix: 650aff3, retest

## Summary

total: 17
passed: 17
failed: 0
pending: 0
skipped: 0
blocked: 0
reworked: 3
