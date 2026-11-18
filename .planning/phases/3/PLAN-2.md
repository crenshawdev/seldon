---
phase: 3
plan: 2
depends_on: [1]
requirements:
  - FLOW-02
  - FLOW-04
  - DOCS-02
files:
  - skills/seldon/SKILL.md
  - evals/resume/case.yaml
  - evals/resume/prompt.md
  - evals/resume/seed.sh
  - evals/resume/graders/names-brief-first.md
  - evals/resume/graders/writes-prd.md
  - evals/resume/graders/no-dump-ask.md
  - evals/resume/graders/no-who-for.md
  - evals/existing-brief/case.yaml
  - evals/existing-brief/graders/says-rerun-later.md
  - evals/existing-brief/graders/asks-rerun-or-go-on.md
---

# Phase 3: The PRD, resume and rerun - Plan 2: Resume into the PRD step

## Goal

The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds. This plan does three things:

- makes the files in `.planning/seldon/` decide where a new run starts
- adds the PRD step, built from `brief.md` alone and checked with `--prd`
- rewrites the existing-brief case for a new dump that meets a brief already there

## Must be true when done

- In a fresh session with a confirmed brief on disk, `/seldon` first says the fixed resume line naming `.planning/seldon/brief.md` and `/seldon brief`, before it writes anything. It then writes `.planning/seldon/prd.md` and asks none of the brief step's questions. The resume case scores 1.00.
- With `brief.md` there and a new dump as the argument, `/seldon` writes and edits nothing and ends on the fixed question, which offers `/seldon brief` or going on from the brief. The existing-brief case scores 1.00.
- With both the brief and the PRD there, a bare `/seldon` writes nothing and ends on the fixed later-release line. So does answering the documents question by going on.
- No route makes a fresh Write over an existing `prd.md`. The PRD step creates `prd.md` only when it isn't there.
- SKILL.md's `allowed-tools` still holds exactly phase 2 D-02's five entries. Only the body's write rule widens, to add `prd.md`.
- The README's eval command passes every case in the suite, phase 2's ten included.

## Context

- **Locked:** D-01, D-02, D-05, D-06, D-08, D-10, D-14, D-15, D-16, D-17, D-18, D-19, D-20 and D-21.
- **SECURITY (phase 2 D-02):** `allowed-tools` stays exactly these five entries, pinned by `tests/skill.test.mjs`: Read, Glob, Grep, `Edit(.planning/seldon/**)` and `Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*)`. No task touches it.
- **Fixed words:** every sentence a grader matches gets fixed words in SKILL.md, on a line of its own in a fenced block introduced with "exactly these words", the way §3's dump ask is written. Phase 2's model paraphrased free wording past its graders three times (phase 2 SUMMARY deviations). This plan fixes three: the resume line, the later-release line and the documents question.
- **The eval run:**
  - Run from `/code/seldon`, the main tree, never a worktree.
  - Run one case at a time with `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, because it reads everything after it as a list.
  - `--keep-temp` is for the Bash audit only and goes in no committed file.
  - Nothing broader, and never plain Write.
- **The Bash audit:** after every run, read each kept `/tmp/claude-eval-*/out/trace.jsonl` and report every Bash command in it.
  - Only two commands are allowed: `node /code/seldon/lib/check.mjs --brief .planning/seldon` and `node /code/seldon/lib/check.mjs --prd .planning/seldon`.
  - Any other command is a checkpoint: stop.
  - Remove every kept `/tmp/claude-eval-*` folder before the plan finishes.
- **Case rules:**
  - `allowed_tools` is `[Skill, Read, Glob, Grep]` and nothing else (phase 2 D-16). Write and Edit come only through the grant.
  - A scaffold is only copy lines from `samples/` that `tests/scaffold.test.mjs` allows.
  - No line of a `case.yaml` or `prompt.md` may say "scaffold" except the plain `scaffold_script: seed.sh`, and none may hold a double-quoted backslash. The scaffold test flags both.
  - Every new grader passes D-21's question before commit: can it pass when the behavior it claims is missing?
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Start a new run from the files in .planning/seldon/

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#2. A brief already there, skills/seldon/SKILL.md#3. The dump
- **Decisions:** D-06, D-01, D-16, D-17
- **Pins:** tests/skill.test.mjs
- **Action:** Replace two things (D-06): §1's rule to read only the conversation, never a file, and §2's brief-exists stop with its fixed line.
  - **§1, the conversation:** it decides only inside a step already under way. Those positions are Dump given, Path chosen, Interview under way, and the ones later tasks add. Anything else is a new run, and the files decide, even when the conversation still holds an earlier run. D-16 makes `/clear` a suggestion, never a requirement, so a new run in a long conversation builds from the files alone.
  - **§1, Run finished:** it now leads to the file-based start, as a new run does. Plan 3 replaces this position with the step's confirm (D-07).
  - **The new start section:** a new section takes §2's place. Before reading any dump, look for `.planning/seldon/brief.md` and `.planning/seldon/prd.md` with Read or Glob. An error or no match means the file isn't there. Then:
    - **No brief:** the brief step, as now, from §3 on.
    - **A brief, no PRD and an empty argument:** this is the resume (FLOW-02).
      - The message starts with the fixed resume line, before any drafting or writing, and then goes to the PRD step that Task 3 adds.
      - The line names `.planning/seldon/brief.md` as the file the PRD is built from and says `/seldon brief` revises it (D-01).
      - A brief on disk counts as confirmed, so there's no confirmation record to look for (D-01).
    - **A brief and a PRD, and an empty argument:** write nothing and end on the fixed later-release line (D-17). It says the spine and epics steps come in a later release. It says nothing about which files exist, because Plan 4 reuses it for `/seldon spine` and `/seldon epics`.
    - **Documents there and an argument that isn't empty:** write nothing and go to the section Task 2 adds.
  - **Removals:** delete phase 2's fixed line, `A brief is already there at .planning/seldon/brief.md, and I've left it as it is. Rerunning a step comes in a later release.`, and the stop around it.
  - **Kept:** the paragraph about a summary arriving as `$ARGUMENTS` on a later turn.
- **Verify:**
  - **Testing scope:** the outcomes are the routes from the files. Task 6 proves the resume route by eval, and Task 7 proves the dump-with-a-brief route and runs the whole suite. Here, text checks that fail today plus the pinned test are enough, and testing stops there.
  - (1) `grep -c 'rebuilding a run after' skills/seldon/SKILL.md` prints 0, and so does `grep -c 'left it as it is' skills/seldon/SKILL.md`. Each prints 1 today.
  - (2) SKILL.md holds two fixed lines, each on a line of its own: the resume line, naming `.planning/seldon/brief.md` and `/seldon brief`, and the later-release line, naming the spine and epics. `grep -c 'prd.md' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (3) `node --test tests/skill.test.mjs` passes and `claude plugin validate --strict .` exits 0.

### Task 2: Ask before setting a new dump aside when documents exist

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#3. The dump
- **Decisions:** D-02, D-08
- **Pins:** tests/skill.test.mjs
- **Action:** This covers a new run where documents are already there and the argument is text that isn't exactly a step name. Plan 4 handles an argument that is exactly `brief`, `prd`, `spine` or `epics` once trimmed (D-08). The user's words are never set aside silently (D-02).
  - **The turn:** Seldon writes nothing and ends on one fixed prose question. It asks whether to rerun the brief with this text (`/seldon brief`) or go on from the brief on disk. The fixed words name `/seldon brief` and say going on continues from the brief that's there. With only a brief there, which is the state the eval grades, going on means the PRD.
  - **Nothing else that turn:** no AskUserQuestion and no menu. Don't read the design folder or make the path judgment on that text in this turn.
  - **The answer:** add a §1 position for when the documents question has been asked and the user has answered. Going on follows Task 1's file routes, exactly as a resume does:
    - **Only a brief there:** the fixed resume line, then the PRD step.
    - **A brief and a PRD there:** write nothing and end on the fixed later-release line (D-17). Going on never runs the PRD step over a PRD that's already there.
    - The text from the question's turn isn't input to the PRD (D-15).
    - A rerun answer, `/seldon brief` typed as the reply included, gets its path in Plan 5 Task 1, where the brief rerun is built.
- **Verify:**
  - **Testing scope:** Task 7 proves the question by eval. Here, text checks that fail today plus the pinned test are enough, and testing stops there.
  - (1) SKILL.md holds the fixed question on a line of its own that names `/seldon brief` and ends in `?`. No such line exists today.
  - (2) SKILL.md's position for an answered documents question sends going on to the resume line and the PRD step when only `brief.md` is there, and to the fixed later-release line, writing nothing, when `prd.md` is there too. No such position exists today.
  - (3) `node --test tests/skill.test.mjs` passes and `claude plugin validate --strict .` exits 0.

### Task 3: Build the PRD step from the brief alone

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#5. The judgment, skills/seldon/SKILL.md#8. The fast path questions, docs/FORMAT.md#prd.md
- **Decisions:** D-15, D-19, D-05
- **Pins:** tests/skill.test.mjs
- **Action:** Add a PRD step section after the brief's sections.
  - **Input (D-15, FLOW-04):** it reads `.planning/seldon/brief.md` and nothing else. That rules out `docs/design/` or any design folder, the dump, and the earlier conversation, whatever that holds. Design-folder facts reach the PRD only through the brief's sourced quotes.
  - **Go-ahead (D-19):** running the step is the go-ahead, so there's no path recommendation and no confirm-first turn. Every brief section counts as answered, tagged guesses included.
    - The step drafts in the same turn unless something only the user can decide is still open.
    - Then every such question goes in one plain-prose message that ends the turn, and nothing is written in that turn.
    - Add a §1 position for PRD questions that were asked and answered: draft with those answers. They are quote sources too, which Plan 3 wires in (D-13).
  - **Stakes (D-05):** infer the stakes from the brief's Who it serves, Success criteria and Scope, and size the PRD to them: how many requirements and categories, and how much goes into non-functional requirements and journeys.
    - When the brief doesn't show the stakes, MVP scope carries one line saying what size the PRD was drafted for, tagged `[ASSUMPTION]`. MVP scope is my choice of place: the PRD keeps exactly its five sections (D-12).
    - The step asks no extra question about stakes and doesn't change the brief's format.
- **Verify:**
  - **Testing scope:** Task 6 proves this step's behavior by eval. Text checks that fail today are enough here, and testing stops there.
  - (1) SKILL.md has a PRD step section that names `.planning/seldon/brief.md` as its only input and says it never reads `docs/design/`, the dump or the conversation. Today SKILL.md has no PRD section.
  - (2) `grep -c 'Recommended path:' skills/seldon/SKILL.md` is the same before and after this task, so the PRD step adds no recommendation.
  - (3) `node --test tests/skill.test.mjs` passes.

### Task 4: Draft prd.md as capabilities, naming no technology

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#10. The draft, docs/FORMAT.md#prd.md, docs/FORMAT.md#Requirement IDs, samples/prd.md
- **Decisions:** D-14, D-18, D-17, D-09
- **Pins:** tests/skill.test.mjs
- **Action:** Add a PRD draft section. It writes `.planning/seldon/prd.md` with the Write tool, in the shape `docs/FORMAT.md` sets and the check enforces:
  - **Title:** a `# ` title naming the project, in `samples/prd.md`'s form.
  - **Sections:** exactly five `## ` sections, in this order and spelling: Requirements, Non-functional requirements, User journeys, Non-goals, MVP scope. There's no other `## ` heading, and no line in a body starts with `## `.
  - **Requirements:**
    - They sit under `### <Category>` subheadings, each one a `- **CAT-01**: <one line>` bullet with only the ID inside the bold.
    - Non-functional requirements use the same bullet form and need no subheading.
    - An ID is a prefix of 2 to 8 uppercase letters or digits with at least one letter, a dash, and two or more digits. Each ID appears once across both sections.
    - Each of the two sections holds at least one bullet (Plan 1, D-11).
  - **User journeys:** prose that walks a user through the product.
  - **MVP scope:** says which requirement IDs come first.
  - **Capabilities, not implementation (DOCS-02):** the PRD names no library, framework, format or hosting choice, even when the brief names one (D-14). Those belong to the spine. A tech word the user said stays in the brief.
  - **No fresh Write over a PRD (D-17, D-09):** the step uses Write only to create a `prd.md` that isn't there yet.
    - Right before that Write, it looks for `.planning/seldon/prd.md` with Read or Glob, whatever route led into the step.
    - When one is there and the run isn't a `/seldon prd` rerun, it writes nothing and ends on the fixed later-release line.
    - Only the `/seldon prd` rerun updates an existing PRD, with Edit. Plan 4 Task 4 builds it.
    - This is why a route nobody planned for, like a go-on answer with both documents there, can't replace a PRD with renumbered IDs and no `Retired:` line.
  - **The write rule (D-18):** widen `<rules>`' write rule from `brief.md` alone to `brief.md` and `prd.md`, keeping every other word of that rule. Leave `allowed-tools` untouched.
  - **Description:** update the frontmatter `description` and the `<objective>` to say Seldon writes the brief and then the PRD, and picks up from the files after a `/clear`.
- **Verify:**
  - **Testing scope:** Task 6 proves this behavior by eval, and Plan 3 Task 3 grades the no-technology rule. Text checks and the pinned grant are enough here, and testing stops there.
  - (1) The `<rules>` write rule names both `.planning/seldon/brief.md` and `.planning/seldon/prd.md`. Today it names only the brief.
  - (2) The five PRD section names appear in SKILL.md in FORMAT.md's order.
  - (3) `node --test tests/skill.test.mjs` passes. `git diff skills/seldon/SKILL.md` changes no line between `allowed-tools:` and the frontmatter's closing `---`.
  - (4) `claude plugin validate --strict .` exits 0.
  - (5) SKILL.md's PRD draft section says Write only creates a `prd.md` that isn't there, and that a PRD step finding one outside a `/seldon prd` rerun writes nothing and ends on the later-release line. Today SKILL.md says neither.

### Task 5: Check the PRD with the plugin's own --prd mode

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#11. The check, tests/skill.test.mjs
- **Decisions:** D-10
- **Pins:** tests/skill.test.mjs
- **Action:**
  - **Running it:** after writing `prd.md`, run exactly `node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --prd .planning/seldon` from the project root, with the path unquoted. Never run a `lib/check.mjs` in the user's project.
  - **On failure:** when it exits 1, fix each problem in `prd.md` with Edit, inside `.planning/seldon/`, and run it again until it passes.
  - **Final message:** it names the file and repeats the result line word for word on a line of its own.
  - **The brief:** it keeps `--brief`.
  - **The rule:** `<rules>`' line about the only command you run covers both check commands, exactly as written, and nothing else.
- **Verify:**
  - **Testing scope:** `tests/skill.test.mjs` already holds every check command in the body to the grant's prefix. Task 6's run proves the command runs. One grep that fails today is enough here, and testing stops there.
  - (1) `grep -c -- '--prd .planning/seldon' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes. Its second test finds the new command starting with the Bash rule's prefix, and still finds `--brief .planning/seldon`.
  - (3) `node lib/check.mjs --prd samples` prints `seldon check: prd.md conforms`. That's Plan 1's mode, which this command depends on.

### Task 6: Add the resume case

- **Files:** evals/resume/case.yaml, evals/resume/prompt.md, evals/resume/seed.sh, evals/resume/graders/names-brief-first.md, evals/resume/graders/writes-prd.md, evals/resume/graders/no-dump-ask.md, evals/resume/graders/no-who-for.md
- **Reads:** evals/existing-brief/seed.sh, evals/existing-brief/case.yaml, evals/fast-path-brief/graders/writes-brief.md
- **Decisions:** D-20, D-21, D-01
- **Pins:** tests/scaffold.test.mjs
- **Action:** AC2's case: a fresh session with a confirmed brief and no history.
  - **`seed.sh`:** it makes `.planning/seldon/`, copies `samples/brief.md` to `.planning/seldon/brief.md`, and does nothing else. It has the same shape as existing-brief's.
  - **`prompt.md`:** exactly `/seldon`.
  - **`case.yaml`:**
    - `schema_version: "1.1"`, `name`, `runs: 1` and a description. The description never uses the word scaffold.
    - `context.scaffold_script: seed.sh`.
    - Under `execution`: `max_turns: 20`, `timeout_seconds: 600` and `allowed_tools: [Skill, Read, Glob, Grep]`.
  - **Graders:**
    - **`writes-prd.md`:** `file_exists`, with path `.planning/seldon/prd.md`.
    - **`names-brief-first.md`:** `regex` on `trace`. It checks that an assistant message holding the fixed resume line comes before the Write call whose `file_path` ends in `.planning/seldon/prd.md`.
      - The trace also holds SKILL.md's own text, the fixed line included, in the message that loads the skill. So the pattern anchors the line inside an assistant message's own JSON line rather than matching it anywhere.
      - Take the record shape from a kept trace of this case's first run, not from memory: how the role, a text block, a tool_use name and its input appear, and how quotes are escaped.
    - **`no-dump-ask.md`:** `regex` on `last_message` with `match: not_contains`. It matches SKILL.md's fixed dump ask.
    - **`no-who-for.md`:** `regex` on `last_message` with `match: not_contains`. It matches `Who is it for\?`.
- **Verify:**
  - **Testing scope:** the outcome is AC2: the resume names its input first, writes the PRD and asks none of the brief's questions again. Nothing covers it today. Four graders, one passing run and the D-21 checks are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, with `evals/resume/seed.sh` scanned.
  - (2) The run command with `--case resume` exits 0 at 1.00, with no `not granted` and no `scaffold failed`. The Bash audit from Context is reported.
  - (3) D-21, checked with a `node -e` script that reads each pattern from its grader file:
    - `names-brief-first` matches the kept trace.
    - It doesn't match an edited copy with the assistant's resume line removed, where SKILL.md's copy of the line is still there.
    - It doesn't match an edited copy with that assistant text moved after the Write.
    - `no-dump-ask` matches a last message ending in SKILL.md's dump ask, and `no-who-for` matches one ending in `Who is it for?`. Neither matches the run's own last message.
    - `writes-prd`'s path is exactly `.planning/seldon/prd.md`, with no `exists: false`, so a run that writes no PRD fails it.
  - (4) Before the kept folder is removed:
    - `node lib/check.mjs --prd <kept workspace>/.planning/seldon` exits 0.
    - `cmp` shows the seeded brief is byte-identical to `samples/brief.md`.

### Task 7: Rewrite the existing-brief case for a dump that meets a brief

- **Files:** evals/existing-brief/case.yaml, evals/existing-brief/graders/says-rerun-later.md, evals/existing-brief/graders/asks-rerun-or-go-on.md
- **Reads:** evals/existing-brief/prompt.md, evals/existing-brief/seed.sh, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-02, D-06, D-20, D-21
- **Pins:** tests/scaffold.test.mjs
- **Action:** The first half of AC6.
  - **Unchanged:** the seed (the Toolshed brief) and the prompt (a pacer sign-up dump), plus the `no-write` and `no-edit` graders.
  - **Delete `says-rerun-later.md`:** phase 2's "rerunning comes later" stop is gone (D-06).
  - **Add `asks-rerun-or-go-on.md`:** `regex` on `last_message`, matching Task 2's fixed question as it ends the message.
  - **`case.yaml`'s description:** it says Seldon writes and edits nothing, and asks whether to rerun the brief with the dump or go on from the brief. It never uses the word scaffold.
- **Verify:**
  - **Testing scope:** the outcome is the first half of AC6, plus phase 2's cases still passing after this plan's SKILL.md changes. One case run, the D-21 check and one full run are the evidence, and testing stops there.
  - (1) D-21, checked with a `node -e` script that reads the pattern from its file. `asks-rerun-or-go-on` matches the fixed question as SKILL.md holds it. It doesn't match:
    - phase 2's old stop line
    - a `Recommended path: fast path` recommendation ending in a question
    - the fixed resume line
  - (2) The run command with `--case existing-brief` exits 0 at 1.00. The Bash audit is reported.
  - (3) The README's eval command, run verbatim from `/code/seldon` with `--keep-temp` added before `--allow-tools`, exits 0 with no `not granted` and no `scaffold failed`. All eleven cases score 1.00: phase 2's ten, with existing-brief rewritten, plus resume. The Bash audit covers every trace. A failing case is a checkpoint, not a fix.
  - (4) `ls -d /tmp/claude-eval-*` matches nothing.
  - (5) `git status --porcelain` lists only this plan's files.

## Notes

- **Order:** this plan runs after Plan 1, because Task 5's command and Task 6's run need the `--prd` mode. Plans 3, 4 and 5 share SKILL.md and run after it.
- **Between Plans 2 and 5:** a user who answers the documents question by choosing the rerun has no path yet. Plan 5 Task 1 wires it into the brief rerun. No case before then reaches that answer.
- **The go-on answer with both documents there:** Task 2 sends it to the later-release line, and Task 4's guard backs that up for any route into the PRD step. Plan 4 Task 4 makes the `/seldon prd` rerun the guard's one exception. No eval case reaches this state; text checks pin it.
- **Prior art:**
  - D-07 (ending a step), from phases/3/CONTEXT.md, phase 3. It's why Task 1 points "Run finished" at the file-based start and leaves the confirm to Plan 3.
  - Phase 2 SUMMARY's fixed-words deviations explain the fixed lines.
  - Phase 2 D-15 (phases/2/CONTEXT.md, phase 2) set the case mechanics: hand-written histories and `/seldon`-prefixed continuations.
