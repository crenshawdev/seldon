---
status: testing
phase: 5
fields_version: 1
started: 2026-11-17
updated: 2026-11-17
ci: ed9470378f6fd7bb9f89d9be0b02cf7b1f8e5e38
---

## Items

### 1. Full walk resumes into the epics step
expected: The full-walk replay (history through the brief, PRD and spine confirms; brief, PRD and spine seeded; bare /seldon) says the epics resume line naming spine.md before any tool call, creates .planning/seldon/epics.md, repeats `seldon check: epics.md conforms`, ends on the epics confirm question, and makes no Write or Edit to any .planning/seldon/ path but epics.md
criterion: AC1
status: pass
first_pass: pass
source: verifier
evidence: Final run full-walk 6/6 graders. The session record shows Glob, then the epics resume line, then Read prd.md and spine.md, one Write of epics.md, the --epics check, and a last message with the pass line ending on the epics confirm question. The extracted draft passes --epics.

### 2. Confirm at the epics step ends on the /clear words
expected: The epics-confirm replay ends on the /clear words with Write and Edit at 0
criterion: AC1
status: pass
first_pass: pass
source: verifier
evidence: Final run epics-confirm 3/3. The session record has no tool_use, and its last text is exactly the /clear words.

### 3. Epics drafted from the spine carry the six fields and the right citations
expected: The epics-from-spine case (Toolshed brief, PRD and spine seeded; /seldon epics) creates epics.md where every epic has the six fields, only S-01 to S-06 are cited and each at least once, every epic cites S-02, S-04 and S-05, and every done-when holds the fixed integrated item
criterion: AC2
status: pass
first_pass: pass
source: verifier
evidence: Final run epics-from-spine 9/9. Probed graders pass the samples and the full-walk draft, and fail on a missing S-04, a stray S-07, a duplicate requirement and a missing integrated item.

### 4. An oversized category splits along its spine boundary
expected: The epics-split case writes at least two epics for the 8-requirement category, none over 5 requirement IDs or 5 done-when items, none mixing both sides of the boundary, and both halves cite the boundary's S- ID
criterion: AC3
status: pass
first_pass: pass
source: verifier
evidence: Final run epics-split 6/6. The probe fails the count and halves splits on no-mixed-epic, an uncited half on both-halves-cite-boundary and six done-when items on at-most-five-done-when. A correct split passes all graders and --epics.

### 5. No boundary to cut an oversized category writes nothing
expected: The epics-no-boundary case makes Write and Edit 0 and names /seldon spine
criterion: AC3
status: pass
first_pass: pass
source: verifier
evidence: Final run epics-no-boundary 4/4 (Lettings named, /seldon spine named, Write 0, Edit 0). The fixture spine has no Kind: boundaries.

### 6. Epics rerun keeps IDs and retires the dropped epic
expected: The epics-rerun case keeps E-01 byte-identical, keeps E-02's ID with S-03 removed, lists E-03 on a Retired: line, and does not reuse E-03
criterion: AC4
status: pass
first_pass: pass
source: verifier
evidence: Final run epics-rerun 4/4. The probe fails the unchanged sample, a Retired line after the last epic and a one-character change in E-01.

### 7. All four documents there: writes nothing and names the later release
expected: The resume-later case (all four documents seeded; bare /seldon) writes nothing and ends on the later-release line naming the readiness check and the handoff
criterion: AC5
status: pass
first_pass: pass
source: verifier
evidence: Final run resume-later 3/3 with all four documents seeded. The line comes from SKILL.md:262-264.

### 8. /seldon epics with no spine writes nothing
expected: The epics-no-spine case writes nothing and names /seldon spine
criterion: AC5
status: pass
first_pass: pass
source: verifier
evidence: Final run epics-no-spine 3/3 (names /seldon spine, Write 0, Edit 0). The route is SKILL.md:83-84.

### 9. The old epics later-release line is gone
expected: git grep for 'The epics step comes in a later release' across skills/, docs/, README.md and evals/ finds 0 hits
criterion: AC5
status: pass
first_pass: pass
source: verifier
evidence: git grep across skills/, docs/, README.md and evals/ printed nothing, exit 1.

### 10. The --epics check passes the sample and fails each fault
expected: node lib/check.mjs --epics exits 0 on samples/ with its pass line, and non-zero naming the problem on an epic with 6 requirement IDs, 1 or 6 done-when items, a Depends on naming a later epic, or a missing field; the full check fails on the same
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: --epics on samples exit 0 with `seldon check: epics.md conforms`. Six IDs, 1 item, 6 items, a label-line-only done-when, a later/unknown/self Depends on and a missing Boundaries each exit 1 with the epic, field and problem, through --epics and the full check alike.

### 11. allowed-tools is still the pinned five
expected: node --test tests/skill.test.mjs passes
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: tests/skill.test.mjs both tests pass in the suite run. SKILL.md:5-10 lists the five entries.

### 12. The full eval suite passes with the README's command
expected: The README's eval command exits 0 with all 32 cases at 1.00, phase 1 to 4 cases included
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: aggregate-result.json at evals/results/2026-11-17T22-48-58-394Z: 32 of 32 cases at score 1, partial false, run after 6138455 with no later change outside .planning/. plan-7.md records exit 0 and a Bash audit of only the four checks.

### 13. The unit suite passes under the coverage gate
expected: The node-test and coverage jobs pass (ci: node-test, coverage)
criterion: AC6
status: pass
job: coverage
commit: ed9470378f6fd7bb9f89d9be0b02cf7b1f8e5e38
first_pass: pass
source: model
evidence: coverage concluded success at ed9470378f6fd7bb9f89d9be0b02cf7b1f8e5e38

### 14. README describes the epics step
expected: README.md's Using it describes the walk through all four steps, the epics step with its limits and boundary split, the stop pointing to /seldon spine, the resume into epics, the /seldon epics rerun with its Retired: line, and the later-release line once all four are there
status: pass
first_pass: pass
source: verifier
evidence: README.md:39, 43, 49 and 53 cover the four-step walk, the resume into epics, the all-four later-release line, the limits and boundary split, the /seldon spine stop and the /seldon epics rerun with Retired:. The Evals list matches the 32 case folders.

### 15. node-test passes in CI
expected: The node-test required job passes on this commit. (ci: node-test)
criterion: AC6
status: pass
job: node-test
commit: ed9470378f6fd7bb9f89d9be0b02cf7b1f8e5e38
first_pass: pass
source: model
evidence: node-test concluded success at ed9470378f6fd7bb9f89d9be0b02cf7b1f8e5e38 (node-test (22) and node-test (24) both success)

## Summary

total: 15
passed: 15
failed: 0
pending: 0
skipped: 0
blocked: 0
reworked: 0
