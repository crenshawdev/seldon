---
status: testing
phase: 9
fields_version: 1
started: 2026-11-18
updated: 2026-11-18
ci: e0d2637160f93f12d44f90c2753cca118cce25d9
---

## Items

### 1. The full graders' unit tests catch every bad input
expected: `node --test tests/graders.test.mjs` passes, and in it each new or changed full grader fails its hand-made bad input and passes a matching good one: the trace grader on an epics file missing one of its case's PRD IDs, the size grader on an epic with 6 IDs, the agent-result half on an Agent result with a finding line and no no-findings line, the last-message half on any of the three finding labels, the anchored recommends-fast-path grader on a bold, a mid-sentence and a split recommendation, and the test fails on any full grader pattern outside D-09 (ci: node-test, coverage)
criterion: AC1
status: pass
job: node-test, coverage
commit: e0d2637160f93f12d44f90c2753cca118cce25d9
first_pass: pass
source: model
evidence: node-test concluded success (node-test (24), node-test (22)) and coverage concluded success at e0d2637

### 2. Each full grader sits only in its own cases, with copies held equal
expected: The trace and size graders sit in full-walk, epics-from-spine and epics-split, both readiness-passes halves sit in resume-later, handoff-cadence, handoff-named and readiness-agent, no full grader sits in any other case folder, a unit test fails when two copies of the size grader or of either half differ by one byte, and every new `tool_used` grader with a `max:` has a `min:` (ci: node-test, coverage)
criterion: AC2
status: pass
job: node-test, coverage
commit: e0d2637160f93f12d44f90c2753cca118cce25d9
first_pass: pass
source: model
evidence: node-test concluded success (node-test (24), node-test (22)) and coverage concluded success at e0d2637

### 3. The new graders pass on kept traces and on the two real runs
expected: Each new or changed grader passes on its case's kept trace in `evals/results/phase-8-traces/full-run-3/`, file graders checked against the file rebuilt from the trace's Write and Edit inputs, and one `claude plugin eval` run each of full-walk and readiness-agent with the README's grant scores 1.00, full-walk's scored graders including the trace and size graders and readiness-agent's including both readiness-passes halves
criterion: AC3
status: pass
first_pass: pass
source: verifier
evidence: An independent re-match over full-run-3 passes every grader, with file graders checked against rebuilt epics.md. 2026-11-18T22-34-19-557Z full-walk has score 1 with every-requirement-traced and at-most-five-ids passed. 2026-11-18T22-35-37-821Z readiness-agent has score 1 with agent-finds-nothing and says-no-findings passed.

### 4. The spine confirm form, stale-spine's history and the solo runs
expected: SKILL.md lets `/seldon architecture` sit in a sentence just before a plain closing question, stale-spine's `ends-on-confirm.md` passes that form and fails a turn ending on a statement, stale-spine's history has `/seldon prd` ending on the conflict question naming S-03, then a plain go-ahead, then the applied change, every case whose graded turn ends on the spine confirm question scored 1.00 in a solo run within three tries, and SKILL.md is at or under 90,000 bytes
criterion: AC4
status: pass
first_pass: pass
source: verifier
evidence: SKILL.md:1306-1316 carries the new form, and SKILL.md is 80,867 bytes. The grader's form tests and three-copy equality pass. History L1-L6 run from the S-03 conflict question to the go-ahead to the applied change. The seven spine-confirm cases each score 1 on try 1 (aggregates 2026-11-18T22-20-06-990Z to 22-23-48-473Z).

### 5. A unit test proves the README's eval command runs every case
expected: A unit test fails when README.md's eval command carries `--case` or any other case filter, or when the README's case list and the case folders under `evals/` (leaving out `results/`) differ by one name, and it passes on the repo as the phase leaves it (ci: node-test, coverage)
criterion: AC5
status: pass
job: node-test, coverage
commit: e0d2637160f93f12d44f90c2753cca118cce25d9
first_pass: pass
source: model
evidence: node-test concluded success (node-test (24), node-test (22)) and coverage concluded success at e0d2637

### 6. No workflow runs the eval suite or sees a model key
expected: A unit test reads every file under `.github/workflows/` and fails on `claude plugin eval` or a model-key reference (`ANTHROPIC_API_KEY`, or a `secrets.` reference to a key), and passes on `test.yml`; SKILL.md's `allowed-tools` is still the pinned five, `claude plugin validate --strict .` passes, and the unit suite passes under the coverage gate (ci: node-test, coverage, plugin-validate)
criterion: AC6
status: pass
job: node-test, coverage, plugin-validate
commit: e0d2637160f93f12d44f90c2753cca118cce25d9
first_pass: pass
source: model
evidence: node-test concluded success (node-test (24), node-test (22)), coverage concluded success and plugin-validate concluded success at e0d2637

### 7. The roadmap, requirements and capture wording match the decisions
expected: ROADMAP.md's phase 9 criteria 2 and 3 read as D-03 and D-04 word for word, REQUIREMENTS.md's EVAL-04 reads D-04's row, and CAPTURE.md holds no "(phase 9)" tag and holds a `(backlog)` entry for each of D-20 to D-23
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: Exact-string comparison against CONTEXT.md's D-03, D-04 and EVAL-04 texts is true for all three. CAPTURE.md has 0 '(phase 9)' tags and (backlog) entries for D-20 to D-23 at :4-12.

## Summary

total: 7
passed: 7
failed: 0
pending: 0
skipped: 0
blocked: 0
reworked: 0
