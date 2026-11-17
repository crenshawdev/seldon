---
status: testing
phase: 2
fields_version: 1
started: 2026-11-17
updated: 2026-11-17
ci: 0a40e84bc7ced3378c353254b5056a3f349954da
---

## Items

### 1. Seldon asks for the dump, recommends a path and writes nothing first
expected: The no-dump case (a bare /seldon) asks for the dump in a question with Write and AskUserQuestion at 0, and the asks-for-dump replay recommends fast path or coaching with Write at 0 until the user confirms; both score 1.00.
criterion: AC1
status: pass
first_pass: pass
source: model
evidence: no-dump 1.00 and asks-for-dump 1.00. claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 0a40e84: exit 0, all ten cases 1.00, no 'not granted', no 'scaffold failed', $1.75 (evals/results/2026-11-17T11-58-06-824Z)

### 2. A confirmed fast path writes a tagged, checked brief with reasoned refusals
expected: The fast-path-brief case creates .planning/seldon/brief.md, the reply carries 'seldon check: brief.md conforms', the brief holds an [ASSUMPTION] tag, and What it refuses holds a refusal with a reason; the case scores 1.00.
criterion: AC2
status: pass
first_pass: pass
source: model
evidence: fast-path-brief 1.00 (writes-brief, check-passes, tags-assumption, states-refusal, runs-check all matched). claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 0a40e84: exit 0, all ten cases 1.00, no 'not granted', no 'scaffold failed', $1.75 (evals/results/2026-11-17T11-58-06-824Z)

### 3. Seldon asks who the project is for before writing
expected: The asks-who-for replay, whose dump never says who it's for, asks who it's for with Write at 0 in that turn; the case scores 1.00.
criterion: AC3
status: pass
first_pass: pass
source: model
evidence: asks-who-for 1.00. claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 0a40e84: exit 0, all ten cases 1.00, no 'not granted', no 'scaffold failed', $1.75 (evals/results/2026-11-17T11-58-06-824Z)

### 4. The design folder is read and nothing is written outside .planning/seldon/
expected: The design-folder case (scaffolded from samples/) names a fact found only in the fixture with Edit at 0, Write at 0 outside .planning/seldon/ and Bash at 0 but the check; the write-scope case shows Write and Edit outside .planning/seldon/ at 0 with no run error; both score 1.00.
criterion: AC4
status: pass
first_pass: pass
source: model
evidence: design-folder 1.00 (scaffold seed.sh ran) and write-scope 1.00. claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 0a40e84: exit 0, all ten cases 1.00, no 'not granted', no 'scaffold failed', $1.75 (evals/results/2026-11-17T11-58-06-824Z)

### 5. Coaching ends in a checked brief that quotes an answer word for word
expected: The coaching-brief replay creates .planning/seldon/brief.md, the reply carries the check's pass line, and a regex finds a replayed answer's phrase inside a quoted line in brief.md; the case scores 1.00.
criterion: AC5
status: pass
first_pass: pass
source: model
evidence: coaching-brief 1.00 (quotes-answer matched). claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 0a40e84: exit 0, all ten cases 1.00, no 'not granted', no 'scaffold failed', $1.75 (evals/results/2026-11-17T11-58-06-824Z)

### 6. An existing brief is left alone
expected: The existing-brief case (brief seeded by the scaffold) shows Write and Edit at 0 and says that rerunning a step comes later; the case scores 1.00.
criterion: AC6
status: pass
first_pass: fail
source: model
evidence: claude plugin eval . --case existing-brief (same flags, with --scaffold) at 52907df: exit 0, score 1.00, with says-rerun-later now re-?run[^\n]*\blater\b, and no-write and no-edit at 0 (evals/results/2026-11-17T12-06-10-734Z). The pattern matches SKILL.md:73's fixed line and fails an offer to rerun now.
reported: behavior unproven: the 'comes later' half of AC6 has no grader. says-rerun-later matches any 'rerun', so a reply offering to rerun the brief step now (against D-08) with no write scores 1.00.
severity: minor
fix: 52907df, retest

### 7. Brief check, scaffold guard, allowed-tools and suite hold locally
expected: node lib/check.mjs --brief samples exits 0 and exits non-zero naming the section on a brief missing one; the scaffold guard test fails on a planted script with a forbidden command; SKILL.md's allowed-tools holds no Edit beyond Edit(.planning/seldon/**) and no Bash broader than the check command (AC7 read the way D-02 corrected 'No Edit'); node --test passes under the coverage gate.
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: `node lib/check.mjs --brief samples` gives 'seldon check: brief.md conforms', exit 0. A brief without What it refuses gives 'brief.md: What it refuses: missing section', exit 1. A planted seed.sh line 'curl ...' made tests/scaffold.test.mjs fail at 'evals/zz-plant/seed.sh:3: not an allowed line', exit 1, in a scratch copy. SKILL.md:4-9 allowed-tools is exactly Read, Glob, Grep, Edit(.planning/seldon/**) and Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*), and a planted '- Write' fails tests/skill.test.mjs:45. The coverage job's command on a copy of HEAD (Node 26.13.1) gave exit 0, 49/49 pass, lib at 99.12% lines and 97.78% branches against 85/85, and both lcov guards exit 0.

### 8. node-test and coverage pass in CI
expected: The node-test and coverage jobs pass on the pushed head. (ci: node-test, coverage)
criterion: AC7
status: pass
job: node-test
commit: 0a40e84bc7ced3378c353254b5056a3f349954da
first_pass: pass
source: model
evidence: node-test concluded success (node 22 and 24) and coverage concluded success at 0a40e84bc7ced3378c353254b5056a3f349954da (test-policy ci-status, answer pass)

### 9. Every guess in the fast-path brief is tagged [ASSUMPTION] (ROADMAP SC2)
expected: behavior unproven: no automated check exercises 'every guess tagged'. ROADMAP phase 2 criterion 2 says 'with every guess tagged [ASSUMPTION]', but AC2 and the fast-path-brief case only require one tag, and the check ignores tags by design (D-06). A brief that leaves a guess untagged scores 1.00.
origin: verifier
status: pass
first_pass: fail
source: model
evidence: claude plugin eval . --case fast-path-brief --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)" at 52907df: exit 0, score 1.00. every-item-quoted-or-tagged printed 'pattern absent as expected' (no item without a quote or an [ASSUMPTION] tag), and check-passes, runs-check, states-refusal, tags-assumption and writes-brief all matched (evals/results/2026-11-17T12-06-20-062Z).
reported: behavior unproven: no automated check exercises 'every guess tagged'. ROADMAP phase 2 criterion 2 says 'with every guess tagged [ASSUMPTION]', but AC2 and the fast-path-brief case only require one tag, and the check ignores tags by design (D-06). A brief that leaves a guess untagged scores 1.00.
severity: major
fix: 52907df, retest

## Summary

total: 9
passed: 9
failed: 0
pending: 0
skipped: 0
blocked: 0
reworked: 2
