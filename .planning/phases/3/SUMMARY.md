---
phase: 3
status: complete
completed: 2026-11-17
---

# Phase 3: The PRD, resume and rerun - Summary

`/seldon` now builds `.planning/seldon/prd.md` from the confirmed brief alone, with ID'd requirements whose lines are quoted from the brief or tagged `[ASSUMPTION]`, the brief's refusals carried into Non-goals and no technology named. A fresh `/seldon` after a `/clear` names the brief it resumes from and picks up at the PRD step. `/seldon brief`, `/seldon prd`, `/seldon spine` and `/seldon epics` rerun one step, and the PRD rerun keeps every unchanged requirement's ID. Eighteen eval cases under the scoped grant prove it, nine of them new or rewritten here.

## What shipped

- The PRD-only check, `node lib/check.mjs --prd <dir>`, which reads only `prd.md` and requires an ID'd requirement in both requirement sections - `lib/check.mjs`, `tests/check.test.mjs`
- The PRD's format rules: the PRD-alone check, every requirement and non-goal quoted or tagged, the brief's refusals as `- ... because ...` Non-goals with their quotes, and a `Retired:` line for dropped IDs - `docs/FORMAT.md`
- A sample PRD that follows those rules - `samples/prd.md`
- Where a run starts: the files in `.planning/seldon/` decide it, and a new dump while a brief exists gets the documents question (rerun the brief, or go on) instead of being set aside - `skills/seldon/SKILL.md` sections 1 and 2
- The PRD step, draft and check: built from `brief.md` alone, even where it differs from earlier talk; a create-only Write behind a later-release guard; checked with the plugin's own `--prd` mode - `skills/seldon/SKILL.md` sections 12 to 14
- Step-name reruns: an exact `brief`, `prd`, `spine` or `epics` argument reruns that step. The PRD rerun edits in place and keeps unchanged IDs, the brief rerun reopens or takes the documents-question dump, and spine and epics still end on the later-release line - `skills/seldon/SKILL.md`
- Each step ends on a confirm question, and a confirm ends on the fixed `/clear` words. Every point where a turn stops to ask has a route that carries the same step on with the answer - `skills/seldon/SKILL.md` section 1
- Eval cases `resume`, `prd-from-brief`, `confirm-clear`, `spine-later`, `prd-reads-brief`, `prd-rerun`, `brief-rerun` and `brief-rerun-dump`, plus `existing-brief` rewritten for the documents question - `evals/`, with fixtures in `samples/prd-from-brief/`, `samples/prd-reads-brief/` and `samples/prd-rerun/`
- The README's Using it section covers the PRD step, resume and reruns, and its Evals section lists all eighteen cases - `README.md`

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | 264f817 | Add the `--prd` check mode that reads only `prd.md` |
| 1 | 2 | dbd89be | Require an ID'd requirement in both PRD requirement sections |
| 1 | 3 | 2bc2686 | Hold PRD requirements and non-goals to the quote-or-tag rule |
| 1 | 4 | 6a2ae21 | Carry the brief's refusals into the PRD's Non-goals |
| 1 | 5 | dcd5d04 | Document the Retired line for dropped requirement IDs |
| 1 | 6 | 860e338 | Make `samples/prd.md` follow the quote and refusal rules |
| 2 | 1 | f009bd2 | Let the files in `.planning/seldon/` decide where a new run starts |
| 2 | 2 | 30a3330 | Ask before setting a new dump aside when a brief is there |
| 2 | 3 | 5891111 | Build the PRD step from the brief alone, sized to its stakes |
| 2 | 4 | 8f85e54 | Draft `prd.md` as capabilities, creating it only when absent |
| 2 | 5 | 7e1abdb | Check the PRD with the plugin's own `--prd` mode |
| 2 | 6 | 5f2545a | Add the `resume` case |
| 2 | 7 | 791f218 | Rewrite `existing-brief` for the documents question |
| 3 | 1 | faf4cb6 | Quote or tag every PRD requirement and non-goal from the brief |
| 3 | 2 | 79ed5ca | Carry each brief refusal into Non-goals with its quote |
| 3 | 3 | 4a0450b | Add the `prd-from-brief` case and its fixture |
| 3 | 4 | 857d722 | End each step on a confirm question and the `/clear` words |
| 3 | 5 | 7910c97 | Add the `confirm-clear` case |
| 3 | review fix | 8868b83 | Scope the PRD guard to creating with Write, so Names changes can Edit |
| 4 | 1 | 334a207 | Read an exact step name as a rerun of that step |
| 4 | 2 | 11cac99 | Add the `spine-later` case |
| 4 | 3 | f0a5cf8 | Add the `prd-reads-brief` case, and build the PRD from the brief on disk |
| 4 | 4 | d956333 | Keep requirement IDs when `/seldon prd` reruns |
| 4 | 5 | 2a55535 | Add the `prd-rerun` case and its fixture |
| 4 | review fix | 0d8c4c4 | Let a PRD rerun that stops to ask carry on with the answers |
| 5 | 1 | f6ad1f1 | Rerun the brief in place, taking a documents-question dump as the change |
| 5 | 2 | 8fdd587 | Add the `brief-rerun` case |
| 5 | 3 | 4e9b03c | Add the `brief-rerun-dump` case |
| 5 | review fix | 3e39795 | Carry a brief change on after the question it stopped to ask |
| 6 | 1 | 39f6133 | Describe the PRD step, resume and reruns in the README |
| 6 | 2 | 4608bf4 | List every eval case in the README and run the full suite |

## Deviations

- [deviation] Plan 2 task 6 assumed the eval trace holds SKILL.md's own text, the resume line included. The skill text isn't in the trace at all, so the `resume` grader is anchored inside an assistant record, and its D-21 check plants SKILL.md's text as a user record to prove the skill's copy can't satisfy it (5f2545a).
- [deviation] Plan 4 task 3 assumed the PRD step already built from the brief alone under an earlier conversation. The first `prd-reads-brief` run scored 0.00 because the step asked which of the brief's value and the conversation's was right. Section 12 now builds from the brief on disk even where it differs from earlier talk, and the case scored 1.00 after (f0a5cf8).
- [deviation] Plan 4's combined-form check, condition 2, was read through the replay transcript and the quoted value, because `out/trace.jsonl` starts at system init and never replays the history. The transcript holds the six history records before the prompt, and the first run quoted the history's value. The owner ruled the condition met, so `prd-reads-brief` keeps both `history_file` and `scaffold_script`, and plan 5's cases use the same form (f0a5cf8).
- [deviation] Three diff reviews in a row found a step that stops to ask with no route carrying the answer back to that step: Names changes on an existing PRD (plan 3), a PRD rerun's questions (plan 4) and a brief rerun's refusal question (plan 5). Each was fixed as its plan's work, and the last fix checked every stop point in SKILL.md, with a table in plan 5's report (8868b83, 0d8c4c4, 3e39795).
- [deviation] Plan 6's first full run scored `resume` at 0.75, because the model wrote `prd.md` without the resume line first. Rerun alone, it scored 1.00 (4608bf4).

## Open items

- `resume` is flaky on the resume line: 1 miss in 2 full-suite runs. More runs, or firmer SKILL.md wording, would show or close it.
- Inside eval runs, every check call reports exit 1 after printing its pass line, because the harness shell can't write its cwd-tracking file under the sealed read-only `tmp/`. Graders don't read the exit code, but a model can take the 1 as a failed check, and in plan 3's runs it spent a paragraph explaining it.
- The three routes the review fixes added (8868b83, 0d8c4c4, 3e39795) have no eval case. The reviewers recommended one each, and the owner ruled no new cases for these fixes.
- In both `existing-brief` runs in plan 2, the model Globbed `docs/design/**` before asking the documents question. It read nothing, but SKILL.md says not to read a design folder on that turn, and no grader covers it.

## Goal check

The commits plausibly deliver the goal, and each success criterion has a case that scored 1.00, with the resume one flaky. The PRD builds from the brief alone: `prd-from-brief` (4a0450b) passed with its no-tech-words and every-item-quoted-or-tagged graders, on the `--prd` check (264f817, dbd89be). `prd-reads-brief` (f0a5cf8) shows the brief's value in and the conversation's value out, after the section 12 fix. The walk survives a `/clear`: `resume` (5f2545a) names the brief and writes the PRD without asking again, but it scored 0.75 on plan 6's first full run and 1.00 rerun alone, so criterion 2 holds only most of the time. `confirm-clear` (7910c97) shows the `/clear` suggestion. Any one step can be rerun: `prd-rerun` (2a55535) keeps every unchanged ID and retires the dropped one, `brief-rerun` (8fdd587) and `brief-rerun-dump` (4e9b03c) update the brief in place without touching the PRD, and `spine-later` (11cac99) shows a later step writing nothing. Plan 6's full run put 17 of 18 cases at 1.00 and the eighteenth at 1.00 on its rerun, and `node --test tests/*.test.mjs` passes 59 of 59 (plan 6 report). What's missing: no eval proves the three routes the review fixes added, and the `resume` flake isn't closed.

complete locally, not CI-verified
