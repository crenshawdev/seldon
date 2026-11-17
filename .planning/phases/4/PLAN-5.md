---
phase: 4
plan: 5
depends_on: [1, 2, 3, 4]
requirements:
  - ARCH-02
files:
  - skills/seldon/SKILL.md
  - samples/spine-job/brief.md
  - samples/spine-job/prd.md
  - evals/spine-job/case.yaml
  - evals/spine-job/prompt.md
  - evals/spine-job/history.jsonl
  - evals/spine-job/seed.sh
  - evals/spine-job/graders/asks-unattended.md
  - evals/spine-job/graders/asks-failure.md
  - evals/spine-job/graders/no-trust-question.md
  - evals/spine-job/graders/no-write.md
  - evals/spine-job/graders/no-edit.md
  - samples/spine-outside-input/brief.md
  - samples/spine-outside-input/prd.md
  - evals/spine-outside-input/case.yaml
  - evals/spine-outside-input/prompt.md
  - evals/spine-outside-input/history.jsonl
  - evals/spine-outside-input/seed.sh
  - evals/spine-outside-input/graders/asks-trust.md
  - evals/spine-outside-input/graders/no-unattended-question.md
  - evals/spine-outside-input/graders/no-failure-question.md
  - evals/spine-outside-input/graders/no-write.md
  - evals/spine-outside-input/graders/no-edit.md
  - evals/spine-answers/case.yaml
  - evals/spine-answers/prompt.md
  - evals/spine-answers/history.jsonl
  - evals/spine-answers/seed.sh
  - evals/spine-answers/graders/writes-spine.md
  - evals/spine-answers/graders/check-passes.md
  - evals/spine-answers/graders/carries-answer.md
---

# Phase 4: The architecture spine - Plan 5: The spine's questions

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. This plan makes the spine step ask about trust boundaries, unattended work and failure only when the design has the part each concerns (ARCH-02). It carries the answers into that part's own decision, and proves it with three replayed conversations (AC2, AC3, AC4).

## Must be true when done

- The spine-job case scores 1.00. A design with a scheduled job, whose only input is the operator's own file, gets the fixed unattended-work question and the fixed failure question, doesn't get the trust-boundary question, and writes and edits nothing that turn.
- The spine-outside-input case scores 1.00. A design that takes input from the public and runs nothing unattended gets the fixed trust-boundary question, gets neither the unattended-work nor the failure question, and writes and edits nothing that turn.
- The spine-answers case scores 1.00. Answering spine-job's questions writes a `spine.md` that passes `--spine`. The job's own S- decision carries the user's answers as `> ` quotes, who is told when it breaks and how included.
- Every point in SKILL.md where a turn stops to ask has a §1 route that carries the same step on with the answer. The plan report holds that mapping.
- spine-from-prd and spine-rerun still score 1.00 with the questions in place.

## Context

- **Locked:** D-02, D-03, D-04, D-06 and D-09, and D-15 for the case form. The sections "15. The spine step", "16. The spine draft" and "17. The spine check" come from Plan 2.
- **SECURITY (phase 2 D-02, D-13):** `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`. No task touches it.
- **Fixed words:** this plan fixes the three questions. Each goes on a line of its own in a fenced block introduced with "exactly these words", as §8 does for `Who is it for?`. A positive regex and a `not_contains` regex can then both test them honestly (D-09). The case tasks copy the lines from SKILL.md.
- **Stop points:** Task 1 adds the spine's questions turn, a new stop point, and Task 2 adds the §1 route back from it in the same plan. Task 2's Verify audits every stop point in SKILL.md, which is the check the owner asked to be planned into the spine work after phase 3's diff reviews.
- **Eval runs:** as in Plan 3's Context.
  - Run from `/code/seldon`, the main tree, never a worktree, one `--case` per run.
  - Use `--trust-plugin --no-publish --ablation none --scaffold --keep-temp`, then `--allow-tools` last with exactly the two grants.
  - **This plan runs exactly five cases:** `spine-job`, `spine-outside-input` and `spine-answers`, which are new, and `spine-from-prd` and `spine-rerun` again, as the regression for the changed step.
- **Seed vetting:** each new `seed.sh` holds only `mkdir -p .planning/seldon` and `cp` lines from `"$repo/samples/..."`, besides the shebang, `set -euo pipefail`, the repo line and comments. The coordinator vets it before its first run. The task stops at a checkpoint quoting the file.
- **Bash audit:** report every Bash command in each kept trace. Only `node /code/seldon/lib/check.mjs` with `--brief`, `--prd` or `--spine`, then `.planning/seldon`, is allowed. Anything else is a checkpoint. Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:** as in Plan 3, plus three for the histories:
  - The history and scaffold come together, as in `prd-reads-brief`, under D-15.
  - A history is hand-written in phase 2 D-15's record shape, as in `evals/confirm-clear/history.jsonl`. Its `sessionId` is UUID-shaped, so `evals/.gitignore` ignores the session file a run writes.
  - A continuation prompt starts with `/seldon`.
- **Owner's words:** committed files never carry the owner's own words. Fixtures, histories and prompts use coined projects and invented user words.
- **Held:** no push, tag, PR or GitHub change, and no install.

## Tasks

### Task 1: Ask the spine's open questions in one turn

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#15. The spine step, skills/seldon/SKILL.md#8. The fast path questions, skills/seldon/SKILL.md#12. The PRD step
- **Decisions:** D-02, D-09, D-06
- **Pins:** tests/skill.test.mjs
- **Action:** "15. The spine step" stops to ask when something only the user can decide is open. Otherwise it drafts in the same turn, as it does now.
  - **The turn (D-09):** ask every open question in one plain-prose message that ends the turn, and write nothing in that turn. No AskUserQuestion and no menu.
  - **What's open:** stack or hosting the brief's `> ` quotes never name, plus the questions about the design's parts below. Stack and hosting are always open in that case because the PRD leaves them out (D-06). This is my reading of D-15, which treats them as spine questions a fixture settles by stating them.
  - **The parts (D-02), each defined in the section:**
    - **Outside input:** anything typed or sent by people or systems the project doesn't control: users, members, the public, another service. The operator's own data, such as a file the owner maintains, isn't outside input. A design with outside input gets the trust-boundary question.
    - **Unattended work:** anything the system does with no person present, such as a scheduled job. A design with unattended work gets the unattended-work question and the failure question.
    - **Failure goes with unattended parts only.** The failure question is never asked about an outside dependency, such as an email provider.
    - A design without a part gets neither of that part's questions.
  - **Fixed words:** each of the three questions is one sentence ending in `?`. None holds another's wording or `Who is it for?`, so a `not_contains` on one can't match another. The failure question asks who is told when the part breaks, and how. Prose before the fixed lines can name the part the questions are about.
  - **A rerun:** every decision in the `spine.md` a rerun reads counts as answered, its `[ASSUMPTION]` guesses included. A rerun asks only about what that spine doesn't decide yet and only the user can decide, under the same rules. "The spine rerun" says so too.
- **Verify:**
  - **Testing scope:** Tasks 3 and 4 prove this by eval. Text checks that fail today, plus the pinned test, are enough here, and testing stops there.
  - (1) A `node -e` script takes "15. The spine step" from SKILL.md. It finds three fenced one-line blocks, each a sentence ending in `?`, and today it finds none.
  - (2) The same script confirms that no one of the three lines is a substring of another or of `Who is it for?`, and `Who is it for?` isn't a substring of any of them.
  - (3) The section defines outside input, excluding the operator's own data, and unattended work. It ties the failure question to unattended parts only, and it says a rerun counts existing decisions as answered.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 2: Carry the spine answers back into the draft

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#16. The spine draft
- **Decisions:** D-09, D-02, D-03, D-04
- **Pins:** tests/skill.test.mjs
- **Action:** Task 1's stop point gets its way back.
  - **The route:** §1 gains "Spine questions answered", after "PRD questions answered" and in its shape: your last turn asked the spine step's questions, and the user answered.
    - When that turn was a `/seldon spine` rerun over a `spine.md` that's there, go to "The spine rerun" and carry the rerun on with those answers. Change `spine.md` with Edit, never a fresh Write.
    - Otherwise, go to "16. The spine draft" and draft with those answers.
  - **Where the answers go (D-02, D-03):** "16. The spine draft" says each answer to a part's question goes into that part's own S- decision, quoted word for word on a `> ` line.
    - The trust-boundary answer goes into the decision for the part that takes the outside input.
    - The unattended-work and failure answers, who is told when it breaks and how included, go into that job's own decision.
    - Never put an answer into a decision of a new kind, or into a decision that holds only the answer.
    - A stack or hosting answer goes into the `stack` or `hosting` decision with its quote.
  - **The Edit routes:** "The spine draft" adds the rerun continuation to the routes that change an existing `spine.md`.
- **Verify:**
  - **Testing scope:** Task 5 proves the route and the placement by eval. The stop-point audit, the regression runs and text checks that fail today are enough, and testing stops there.
  - (1) `grep -c 'Spine questions answered' skills/seldon/SKILL.md` prints at least 1. It prints 0 today. The route has both branches, and the rerun branch says Edit, never a fresh Write.
  - (2) "16. The spine draft" says each answer goes into its part's own decision as a `> ` quote, never into a decision of a new kind.
  - (3) **Stop-point audit:** list every place SKILL.md ends a turn on a question and the §1 route that carries it on, as a table in the plan report. That covers the dump ask, the recommendation, the fast-path questions, the refusal re-ask, the coaching question, the brief reopen, the documents question, the three steps' confirm questions, the PRD questions and the spine questions, the rerun branch included. Every row has a route. A row without one is fixed in this task.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (5) The run command with `--case spine-from-prd`, and again with `--case spine-rerun`, each exits 0 at 1.00, with the Bash audit reported.

### Task 3: Add the spine-job case

- **Files:** samples/spine-job/brief.md, samples/spine-job/prd.md, evals/spine-job/case.yaml, evals/spine-job/prompt.md, evals/spine-job/history.jsonl, evals/spine-job/seed.sh, evals/spine-job/graders/asks-unattended.md, evals/spine-job/graders/asks-failure.md, evals/spine-job/graders/no-trust-question.md, evals/spine-job/graders/no-write.md, evals/spine-job/graders/no-edit.md
- **Reads:** evals/prd-reads-brief/case.yaml, evals/confirm-clear/history.jsonl, evals/confirm-clear/graders/suggests-clear.md, evals/resume/graders/no-who-for.md, samples/prd-from-brief/brief.md, skills/seldon/SKILL.md#15. The spine step
- **Decisions:** D-02, D-09, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** This case is AC2's positive replay and AC3's negative one.
  - **The fixture pair, a coined project:**
    - **`brief.md`:** passes `--brief`, and every item carries a quote or a tag. Its user quotes name the stack and the hosting, so only the part questions are open.
    - **The design:** one job runs on a schedule with nobody present, such as a daily email to the operator. Its only input is a file or list the operator keeps themselves. Nobody else types or sends anything into it, so it has unattended work and no outside input (D-02).
    - **`prd.md`:** what the PRD step would build from that brief. It passes `--prd`, every requirement and non-goal is quoted or tagged, and it names no technology.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy the pair from `samples/spine-job/`.
  - **`history.jsonl`:** four records:
    - the user's `/seldon`
    - Seldon's PRD resume line, then the PRD written, `seldon check: prd.md conforms` and the PRD confirm question
    - the user's `/seldon` confirmation
    - Seldon's `/clear` words, exactly as SKILL.md fixes them

    The talk matches the fixture pair, and the history holds no stack, hosting or job detail the files don't.
  - **`prompt.md`:** exactly `/seldon`. A new run resumes into the spine step from the files.
  - **`case.yaml`:** `context.history_file: history.jsonl`, `context.scaffold_script: seed.sh`, `max_turns: 20`, `timeout_seconds: 600` and the read-only tools. The description doesn't say "scaffold".
  - **Graders:**
    - **`asks-unattended.md`** and **`asks-failure.md`:** `regex` on `last_message`. Each matches its fixed line from SKILL.md on a line of its own, with regex metacharacters escaped.
    - **`no-trust-question.md`:** `regex` on `last_message`, `match: not_contains`, on the trust-boundary line's text.
    - **`no-write.md`** and **`no-edit.md`:** `tool_used` on Write and on Edit, each with `max: 0`.
- **Verify:**
  - **Testing scope:** the outcomes are AC2's positive half and AC3's negative half, which nothing covers today. Five graders, their D-21 checks and one passing run are enough, and testing stops there.
  - (1) The fixture is valid:
    - `node lib/check.mjs --brief samples/spine-job` and `node lib/check.mjs --prd samples/spine-job` each exit 0.
    - The brief's `> ` lines name a stack and a hosting choice.
    - The PRD has a requirement for the scheduled job, and none takes input from anyone but the operator.
  - (2) `node --test tests/scaffold.test.mjs` passes. Each history line parses as JSON with a UUID-shaped `sessionId`.
  - (3) D-21, checked with a `node -e` script that reads each pattern from its file:
    - Each `asks-` pattern matches a message holding its line on a line of its own. It doesn't match the line with one word changed, or a message holding only the other two fixed lines.
    - `no-trust-question` matches, which fails the grader, a message holding the trust-boundary line. It doesn't match a message holding only the unattended and failure lines.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case spine-job` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

### Task 4: Add the spine-outside-input case

- **Files:** samples/spine-outside-input/brief.md, samples/spine-outside-input/prd.md, evals/spine-outside-input/case.yaml, evals/spine-outside-input/prompt.md, evals/spine-outside-input/history.jsonl, evals/spine-outside-input/seed.sh, evals/spine-outside-input/graders/asks-trust.md, evals/spine-outside-input/graders/no-unattended-question.md, evals/spine-outside-input/graders/no-failure-question.md, evals/spine-outside-input/graders/no-write.md, evals/spine-outside-input/graders/no-edit.md
- **Reads:** evals/spine-job/case.yaml, evals/spine-job/history.jsonl, evals/spine-job/graders/asks-unattended.md, evals/spine-job/graders/no-trust-question.md, skills/seldon/SKILL.md#15. The spine step
- **Decisions:** D-02, D-09, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** This case is AC3's positive replay and AC2's negative one, built the way Task 3 is.
  - **The fixture pair, another coined project:**
    - **`brief.md`:** passes `--brief`, quotes or tags every item, and its user quotes name the stack and the hosting.
    - **The design:** people outside the project's control type something in, such as members of the public filling in a form. Nothing happens on a schedule or with no person present. Nothing is sent, synced, imported or reminded, and everything happens while a person is using it (D-02).
    - **`prd.md`:** passes `--prd`, is quoted or tagged, and names no technology.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy the pair from `samples/spine-outside-input/`.
  - **`history.jsonl`:** the same four-record shape as Task 3's, matching this pair.
  - **`prompt.md`:** exactly `/seldon`.
  - **`case.yaml`:** as in Task 3.
  - **Graders:**
    - **`asks-trust.md`:** `regex` on `last_message`, matching the trust-boundary line from SKILL.md on a line of its own.
    - **`no-unattended-question.md`** and **`no-failure-question.md`:** `regex` on `last_message`, each `match: not_contains` on its fixed line's text.
    - **`no-write.md`** and **`no-edit.md`:** as in Task 3.
- **Verify:**
  - **Testing scope:** the outcomes are AC3's positive half and AC2's negative half, which nothing covers today. Five graders, their D-21 checks and one passing run are enough, and testing stops there.
  - (1) `node lib/check.mjs --brief samples/spine-outside-input` and `--prd samples/spine-outside-input` each exit 0. The brief names a stack and a hosting choice, and neither file mentions a schedule, a reminder, a sync, an import or a background job.
  - (2) `node --test tests/scaffold.test.mjs` passes, and each history line parses with a UUID-shaped `sessionId`.
  - (3) D-21, checked with a `node -e` script:
    - `asks-trust` matches its line on a line of its own. It doesn't match the line with one word changed, or a message holding only the unattended and failure lines.
    - Each `not_contains` pattern matches, which fails the grader, a message holding its line. It doesn't match a message holding only the trust-boundary line.
  - (4) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (5) The run command with `--case spine-outside-input` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported.

### Task 5: Add the spine-answers case

- **Files:** evals/spine-answers/case.yaml, evals/spine-answers/prompt.md, evals/spine-answers/history.jsonl, evals/spine-answers/seed.sh, evals/spine-answers/graders/writes-spine.md, evals/spine-answers/graders/check-passes.md, evals/spine-answers/graders/carries-answer.md
- **Reads:** evals/spine-job/history.jsonl, evals/spine-job/seed.sh, evals/coaching-brief/graders/quotes-answer.md, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#16. The spine draft
- **Decisions:** D-02, D-03, D-09, D-15
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC4's replay: the user answers the questions spine-job's design gets.
  - **`seed.sh`:** `mkdir -p .planning/seldon`, then copy the pair from `samples/spine-job/`. No new fixture.
  - **`history.jsonl`:** spine-job's four records, then two more:
    - the user's `/seldon`
    - Seldon's spine resume line, prose naming the scheduled job, then the unattended-work and failure questions, each on its own line exactly as SKILL.md fixes them, ending the turn
  - **`prompt.md`:** `/seldon` followed by the user's answers in their own words. They hold two distinct phrases:
    - one saying when the job runs with nobody there
    - one saying who is told when it breaks, and how, in one unbroken run of words
  - **`case.yaml`:** history and scaffold, `max_turns: 20`, `timeout_seconds: 600`, the read-only tools, and a description without "scaffold".
  - **Graders:**
    - **`writes-spine.md`:** `file_exists` on `.planning/seldon/spine.md`.
    - **`check-passes.md`:** `regex` on `last_message`, matching `seldon check: spine\.md conforms`. Since `--spine` fails a seventh kind, this is the evidence the answers didn't land in a decision of a new kind (D-02).
    - **`carries-answer.md`:** `regex` on the file `.planning/seldon/spine.md`. Inside one `## S-NN:` section, before the next `## `, it finds a `> ` line holding the who-is-told phrase and a `> ` line holding the when-it-runs phrase, word for word. The same section must also hold the job's own wording, a coined job word from `samples/spine-job/prd.md`, in its heading or in non-quote body text. Sharing one section alone doesn't make it the job's decision; the job's wording does, so a separate decision holding only the answers fails it (D-02).
- **Verify:**
  - **Testing scope:** the outcome is AC4, which nothing covers today. Three graders, their D-21 checks and one passing run are enough, and testing stops there.
  - (1) The history's last assistant record holds the two fixed lines exactly as SKILL.md fixes them, and the spine resume line. A `node -e` script compares each against SKILL.md's fenced lines.
  - (2) `node --test tests/scaffold.test.mjs` passes, and each history line parses with a UUID-shaped `sessionId`.
  - (3) D-21 for `carries-answer`, checked with a `node -e` script. It matches a spine whose one decision quotes both phrases. It doesn't match when:
    - the two phrases sit in different decisions
    - both phrases sit in a section of an allowed kind that holds no job wording, beside a job decision with no quotes
    - the who-is-told phrase is in body text with no `> `
    - one word of a phrase changes
  - (4) D-21 for the other two: `check-passes` doesn't match the brief, PRD or all-four pass lines. `writes-spine`'s path is `.planning/seldon/spine.md`, which the seed doesn't create.
  - (5) The coordinator vets `seed.sh` before its first run. This is a checkpoint.
  - (6) The run command with `--case spine-answers` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit is reported. Before the kept folder is removed, `node lib/check.mjs --spine <kept workspace>/.planning/seldon` exits 0.

## Notes

- **Two cases, four halves:** each of Tasks 3 and 4 is one criterion's positive replay and the other's negative. The design that gets the unattended questions is the one that must not get the trust question, and the other way round. So every `not_contains` grader runs in a turn that did stop to ask, and can't pass just because Seldon asked nothing.
- **Why Plan 4 comes first:** this plan shares no file with Plan 4. Every plan from 3 on runs evals from the main tree, though, so no two of them can run at once, and `depends_on` orders them.
