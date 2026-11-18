---
phase: 2
status: complete
completed: 2026-11-17
---

# Phase 2: The brief - Summary

`/seldon` now takes the user's dump, recommends the fast path or coaching, waits for the user to confirm, asks what the dump left open (always who it's for and what it refuses), and writes `.planning/seldon/brief.md`, with the user's own words quoted, guesses tagged `[ASSUMPTION]` and each refusal given its reason. A brief-only check holds it to the format, and ten eval cases under a scoped grant prove the behavior.

## What shipped

- The brief-only check, `node lib/check.mjs --brief <dir>`, with the required "What it refuses" section between Scope and Vision, `[ASSUMPTION]` kept out of headings and a lone tag read as empty - `lib/check.mjs`, `tests/check.test.mjs`
- The format contract for the brief: the check's two modes, the `[ASSUMPTION]` tag (free text only), the refusal form (`- ... because ...`) and the quote form (`> ` under the item, design-folder quotes naming their file) - `docs/FORMAT.md`
- A sample brief where every item carries a quote or a tag - `samples/brief.md`
- The brief step: finding its place in the conversation, the confirm before any write, the fast path's blocking questions in one turn, the coaching walk, re-asking an unsettled refusal, the stop when a brief exists or a run has finished, reading `docs/design/` read-only, and running the plugin's own check - `skills/seldon/SKILL.md`
- `allowed-tools` exactly Read, Glob, Grep, `Edit(.planning/seldon/**)` and `Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*)`, pinned by a test - `skills/seldon/SKILL.md`, `tests/skill.test.mjs`
- Eight new eval cases (fast-path-brief, asks-for-dump, asks-who-for, coaching-brief, write-scope, no-dump, design-folder, existing-brief), and Write and Edit graders on phase 1's fast-path case - `evals/`
- Two copy-only scaffolds and a guard test that allows only the lines that copy fixtures from `samples/`, and reads a case's scaffold only in one strict form - `evals/design-folder/seed.sh`, `evals/existing-brief/seed.sh`, `samples/design/`, `tests/scaffold.test.mjs`
- The README's eval command with `--scaffold` and the two scoped grants, and a line for each of the ten cases - `README.md`

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | 18fb7cf | the brief-only check |
| 1 | 2 | 0fa914b | FORMAT.md documents the brief-only check |
| 1 | 3 | 6151126 | the `[ASSUMPTION]` tag in the contract, free text only |
| 1 | 4 | c22d8e6 | both checks require What it refuses |
| 1 | 5 | 59f3212 | What it refuses listed among the brief's sections |
| 1 | 6 | a540999 | the quote format for the user's own words |
| 1 | review fix | 0071fba | tag out of spine and epic headings, lone tag empty, every sample item quoted or tagged (REVIEW-diff-a8ab47b-a540999) |
| 2 | 1 | 0f08578 | allowed-tools exactly D-02's five, pinned by a test |
| 2 | 2 | 704fc74 | find /seldon's place from the conversation first |
| 2 | 3 | b9bbb01 | draft the brief after a confirmed path |
| 2 | 4 | 3b5004e | run the plugin's own check and repeat its line |
| 2 | 5 | 447b6d6 | the fast path's blocking questions in one turn |
| 2 | 6 | 220c3e5 | the coaching walk |
| 2 | 7 | a2b2a32 | stop when a brief exists |
| 2 | 8 | e645d61 | read docs/design/ as read-only input |
| 2 | review fix | 0c98fa5 | re-ask an unsettled refusal, stop after a finished run, design-folder quotes name their file (REVIEW-diff-0071fba-e645d61) |
| 3 | 1 | f8243c4 | fast-path-brief case |
| 3 | 2 | a4af743 | asks-for-dump case |
| 3 | 3 | c5d1112 | asks-who-for case |
| 3 | 4 | 10fb7a5 | coaching-brief case |
| 3 | 5 | 96b6542 | write-scope case |
| 3 | 6 | b396335, c6b193b | fixed closing question for a bare /seldon, and the no-dump case |
| 3 | 7 | 4874ccd | read tools on phase 1's fast-path case |
| 3 | review fix | f47f5d2 | Write and Edit at 0 on phase 1's fast-path case (REVIEW-diff-0c98fa5-4874ccd) |
| 4 | 1 | 89eb6c5 | the scaffold guard test |
| 4 | 2 | fd8d2d4 | design-folder case |
| 4 | 3 | 2d663ad | existing-brief case |
| 4 | 4 | c0f4e0f | README describes the brief step |
| 4 | 5 | f565d88, 6347a7e | fixed words for the who-for question and the brief-exists stop, and the README's full eval command |
| 4 | review fix | 119b9d7 | scaffold guard as an allowlist, odd-form scaffold_script fails (REVIEW-diff-f47f5d2-6347a7e) |
| 4 | review fix | 3139bee | scaffold read only in one strict form (REVIEW-risk_surface-6347a7e-119b9d7), the third and last hardening round |

## Deviations

- [deviation] Plan 3 assumed a `not granted` line meant the eval grant wasn't honored. The harness prints it for any case that lists plain Write, though the scoped `Edit(.planning/seldon/**)` rule lets Write through. Ruled: cases list only read-only tools and Skill (D-16, recorded in CONTEXT.md).
- [deviation] Plan 3 assumed a resumed turn on a hand-written history loads the skill. A plain reply made 0 Skill calls. Ruled: a continuation case's prompt starts with `/seldon` (D-15, recorded in CONTEXT.md).
- [deviation] Plan 3 assumed SKILL.md made a bare `/seldon` end on a question. The model ended on an imperative. Ruled: fixed closing words (b396335).
- [deviation] Plan 3's review fix added Write and Edit graders to phase 1's fast-path case, against Task 7's "graders stay as they are", because the review showed D-04's "writes nothing" check was ungraded there (f47f5d2).
- [deviation] Plan 4 listed Write, Edit and Bash in its cases' `allowed_tools`. Used read-only tools and Skill per D-16.
- [deviation] Plan 4's full run missed on the model's paraphrase of the who-for question and the brief-exists stop. Ruled: fixed words, with SKILL.md added to plan 4's lease (f565d88).

## Open items

- `samples/brief.md` shows neither the "refuses nothing" form nor a sourced design-folder quote, and no eval covers the refusal re-ask or a `/seldon` after a run finished in the same conversation. FORMAT.md documents both forms, and the check passes both.
- Phase 1's replay case has no Write or Edit grader, though the D-16 grant reaches it. Only the fast-path case's gap was picked for fixing.
- Inside the eval sandbox every check call reports `Exit code 1` even when the check passed, because the shell wrapper can't write its cwd file. Captured as a phase 8 todo.
- In interactive use, a skill's `allowed-tools` grant clears on the user's next message, so the brief's write and check on a later turn show the normal permission prompt. Eval runs aren't affected, and D-02 stands.
- Declined under the three-round hardening cap: the strict scaffold-name form still admits names a YAML parser reads as a number or boolean (`0x10`, `true`). It needs a numeric-looking file in the case folder and depends on how the harness types the value, which isn't checked.
- The plan-review adjudication record (ADJUDICATION-plan-plan-1eb9a9a.json) shows findings 2 to 4 as survived with no fix, though the plan revision 77580fc fixed them. The record can't mark a medium or low fixed in a plan file, a known Cadence gap.
- Plan 3's first dispatch record names a brief path in its read list, though that brief was refused as over Cadence's size ceiling and the executor read the plan file instead.

## Goal check

The commits deliver the phase goal locally. `/seldon` writes a brief only after the user confirms a path, asks who it's for and what it refuses when the dump is silent, quotes the user's own words and tags guesses (b9bbb01, 447b6d6, 0c98fa5). Its `allowed-tools` holds exactly the five entries D-02 permits (`skills/seldon/SKILL.md` frontmatter). The README's full eval command ran all ten cases at 1.00 with exit 0, no `not granted` and no `scaffold failed` (plan-4 report, task 5, results 2026-11-17T11-24-01-649Z). The two later commits, 119b9d7 and 3139bee, change only `tests/scaffold.test.mjs` and the README's wording, so they don't affect what those cases prove. No eval run executed any Bash but the check command (plan-3 and plan-4 reports). Every brief landed inside the run's own workspace, never the repository. The suite passes 49 of 49 under the coverage gate, and both checks pass the samples. Every plan's risk status reads recorded, and the plan review, four diff reviews and three risk reviews are recorded under `.planning/phases/2/records/`.

complete locally, not CI-verified
