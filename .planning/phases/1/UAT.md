---
status: testing
phase: 1
fields_version: 1
started: 2026-11-17
updated: 2026-11-17
---

## Items

### 1. FORMAT.md defines the four files
expected: docs/FORMAT.md defines brief.md, prd.md, spine.md and epics.md under .planning/seldon/, the sections each carries, the ID spellings **CAT-01**, S-01 and E-01, and the six epic field labels Outcome, Boundaries, Done when, Depends on, Requirements and Spine decisions.
criterion: AC1
status: pass
first_pass: pass
source: verifier
evidence: docs/FORMAT.md:7-12 lists the four files, :26-50 the brief and PRD sections, :54-99 the **CAT-01**, S-01 and E-01 grammar, and :103-110 the six epic labels. A grep -qF loop over PLAN-1's 27 required strings found miss=0. The four example blocks, extracted and run through node lib/check.mjs, conform with exit 0.

### 2. Format check passes the samples and names a missing field
expected: node lib/check.mjs samples exits 0, and on a copy of samples/ whose epic lacks a required field it exits non-zero and prints that field's name.
criterion: AC2
status: pass
first_pass: pass
source: verifier
evidence: `node lib/check.mjs samples` printed 'seldon check: all four documents conform' with exit=0. A scratch copy without E-01's **Boundaries:** line printed 'epics.md: E-01: Boundaries: missing field' with exit=1. Named tests passed: six 'an epic missing <label> fails, naming the field and the epic' cases and 'a missing field exits 1 and prints the field and the epic' (tests/check.test.mjs:47-62).

### 3. Both eval cases pass locally
expected: claude plugin eval . --trust-plugin --no-publish --ablation none exits 0 with the fast-path and replay cases both scoring 1.00.
criterion: AC3
status: pass
first_pass: pass
source: model
evidence: `claude plugin eval . --trust-plugin --no-publish --ablation none` exit=0: fast-path score 1.00 (no-ask-user-question: AskUserQuestion called 0x; recommends-fast-path matched), replay score 1.00 (recalls-transcript-fact matched Brindlewick); 2 cases, $0.19, report kept local under evals/results/.

### 4. Plugin validates strictly
expected: claude plugin validate --strict . exits 0.
criterion: AC4
status: pass
first_pass: pass
source: verifier
evidence: `claude plugin validate --strict .` printed 'skills: seldon:seldon' and '✔ Validation passed', exit=0 (CLI 2.1.326). The ICON_MISSING note is a directory warning that does not change the result.

### 5. Plugin installs from its own marketplace in CI
expected: The plugin-validate job installs seldon from the repository's own marketplace and passes on the pushed commit. (ci: plugin-validate)
criterion: AC5
status: pending_ci
job: plugin-validate
commit: 565a5fd6e28279fa7354cbf6646bae76f44ec160
source: model
evidence: The install from the repository's own marketplace runs only in the plugin-validate CI job; a local install is held for John, and the commit has not been pushed yet.

### 6. README credits BMad and no name carries it
expected: README.md contains "inspired by BMad", and BMad appears in no plugin name, command name or manifest field.
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: README.md:9 reads 'The method is inspired by BMad'. `grep -rni bmad .claude-plugin skills README.md` hits only README.md:9. Plugin, marketplace, skill directory and skill frontmatter names are all 'seldon'.

### 7. Testing policy agrees with the workflow
expected: planning.mjs test-policy check --root . returns ok:true: the workflow carries the accepted coverage commands, names node-test, coverage and plugin-validate, and .github/cadence/coverage-policy.json is tracked.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: `planning.mjs test-policy check --root .` returned {"ok":true,"problems":[]}, exit=0. coverage-policy.json is tracked, and test.yml defines node-test, coverage and plugin-validate. The accepted coverage command on a clean copy of HEAD gave 32 passed and 0 failed, lib/check.mjs at 99.07% lines and 97.75% branches, and both LCOV guards exited 0.

## Summary

total: 7
passed: 6
failed: 0
pending: 0
pending_ci: 1
skipped: 0
blocked: 0
reworked: 0
