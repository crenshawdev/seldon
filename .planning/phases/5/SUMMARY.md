---
phase: 5
status: complete
completed: 2026-11-17
---

# Phase 5: Epics and the full walk - Summary

The epics step: `/seldon epics` builds `.planning/seldon/epics.md` from the PRD and the spine alone, in build order with MVP first, holds each epic to at most 5 requirement IDs and 2 to 5 done-when items, splits an epic only along a spine boundary, checks it with `--epics` and reruns in place keeping IDs, and a bare `/seldon` now walks on from the spine into it. Eight eval cases are new or rewritten, and the full suite of 32 scores 1.00.

## What shipped

- Epics format: done-when as a 2-to-5 list holding the integrated item, file order as build order, at most 5 requirement IDs, Depends on naming only earlier epics, the epics `Retired:` line - docs/FORMAT.md
- `--epics` check mode, failing an epic over 5 requirement IDs, outside 2 to 5 done-when items, or with a Depends on that names no earlier epic - lib/check.mjs, tests/check.test.mjs
- The sample epics brought up to the done-when and citation rules - samples/epics.md
- The epics step: built from the PRD and the spine alone, sized by capability, split only along a spine boundary, and a stop pointing to `/seldon spine` when no boundary cuts an epic - skills/seldon/SKILL.md §18
- The epics draft in six fields with the integrated item, build order, citations of every spine decision it relies on, and the in-place rerun - skills/seldon/SKILL.md §19
- The epics check and the step's confirm question - skills/seldon/SKILL.md §20
- Routing a run by which of the four documents exist, the resume into the epics step, and the later-release line once all four are there - skills/seldon/SKILL.md §1-2
- Eval cases: epics-from-spine (was epics-later), epics-rerun, epics-split, epics-no-boundary, full-walk, epics-confirm, epics-no-spine, and resume-later rewritten - evals/
- Fixtures for the new cases - samples/epics-rerun/, samples/epics-split/, samples/epics-no-boundary/
- README: Using it and the full eval list - README.md

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | 38a02fc | `--epics` check mode |
| 1 | 2 | 1de45ea | Done-when as a 2-to-5 list holding the integrated item |
| 1 | 3 | 2d86efd | File order as build order and the epic ID-field limits |
| 1 | 4 | 9272418 | Sample epics brought up to the done-when and citation rules |
| 1 | 5 | 641937b | Check fails an epic over 5 requirement IDs or outside 2 to 5 done-when items |
| 1 | 6 | 39cd382 | Check fails a Depends on that names no earlier epic |
| 1 | 7 | 221dc97 | epics.md `Retired:` line documented |
| 2 | 1 | 4231697 | Epics step built from the PRD and the spine alone |
| 2 | 2 | 37617c4 | Epics sized by capability and split only along a spine boundary |
| 2 | 3 | 3e3f962 | Draft epics.md in six fields with the integrated done-when item |
| 2 | 4 | db5e448 | Build order and citations of every spine decision |
| 3 | 1 | ceb73b3 | Epics checked with `--epics`, step ends on its confirm question |
| 3 | 2 | 4762f49 | Epics rerun in place, retiring dropped IDs under the title |
| 3 | 3 | 2658a18 | Routing by which of the four documents exist |
| 4 | 1 | 1f9fdc6 | epics-later becomes epics-from-spine |
| 4 | 2 | fd7b2e2 | epics-rerun case and fixture |
| 5 | 1 | 452e0f2 | epics-split case and fixture |
| 5 | 2 | 353429c | epics-no-boundary case and fixture |
| 6 | 1 | 288c3ff | full-walk replay |
| 6 | 2 | 9ac0dd9 | epics-confirm replay |
| 6 | 3 | deb04fa | resume-later seeds all four documents |
| 6 | 4 | a6c7375 | epics-no-spine case |
| 7 | 1 | 075b6c8 | README Using it describes the epics step, its resume and its rerun |
| 7 | 2 | 6138455 | README lists every eval case |

## Deviations

- [deviation] Plan 4 Task 1: Verify (6) expected the kept run's out/trace.jsonl to hold the loaded skill and SKILL.md's last sentence; that file holds no skill text at all. The size question was answered from the kept session transcript in the same folder instead, where the loaded skill matches SKILL.md byte for byte at 55,644 bytes, so the loader didn't cut it. 1f9fdc6

## Open items

- One problem line covers a Depends on naming a later epic, the epic itself, or an ID no epic has. Split it into three when a reader needs to tell them apart (plan 1).
- full-walk's history of the brief, PRD and spine stops is text generated from SKILL.md's fixed lines, so in that case only the epics leg is the model's own behavior. The three earlier stops rest on phases 2 to 4's cases (D-20, PLAN-6.md:173), and no single case runs a new project live through all four stops (plan 6).

## Goal check

The commits deliver the goal on all three success criteria. (1) full-walk replays a session through the brief, PRD and spine confirms, and a bare `/seldon` then names the spine first, writes epics.md that passes `--epics` and stops on the epics confirm question (288c3ff; .planning/phases/5/records/reports/plan-6.md:6), and epics-confirm shows a confirm there ending on the `/clear` words with nothing written (9ac0dd9). (2) epics-from-spine's graders hold every epic to the six fields and the integrated item, each requirement on exactly one epic, citing only the spine's IDs and every project-wide decision (1f9fdc6), and `--epics` fails a Depends on that names no earlier epic (39cd382). (3) epics-split's eight-requirement Lettings category comes out as two epics split along its S-02 boundary, each within 5 IDs and 5 done-when items (452e0f2), and epics-no-boundary writes nothing and points to `/seldon spine` when no boundary cuts it (353429c). The full suite ran once over all 32 cases, each at 1.00, with every Bash call one of the four checks, and the coverage job passed 88 of 88 with lib/check.mjs at 99.27% of lines (.planning/phases/5/records/reports/plan-7.md:7). What isn't proven: the replay's three earlier stops are scripted, as the second open item says, and the five low review findings the owner declined, which are recorded in .planning/records/DECLINED.md.

complete locally, not CI-verified
