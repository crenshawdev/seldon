---
phase: 8
status: complete
completed: 2026-11-18
---

# Phase 8: Readiness check and handoff - Summary

A bare `/seldon` with all four documents there and nothing stale now starts one read-only agent, `seldon:readiness`, on the PRD, spine and epics. The agent names a requirement no epic names, an epic crossing a boundary the spine didn't fix, or a decision left open, each by ID. Seldon repeats its report in fixed forms, asks whether to fix or hand off, and on a clean report ends on the exact Cadence command, `/cad-new-project --brief .planning/seldon` or `/cad-phase add --brief <folder>` on a project already under Cadence.

## What shipped

- The readiness agent. `agents/readiness.md` has `tools: Read` and `disallowedTools: Write, Edit, Bash`, the rules for CHECK-01's three kinds and the fixed reply lines (e1cb084). Its open-decision rule holds a decision left open to what an epic or the PRD needs, so a detail only the spine mentions, or an `[ASSUMPTION]` line, can't raise one (4cf4f7c). `tests/skill.test.mjs` pins both frontmatter lines (217ee9a).
- The minimum Claude Code version. `.claude-plugin/plugin.json` states `engines["claude-code"]` as `>=2.1.327`, the version the agent was proven on, and CI's plugin-validate job installs 2.1.327 (6be8d3d). It's to be revisited at release.
- The readiness check and the handoff in the skill. `skills/seldon/SKILL.md` §22 "The readiness check" replaces the later-release line: start exactly one agent with the three paths, start no other, repeat its reply in the fixed forms, say the did-not-run line when the start is refused or the reply isn't in those forms (640f136). §23 "The handoff" picks the command by whether `.planning/PROJECT.md` exists (1d2efea). The fix-or-hand-off answer is routed with the finding lines carried into the one rerun they name (18eb063). The answer to a question that a fix-started spine rerun stopped to ask goes back through the rerun (70a0b54). `allowed-tools` stays the pinned five, with no agent entry.
- The wider trust trigger (John's ruling, "Go a"). SKILL.md asks the trust-boundary question when the design takes outside input or its data shows on a page or service people outside the project can reach, whether it writes, changes or only reads that data, read from the brief, the PRD and, under Cadence, the code (e6a5d54, e46948c). The answer goes into the decision for the part outsiders reach, and the general parts rule now matches the trigger (373805f).
- Two fixture designs: `samples/readiness/` with exactly one crossing, E-02 across Loans and Repairs (2bea78b), and `samples/readiness-uncovered/epics.md`, which leaves CAT-01 on no epic (917f630).
- Nine new eval cases under `evals/`: `handoff-cadence`, `handoff-named` and `readiness-not-run` (c3e31db, 71ed0d4, 147351f); `readiness-findings`, `readiness-crossing`, `readiness-hand-off`, `readiness-fix`, `readiness-fix-answer` and `readiness-agent` (e2ff264, a2f3364, 7648c65, bdef24b, c0cbcde, 20e90e3). Every case that expects the start carries `no-other-agent`. `readiness-not-run` keeps the agent out with `disallowed_tools: [Agent]`. `readiness-agent` tells the skill's Reads from the agent's by `parent_tool_use_id`. `resume-later` now grades the clean report and the new-project handoff (6222bf4).
- Changed cases. `spine-who-relies` now requires the trust question (2481a6f), and `spine-conventions` was recaptured so its history asks both questions and its spine must quote the trust answer under the catalog (16b791d, 900d872).
- Three scaffold tests in `tests/scaffold.test.mjs`. A `tool_used` grader with `max:` and no `min:` fails (ca6c4c6). A case.yaml string key (`schema_version`, `name`, `description`, `history_file`) fails on an unquoted value holding `: ` or ` #`, starting with a YAML indicator, empty, a block scalar or wrapped onto the next line. It's named as a line check, not a YAML parse (dacedd9, 6a41a0a, 2e23b84).
- The README says what the readiness check and the handoff do, that Seldon starts one read-only agent and no grant limits which agent a skill starts, when the trust question is asked, and lists all 57 cases (b7c33e9, b657af4, 32d0e13, 373805f).

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | none | The probe: four runs measuring how the agent starts. No commit by design |
| 2 | 1 | e1cb084 | Add the readiness agent, Read only, with its three findings and fixed reply lines |
| 2 | 2 | 217ee9a | Pin the agent to `tools: Read` with Write, Edit and Bash disallowed |
| 2 | 3 | 6be8d3d | Require Claude Code 2.1.327 and pin CI to it |
| 4 | 1 | 2bea78b | Add the readiness design, one epic crossing a boundary the spine never drew |
| 4 | 2 | 917f630 | Add the readiness epics that leave CAT-01 on no epic (merged at 82c0953) |
| 3 | 1 | 640f136 | Run the readiness check from a bare `/seldon` where the later-release line stood |
| 3 | 2 | 1d2efea | End the readiness check on the Cadence command, chosen by whether PROJECT.md is there |
| 3 | 3 | 6222bf4 | Grade resume-later on the clean report and the new-project handoff |
| 3 | 4 | 18eb063 | Route a fix-or-hand-off answer, carrying the finding lines into the one rerun they name |
| 3 | fix | 70a0b54 | Diff-review medium: send an answer to a fix-started spine rerun's questions back through the rerun |
| 5 | 1 | c3e31db | Add handoff-cadence |
| 5 | 2 | 71ed0d4 | Add handoff-named |
| 5 | 3 | 147351f | Add readiness-not-run |
| 6 | 1 | e2ff264 | Add readiness-findings |
| 6 | 2 | a2f3364 | Add readiness-crossing, the live report the replays copy |
| 6 | 3 | 7648c65 | Add readiness-hand-off |
| 6 | 4 | bdef24b | Add readiness-fix |
| 6 | 5 | ca6c4c6 | Fail any tool_used grader that states a max with no min |
| 6 | 5 | c0cbcde | Add readiness-fix-answer |
| 6 | 6 | 20e90e3 | Add readiness-agent |
| 6 | fix | a5c6a34 | Diff-review medium: fixes-boundary passes only a new decision, S-07 or later |
| 7 | 1 | b7c33e9 | README: what the readiness check and the handoff do |
| 7 | 2 | b657af4 | README: the grant paragraph |
| 7 | 3 | 32d0e13 | README: the nine new cases and resume-later's line |
| 7 | 3 | e6a5d54 | Widen the trust trigger to data outsiders can reach (John's "Go a") |
| 7 | 3 | 2481a6f | spine-who-relies expects the trust question |
| 7 | 3 | 16b791d | Recapture spine-conventions on the wider trigger |
| 7 | 3 | 900d872 | Quote spine-conventions' description, which broke the YAML |
| 7 | 3 | 4cf4f7c | Hold a decision left open to what the epics or the PRD need |
| 7 | 3 | dacedd9 | The case.yaml string-key line check |
| 7 | 3 | 6a41a0a | Leave scaffold_script to the scaffold-name test |
| 7 | fix | e46948c | Diff-review medium: the trust trigger covers data the design only reads |
| 7 | fix | 2e23b84 | Diff-review low: the line check fails empty, block-scalar and wrapped values |
| phase | fix | 373805f | Phase-review medium: README.md:53 and SKILL.md's general parts rule match the trigger |

Plan amendments by the coordinator, each on the lead's ruling: 57b2a40 (plans 2 to 7 to the probe's ruling), 6c01f88 (readiness-fix-answer, two full runs), 841b775 (no-spine-write's min and the bound test), a359c05 (the wider trust trigger's lease), ccc0c94 (the open-decision rule and the YAML test), 35cfa51 (John's "the design's data shows" restored).

41 commits from 57b2a40 to 373805f: 34 task and fix commits, six plan amendments, and the merge 82c0953.

Reviews: each plan's diff review and the whole-phase review ran, and every `REVIEW-*.md` and `ADJUDICATION-*.json` under `.planning/phases/8/records/` belongs to this phase's record. Five findings were raised, all survived and all were fixed: three mediums (70a0b54, a5c6a34, e46948c), one low (2e23b84) and the phase review's medium (373805f). Plans 2, 4 and 5 raised none. Every plan's risk check matched no surface.

Eval runs: the probe made four runs. Each plan ran its own cases, and plan 7 ran full run 1 (56 of 57, spine-who-relies 0.86), full run 2 (54 of 57, three readiness misses) and full run 3. Full run 3, at 6a41a0a, is the AC7 gate: "57 case(s) · 805s · $23.39", EXIT 0, every case at 1.00 (`.planning/phases/8/records/reports/plan-7.5.md:97`). The four trust cases then passed solo after e46948c and again after 373805f. Traces are kept, git-ignored, in `evals/results/phase-8-traces/`.

## Deviations

- [deviation] Plan 1, the probe. Its outcome was "not scoped, or not shown". Run 2's case scoped the entry to `seldon:not-readiness`, and `seldon:readiness` still started. Run 3 started it with no Agent entry anywhere, so nothing gates an agent start in the eval on 2.1.327 under dontAsk. Run 4 showed the agent's own `tools: Read` held: it made no Write or Bash call and said "I have no Write tool." and "I have no Bash tool.". Daneel raised D-04 a's two runs to four for this probe, and settled D-02 as no grant change in phase 8. `claude plugin validate --strict` takes `engines["claude-code"]` on 2.1.327, against the docs' prediction that an unknown key fails. CONTEXT.md's D-02 and D-18 carry correction notes.
- [deviation] The plans were amended four times for the probe and later rulings (57b2a40, 6c01f88, a359c05, ccc0c94), plus two corrections (841b775, 35cfa51). readiness-fix-answer was added on Daneel's ruling after John lifted cost as a reason to defer tests. John's words: "dont need to worry about test / review costs do what it takes up to the point you are comfortable. I wont get upset with you I gave you the auth.  Nothing we cant revert or fix".
- [deviation] Plan 5. readiness-not-run's first run proved `disallowed_tools: [Agent]` works on 2.1.327: its init tools list has no `Task` and no `Agent`, and nothing started (`evals/results/phase-8-traces/readiness-not-run-try-1.trace.jsonl`).
- [deviation] Plan 6, the brief. The seam refused plan 6's brief at 39,299 bytes, over the 32,768-byte ceiling, so it ran on the plan file and the two phase documents. The coordinator's first resolve had already named the brief path in its bracket read, so that line names a file the executor never got.
- [deviation] Plan 6, no-spine-write. The coordinator's PLAN-6 draft spelled it with `max: 0` and no `min`, so the runner read it as "expected 1..0", and readiness-fix-answer's try 1 scored 0.88 with no Write made. Fixed by `min: 0` and the bound test ca6c4c6 (841b775, c0cbcde). The plan's D-21 check had tested only the regex, not the bounds.
- [deviation] Plan 6, readiness-fix-answer's try 2 made a skill-thread listing, `git ls-files --others --exclude-standard . ; ls -la`, accepted as read-only, with git refused by the sandbox. Within term D. It was the first fix-started spine rerun to make a listing, so the phase 9 todo at `.planning/CAPTURE.md:6` now covers the rerun route too.
- [deviation] Plan 7, full run 1. spine-who-relies asked the trust question because its code shows the shelf, which the repair log changes, on a catalog members browse from home. John chose option A. His words: "Go a". The option, word for word: "widen the trigger. The question also fires when the design's data shows on a page or service people outside the project can reach. This test case is then changed to expect the question." It landed in e6a5d54 and 2481a6f, with spine-conventions recaptured (16b791d). The coordinator's first proposal, a sentence saying a part people only browse sends nothing in, would have narrowed the question; Daneel turned it down.
- [deviation] Plan 7, the trust spec. Daneel's step-2 spec narrowed John's option to "data this design writes or changes" (PLAN-7.md:75), and the coordinator wrote it into the plan. Plan 7's diff review found the gap, and 35cfa51 and e46948c restore "the design's data shows". `.planning/ROADMAP.md:60` is a phase 4 criterion John's ruling widened. It's left as committed and isn't the current rule.
- [deviation] Plan 7, 900d872. The recaptured spine-conventions case.yaml had an unquoted description holding "word for word: the", which YAML can't parse, so the eval couldn't load the case. The unit tests didn't catch it. The string-key line check followed (dacedd9, 6a41a0a, 2e23b84).
- [deviation] Plan 7, full run 2. resume-later, handoff-cadence and handoff-named missed on one readiness-agent finding, "Decision left open: E-02, E-03 (who owns the record of failed reminder runs ...)". Inputs, version and model were identical to full run 1. The finding broke three of the agent's own rules: no epic needs the choice, the spine makes it, and an `[ASSUMPTION]` line settles it. Fixed by Daneel's anchor in 4cf4f7c, not the coordinator's broader "writes, shows or clears" sentence, and the six cases that start the agent passed solo after it.
- [deviation] The full-suite rule. John dropped the second full run. His words: "yes its over kill it will get tested well before release". Full run 3 alone is the AC7 gate, with AC6 taken from it. Then John set a rule for eval runs from here on. His words, "do it sorry i missed what was going on until now", answered "From here, a change gets eval runs only for the cases it touches, and the full suite runs once before release, as you said." So no phase gets an acceptance criterion that the full eval suite passes. Phase 8's AC7 stays met by full run 3, this kind of criterion conflicts with his rule and isn't repeated, and phase 9's context gate must not write one. e46948c, 2e23b84 and 373805f came after full run 3, and only the cases they touch were re-run.
- [deviation] Full run 3's listings. readiness-fix-answer's skill-thread `git ls-files --others --cached --exclude-standard . | grep ... | head -50` was refused by the permission layer (reject/config/mode), never ran, and appears in the run's `permission_denials`. spine-who-relies' accepted `git ls-files` listing, refused by the sandbox, is within term D. Both sit beside the phase 9 todo at `.planning/CAPTURE.md:6`.
- [deviation] The phase review's medium. README.md:53 and SKILL.md's general parts rule still described the narrow trigger. Fixed in 373805f. John on the README clause: "prose is fine".
- [deviation] The coordinator's own mistakes. It told Daneel that plan 5 or 6's cases covered the fix-answer route without checking; that was wrong and was corrected, and the route then got its case. It wrote no-spine-write without a `min`. It wrote the narrowed trust spec into PLAN-7.

## Open items

For phase 9:

- The todos at `.planning/CAPTURE.md:6` (the spine step's shell listing, now the rerun route too), `:7` (nothing limits which agent the skill starts) and `:8` (a must: a case where two epics' own text needs a choice no spine decision makes, proving "Decision left open" still fires after 4cf4f7c).
- `fixes-boundary` has no comment saying why S-01 to S-06 are excluded. Neither an eval run nor validate could show the runner accepts a `#` line in grader front matter (`.planning/phases/8/records/reports/plan-6.md:22`, `:44`). Add it once a run shows the form loads.
- The handoff command doesn't work yet. `/cad-new-project --brief` takes one file and `/cad-phase add` reads no file on Cadence 4.4.1, so Seldon isn't made public before Cadence's reader of the Seldon folder ships (D-16).

Closed:

- `.planning/phases/8/records/reports/plan-3.md:48`'s item, that no eval case covered the answer to a question a fix-started spine rerun stopped to ask, is covered by readiness-fix-answer (c0cbcde). That report stays as written.

Not tied to a phase:

- readiness-findings' last message opened with a lead-in sentence before the finding lines (plan-6.2.md). SKILL.md §22 doesn't forbid it, and no grader fails on it.
- Every phase 8 history records `"version":"2.1.327"`, and earlier histories say 2.1.326.
- Git-ignored runner files: replay session `.jsonl` files sit in case folders (one is `evals/spine-conventions/cb5abfcc-1f9e-4b7b-9434-2adabad26685.jsonl`, 2.8 MB), and each run left an HTML report under `evals/results/`. They're kept out of every commit.
- The phase fix ran under worker key `phase`, and `planning.mjs lease-check --plan phase` answers bad-args, so no lease check covered 373805f. It holds only README.md and SKILL.md.
- No lint or typecheck command is configured, so static analysis was skipped in every plan.

## Goal check

The goal and the four criteria are delivered, each proven by a case that passed in full run 3 at 6a41a0a (EXIT 0, 57 of 57, `.planning/phases/8/records/reports/plan-7.5.md:97`; traces in `evals/results/phase-8-traces/full-run-3/`). The independent check is `agents/readiness.md` (e1cb084), started from a bare `/seldon` by SKILL.md §22 (640f136). Criterion 1 is readiness-findings, which names CAT-01 on no epic and E-02's crossing (e2ff264). Criterion 2 is readiness-agent: one start of `seldon:readiness`, the three paths, the agent's Reads limited to them by `parent_tool_use_id`, and no Read of them by the skill (20e90e3). Criterion 3 is readiness-fix and readiness-hand-off, replaying the live one-crossing report from readiness-crossing (bdef24b, 7648c65, a2f3364), with readiness-fix-answer covering a fix whose rerun stops to ask (c0cbcde). Criterion 4 is resume-later ending on `/cad-new-project --brief .planning/seldon` (6222bf4), and handoff-cadence and handoff-named on `/cad-phase add --brief ...` under Cadence (c3e31db, 71ed0d4; the skill never names `/cad-milestone`, per D-12). readiness-not-run shows a check that couldn't run never reads as an all-clear (147351f). Two things are short of a full proof. Three commits came after the gate (e46948c, 2e23b84, 373805f): the four trust cases passed solo after each, and per John's rule no full run followed. And the command Seldon prints works only once Cadence's reader of the Seldon folder ships (D-16). The unit suite passes 115 of 115 at 373805f.

complete locally, not CI-verified
