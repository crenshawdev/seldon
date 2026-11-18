PLAN CHECKPOINT: human-verify
Plan: .planning/phases/8/PLAN-7.md
Tasks: 2 of 3
| Task | Commit | Note |
|---|---|---|
| 1 - Describe the readiness check and the handoff | b7c33e9 | Earlier dispatch, not redone. Record in plan-7.1.md. |
| 2 - Say what the grant doesn't limit | b657af4 | Earlier dispatch, not redone. Record in plan-7.1.md. |
| 3 - List every case and run the full suite | 32d0e13 (README lines, earlier dispatch), e6a5d54, 2481a6f | This pass wrote the wider trust trigger (e6a5d54) and changed spine-who-relies to expect the trust question, with README.md:117 (2481a6f). spine-conventions is in capture state, uncommitted. No `claude plugin eval` was run. STOPPED here for the lead to read the diff before the runs. |

This dispatch continues from the checkpoint report after full run 1, rotated to `plan-7.1.md` before this first write. That file holds full run 1, its audits, AC6 and Verify (1), (1a), (2), (5), (6) and (7) from the earlier dispatch.

## The SKILL.md diff, whole (e6a5d54)

```diff
@@ -1092,8 +1092,12 @@ Read the brief and the PRD for two kinds of part:
 - **Unattended work:** anything the system does with no person present, such
   as a scheduled job.
 
-A design with outside input gets the trust-boundary question. Ask it with
-exactly these words, on a line of their own:
+A design with outside input gets the trust-boundary question. So does a
+design whose data, anything it writes or changes, shows on a page or service
+people outside the project can reach. Read that reach from the brief, the PRD
+and, on a project under Cadence, the code this step already reads: there the
+code counts too. Ask the question with exactly these words, on a line of their
+own:
 
 ```
 What can people outside the project send in, and what must they never see or change?
@@ -1249,8 +1253,8 @@ New work stores its data through better-sqlite3, as the existing code does.
 **The answers to the spine's questions.** Each answer goes into its part's
 own decision, word for word, on a `> ` line under that decision's text:
 
-- The trust-boundary answer goes into the decision for the part that takes
-  the outside input.
+- The trust-boundary answer goes into the decision for the part people
+  outside the project reach, whether it takes their input or shows them data.
 - The unattended-work and failure answers, who is told when it breaks and how
   included, go into that job's own decision, the one that says what the job
   does.
```

The question's fixed words (now SKILL.md:1103) are unchanged. The outside-input definition and the unattended-work kind (1086-1093) are unchanged. Nothing else in SKILL.md changed. `wc -c skills/seldon/SKILL.md` = 80636 (was 80314, +322), under 90,000.

## The spine-who-relies and README diffs (2481a6f)

- `evals/spine-who-relies/graders/no-trust-question.md` deleted.
- `evals/spine-who-relies/graders/asks-trust.md` added: `cmp` equal to `evals/spine-outside-input/graders/asks-trust.md`, both blob 86c08b0f.

```diff
--- a/evals/spine-who-relies/case.yaml
+++ b/evals/spine-who-relies/case.yaml
-description: A project under Cadence, with Toolshed's code at the root and the repair log's confirmed brief and PRD in .planning/seldon/, and no spine. The code settles the stack and the host, so /seldon spine has to ask only the fixed who-relies question, and write and edit nothing in that turn.
+description: A project under Cadence, with Toolshed's code at the root and the repair log's confirmed brief and PRD in .planning/seldon/, and no spine. The code settles the stack and the host, and its catalog page, which members browse from home, shows whether a tool is on the shelf, so /seldon spine has to ask the fixed trust-boundary and who-relies questions and no other spine question, and write and edit nothing in that turn.
```

```diff
--- a/README.md
+++ b/README.md
@@ -117 @@
-- `spine-who-relies` runs `/seldon spine` on a project under Cadence whose code settles the stack and the host, and checks that Seldon asks the who-relies question but neither the trust, the unattended-work nor the failure question, writes and edits nothing, and keeps the fake token in the project's `.env` out of the trace.
+- `spine-who-relies` runs `/seldon spine` on a project under Cadence whose code settles the stack and the host, and checks that Seldon asks the trust and who-relies questions but neither the unattended-work nor the failure question, writes and edits nothing, and keeps the fake token in the project's `.env` out of the trace.
```

The line's claims and their graders: trust = asks-trust; who-relies = asks-who-relies; not unattended-work = no-unattended-question; not failure = no-failure-question; writes and edits nothing = no-write, no-edit; fake token out of the trace = no-secret.

README.md:118 is unchanged. As I read it, the new prompt doesn't make it untrue: the case still answers the who-relies question, and the who-relies answer is still quoted in the decision for the part it names. It no longer names everything the case checks once records-trust lands. If the lead wants it complete, a line in the list's style would be: "- `spine-conventions` answers the trust and who-relies questions, and checks that Seldon writes a spine that passes the check, with the trust answer quoted in a decision that names the catalog, the who-relies answer quoted in the decision for the part it names, a convention quoted from `src/tools.mjs` with the file named under it, and the fake token nowhere in the trace." Not written.

## spine-conventions capture setup (uncommitted)

The case folder now holds the capture form, as readiness-fix-answer's did (PLAN-6 Task 5). The capture turn here is the case's first exchange, `/seldon spine` on the seed, so there is no capture history.

- `seed.sh`: unchanged, blob 55908ad27b4aa5d638a20e3aa225b1b44d771002 (the phase 6 vet).
- `prompt.md`: `/seldon spine`, `cmp` equal to `evals/spine-who-relies/prompt.md`.
- `history.jsonl`: removed from the working tree (the tracked phase 6 history is in HEAD). case.yaml names no history_file.
- Graders: `asks-trust`, `asks-who-relies`, `no-unattended-question`, `no-failure-question`, `no-write`, `no-edit` and `no-secret`, each `cmp` equal to `evals/spine-who-relies/graders/`'s. The tracked `check-passes`, `quotes-code`, `records-who-relies` and `writes-spine` are removed from the working tree and come back from HEAD unchanged after the capture.
- `case.yaml`, whole:

```yaml
schema_version: "1.1"
name: spine-conventions
description: Capture state, never committed. A project under Cadence, with Toolshed's code at the root and the repair log's confirmed brief and PRD in .planning/seldon/, and no spine. /seldon spine has to end on the fixed trust-boundary and who-relies questions and no other spine question, write and edit nothing, and keep the fake token in .env out of the trace. Its last message becomes the assistant line of this case's history.
runs: 1
context:
  scaffold_script: seed.sh
execution:
  max_turns: 20
  timeout_seconds: 600
  allowed_tools: [Skill, Read, Glob, Grep]
```

A capture try passes only at 1.00: the last message ends on both the trust and the who-relies question and asks no other spine question, nothing is written or edited, and the token stays out of the trace.

### Staged for after the capture

These files wait in `/tmp/claude-1000/-code-seldon/8e645b01-f58e-4a35-9c78-089fd8a306cb/scratchpad/p7/stage/spine-conventions/` and are quoted whole here in case the scratchpad is cleared.

`prompt.md` (the new prompt, one line, ending in a newline):

```
/seldon Members only browse the catalog page from home and send nothing in through it, and it must never show them the repair notes or who has a tool out. The parish newsletter copies the tool records every Sunday night to print which tools are out on loan. Nothing else outside this repository relies on Toolshed.
```

The first sentence answers the trust question, and the other two are the phase 6 who-relies answer, kept word for word so `records-who-relies` stands unchanged. All of it is invented and names no secret value.

`graders/records-trust.md`:

```
---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*must never show them the repair notes)(?=[^\n]*\b[Cc]atalog|[^\n]*(?:\n(?!## )[^\n]*)*?\n(?!## )(?![ \t]*>)[^\n]*\b[Cc]atalog)'
flags: m
---
```

This is records-who-relies.md's form. The first lookahead needs the trust answer's words on a `> ` line inside an S- decision. The second needs that decision to name the catalog, the part members reach, on its heading or on a line that isn't a `> ` quote. It's a regex grader with no `max:`, so it needs no `min:`. tests/scaffold.test.mjs's bound test covers tool_used graders and passes.

`case.yaml`: the committed one with only the description changed, to:

```
description: Resumes a /seldon spine session on a project under Cadence, with Toolshed's code at the root and the repair log's confirmed brief and PRD in .planning/seldon/, whose last turn asked the fixed trust-boundary and who-relies questions. Both answers have to land in a .planning/seldon/spine.md that passes the spine check, each quoted word for word: the trust answer in a decision that names the catalog, the page members reach from home, and the who-relies answer in the decision for the part it names. The spine also has to quote a convention from src/tools.mjs under its own decision with the file named on the line after. The run never reads the fake admin token in .env, so its value appears nowhere in the trace.
```

After a passing capture, the case is assembled in this order:
1. Write `history.jsonl`: the user line `/seldon spine`, then the capture's last message byte for byte as the assistant line. It gets a fresh sessionId, cwd `/tmp/seldon-spine-conventions`, fresh uuids and a chained parentUuid, in the form of the phase 6 history.
2. Delete the six capture-only graders, restore the four from HEAD, and add the staged records-trust, prompt and case.yaml.
3. Commit.

## D-21, records-trust

Checked with `/tmp/claude-1000/-code-seldon/8e645b01-f58e-4a35-9c78-089fd8a306cb/scratchpad/p7/d21.mjs`, which reads the pattern from the staged grader file. The base input is the spine full run 1's spine-conventions trace wrote on the unchanged history: the Write's content, extracted to `scratchpad/p7/d21/run1-spine.md`. The trust words are the staged prompt's first sentence. 7/7 as predicted:

- no match on the unchanged history's spine (full run 1)
- no match with the words on a line without `> `, under S-04
- no match with the words on a `> ` line above the first S- heading
- no match with the words on a `> ` line under S-02 (hosting), whose only "catalog" is inside the quote
- match with the words on a `> ` line under S-04, which names the catalog
- match with the words on a `> ` line under S-05, which names the catalog in its text and on its file line
- match with the words on a `> ` line under a new S-06 whose heading names the catalog

## Checks this pass

- `node --test tests/*.test.mjs`: 113/113 pass, 0 fail. This was run with the capture state in place, so scaffold.test.mjs walked it.
- `claude plugin validate --strict .`: "Validation passed", exit 0.
- lease-check ok:true before both commits. 2481a6f deletes only `no-trust-question.md`, as intended.
- No lint or typecheck command was detected (both null).
- No `claude plugin eval` was run in this pass.

Deviations:
- [deviation] Before this pass, PLAN-7 asserted (through D-01 to D-20 as SKILL.md stood) that the trust-boundary question fires only on outside input read from the brief and the PRD, and that spine-who-relies asks no trust question. Full run 1 showed the model asking it because members reach the catalog from home (spine-who-relies 0.86, no-trust-question). The ruling was John's, relayed by the lead, Daneel [e140f7]: "Go a". The option put to him, word for word: "widen the trigger. The question also fires when the design's data shows on a page or service people outside the project can reach. This test case is then changed to expect the question." Done: SKILL.md widened (e6a5d54), spine-who-relies expects the trust question (2481a6f), spine-conventions set up for recapture. PLAN-7's lease was amended in a359c05.
- [deviation] The lead's rulings on the sweep:
  - Full run 1's spine-who-relies Bash call `git ls-files --others --exclude-standard . | grep -v '^\.planning/' | head -100` falls within phase 6's listing ruling and term D.
  - spine-conventions gains a records-trust grader, and its new prompt answers both questions in invented words.
  - README.md:117 changes, and :118 changes only if the new prompt makes it untrue.
  - PROJECT.md, REQUIREMENTS.md, ROADMAP.md and phase 4's CONTEXT stay as committed. The phase SUMMARY names ROADMAP.md:60 as a phase 4 criterion that John's ruling widened.
  - The spine-conventions capture needs no new vet (seed 55908ad2) and gets three tries of its own.

Open items:
- What comes next, all of it in a later dispatch:
  - the spine-conventions capture (three tries of its own; a try that doesn't end on both questions stops to the lead with its last message)
  - assembly and commit of the case
  - solo runs of spine-who-relies, spine-conventions, spine-job and spine-outside-input within the per-case cap (spine-who-relies has used 1 of its 3 tries, in full run 1)
  - two full runs, both at 1.00
  - Verify (3), (8) and (9), and the final suite
- Full run 1's AC6 result (79,302 bytes loaded, byte-for-byte equal) was taken on the SKILL.md before e6a5d54. The skill is now 322 bytes longer, so AC6 needs taking again from a transcript of the next full run.
- spine-job's design sends its morning email to the gardener herself (samples/spine-job/prd.md:13), who is the operator and not someone outside the project. As I read the new text it should still not ask the trust question, but only its solo run can show that.
- records-trust's second lookahead, the decision naming the catalog, is the records-who-relies form. In full run 1's spine, four of the five decisions name the catalog outside a quote, so it rules out only a decision like hosting that never names it. It is a placement check, not a strict one, and it doesn't make the grader any easier to fail.
- README.md:118: see the note under the spine-who-relies diff. Left as is. A draft line is there if the lead wants it.
- Carried from plan-7.1.md: each eval run leaves a git-ignored HTML report folder in evals/results/. Replayed sessions append to git-ignored session files beside their histories, and spine-conventions' old `cb5abfcc-...jsonl` is still there, unused while no history_file is named.
