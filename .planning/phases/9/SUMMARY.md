---
phase: 9
status: complete
completed: 2026-11-18
---

# Phase 9: The full graders - Summary

The size, trace and readiness-passes graders now sit in every case that writes what they grade, and three unit tests hold the line around them. `tests/graders.test.mjs` keeps every full grader to its own cases and its copies equal. `tests/eval-suite.test.mjs` fails when the README's eval command carries a case filter or its case list drifts from `evals/`. `tests/workflows.test.mjs` fails any workflow that runs the eval suite or can reach a model. The spine confirm question's form is settled, stale-spine replays a history the skill at HEAD produces, and all ten of the phase's eval runs scored 1.00 on the first try.

## What shipped

- The size grader `at-most-five-ids.md` in every case that writes epics, with a test holding the copies byte-equal (f34f484).
- The trace grader `every-requirement-traced.md` for full-walk and epics-split, each over its own seeded PRD IDs (28c890b).
- The readiness-passes grader in two halves, copied into resume-later, handoff-cadence, handoff-named and readiness-agent. The last-message half refuses the three finding labels (794a049), and the agent-result half reads the Agent tool's result in the trace (052413f).
- The recommendation graders anchored to a line of their own, so a bold label or a mid-sentence mention no longer passes (9362ca6).
- `tests/graders.test.mjs`: every full grader's pattern stays inside D-09's forms (9f92e28), every full grader is held to its own cases (70ef1f5), and the spine confirm grader's passing forms, failing forms and three copies are pinned (4482e4c).
- `tests/eval-suite.test.mjs`: the README's `claude plugin eval` command carries no case filter, read whole across backslash continuations, and its case list matches the 58 case folders. A case file anywhere but `evals/<case>/<file>` fails, and so does `experimental.evals` in `.claude-plugin/plugin.json` (e5af664, f943e75, dc42547, cf7063e).
- `tests/workflows.test.mjs`: a workflow fails on `plugin eval` in any spelling (npx, a backslash continuation, a folded block), on `ANTHROPIC_API_KEY` or any `secrets` reference other than `GITHUB_TOKEN`, on `id-token:` or `write-all`, and on any backslash, since every YAML escape starts with one (2f3d9d1, dfa72ce, 7245f24, 79ce674, db1868e, 3bdd31f, 4cfa959).
- `skills/seldon/SKILL.md` section 17: a sentence just before the spine confirm question names `/seldon architecture`, on the question's line or the line before it, and the question mark stays last. stale-spine's `ends-on-confirm.md` and its byte copies in readiness-fix and readiness-fix-answer accept that form (4482e4c). README.md says the same (58d42c4).
- `evals/stale-spine/history.jsonl`: six lines that replay the `/seldon prd` turn through the S-03 conflict question and the go-ahead, captured from the skill at HEAD. The capture's rebuilt prd.md equals `samples/spine-rerun/prd.md` byte for byte (af0c7bc).
- The evidence, kept local under D-27 in the git-ignored `evals/results/phase-9-traces/`: 18 of 18 new and changed graders pass against their kept phase 8 traces, and the ten runs D-10 names each scored 1.00 on try 1, 10 tries of the 30 allowed. Every run's Bash and agent audit came back clean, or within terms (see Deviations).

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | f34f484 | Put the size grader in full-walk and epics-from-spine, held equal by test |
| 1 | 2 | 9f92e28 | Fail any full grader whose pattern uses a form outside D-09 |
| 1 | 3 | 28c890b | Give full-walk and epics-split a trace grader over their own seeded PRD IDs |
| 1 | 4 | 794a049 | Make the last-message half refuse the three finding labels |
| 1 | 5 | 052413f | Add the agent-result half, read from the Agent tool's result |
| 1 | 6 | 9362ca6 | Anchor the recommendation graders to a line of their own |
| 1 | 7 | 70ef1f5 | Hold every size, trace and readiness-passes grader to its own cases |
| 2 | 1 | e5af664 | Prove the README's eval command runs every case |
| 2 | 2 | 2f3d9d1 | Fail any workflow that runs the eval suite or sees a model key |
| - | - | 541b0d8 | Merge plan 2's worktree branch into cadence/v0.1.0 |
| - | - | 173ee51 | Amend PLAN-2.md to read the eval command whole across backslash continuations |
| 2 | fix A | dfa72ce | Flag YAML `\x`, `\u` and `\U` escapes that can spell a hidden name |
| 2 | fix A | 7245f24 | Prove the escaped model key is caught as an escape, not by name |
| 2 | fix B | f943e75 | Check the README's eval command whole across backslash continuations |
| 2 | fix C | 79ce674 | Catch `plugin eval` through npx and backslash continuations |
| 2 | fix D | dc42547 | Fail on a nested case file or a manifest eval dir the case list can't see |
| 2 | fix E | db1868e | Fail any workflow that asks for an OIDC id-token |
| 2 | fix F | 3bdd31f | Fail on `permissions: write-all`, which grants an id-token unnamed |
| 2 | fix G | cf7063e | Fail on a case file sitting directly in `evals/` |
| 2 | fix H | 4cfa959 | Fail on any backslash in a workflow, so an escaped line break can't rejoin a hidden name |
| 3 | 1 | 4482e4c | Let `/seldon architecture` sit in a sentence just before the spine confirm question |
| 3 | 2 | af0c7bc | Replay stale-spine through the S-03 conflict question and the go-ahead |
| 3 | 3 | none | Solo-run the six other cases that end on the spine confirm question, all 1.00 on try 1 |
| 3 | fix 1 | 58d42c4 | Say in the README that the command comes just before the confirm question |
| 4 | 1 | none | Match every new and changed grader against its kept trace, 18 of 18 pass |
| 4 | 2 | none | Run full-walk once with the README's grant, 1.00 on try 1 |
| 4 | 3 | none | Run readiness-agent once with the README's grant, 1.00 on try 1 |

## Deviations

- [deviation] Plan 1: D-09 lists no `\b`, and the form check accepts it on Daneel's ruling. every-requirement-once.md wraps each ID in `\b` and scored 1.00 in phase 8's full run 3, and with `u` refused it reads the same in Node on ASCII IDs. Inside a class, `\b` (backspace) stays refused.
- [deviation] Plan 2, fixes A to H, each on a ruling over a review finding. Task 2's three workflow rules read raw text, so the guard grew to close every way around them: YAML `\x`, `\u` and `\U` escapes (A, dfa72ce and 7245f24), then every backslash (H, 4cfa959); `plugin eval` across npx and continuations (C, 79ce674); an OIDC `id-token:` key, John's ruling "Flag id-token (Recommended)" (E, db1868e), and `write-all`, which grants the same thing unnamed (F, 3bdd31f). Task 1 read only the eval command's first line and only the top-level case folders, so it now reads continuation lines (B, f943e75, with PLAN-2.md amended in 173ee51) and fails a case file outside `evals/<case>/<file>` or a manifest eval dir (D and G, dc42547 and cf7063e). A shell `\` continuation or `\x` in a run block is flagged too, which fails closed and is accepted. Fix H is kept on John's ruling: he picked "Keep it (Recommended)", the option "It's committed and clean, so the finding is recorded as fixed and nothing more runs."
- [deviation] Plan 3: D-13 named only stale-spine's grader. On Daneel's ruling, readiness-fix's and readiness-fix-answer's `ends-on-confirm.md` changed with it as byte copies, and a test holds the three equal (4482e4c). Without them SKILL.md would allow a form two graders fail.
- [deviation] Plan 3: diff review finding 1 (REVIEW-diff-4cfa959-af0c7bc.md, low) found README.md:61 still saying the confirm question names the command. On Daneel's ruling README.md joined plan 3's files for that one sentence, against the plan's "Out: the README", and was fixed in 58d42c4.
- [carried term, not a new grant] Phase 8's term D carries into phase 9 for plan 3 and plan 4's runs, on Daneel's ruling ("option 1, within terms") over readiness-fix-answer try 1's read-only `ls -la /tmp/claude-eval-7SiYuL/home/cwd` at trace L19. It rests on John's phase 6 read-only listing ruling ("1"). It covers a command that only lists or reads files, accepted read-only (subcommandResults), inside the sandbox, on the skill's own thread only, with each listing quoted whole with its permission record. Any Bash from an agent, any write or other command, and any listing in a case whose seed copies code or a .env without the no-secret grader still stop as SECURITY. Plan 4's two runs made no listing.
- [deviation] Final suite counts ran above the executors' predictions (177 against 124 in plan 2, 187 against 181 in plan 3). Plan 2's gap is plan 1's later commits merging in, and plan 3's is Node counting the six subtests of the two new form tests. Nothing changes in what done means.

## Open items

- The workflow guard flags the bare word `secrets` anywhere except `secrets.GITHUB_TOKEN`, so `toJSON(secrets)` and `secrets: inherit` fail, and so does a YAML comment that only mentions the word. test.yml has no such comment today, and the finding that raised it is declined in `.planning/records/DECLINED.md` (7fb4b04dcc728f65).
- Line 4 of stale-spine's history says the user journey still mentions a reminder. That's true of `samples/spine-rerun/prd.md`, which the rebuild matched byte for byte, and it stays as the skill wrote it, because D-28 requires the history to be what the skill at HEAD produces.

## Goal check

The commits plausibly deliver the goal, with two limits named below. Criterion 1: the size grader fails a sixth ID and passes five (f34f484), the trace grader fails a missing or twice-listed ID (28c890b), the readiness-passes halves fail each of the three finding labels and a dropped finding (794a049, 052413f), and `writes-epics.md` fails a missing epics.md, which passed in full-walk's run (plan-4.md Task 2). Criterion 2: full-walk at 58d42c4 scored 1.00 with `every-requirement-traced.md`, `at-most-five-ids.md` and `writes-epics.md` passing (evals/results/2026-11-18T22-34-19-557Z/aggregate-result.json, 9 `"passed":true` and 0 `"passed":false`, checked this run), and readiness-agent scored 1.00 with both readiness-passes halves passing (evals/results/2026-11-18T22-35-37-821Z/aggregate-result.json, 11 true and 0 false). resume-later, handoff-cadence and handoff-named pass readiness-passes against their kept phase 8 traces only (plan-4.md Task 1), because D-10 runs a case fresh only when its behavior or history changed. The "one eval case drives one user turn" half of criterion 2 isn't checked here. Criterion 3: `tests/eval-suite.test.mjs` passes with 58 cases listed and 58 folders (e5af664), and the one full run is left for release, as the criterion says. Criterion 4: `tests/workflows.test.mjs` passes on test.yml and flags every planted spelling (plan-2.md, second fix pass). `node --test tests/*.test.mjs` at 58d42c4 gives 187 pass and 0 fail, run this session.

complete locally, not CI-verified
