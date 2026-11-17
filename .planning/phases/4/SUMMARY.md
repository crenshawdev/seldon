---
phase: 4
status: complete
completed: 2026-11-17
---

# Phase 4: The architecture spine - Summary

The spine step: `/seldon spine` builds `.planning/seldon/spine.md` from the brief and the PRD alone, one `Kind:` line and a quote or `[ASSUMPTION]` tag per `S-` decision, asks only the questions the design's parts call for, reruns in place keeping IDs, and `/seldon architecture` writes the full document only on request. Thirteen eval cases are new or rewritten, and the full suite of 26 scores 1.00.

## What shipped

- Spine format: one `Kind:` line naming one of six kinds, the quote-or-tag rule, the `Retired:` line - docs/FORMAT.md
- `--spine` check mode, failing a decision without exactly one known Kind line - lib/check.mjs
- The sample spine brought up to the rules, with S-04 and S-05 no longer naming the daily job - samples/spine.md
- The spine step, its draft, check, confirm question and in-place rerun - skills/seldon/SKILL.md §15-17
- The spine's open questions in one turn (unnamed stack or hosting, trust for outside input, unattended work and its failure), and a §1 route carrying the answers into each part's own decision - skills/seldon/SKILL.md §1, §15-16
- Routing a run by which of the brief, PRD and spine exist - skills/seldon/SKILL.md §1
- `/seldon architecture`, writing `.planning/seldon/architecture.md` only on request over a brief, a PRD and a spine - skills/seldon/SKILL.md §1, §18
- Eval cases: spine-from-prd, spine-rerun, spine-job, spine-outside-input, spine-answers, architecture-on-request, epics-later (was spine-later), and resume-later rewritten - evals/
- Fixtures for the new cases - samples/spine-from-prd/, samples/spine-rerun/, samples/spine-job/, samples/spine-outside-input/
- README: What it writes, Using it and the full eval list - README.md

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | 387addd | Kind line documented in the format |
| 1 | 2 | 2f8467d | Quote-or-tag rule for spine decisions |
| 1 | 3 | 2debbc0 | Sample spine brought up to the rules |
| 1 | 4 | 2c14507 | Check fails a decision without one known Kind line |
| 1 | 5 | 7ffeabc | `--spine` check mode |
| 1 | 6 | 1c0b53e | `Retired:` line documented |
| 1 | 7 | d1568d0 | architecture.md named as the one file written on request |
| 2 | 1 | c7c1601 | Spine step built from the brief and the PRD alone |
| 2 | 2 | 7caba03 | Draft spine.md with Kind lines and quotes or tags |
| 2 | 3 | df7df7b | Spine checked with `--spine`, step ends on its confirm question |
| 2 | 4 | 676159d | Spine rerun in place, keeping IDs and retiring dropped ones |
| 2 | 5 | 3d0f245 | PRD create guard on its own line |
| 2 | 6 | 1a03f54 | Routing by which of the three documents exist |
| 3 | 1 | 72661b0 | spine-from-prd case and fixture (committed in the pause commit) |
| 3 | 2 | f6f4c5b | spine-rerun case; S-04 and S-05 no longer name the daily job |
| 4 | 1 | 2f08e25 | resume-later seeds a spine and expects the epics-only line |
| 4 | 2 | 7d60855 | spine-later becomes epics-later |
| 5 | 1 | c0df195 | The spine's open questions in one turn |
| 5 | 2 | 1e761c7 | Spine answers carried into the job's own decision |
| 5 | 3 | 3d4398a | spine-job case |
| 5 | 4 | 354a0f7 | spine-outside-input case |
| 5 | 5 | 9cb2018 | spine-answers case |
| 5 | review fix | c03fe4e | carries-answer requires the decision that says what the job does |
| 6 | 1 | 8becc40 | architecture.md only on `/seldon architecture`, over a spine |
| 6 | 2 | 12b6a7b | Spine confirm question names `/seldon architecture` |
| 6 | 3 | 3215a4e | architecture-on-request case |
| 6 | review fix | f4394ed | `/seldon architecture` writes nothing without a brief or a PRD |
| 7 | 1 | 788125d | README What it writes names architecture.md |
| 7 | 2 | eebedae | README Using it describes the spine step and `/seldon architecture` |
| 7 | 3 | 3586d1d | README lists every eval case |

## Deviations

- [deviation] Plan 1 Task 5: Verify (1) expected `--spine samples` to print the usage line before the change; it printed `check: "--spine" is not a directory` (exit 2 either way). The after-state was built as written. 7ffeabc
- [deviation] Plan 3: the plan held every decision but S-03 untouched by dropping reminders, but S-04 and S-05 named S-03's daily job. The owner chose to reword both in samples/spine.md (plan 3's lease amended); the grammar fix changed "run"/"keep" agreement in S-04 and dropped "all" in S-05, no other word. f6f4c5b
- [deviation] Plan 6 review fix: the grader collision check matched three lines through fast-path-brief's every-item-quoted-or-tagged, which hits any untagged prose and hit the old lines identically. Words kept. f4394ed
- [deviation] Plan 7 Task 3 Verify (7) expected `git status` to list only README.md; it also listed the orchestrator's uncommitted `.planning/` records. README.md was the only file the plan changed. 3586d1d

## Open items

- carries-answer recognises the job's own decision by a fixed word list drawn from the Sowlist brief and PRD. An answers-only decision that also spells out the job's work would pass, and a real job decision described only in other words would fail (plan 5).
- SKILL.md says nothing about a design with two unattended parts, such as asking the run-time and failure pair once per part. No case has two (plan 5).
- docs/FORMAT.md:148 shows only `Kind: missing line` as an example; the check's other two Kind problem lines (a kind outside the six, a second Kind line) are fixed text graders may match but the format doesn't show (plan 1).

## Goal check

The commits deliver the goal on all four success criteria. (1) spine-from-prd writes a spine from a confirmed PRD that passes `--spine`, which fails any decision without exactly one of the six kinds (2c14507, 7ffeabc), with every decision quoted or tagged (graders in evals/spine-from-prd/). (2) spine-job gets the run-time and failure questions (3d4398a), and spine-outside-input, which runs nothing unattended, gets neither (354a0f7). (3) spine-outside-input gets the trust question, and spine-job, with no outside input, does not. (4) spine-from-prd's no-write and no-edit graders allow no file in `.planning/seldon/` but spine.md, and architecture-on-request writes architecture.md on request with every spine ID and the spine byte-identical (3215a4e; .planning/phases/4/records/reports/plan-6.md:10). Stable IDs across a rerun are proven by spine-rerun (f6f4c5b). The full suite ran once over all 26 cases, each at 1.00, with every Bash call one of the three checks (.planning/phases/4/records/reports/plan-7.md:8). What isn't proven: the two plan 5 open items above, and the review findings the owner declined, which are recorded in .planning/records/DECLINED.md.

complete locally, not CI-verified
