---
status: testing
phase: 8
fields_version: 1
started: 2026-11-18
updated: 2026-11-18
---

## Items

### 1. Report names an uncovered requirement and a crossed boundary
expected: Over samples/readiness-uncovered with the readiness design, a bare /seldon prints an uncovered-requirement line naming CAT-01 and a crossed-boundary line naming E-02, each naming the step that fixes it, makes no Write or Edit, and ends on the fix-or-hand-off question with nothing after its question mark (evals/readiness-findings at 1.00).
criterion: AC1
status: pass
first_pass: pass
source: verifier
evidence: full-run-3/readiness-findings.trace.jsonl last message: the CAT-01 line with /seldon epics, the E-02 (Loans and Repairs) line with /seldon spine, then the readiness question last. No Write, Edit or skill Read. One seldon:readiness start. run.log: 6/6 graders, 1.00. The seed reads 'no stale link' under check.mjs --stale (run here).

### 2. The readiness check is one read-only agent on the three files
expected: The skill starts exactly one agent, seldon:readiness, hands it prd.md, spine.md and epics.md and no other path, makes no Read of those three itself, and the agent's own Reads are those three and nothing else (evals/readiness-agent at 1.00, graded on parent_tool_use_id).
criterion: AC2
status: pass
first_pass: pass
source: verifier
evidence: full-run-3/readiness-agent.trace.jsonl: L14 is the one Agent start, seldon:readiness, with exactly the three paths. L18, L21 and L24 are the agent's Reads of prd/spine/epics, all carrying parent_tool_use_id toolu_01EAaqyBda2TcTAAbdKEuj51. The skill thread makes no Read. by_type {seldon:readiness:1}. run.log: 8/8 graders, 1.00. agents/readiness.md:4-5 is Read-only.

### 3. Fix and hand-off answers do what they say
expected: After a one-crossing report, a fix edits spine.md so a Kind: boundaries decision names loans and repairs, makes no Write or Edit to epics.md and ends on the spine confirm question; a hand-off writes and edits nothing and ends on /cad-new-project --brief .planning/seldon (evals/readiness-fix and readiness-hand-off at 1.00).
criterion: AC3
status: pass
first_pass: pass
source: verifier
evidence: readiness-fix: L24 Edits spine.md, adding S-07 Kind: boundaries for repairs vs loans. There is no epics Write or Edit, and the run ends on the spine confirm question. Replaying that Edit in scratch makes --stale report epics.md stale. readiness-hand-off: only Globs, and it ends on /cad-new-project --brief .planning/seldon. Both score 1.00 in full-run-3/run.log.

### 4. Clean design ends on the right Cadence command
expected: Clean samples with no PROJECT.md: the no-findings line, no question, no Write or Edit, ending on /cad-new-project --brief .planning/seldon. With PROJECT.md: /cad-phase add --brief .planning/seldon and the already-built sentence, never /cad-milestone. A named design prints .planning/seldon/<name> (evals/resume-later, handoff-cadence, handoff-named at 1.00).
criterion: AC4
status: pass
first_pass: pass
source: verifier
evidence: Full run 3 final messages. resume-later: the no-findings line, then /cad-new-project --brief .planning/seldon. handoff-cadence: /cad-phase add --brief .planning/seldon plus the already-built sentence, with no /cad-milestone. handoff-named: /cad-phase add --brief .planning/seldon/repair-log plus the sentence. None writes or edits, and all three score 1.00. SKILL.md:1624-1660.

### 5. A check that can't run never reads as an all-clear
expected: With the agent withheld (disallowed_tools: [Agent]), a bare /seldon over the clean samples prints the did-not-run line, not the no-findings line, asks nothing, and prints the handoff command with the not-checked line (evals/readiness-not-run at 1.00).
criterion: AC5
status: pass
first_pass: pass
source: verifier
evidence: full-run-3/readiness-not-run.trace.jsonl: the init tools have no Task/Agent, and spawned is 0. The last message is the did-not-run line with its reason, the not-checked line, the lead-in and /cad-new-project --brief .planning/seldon, with no '?' and no no-findings line. 4/4 graders, 1.00.

### 6. Grant, validator, skill size and unit suite hold
expected: SKILL.md's allowed-tools is the pinned five with no agent entry (D-02 as settled after plan 1) and tests/skill.test.mjs fails on any other list; claude plugin validate --strict . passes with agents/readiness.md; a grep of skills/, README.md and evals/ for "come in a later release" finds 0 hits; SKILL.md is at most 90,000 bytes and a kept transcript shows the loaded skill equal to SKILL.md; the unit suite passes under the coverage gate (ci: node-test, coverage, plugin-validate).
criterion: AC6
status: pass
first_pass: pass
source: verifier
evidence: allowed-tools is the five (SKILL.md:5-10). The pin test fails when Agent(seldon:readiness) is planted or Glob dropped (a duplicate entry passes, adding no grant). validate --strict passes with exit 0, providing agents: seldon:readiness. 0 'come in a later release' hits. SKILL.md is 80,798 bytes. The loaded skill equals SKILL.md after substitutions at 6a41a0a (79,624 bytes) and at HEAD (replay transcripts after 373805f). The coverage-gated suite passes 115/115 at 99.41% lines and 97.90% branches.

### 7. The full eval suite passes
expected: The README's eval command with --keep-temp, every case including the rewritten resume-later and the nine new cases, exits 0 with every case at 1.00 (full run 3, the phase's AC7 gate per John's ruling; later commits re-ran only the cases they touch) (ci: node-test, coverage).
criterion: AC7
status: pass
first_pass: pass
source: verifier
evidence: full-run-3/run.log:590 '57 case(s) · 805s · $23.39', :592 'EXIT 0', with all 57 at 1.00, the nine new cases and resume-later included. The run was at 6a41a0a with README.md:74 plus --keep-temp (plan-7.5.md), and the run's loaded skill equals 6a41a0a's SKILL.md.

### 8. The trust question fires on data outsiders can reach
expected: Under John's "Go a" ruling, spine-who-relies (data shown on a members' catalog, no outside input) asks the trust and who-relies questions, spine-outside-input asks the trust question, spine-job asks no trust question, and spine-conventions records the trust answer under the catalog decision, each at 1.00 after 373805f.
status: pass
first_pass: pass
source: verifier
evidence: The spine-*-solo-after-phase-fix traces were run after 373805f, and their skill loads equal HEAD. who-relies asks the trust and who-relies questions, outside-input asks the trust question only, and job asks no trust question. spine-conventions writes S-05 (catalog) quoting 'must never show them the repair notes'. phase-fix.md has all four at 1.00.

### 9. An answer to a fix-started spine rerun's question goes back through the rerun
expected: On a project under Cadence, after a fix whose spine rerun stopped on who-relies, the answer edits spine.md with no Write, keeps the finding's new boundaries decision and the answer on a > line, leaves epics.md alone, starts no agent and ends on the spine confirm question (evals/readiness-fix-answer at 1.00).
status: pass
first_pass: pass
source: verifier
evidence: full-run-3/readiness-fix-answer.trace.jsonl: two Edits of spine.md (S-03 takes the answer, S-07 boundaries loans/repairs). No Write, no epics edit, no Agent, and it ends on the spine confirm question. 8/8 graders, 1.00. SKILL.md:231-248 routes it.

### 10. Scaffold tests catch unpassable graders and unreadable case.yaml
expected: tests/scaffold.test.mjs fails a tool_used grader with max: and no min:, and a case.yaml string key whose unquoted value holds ": " or " #", starts with a YAML indicator, is empty, is a block scalar or wraps onto the next line; it passes on every grader and case.yaml in the tree.
status: pass
first_pass: pass
source: verifier
evidence: tests/scaffold.test.mjs:95-181. It passes on the tree (suite run here). In a scratch copy, a planted max-only tool_used grader and a description holding 'word for word: the' each fail their test.

### 11. The plugin states its minimum Claude Code version
expected: plugin.json states engines["claude-code"] as >=2.1.327, and CI's plugin-validate job installs 2.1.327 and passes (ci: plugin-validate).
status: pass
first_pass: pass
source: verifier
evidence: .claude-plugin/plugin.json:13 '>=2.1.327'. .github/workflows/test.yml:75 installs @anthropic-ai/claude-code@2.1.327. validate --strict on plugin.json passes on local 2.1.327. The CI job's run is for the ci-status seam.

### 12. The readiness agent raises a real 'Decision left open' (CHECK-01's third kind)
expected: Behavior unproven: no automated check exercises it. CHECK-01 (REQUIREMENTS.md:42, mapped to phase 8) requires the agent to report decisions left open. 4cf4f7c then narrowed that kind, and no eval case since shows it firing on a real open decision. The only observed instance was a false positive in full run 2, before the narrowing. The ROADMAP's four success criteria don't name this kind, and the phase records already list it as a phase 9 must (.planning/CAPTURE.md:8). It is still a mapped requirement clause with no evidence behind it.
origin: verifier
status: pass
first_pass: fail
source: model
evidence: c85a141 adds evals/readiness-open-decision over samples/readiness-open-decision/epics.md: Repairs (E-03) split from Lending (E-02), every requirement on an epic, no crossing, and no spine decision on how a checkout learns a tool is logged broken. claude plugin eval . --case readiness-open-decision --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools ... : EXIT 0, score 1.00, 6/6 graders (names-open-decision, ends-on-question, one-finding, no-write, no-edit, no-other-agent). Trace evals/results/phase-8-traces/readiness-open-decision-try-1.trace.jsonl: L14 is the one Agent start, seldon:readiness, with the three paths. L18, L21 and L24 are its Reads of prd/spine/epics only. L28's agent reply is the single line 'Decision left open: E-02, E-03 (how a tool logged broken blocks a checkout). Fixed by rerunning /seldon spine.' L29's last message repeats it and ends on the readiness question. Skill, agent and lib are unchanged from 3f223be to c85a141, and the case's seed and fixture blobs (b174d123, a0374bf7) are the ones that ran. Graders pass their D-21 checks. Unit suite 115/115.
reported: Behavior unproven: no automated check exercises it. CHECK-01 (REQUIREMENTS.md:42, mapped to phase 8) requires the agent to report decisions left open. 4cf4f7c then narrowed that kind, and no eval case since shows it firing on a real open decision. The only observed instance was a false positive in full run 2, before the narrowing. The ROADMAP's four success criteria don't name this kind, and the phase records already list it as a phase 9 must (.planning/CAPTURE.md:8). It is still a mapped requirement clause with no evidence behind it.
severity: major
cause: No fixture or eval case shows the readiness agent raising a real Decision left open after 4cf4f7c narrowed the kind (agents/readiness.md:55-69); the only instance seen was full run 2's false positive.
fix: c85a141, retest

## Summary

total: 12
passed: 12
failed: 0
pending: 0
skipped: 0
blocked: 0
reworked: 1
