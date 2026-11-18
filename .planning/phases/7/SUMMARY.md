---
phase: 7
status: complete
completed: 2026-11-18
---

# Phase 7: PRD changes flow downstream - Summary

`/seldon` now knows when a document is out of date with the one it was built from. The PRD, spine and epics each carry a `Built from: <parent> sha256:<16 hex>` stamp, `lib/check.mjs --stale` names every stale link, and a bare `/seldon` reruns the earliest stale document before any resume line. `/seldon prd` stops a change that would undo a spine decision, names each S- decision it hits, and asks before writing anything.

## What shipped

- The stale check. `node lib/check.mjs --stale <dir>` names each stale link and prints each step's stamp, and the PRD, spine and epics checks hold a present stamp to its exact form. Lives in `lib/check.mjs` (66af993, 833b2dc), documented in `docs/FORMAT.md` under "Stamps" and "Stale links" (769aed5, 04b49da).
- Stamped samples. Every sample PRD, spine and epics file carries the stamp of the parent its cases seed beside it, and `tests/samples.test.mjs` pins each stamp to its parent's hash and the three rerun seeds' stale links (87709cb, ca877eb).
- Stamps and the stale routes in the skill. Every write of the PRD, spine and epics records the stamp, and a bare `/seldon` goes to the earliest stale document's rerun before any resume line. Lives in `skills/seldon/SKILL.md` under "Stamps and stale links" and "Where a run starts" (9f8c9f6, 12318d7).
- The conflict check. A PRD change that undoes something a spine decision relies on writes nothing, names each S- decision and asks "Do you want me to apply this change to the PRD anyway?". A go-ahead applies exactly the reported change and a decline writes nothing. When the brief changed between the report and the go-ahead, it writes nothing and asks again with the new report. Lives in `skills/seldon/SKILL.md` under "The conflict check" and "Conflict question answered" (df590a3, c049158, 1dedddc).
- This run's arguments, stated once. `$ARGUMENTS` now sits in one `<seldon-arguments>` block in section 1, and the prose says "this run's arguments" everywhere else. `tests/skill.test.mjs` fails if the token is written into prose again or the block moves (376eded, 86d0521).
- The spine confirm question ends the turn. `skills/seldon/SKILL.md:1285-1286` says its question mark is the last thing in the turn (65dc09a).
- Eight eval cases under `evals/`: `stale-spine`, `stale-epics`, `prd-conflict`, `prd-conflict-decline`, `prd-conflict-apply`, `prd-change-conflict`, `prd-change-decline` and `stale-prd`. The `resume`, `spine-answers` and `epics-from-spine` cases gained a grader that requires the stamp, and the two resume graders allow the stale check's Bash call before the resume line (d86e125, 3b28866).
- The README says what stamps, the stale walk and the conflict report do, and lists all 48 cases (20d0983, e9b3b90).

## Commits

| Plan | Task | Commit | Description |
|---|---|---|---|
| 1 | 1 | none | Size probe: a SKILL.md padded to 90,118 bytes loaded whole, which set a 90,000-byte budget for the phase. No commit by design |
| 2 | 1 | 66af993 | Add the `--stale` check, which names stale links and prints each step's stamp |
| 2 | 2 | 833b2dc | Hold a present stamp to its exact form in the PRD, spine and epics checks |
| 2 | 3 | 769aed5 | Document the stamp, the stale rule and the `--stale` check in the format |
| 2 | fix | 04b49da | Diff-review finding 1: say the check reads a `Built from` line above the first spine decision or epic |
| 3 | 1 | 87709cb | Stamp every sample PRD, spine and epics file |
| 3 | 2 | ca877eb | Pin each sample stamp to its parent's hash, and the three rerun seeds' stale links |
| 4 | 1 | 9f8c9f6 | Record each step's stamp on every write of the PRD, spine and epics |
| 4 | 2 | 12318d7 | Route a bare `/seldon` to the earliest stale document's rerun (merged at 2b7204d) |
| 5 | 1 | d86e125 | Let the stale check's Bash call come before the spine and epics resume lines |
| 5 | 2 | 3b28866 | Require each created PRD, spine and epics to carry its parent's stamp under the title |
| 5 | 3 | 04f2bcd | Add the stale-spine case |
| 5 | 4 | f35c054 | Add the stale-epics case |
| 5 | fix | a2d4c33 | Diff-review finding 1: anchor both says-stale-line graders so an Edit of the target before the stale line fails them |
| 6 | 1 | df590a3 | Stop a PRD change that undoes a spine decision, and name each S- decision it hits |
| 6 | 2 | c049158 | Route the answer to the conflict question: a go-ahead applies, a decline writes nothing |
| 6 | fix | 1dedddc | Diff-review finding 1: ask the conflict question again when the brief changed before the go-ahead |
| 7 | 1 | 0736d12 | Add the prd-conflict case |
| 7 | 2 | fd7d882 | Add the prd-conflict-decline case |
| 7 | 3 | 58428c1 | Add the prd-conflict-apply case |
| 7 | 4 | bdd270a | Add the prd-change-conflict case |
| 7 | 5 | ae70e5c | Add the prd-change-decline case |
| 7 | 6 | 3b229bc | Add the stale-prd case |
| 7 | fix | a4e324c | Diff-review findings 1 and 2: three graders so prd-conflict-apply fails a go-ahead that keeps the LOAN-03 bullet or scope, and stale-prd's stale line anchored after the `--stale` call and before any document read |
| 8 | 1 | 20d0983 | README: what stamps, the stale walk and the conflict report do |
| 8 | fix | 376eded | Fence this run's arguments in SKILL.md, with the test that pins the token to one place |
| 8 | fix | 86d0521 | Diff-review findings 1 and 2: "Empty arguments write nothing", and the test pins the block inside section 1 |
| 8 | fix | 65dc09a | Make the spine confirm question's mark the last thing in the turn |
| 8 | 2 | e9b3b90 | README: list the eight new cases and note the stamp graders |

29 commits from 66af993 to e9b3b90: 28 task and fix commits, plus the merge 2b7204d.

Reviews: every plan's diff review, plan 3's blocking risk review and the whole-phase review ran, and each has its `REVIEW-*.md` and `ADJUDICATION-*.json` under `.planning/phases/7/records/`. Eight findings were raised across them. Seven were fixed in the commits marked fix above, and one is open (see the stale-spine history under Open items). Plan 3's risk review fired on the recursive delete in `tests/samples.test.mjs`'s temp-folder cleanup and raised nothing.

Eval runs: full run 1 scored 47 of 48 and exited 1 (stale-spine 0.29). Full run 2, on the fixed skill at 65dc09a, scored 48 of 48 and exited 0 (718s, $18.66). Its log and all 48 traces are in `/tmp/cad-6Rynn3/traces/full-run-2/`. Both allowed full runs are used.

## Deviations

- [deviation] Plan 8, the arguments defect. Full run 1 missed stale-spine, and the cause was the skill, not variance. The loader replaces every `$ARGUMENTS` with the run's arguments, and the token sat in 16 places in prose, so on a bare `/seldon` the loaded skill read "look at ``" and "A brief, and `` isn't empty". The model was never told the arguments were empty, and it took an earlier `/seldon Yes, that's right.` in the conversation as a dump. The real-user form: confirm with "/seldon Yes, that's right.", no /clear, then a bare `/seldon`. The same misroute is on record for this case's second try in plan 5, where it was read as variance. Fixed in 376eded and 86d0521. Plan 8 leased only `README.md`, so the coordinator amended `PLAN-8.md`'s `files:` to add `skills/seldon/SKILL.md` and `tests/skill.test.mjs`. In full run 2 the dump appears once in fast-path's loaded skill, and stale-prd's block holds one empty line.
- [deviation] Plan 8, the spine confirm question. After the arguments fix, stale-spine's second solo run scored 0.86: the model split the confirm question into a question and a trailing sentence naming `/seldon architecture`, so the turn ended on a statement. Plan 5's first try had missed the same way. Phase 4's D-17 says the confirm question names the command, so Daneel ruled the text had to hold it: 65dc09a adds the sentence at `SKILL.md:1285-1286`. A fresh series of three solo runs then passed, and so did full run 2.
- [deviation] Plan 8, the run rule. The dispatch said a says-stale-line miss on stale-spine means the model edited or read a document before the stale line. In full run 1 the model made no Read, Edit or Bash call at all. The executor stopped at the checkpoint as told, and the diagnosis above replaced the rule's assumption.
- [deviation] Plan 5, the Edit input. Task 3 said to build says-stale-line in names-brief-first's form, which expects `"file_path"` as the first input key. An Edit's input starts with `"replace_all"`, so that form can never match an Edit. The grader lets the input skip leading keys (04f2bcd), and stale-epics takes the same form.
- [deviation] Plan 5, the review fix's proof. Daneel's terms asked that each case's kept passing trace still pass the fixed grader. Both kept folders had been deleted by the runs that made them, and no copy survived. Daneel withdrew that term as its own mistake and accepted a2d4c33 on plain node checks of both patterns under the flags "", m, s and ms, with the full suite run as the proof through the runner. Later passing traces are kept under `/tmp/cad-6Rynn3/traces/` so this cannot recur inside the phase.
- [deviation] Plan 5, the lifted harness. To stand in for the runner's grading path, the executor copied grading functions out of the Claude binary into a scratch harness. Daneel ruled that out. The harness and two files of copied source were deleted from the scratchpad, nothing from them was committed, the description was removed from plan 5's report, and no proof rests on it. Every later dispatch carried the rule not to lift code from the Claude binary.
- [deviation] Plan 7, the lease. The review fix a4e324c adds three grader files to `evals/prd-conflict-apply/graders/` that `PLAN-7.md` did not list. The coordinator amended `PLAN-7.md`'s `files:` first, so the lease check covered them. `PLAN-7.md:69` had listed only four behaviors for that case, so the gap the review found was in the plan.
- [deviation] Plan 1. Verify 2 expected `git diff --name-only` to list only the padded `skills/seldon/SKILL.md`. It also listed `.planning/records/state.json`, which the coordinator had modified before the dispatch. The probe's own change was the padded file alone.

## Open items

For phase 9 (the full graders):

- The stale-spine replay's back-story. `evals/stale-spine/history.jsonl:2` shows a `/seldon prd` reply that retires LOAN-03 and goes straight to the PRD confirm question. Plan 6 added the conflict check after that history was written, and on those files the skill now stops at the conflict question first. The graded turn is a bare `/seldon` judged on the seeded files, which are right, so the case still measures the stale-spine walk. The whole-phase review raised it (low, fingerprint 9446db28ad3461ff, recorded as declined), and Daneel ruled to fix it in phase 9. Fix shape from the review: `/seldon prd` names S-03 and ends on the conflict question, then a plain go-ahead, then the applied change with the check line and the PRD confirm question, then the confirm and the /clear words, copying the report wording from `evals/prd-conflict-apply/history.jsonl`.
- The spine confirm question's form. John ruled on D-17 with "yes option 2", the option being "Allow the command in a sentence just before a plain question (recommended)." So `/seldon architecture` may be named in a sentence just before a plain confirm question, and the turn still ends on the question. `SKILL.md:1278-1286` and `evals/stale-spine/graders/ends-on-confirm.md` change together. Until then 65dc09a's sentence holds the one-question form.
- stale-spine is the only case whose graders check the confirm question's form, so the same split may pass unnoticed in the other spine cases.
- Other closing questions that could split the same way. This is the plan 8 executor's reading, not yet checked by the coordinator or Daneel: `SKILL.md:711-714` (re-asking what the project refuses, the closest match), `:572-574` (the path confirm), `:989-992` (the PRD confirm), `:751-756` (the shared step ending), `:431-437` (the documents question) and `:1475-1482` (the epics confirm).
- First text. A narration sentence can precede a stale or resume line; no grader holds "the first text of your reply" (`SKILL.md:357-358`). Phase 9 picks one: word SKILL.md to what is enforced (the line comes before any document is read or edited, and before any other text about the documents), or tighten every stale and resume grader and re-run those cases.
- The re-ask route has no eval case. When the brief changed between the conflict report and the go-ahead, `SKILL.md:177-186` writes nothing and asks again. No case replays it.
- The stamp-only rerun has no eval case. D-02 (`CONTEXT.md:16`) says a rerun over a stale link records the new stamp even when nothing else in the document changes, and `SKILL.md:497` says so, but every kept rerun trace changes content as well as the stamp. The risk: if the stamp-only Edit is skipped, each later bare `/seldon` repeats the same rerun. The deep verify pass raised it as UAT item 10, and Daneel made it optional for phase 7 and sent it here. The verifier's case design: seed a brief that differs from `samples/brief.md` only in a line no requirement draws on, beside `samples/prd.md` and `samples/spine.md`, and run a bare `/seldon`. Grade the PRD stale line, an Edit of `prd.md`, the new stamp, every requirement line unchanged, and no conflict question.

Not tied to a phase:

- `lib/check.mjs --prd` accepts a PRD where an ID is both on the `Retired:` line and still a live bullet. A scratch PRD with `Retired: LOAN-03` added and the LOAN-03 bullet left in printed "seldon check: prd.md conforms". Daneel is telling John about it.
- The applied PRD keeps "The day before it's due, the member gets a reminder" in User journeys, because the conflict report did not name the journey. `samples/spine-rerun/prd.md` keeps the same sentence, so the run matches the fixture. Whether a retired requirement should also leave the journey is a question for the skill and the sample.
- The eval sandbox's exit codes. Inside the sandbox every Bash result reads `Exit code 1` with a `read-only file system` line, even when `check.mjs` exits 0, because the shell cannot write its cwd-tracking file. Graders read printed lines, so no case is affected. The model sometimes adds a paragraph explaining it, and a future grader on a Bash exit code would be affected.
- The kept traces are in `/tmp/cad-6Rynn3/traces/` and will not survive a reboot. They hold one passing trace per phase 7 case, both full runs, and the stale-spine solo runs.
- Gitignored runner files. 25 session `.jsonl` files sit across the case folders under `evals/` (`git status --ignored --short evals`), one of them `evals/prd-conflict-apply/d4122279-35ea-4c6e-b9b6-623b1695e368.jsonl`, and each eval run left an HTML report under `evals/results/`, also gitignored. Left untouched.
- No lint or typecheck command is configured, so static analysis was skipped in every plan.
- Plan 2's risk records cover 77e8e63..769aed5 and its fix 769aed5..04b49da separately, so a risk status asked for the single range 77e8e63..04b49da reads `stale`. The phase-wide risk status passes for all eight plans.

## Goal check

The goal has two halves, and the commits deliver both. Every upstream rerun marks the documents built from it stale: the stamp and the `--stale` mode are in `lib/check.mjs` (66af993, 833b2dc), the skill records the stamp on every write and routes a bare `/seldon` by the earliest stale link (9f8c9f6, 12318d7), and `tests/samples.test.mjs` pins the samples' stamps (ca877eb). A changed PRD flows through to the spine and epics: stale-spine and stale-epics replay a bare `/seldon` over a stale spine and stale epics (04f2bcd, f35c054), and stale-prd shows a stale PRD taken before missing epics (3b229bc). Criterion 1, naming the spine decision by ID before writing and writing nothing on a decline, is held by prd-conflict, prd-conflict-decline, prd-change-conflict and prd-change-decline (0736d12, fd7d882, bdd270a, ae70e5c), and prd-conflict-apply now fails a go-ahead that leaves the retired requirement in place (58428c1, a4e324c). The proof by eval cases is full run 2: `/tmp/cad-6Rynn3/traces/full-run-2/full-run-2.log` shows 48 pass lines, no fail line, "48 case(s) · 718s · $18.66" and "EXIT 0", on the tree at 65dc09a, and the unit suite passes 111 of 111 at e9b3b90. Two things are short of clean and are named above. Criterion 2's replay, stale-spine, grades the right behavior from the right files, but its history shows the PRD change applied by a path the skill no longer takes. And the route that asks the conflict question again after the brief changed has no eval case. Neither blocks the goal; both are phase 9's.

complete locally, not CI-verified
