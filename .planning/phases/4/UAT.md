---
status: testing
phase: 4
fields_version: 1
started: 2026-11-17
updated: 2026-11-17
ci: 6f74be836c049854cc4b607a0f44bfb058c8de24
---

## Items

### 1. Spine written from a confirmed PRD
expected: The spine-from-prd case (bare /seldon over a scaffolded brief and PRD whose brief states stack and hosting, with no unattended work and no outside input) opens with the fixed resume line naming prd.md, creates .planning/seldon/spine.md and repeats `seldon check: spine.md conforms`; every decision has an S-NN heading, a Kind: line naming one of the six kinds, and a `> ` quote or an [ASSUMPTION] tag.
criterion: AC1
status: pass
first_pass: pass
source: verifier
evidence: spine-from-prd scores 1 with 8/8 graders in the 19:13:10Z full run. The Kind and quote-or-tag graders were checked to fail on broken spines, and lib/check.mjs:109-146 enforces S-NN headings and the six kinds.

### 2. Unattended work gets the run-time and failure questions
expected: spine-job (a design with a scheduled job) gets the fixed unattended-work question and the fixed failure question and writes nothing that turn; spine-outside-input (no unattended work) gets neither, by not_contains on both fixed lines.
criterion: AC2
status: pass
first_pass: pass
source: verifier
evidence: spine-job: asks-unattended, asks-failure, no-write, no-edit pass. spine-outside-input: no-unattended-question and no-failure-question pass. Both cases are history replays.

### 3. Outside input gets the trust-boundary question
expected: spine-outside-input gets the fixed trust-boundary question; spine-job, whose only input is the operator's own data, does not (not_contains).
criterion: AC3
status: pass
first_pass: pass
source: verifier
evidence: spine-outside-input asks-trust passes, and spine-job no-trust-question passes. The fixtures differ as AC3 requires: the public sends reports in one, and the other reads only the owner's own planting file.

### 4. Spine answers land in the job's own decision
expected: spine-answers writes spine.md, and the job's own S- decision carries the user's answer, including who is told when it breaks and how, as a `> ` quote.
criterion: AC4
status: pass
first_pass: pass
source: verifier
evidence: spine-answers: carries-answer, check-passes, writes-spine pass. carries-answer passes answers in the job's decision and fails answers in a decision holding only them.

### 5. Full architecture document only on request
expected: spine-from-prd makes no Write or Edit to any .planning/seldon/ path but spine.md; architecture-on-request, sending /seldon architecture over a confirmed spine, creates .planning/seldon/architecture.md.
criterion: AC5
status: pass
first_pass: pass
source: verifier
evidence: spine-from-prd no-write-but-spine and no-edit-but-spine pass. architecture-on-request writes-architecture passes, and its seed copies no architecture.md.

### 6. Spine rerun keeps IDs and retires the dropped one
expected: spine-rerun (/seldon spine over a brief, a changed PRD and a spine) keeps every untouched decision byte-identical, lists the dropped S- ID on a Retired: line, and does not reuse it.
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: spine-rerun: keeps-untouched-decisions, retires-dropped-id, no-reused-id pass. All three were checked to fail on a reworded or dropped decision, a missing or misplaced Retired line, and a reused S-03.

### 7. --spine check mode
expected: `node lib/check.mjs --spine` exits 0 on samples/spine.md with `seldon check: spine.md conforms`, and exits non-zero naming the problem on a decision with no Kind: line, with a kind outside the six, or with an empty body.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: `node lib/check.mjs --spine samples` prints 'seldon check: spine.md conforms', exit 0. The no-Kind, bad-kind and empty-body copies each exit 1, naming S-01, S-04 and S-05 and the problem.

### 8. allowed-tools unchanged
expected: SKILL.md's allowed-tools is still phase 2 D-02's five entries, per the pinned test in tests/skill.test.mjs.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: SKILL.md:5-10 holds the five D-02 entries, and tests/skill.test.mjs 'allowed-tools grants exactly D-02's five entries' passes.

### 9. Later-release lines name only epics
expected: resume-later (brief, PRD and spine seeded) ends on the epics-only later-release line, and epics-later does on /seldon epics.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: resume-later and epics-later each score 1, with says-later-release matching 'The epics step comes in a later release, so I've written nothing this time.' and no Write or Edit.

### 10. Old later-release line is gone
expected: A grep of skills/, docs/, README.md and evals/ for "The spine and epics steps come in a later release" finds 0 hits.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: git grep over the tracked tree finds 0 hits, and grep of skills/ docs/ README.md evals/ outside the gitignored evals/results finds 0 hits.

### 11. Full eval suite passes
expected: The full eval suite passes with the README's command, phase 1 to 3 cases included, with spine-later and resume-later rewritten.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: aggregate-result.json at 2026-11-17T19-13-10-936Z: 26/26 cases at 1.00, partial false, and the case list equals the evals/ folders. Only README.md changed outside .planning since the run started.

### 12. node-test passes in CI
expected: The node-test required job passes on this commit. (ci: node-test)
criterion: AC7
status: pass
job: node-test
commit: 6f74be836c049854cc4b607a0f44bfb058c8de24
first_pass: pass
source: model
evidence: node-test concluded success at 6f74be836c049854cc4b607a0f44bfb058c8de24 (node-test (22) and node-test (24) both success)

### 13. coverage passes in CI
expected: The coverage required job passes on this commit, the suite under the coverage gate. (ci: coverage)
criterion: AC7
status: pass
job: coverage
commit: 6f74be836c049854cc4b607a0f44bfb058c8de24
first_pass: pass
source: model
evidence: coverage concluded success at 6f74be836c049854cc4b607a0f44bfb058c8de24

## Summary

total: 13
passed: 13
failed: 0
pending: 0
skipped: 0
blocked: 0
reworked: 0
