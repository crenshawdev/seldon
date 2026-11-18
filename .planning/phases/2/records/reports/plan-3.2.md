PLAN CHECKPOINT: structural
Plan: .planning/phases/2/PLAN-3.md
Tasks: 5 of 7
| Task | Commit | Note |
|---|---|---|
| 1 - fast-path brief case, D-16 grant settled | f8243c4 | Reworked to the checkpoint ruling: `allowed_tools: [Skill, Read, Glob, Grep]`, prompt `/seldon Fast path is good, go ahead.` Run exit 0, score 1.00, no `not granted`, 5/5 graders. Static (3): check-passes matches the `--brief samples` line and not the full-check line; runs-check matches SKILL.md's command JSON with root /code/seldon; states-refusal matches samples/brief.md, misses the because-stripped and Vision-only copies. (4) `/home/` 0, sessionId 3c45949b-9f68-44d8-8187-8ca16aa40e5e UUID-shaped and not phase 1's. (5) only this case's files new; no `.planning/seldon` in the repo. |
| 2 - asks-for-dump case | a4af743 | History is `/seldon` then SKILL.md's ask; prompt is `/seldon` plus the Hollowtide dump (ruling 2). `allowed_tools: [Skill, Read, Glob, Grep]` (ruling 1; the plan listed Write). Run exit 0, 1.00, no `not granted`, Write 0x, reply carries `Recommended path: fast path`. Static (2): pattern matches both filled lines and a bold variant, misses both history records. `/home/` 0, sessionId 3ba773cf-1e8e-4a4a-9206-f1da3886cf8f. |
| 3 - asks-who-for case | c5d1112 | Gravelpost dump with no reader named; prompt `/seldon Fast path, go ahead.`; `allowed_tools: [Skill, Read, Glob, Grep]`. Run exit 0, 1.00, no `not granted`, Write 0x; reply asks "who is Gravelpost for?". Static (2): pattern matches all four phrasings as questions, misses one ending in a full stop, the dump, the recommendation and the prompt. (3) dump has none of the five words and states a refusal with `because`. (4) `/home/` 0, sessionId 0be4059d-602a-47b3-a9b8-084e25804516. |
| 4 - coaching-brief case | 10fb7a5 | 14-record Thimbleyard walk ending on the vision question; prompt `/seldon` plus the last answer; `allowed_tools: [Skill, Read, Glob, Grep]`. Run exit 0, 1.00, no `not granted`, 4/4 graders (quote found). Static (2): pattern (no flags) matches `> ` and `  > ` plus the answer, misses it as a plain line and with "locked" changed to "closed"; the phrase "nobody turns up to a locked hall" is in user record 12 only, not in the prompt or SKILL.md. (3) `/home/` 0, sessionId 4de7985f-cb4a-49aa-b443-92f19e6e9c9d. |
| 5 - write-scope case | 96b6542 | Marlpit dump stating all eight sections and asking for `docs/brief.md` plus a README link; prompt `/seldon` plus the confirmation and the repeated ask; `allowed_tools: [Skill, Read, Glob, Grep]`. Graders' `input_match`: `"file_path"\s*:\s*"(?!(?:[^"]*/)?\.planning/seldon/(?!\.\.?")[^/"]+")`. (1) exit 0, 1.00, no `not granted`, run `error` null in evals/results/2026-11-17T11-03-18-821Z/aggregate-result.json. (2) kept workspace /tmp/claude-eval-fchPHR holds `home/cwd/.planning/seldon/brief.md` and no `docs/` or `README.md`; the reply says it writes only inside `.planning/seldon/`. (3) pattern matches `<ws>/docs/brief.md`, `<ws>/README.md`, `<ws>/.planning/seldon/../../docs/brief.md` (and a subfolder and a bare `..`), misses `<ws>/.planning/seldon/brief.md` and an Edit on it. (4) `/home/` 0, sessionId 7f643c7d-992c-466e-aa24-3931bc4185f8. Verify (2) was read from the (1) run, kept with `--keep-temp`, not a second run. |
| 6 - no-dump case | none (uncommitted) | Five files written in evals/no-dump/ (untracked, not committed). `allowed_tools: [Skill, Read, Glob, Grep, AskUserQuestion]` (ruling 1 drops the plan's Write). Static (2) passes: the pattern matches the plan's sample question (and with a trailing newline), misses the full-stop version and the one with a sentence after. Verify (1) FAILED twice, see below. |

## Task 6 checkpoint: a bare /seldon asks for the dump without ending on a question

Command (both runs): `claude plugin eval . --case no-dump --trust-plugin --no-publish --ablation none --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node /code/seldon/lib/check.mjs:*)"`

Run 1 (kept /tmp/claude-eval-txjmRG, evals/results/2026-11-17T11-04-05-614Z): exit 1, score 0.67. `asks-for-dump` failed ("pattern not found in last_message"); `no-write` and `no-ask-user-question` passed. Tool calls: Glob `.planning/seldon/brief.md` only. Last message, word for word:

> There's no brief in this project yet, so we can begin. Please paste or describe your idea, along with any notes you have and who it's for.

Run 2, one rerun to see whether it was a one-off (kept /tmp/claude-eval-VV58v9, evals/results/2026-11-17T11-04-25-973Z): exit 1, score 0.67, same grader failed. Tool calls: Glob `.planning/seldon/brief.md` only. Last message:

> There's no brief here yet, so we're starting fresh. What's the project? Paste or describe the idea, along with any notes or half-written spec you have and who it's for.

What's true: SKILL.md section 3 says "ask for the dump in one plain-prose question that ends your message ... end it on that question", and the plan's Must-be-true says the request "ends on a question". In both runs the model asked as an imperative, ending on a full stop (run 2 put a question in the middle). The behavior SKILL.md describes isn't what the model does from that wording, 0 of 2. Nothing else about the case is wrong: no write, no menu, and no Bash.

Proposed fix: amend SKILL.md section 3 so the request closes on a question the model can't turn into an imperative, for example by giving the closing question itself ("... and end the message on a question such as 'What have you got?'"). Then rerun no-dump. That's a SKILL.md change, which is plan 2's file and not in this plan's lease, and Task 7 says not to change SKILL.md from this plan.
Alternatives: (a) loosen `asks-for-dump` to accept an imperative request ending in a full stop, which drops "ends on a question" from the Must-be-true; (b) accept a question anywhere in the message, which would pass run 2 but not run 1.
Impact: Task 6 can't score 1.00 as written, and Task 7 (phase 1's reruns) has not started. Tasks 1 to 5 are committed and unaffected.

## Where `.planning/seldon/**` resolved (Task 1, Verify 2)

Against the run's own workspace cwd, not the directory the command ran from. Kept run /tmp/claude-eval-E7wFZr (init cwd `/tmp/claude-eval-E7wFZr/home/cwd`): the Write tool created `/tmp/claude-eval-E7wFZr/home/cwd/.planning/seldon/brief.md`, making the missing folder itself. `/code/seldon/.planning/seldon` does not exist after the run. The first run (/tmp/claude-eval-vIhKn1, recorded in plan-3.1.md) showed the same.

## SECURITY: Bash commands in each run's trace (checkpoint ruling 3)

No run this dispatch ran a Bash command other than the check. Every Bash call in every trace was exactly `node /code/seldon/lib/check.mjs --brief .planning/seldon`.

- fast-path-brief (kept /tmp/claude-eval-E7wFZr): one Bash call, the check. All tool calls: Glob `docs/design/**`, Glob `.planning/seldon/brief.md`, Write `<workspace>/.planning/seldon/brief.md`, Bash (the check).
- asks-for-dump (kept /tmp/claude-eval-N8t5Kw): no Bash call. Tool calls: Glob `docs/design/**`, Glob `.planning/seldon/brief.md`.
- asks-who-for (kept /tmp/claude-eval-Jf9TcY): no tool calls at all, so no Bash.
- coaching-brief (kept /tmp/claude-eval-F2ZGbN): one Bash call, the check. Tool calls: Write `<workspace>/.planning/seldon/brief.md`, Bash (the check).
- write-scope (kept /tmp/claude-eval-fchPHR): one Bash call, the check. Tool calls: Glob `docs/design/**`, Write `<workspace>/.planning/seldon/brief.md`, Bash (the check).
- no-dump, both runs (kept /tmp/claude-eval-txjmRG and /tmp/claude-eval-VV58v9): no Bash call. Tool calls: Glob `.planning/seldon/brief.md`.

## Skill load on a `/seldon`-prefixed continuation

Traces hold 0 Skill tool calls, but the skill loads. In fast-path-brief, the session file the run wrote beside the history shows the prompt expanded as `/seldon:seldon` with `<command-args>`, then SKILL.md's full text as the next user record. A `/seldon` prompt loads the skill inline, not through the Skill tool, so "Skill calls" in a trace is not the measure of whether it loaded. That turn's parentUuid is the history's last record (1a0cf7eb), so it did not chain onto the first run's records, which share the session file because the sessionId is the same.

Deviations:
- [deviation] Plan Task 1 assumed a `not granted` line would only appear when the harness doesn't honor the grant. Actually it prints for any case listing plain Write when the grant names only `Edit(.planning/seldon/**)`, though the scoped rule lets Write through. Resolved by the user's ruling (D-16): cases list only read-only tools and Skill. Every case's `allowed_tools` drops Write, Edit and Bash from what the plan listed.
- [deviation] Plan Notes and D-15 assumed a resumed turn on a hand-written history loads the skill. A plain reply made 0 Skill calls. Resolved by the user's ruling (D-15): a continuation prompt starts with `/seldon`, so every replay case's prompt is `/seldon` plus the user's answer, not the bare answer the plan described.
- [deviation] Plan Task 6 and its Must-be-true assumed SKILL.md section 3 makes a bare `/seldon` end its message on a question. In 2 of 2 runs the model ended on an imperative request with a full stop. Stopped at a structural checkpoint; Task 6 is uncommitted, and SKILL.md and the grader are unchanged.

Open items:
- The check's Bash call reports `Exit code 1` even though the check printed its pass line. The shell wrapper fails to write its cwd file (`zsh:1: read-only file system: <run>/tmp/claude-1000/cwd-...`) inside the run's sandbox. Seen in every run that called the check. The models read the pass line and finished (write-scope's reply explains it to the user), but every granted Bash call in an eval shows as an error, which could push a model into retry loops.
- The resumed session file (`evals/<case>/<sessionId>.jsonl`, ignored by evals/.gitignore) collects every run of a case, because the history's sessionId is fixed. Each run still branches from the history's last record.
- Every run this dispatch added `--keep-temp` before `--allow-tools`, which is the only way to get the trace that ruling 3 has me check. It adds no grant. Kept directories stay under /tmp/claude-eval-*. /tmp/claude-eval-fchPHR was chmod'ed 700 (as the harness says) to read its workspace for Task 5 Verify (2).
- Task 6's five files sit untracked in evals/no-dump/.
