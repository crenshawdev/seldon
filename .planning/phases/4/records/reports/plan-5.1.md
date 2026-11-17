PLAN CHECKPOINT: decision
Plan: .planning/phases/4/PLAN-5.md
Tasks: 1 of 5
| Task | Commit | Note |
|---|---|---|
| 1 - Ask the spine's open questions in one turn | c0df195 | "15. The spine step" gains "The spine's questions": stack and hosting the brief's quotes never name, outside input (the operator's own data excluded), unattended work, failure tied to unattended work only, and "On a rerun". "The spine rerun" says its decisions count as answered and that it takes the answers to its own questions. Verify (1)-(3): a node script finds 3 fenced one-line `?` blocks in section 15 (0 at the parent commit), no substring relation among them or with `Who is it for?`, and all definitions present. Verify (4): skill.test.mjs 2/2, and `claude plugin validate --strict .` exits 0 (one ICON_MISSING directory warning, already there). |
| 2 - Carry the spine answers back into the draft | uncommitted (SKILL.md modified) | §1 gains "Spine questions answered" after "PRD questions answered", with the rerun branch ("The spine rerun", Edit, never a fresh Write) and the draft branch. "The spine's questions" points to it. "16. The spine draft" lists it among the Edit routes for a spine that's there, says "this step's own questions", and gains "The answers to the spine's questions": each answer goes into its part's own decision on a `> ` line, trust into the outside-input part's decision, the unattended-work and failure answers into the job's own decision, stack or hosting into that decision, and never into a decision of a new kind or one holding only the answer. Verify (1): `grep -c` prints 3 (0 at HEAD). Verify (2): present. Verify (3): the stop-point table is below, and every row has a route. Verify (4): skill.test.mjs 2/2, validate exit 0. Stopped before Verify (5), the spine-from-prd and spine-rerun runs. |
| 3 - Add the spine-job case | uncommitted (11 files written) | Sowlist, a coined market gardener's project. The morning list is a program that reads her own planting file every morning and emails her the day's work. The brief's quotes name the stack ("written in Go") and the hosting ("it can live on the raspberry pi in the shed"). Verify (1): `--brief` and `--prd` on samples/spine-job each conform, exit 0. MORN-01 is the scheduled job, and no requirement takes input from anyone but the gardener. Every PRD quote is a run of a brief `> ` line, and every brief item and PRD bullet has a quote or a tag. The PRD names no Go, pi or server. Verify (2): scaffold.test.mjs 4/4, and the 4 history lines parse with one UUID-shaped sessionId, chained by parentUuid. Verify (3): the D-21 node script reads each pattern from its file, and all checks are ok. Stopped at Verify (4), the seed vetting. |
| 4 - Add the spine-outside-input case | uncommitted (11 files written) | Quaylost, a coined ferry terminal lost-property project. Passengers type lost-item reports into a page, and desk staff match them. The brief's quotes name the stack ("built with Django and Postgres") and the hosting ("it can run on the harbour board's server in the back office"). Verify (1): `--brief` and `--prd` each conform, exit 0. `grep -iE 'schedul\|remind\|sync\|import\|background\|cron\|daily\|nightly\|every (day\|morning\|night)'` over both files finds nothing (exit 1). Verify (2): scaffold 4/4, and the history parses with a UUID sessionId. Verify (3): D-21 all ok. Stopped at Verify (4), the seed vetting. |
| 5 - Add the spine-answers case | uncommitted (7 files written) | The seed copies samples/spine-job/, and there's no new fixture. The history is spine-job's four records (same content), then `/seldon`, then the spine resume line, prose naming the morning list, and the two fixed lines, ending the turn. The prompt is `/seldon It should go at half past five every morning, before I head out to the beds. If it breaks, text my phone so I know to check the file myself, nobody else needs telling.` carries-answer looks inside one `## S-NN:` section for a `> ` line with `half past five every morning`, a `> ` line with `text my phone so I know to check the file myself`, and job wording (`morning list`, `morning email` or a `MORN-NN` ID) in the heading or a non-quote line. Verify (1): the last assistant record holds the resume line and both fixed lines, each on a line of its own, compared against SKILL.md's fenced lines. Verify (2): scaffold 4/4, and the 6 history lines parse with a UUID sessionId. Verify (3): carries-answer matches one job decision quoting both phrases, both phrases on one `> ` line, and job wording in body text only. It misses phrases split across decisions, an answers-only section of an allowed kind beside an unquoted job decision, job wording that sits only in a quote, either phrase in body text without `> `, either phrase with one word changed, and a phrase in the next decision. Verify (4): check-passes misses the brief, PRD and all-four lines. writes-spine's path is `.planning/seldon/spine.md`, which the seed doesn't create. Stopped at Verify (5), the seed vetting. |

Stop-point audit (Task 2 Verify (3)). Every place SKILL.md ends a turn on a question, and the §1 route that carries it on:
| Stop point | Where | Route in §1 |
|---|---|---|
| Dump ask (empty `$ARGUMENTS`, or `/seldon brief` with no brief) | §3, §1 `brief` | Dump given |
| Recommendation | §6 | Path chosen |
| Fast-path questions | §8 | Interview under way |
| Refusal re-ask after the fast-path answers | §8, §10 What it refuses | Interview under way ("asked again about What it refuses") |
| Coaching question, including a refusal re-ask during the walk | §9 | Interview under way |
| Brief reopen on `/seldon brief` | §1 `brief`, "Otherwise, reopen it" | Brief change answered (first way) |
| Refusal re-ask during a brief change | §10 The brief rerun | Brief change answered (second way) |
| Documents question | §2 "A dump when documents are there" | Documents question answered, and the step-name test's "After the documents question" for a `/seldon brief` reply |
| Brief confirm question | §11 | Step confirm answered (Confirms / Names changes) |
| PRD confirm question | §14 | Step confirm answered |
| Spine confirm question | §17 | Step confirm answered |
| PRD questions, fresh and on a `/seldon prd` rerun | §12 | PRD questions answered (both branches) |
| Spine questions, fresh and on a `/seldon spine` rerun | §15 "The spine's questions" | Spine questions answered (both branches; added by this task) |
Every row has a route. The spine questions were the only stop point without one, and Task 2 adds it.

Static analysis: `workflow.lint_command` is unset, and `detect-commands` returns lint null and typecheck null, so none ran.

Seeds to vet (all mode 755, every line one the scaffold test allows):
- /code/seldon/evals/spine-job/seed.sh: shebang, `set -euo pipefail`, repo line, comments, `mkdir -p .planning/seldon`, `cp "$repo/samples/spine-job/brief.md" .planning/seldon/brief.md`, `cp "$repo/samples/spine-job/prd.md" .planning/seldon/prd.md`.
- /code/seldon/evals/spine-outside-input/seed.sh: the same lines from `samples/spine-outside-input/`.
- /code/seldon/evals/spine-answers/seed.sh: the same lines as spine-job's (`samples/spine-job/`). Only the comments differ.

Eval runs proposed, exactly five. Each runs from /code/seldon, one case at a time, and calls the model API. Each is followed by the Bash audit of its kept trace, then the kept `/tmp/claude-eval-*` folder is removed:
- `claude plugin eval . --case spine-from-prd --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`
- the same with `--case spine-rerun`
- the same with `--case spine-job`
- the same with `--case spine-outside-input`
- the same with `--case spine-answers`, then `node lib/check.mjs --spine <kept workspace>/.planning/seldon` before the folder is removed

Each case gets one scored run. A miss that the trace shows is model variance gets a retry with no file changes, at most 3 tries per case. A miss that needs a grader, fixture or SKILL change stops at a checkpoint instead.
Commits on continuation: Task 2 (`feat(4-5): ...`, SKILL.md) after the two regression runs pass, then Tasks 3, 4 and 5, one commit each, each after its case's passing run.

Deviations: none
Open items:
- carries-answer accepts `morning list`, `morning email` or a `MORN-NN` ID as the job's own wording, not a single coined word. A separate decision headed with the job's name (for example "When the morning email breaks") holding only the answers would still pass. The plan's rule is that the job's wording makes the decision the job's, and this follows that rule.
- The fixed questions say "it", and prose before them names the part. SKILL.md says nothing about a design with two unattended parts, such as asking the pair once per part. No case here has two, so the lean shape met the Verify. Add it when a case has two such parts.
