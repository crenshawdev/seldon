---
status: testing
phase: 7
fields_version: 1
started: 2026-11-18
updated: 2026-11-18
ci: f2b17dcdf3c53ce4fec6a06a3c65a4b61bb418c3
---

## Items

### 1. /seldon prd names the spine decision before writing, and a decline writes nothing
expected: The prd-conflict case (seeded with samples/prd-rerun/brief.md, samples/prd.md and samples/spine.md) names S-03 in its conflict report and ends on the fixed conflict question with no Write or Edit. The prd-conflict-decline case also makes no Write or Edit and ends on the decline line naming /seldon brief. Both score 1.00 in the full eval run.
criterion: AC1
status: pass
first_pass: pass
source: verifier
evidence: full-run-2.log: prd-conflict 1.00 and prd-conflict-decline 1.00, both at 65dc09a with skills and evals unchanged since. Graders replayed on the kept traces all pass. The trace names S-03 by its shared quote and ends on the conflict question with 0 Write and 0 Edit, and the decline ends on the brief decline line naming /seldon brief. Skill text at SKILL.md:859-883 and :186-214.

### 2. A go-ahead applies the change, and a change named in conversation gets the same conflict report
expected: prd-conflict-apply edits prd.md so LOAN-03 sits on a Retired: line and the stamp holds the seeded brief's hash, repeats 'seldon check: prd.md conforms' and ends on the PRD confirm question. prd-change-conflict names S-03 with no Write or Edit. prd-change-decline ends on the nothing-changed line, which doesn't contain /seldon brief. All three score 1.00 in the full eval run.
criterion: AC2
status: pass
first_pass: pass
source: verifier
evidence: full-run-2.log: prd-conflict-apply, prd-change-conflict and prd-change-decline each 1.00, and the replayed graders all pass. prd.md rebuilt from the trace's Edits has 'Retired: LOAN-03', stamp sha256:38cbca64db3f39c8 (= samples/prd-rerun/brief.md hash), passes --prd, and is byte-identical to samples/spine-rerun/prd.md. The prd-change-decline final message ends on the nothing-changed line with no /seldon brief.

### 3. The --stale check names each stale link
expected: node lib/check.mjs --stale samples exits 0 and reports no stale link. It exits 1 and names the brief-to-PRD link on a folder seeded like prd-rerun, the PRD-to-spine link on one seeded like spine-rerun, and the spine-to-epics link on one seeded like epics-rerun. One changed byte in a parent marks its child stale, a folder of unstamped documents exits 0, each per-file mode fails on a malformed stamp and names the problem, and a unit test fails when a sample's stamp doesn't match its parent's hash. (ci: node-test, coverage)
criterion: AC3
status: pass
first_pass: pass
source: verifier
evidence: Local spot checks: --stale exits 0 on samples, exits 1 naming the one right link on each rerun seed, flags a one-byte parent change (including a change to the parent's own stamp line), exits 0 on unstamped docs, and exits 2 on a bad argument. The per-file modes exit 1 naming each malformed stamp. A mutated sample stamp makes tests/samples.test.mjs fail. Unit suite 111/111 and the coverage command with both guards pass locally. CI results were not observed.

### 4. A bare /seldon reruns a stale spine, then stale epics
expected: stale-spine says the fixed spine stale line, edits spine.md so S-03 sits on a Retired: line and its stamp holds the PRD's hash, repeats 'seldon check: spine.md conforms', ends on the spine confirm question and makes no Write or Edit to epics.md. stale-epics says the fixed epics stale line, edits epics.md so its stamp holds the spine's hash, repeats 'seldon check: epics.md conforms' and Reads nothing outside .planning/seldon/. Both score 1.00 in the full eval run. This is also ROADMAP success criterion 2.
criterion: AC4
status: pass
first_pass: pass
source: verifier
evidence: full-run-2.log: stale-spine 1.00 and stale-epics 1.00, with graders replayed and passing. The rebuilt spine retires S-03, holds the PRD hash, matches samples/epics-rerun/spine.md byte for byte, and leaves epics.md untouched. The rebuilt epics hold the spine hash and leave no stale link, with 0 Reads outside .planning/seldon/. Named beside it: known item (a), the stale-spine history.jsonl:2 back-story, ruled to phase 9, and known item (d), narration before the stale line.

### 5. A stale PRD is taken before missing epics
expected: stale-prd (samples/prd-rerun/brief.md, samples/prd.md and samples/spine.md seeded, no epics.md) says the fixed PRD stale line on a bare /seldon, not the epics resume line, then ends on the conflict question naming S-03 with no Write or Edit. It scores 1.00 in the full eval run.
criterion: AC5
status: pass
first_pass: pass
source: verifier
evidence: full-run-2.log: stale-prd 1.00, with all six graders replayed and passing. The trace runs Glob, Glob, --stale, the PRD stale line, then the Reads, and ends on the conflict question naming S-03 with 0 Write and 0 Edit and no epics resume line. Mutations of says-stale-line fail as intended.

### 6. The loaded skill equals SKILL.md byte for byte
expected: A kept eval session transcript from this phase shows the loaded skill byte for byte equal to skills/seldon/SKILL.md as the phase leaves it, after the loader's substitutions, with nothing cut.
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: In the fast-path and stale-prd session transcripts, the isMeta text equals SKILL.md's body at HEAD exactly after the base-directory prefix and the plugin-root and argument substitutions. Both end on </process>, so nothing is cut. SKILL.md is 74,471 bytes, under the 90,000-byte budget.

### 7. The full eval suite and the unit suite pass
expected: The README's eval command exits 0 with all 48 cases at 1.00, including full-walk, spine-from-prd and the rerun cases on stamped fixtures. Each check mode passes samples/, allowed-tools is still the pinned five, and the unit suite passes under the coverage gate. (ci: node-test, coverage)
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: full-run-2.log: 48 case pass lines and 0 fail lines, '48 case(s) · 718s · $18.66', EXIT 0. The case names equal the 48 eval folders, and the run was at 65dc09a with nothing exercised changed since. Every check mode passes samples/, allowed-tools is the five, the unit suite is 111/111, and coverage is 99.41/97.90 with both guards. CI jobs were not observed.

### 8. This run's arguments are stated once in the skill
expected: skills/seldon/SKILL.md holds the $ARGUMENTS token exactly once, on its own line between <seldon-arguments> and </seldon-arguments> inside section 1, and tests/skill.test.mjs fails if it is written into prose again or the block moves. In a kept bare-run transcript the block is empty, and in a kept dump-run transcript the dump appears once.
status: pass
first_pass: pass
source: verifier
evidence: SKILL.md:56-58 holds the one $ARGUMENTS inside section 1. The named skill test passes and fails on both a prose and a moved-block mutation. The stale-prd transcript's block is empty, and fast-path's dump appears once.

### 9. The README lists every eval case
expected: README.md's case list names each of the 48 case folders under evals/ exactly once, with none missing and no extras, and its eval command and --allow-tools rules are unchanged by this phase.
status: pass
first_pass: pass
source: verifier
evidence: The README Evals bullets, sorted, equal the 48 evals/ folders with no duplicates, and git diff 77e8e63..HEAD changes neither the eval command (README.md:70) nor the --allow-tools text.

### 10. A rerun over a stale link that changes nothing else still records the new stamp (D-02)
expected: behavior wrong: unproven. No automated check exercises it. The skill text says it, but no eval case seeds a stale link whose parent change leaves the child's content alone, so nothing shows whether the model makes the stamp-only Edit or leaves the link stale.
origin: verifier
status: skipped
first_pass: fail
source: model
evidence: skills/seldon/SKILL.md:497, :855, :1173 and :1378 and docs/FORMAT.md:267 state the rule. .planning/phases/7/CONTEXT.md:16 (D-02) and :52 make it a decision and predict the path. All six kept rerun traces in /tmp/cad-6Rynn3/traces/full-run-2/ change content as well as the stamp. No grader in evals/ and no test in tests/ covers a stamp-only rerun.
reported: behavior wrong: unproven. No automated check exercises it. The skill text says it, but no eval case seeds a stale link whose parent change leaves the child's content alone, so nothing shows whether the model makes the stamp-only Edit or leaves the link stale.
severity: minor
cause: No automated check exercises the rule. D-02 (.planning/phases/7/CONTEXT.md:16) decides that a rerun over a stale link that changes nothing else still records the new stamp, and skills/seldon/SKILL.md:497 says so, but no eval case seeds a stale link whose parent change leaves the child content alone and no unit test can show the model makes the stamp-only Edit. Every kept rerun trace changes content as well as the stamp. Proving it takes one new eval case, and the phase eval run budget is spent.
reason: Optional for phase 7 by explicit decision of Daneel [e140f7], lead, 2026-11-18: D-02's stamp-only rerun is written in the skill (SKILL.md:497) and nothing shows it broken, but no eval case proves it; adding the case needs a new sample, a seed vet and eval runs after both full runs are spent, and all seven acceptance criteria pass without it.

## Summary

total: 10
passed: 9
failed: 0
pending: 0
skipped: 1
blocked: 0
reworked: 1
