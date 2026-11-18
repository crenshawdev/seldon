---
phase: 8
plan: 3
depends_on: [2]
requirements:
  - CHECK-01
  - CHECK-02
  - FLOW-08
files:
  - skills/seldon/SKILL.md
  - agents/readiness.md
  - evals/resume-later/case.yaml
  - evals/resume-later/graders/says-later-release.md
  - evals/resume-later/graders/says-no-findings.md
  - evals/resume-later/graders/asks-nothing.md
  - evals/resume-later/graders/ends-on-new-project.md
  - evals/resume-later/graders/no-other-agent.md
---

# Phase 8: Readiness check and handoff - Plan 3: The skill's routes

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan wires the skill to Plan 2's agent end to end:

- the bare `/seldon` route that runs the check, relays its report and ends on the handoff command
- the route for the fix-or-hand-off answer
- `resume-later` rewritten to prove the whole path live

## Must be true when done

- On a bare `/seldon` with all four documents there and nothing stale, the skill starts `seldon:readiness` with the three paths and nothing else, repeats what it returns in the fixed forms, and then does one of three things:
  - with no findings, it ends on the handoff command and asks nothing
  - with findings, it ends on the fix-or-hand-off question
  - when the check couldn't run, it ends on the did-not-run line, the not-checked line and the handoff command
- The handoff command is `/cad-new-project --brief .planning/seldon` with no `.planning/PROJECT.md`, or `/cad-phase add --brief .planning/seldon` followed by the already-built sentence when it's there. A named design prints its own folder.
- Section 1 routes the answer to the question. A fix reruns the earliest step a finding names in the same turn, carrying the finding lines. A hand-off writes nothing and prints the command.
- `resume-later` scores 1.00 on the clean samples, ending on `/cad-new-project --brief .planning/seldon`. `git grep "come in a later release" -- skills evals` finds nothing.
- SKILL.md stays at or under 90,000 bytes after every task.

## Context

- **Locked:** D-03, D-05, D-06, D-08, D-09, D-10, D-11, D-12, D-13, D-14, D-15, D-17, D-19 and D-20.
- **Plan 1 binds this plan:** the tool is spelled `Agent`, with the agent type in its input's `subagent_type`, as Plan 1's traces show. No entry grants it: Plan 1's run 3 showed a start needs none, and Daneel ruled no grant change in phase 8.
- **The fixed lines** (the wording is my call, per CONTEXT). SKILL.md shows each in a fenced block the way it shows its other fixed lines. The no-findings line and the three finding forms are Plan 2's, byte for byte as `agents/readiness.md` has them.
  - the readiness question: `Do you want to fix these, or hand off the design as it is?`
  - did not run: `The readiness check did not run: <the reason, in a few words>.`
  - not checked: `The design was not checked before this handoff.`
  - the handoff's lead-in: `To hand this design to Cadence, run:`
  - the commands: `/cad-new-project --brief .planning/seldon` and `/cad-phase add --brief .planning/seldon`, with `/<name>` added for a named design and no trailing slash
  - already built: `If Cadence has already built this design, there's nothing to hand off.`
- **Budget:** SKILL.md stays at or under 90,000 bytes after every task (D-19).
- **Eval runs (SECURITY):** Task 3 runs on Plan 1's recorded approval and terms. If none is recorded, stop at a checkpoint marked SECURITY before the run.
  - The per-case command, the Bash audit, the agent-start audit, the retries, the cleanup with trace copies, and the rule against reading the Claude binary are Plan 1's Context, unchanged.
  - The agent-start audit also stops on Daneel's ruling on Plan 1's report: a start of anything other than `seldon:readiness`, or any start in a case that isn't a readiness case, stops the run and goes to Daneel.
  - `resume-later`'s seed doesn't change, so it needs no new vet.
- **The agent in the lease:** `agents/readiness.md` is declared only so Task 3's run can fix its text. After such an edit, `claude plugin validate --strict .` passes and the run is retried on the retry terms.
- **Held:** no push, tag, PR or GitHub change, no install of any kind, and nothing published (D-16).

## Tasks

### Task 1: Run the readiness check from a bare /seldon

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#Stamps and stale links, agents/readiness.md
- **Decisions:** D-03, D-05, D-06, D-08, D-09, D-19, D-20
- **Pins:** tests/skill.test.mjs
- **Action:** Replace the later-release line with the check, in a new section, `## 22. The readiness check`, after section 21.
  - **The route (D-05, D-06):** the "All four documents, nothing stale, and empty arguments" bullet in "Where a run starts" writes nothing and goes to "The readiness check".
    - The later-release line and its fenced block go.
    - "Go on from the brief" in section 1 names the readiness check where it named the later-release line.
    - The epics confirm keeps its `/clear` words, so the check never runs in the conversation that wrote the epics.
  - **The look-up:** the sentence in "Where a run starts" that looks for `brief.md`, `prd.md`, `spine.md` and `epics.md` uses Glob, never Read. A run that ends at the check then reads none of the three documents (AC2). The steps still read their own documents when they start.
  - **The start (D-03):**
    - start exactly one agent, `seldon:readiness`, with the `Agent` tool
    - its prompt holds the paths of `prd.md`, `spine.md` and `epics.md` in the working folder, one per line, and nothing else
    - never Read those three yourself, before or after
    - start no other agent
  - **One message:** every tool call this route makes comes before its first report line. That's the stale check, the agent start and, when the handoff follows, the handoff's Glob for `.planning/PROJECT.md`. Once the agent's reply is in hand, and before writing any line of the report, do that Glob if the handoff follows. Then the report lines, the handoff's lead-in and the command are one final message, with no tool call after its first line. The user sees one message, and text written before a tool call isn't in the turn's last message.
  - **The reply:** it is either the no-findings line alone, or one or more finding lines. Each finding line starts with one of the three kind labels and ends with its "Fixed by rerunning" tail. Show the forms in one fenced block.
  - **No findings (D-08):** say the no-findings line, ask nothing, and give the handoff as "The handoff" says.
  - **Findings (D-08, D-09):** write nothing.
    - Repeat each finding line word for word, each on a line of its own, adding and dropping none.
    - End on the readiness question, on a line of its own. Its question mark is the last thing in the turn, and nothing follows it.
  - **Did not run (D-20):** the start is denied or refused, the tool isn't there, or the reply isn't in those forms.
    - Say the did-not-run line with the reason in a few words. Never say the no-findings line, and ask nothing.
    - Then say the not-checked line and give the handoff.
    - A later bare `/seldon` tries the check again.
- **Verify:**
  - **Testing scope:** the outcome is the route as text. These checks tie it to Context's lines and the agent file, Task 3 proves it live, and testing stops there.
  - (1) `grep -c 'come in a later release' skills/seldon/SKILL.md` and `grep -c 'later-release' skills/seldon/SKILL.md` each print 0. Today they print 1 and 2.
  - (2) `grep -cF` finds each of these in SKILL.md: the no-findings line, the readiness question, the did-not-run line's words up to its colon, and the not-checked line. Each prints 0 today. `grep -c 'seldon:readiness' skills/seldon/SKILL.md` prints at least 1, and 0 today. The frontmatter carries no agent entry (Daneel's ruling on Plan 1's report), so the count comes from the body.
  - (2a) `perl -ne 'print if /^## 22\. /../^## 23\. /' skills/seldon/SKILL.md | grep -c 'PROJECT.md'` prints at least 1: the section names the handoff's Glob and puts it before the first report line. It prints 0 today, since there is no section 22.
  - (3) A `node -e` script shows each of the three finding forms appears byte for byte in both SKILL.md and `agents/readiness.md`.
  - (4) The look-up sentence in "Where a run starts" no longer says "Read or Glob".
  - (5) `wc -c skills/seldon/SKILL.md` is at most 90000, and `node --test tests/skill.test.mjs` passes.

### Task 2: Print the handoff command

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#Designs and the working folder, skills/seldon/SKILL.md#15. The spine step
- **Decisions:** D-12, D-13, D-14, D-15, D-17, D-19
- **Pins:** tests/skill.test.mjs
- **Action:** Add `## 23. The handoff`, which "The readiness check" and the hand-off answer both end on.
  - **Which command (D-12):** ask whether `.planning/PROJECT.md` exists with Glob, never Read, the way the spine step does. That Glob comes before the handoff's first line, and before any report line when the readiness check leads into it, as "The readiness check" says. No tool call follows the lead-in.
  - **The lines:** the lead-in on a line of its own, then the command on a line of its own.
    - **Not there (D-13):** `/cad-new-project --brief .planning/seldon`. The command is the last line of the turn.
    - **There (D-14, D-15):** `/cad-phase add --brief .planning/seldon`, then the already-built sentence on a line of its own as the last thing in the turn, named designs included.
    - **A named design:** both commands name `.planning/seldon/<name>`, unquoted and with no trailing slash, as "Designs and the working folder" says for fixed lines.
  - **What it leaves (D-17):** the handoff writes and edits nothing and leaves no record, so a later bare `/seldon` on the same documents checks again and prints the command again. It reads none of Cadence's files to decide anything (D-15).
  - **What to avoid:** naming `/cad-milestone` anywhere in SKILL.md. It closes a milestone and adds no phase (D-14), and naming it invites the model to print it.
- **Verify:**
  - **Testing scope:** the outcome is FLOW-08's command choice as text. These checks, plus Task 3's and Plan 5's runs, prove it, and testing stops there.
  - (1) `grep -cF` finds each of these in SKILL.md: `/cad-new-project --brief .planning/seldon`, `/cad-phase add --brief .planning/seldon`, the lead-in and the already-built sentence. Each prints 0 today.
  - (2) `grep -c 'cad-milestone' skills/seldon/SKILL.md` prints 0.
  - (3) The section's PROJECT.md sentence says Glob and never Read.
  - (4) `wc -c skills/seldon/SKILL.md` is at most 90000, and `node --test tests/skill.test.mjs` passes.

### Task 3: Rewrite resume-later for the check and the handoff

- **Files:** evals/resume-later/case.yaml, evals/resume-later/graders/says-later-release.md, evals/resume-later/graders/says-no-findings.md, evals/resume-later/graders/asks-nothing.md, evals/resume-later/graders/ends-on-new-project.md, evals/resume-later/graders/no-other-agent.md
- **Reads:** evals/resume-later/case.yaml, evals/resume-later/graders/says-later-release.md, evals/epics-confirm/graders/suggests-clear.md, .planning/phases/7/PLAN-5.md#Context
- **Decisions:** D-05, D-13, D-18
- **Pins:** tests/scaffold.test.mjs
- **Action:** The case changes with the line it pinned (D-05). It becomes AC4's first sentence, and the phase's first live run of the whole path.
  - **`case.yaml`:**
    - the description says all four documents are there and nothing is stale, so a bare `/seldon` has to run the readiness check, say the no-findings line, ask nothing, write and edit nothing, and end on the new-project handoff command
    - `allowed_tools` stays `[Skill, Read, Glob, Grep]`, with no Agent entry (D-18, as Daneel ruled on Plan 1's report: run 3 showed a start needs none)
    - `max_turns: 20` and `timeout_seconds: 600`, or higher if Plan 1 found the agent's turns count and need it
  - **Unchanged:** the seed, the prompt, `no-write.md` and `no-edit.md`.
  - **Graders:** delete `says-later-release.md`. No grader or description may quote the old line, since AC6 greps `evals/` for it. Add four graders, copying every fixed line from SKILL.md:
    - `says-no-findings`: `last_message` holds the no-findings line on a line of its own
    - `asks-nothing`: `last_message` holds no `?` (`match: not_contains`)
    - `ends-on-new-project`: `last_message` ends on `/cad-new-project --brief .planning/seldon` on a line of its own. The line may sit inside a code fence, with only blanks or a closing fence after it, in `suggests-clear`'s form.
    - `no-other-agent` (Daneel's ruling on Plan 1's report): `type: tool_used`, `tool: Agent`, `input_match: '^(?<![\s\S])(?![\s\S]*"subagent_type"\s*:\s*"seldon:readiness")'`, `min: 0`, `max: 0`. It matches any Agent input without that exact key and value, so a start of any other agent, or one with no `subagent_type`, fails the grader. A quote inside the prompt string is escaped in the input's JSON, so the prompt can't supply the key. It opens `^(?<![\s\S])`, which holds with or without the `m` flag, as phase 6's `no-secret` fix found. Every case in Plans 5 and 6 that expects the start carries a byte copy, so the audit's check stays in the committed suite.

    The first three read `last_message` on purpose. Task 1's one-message rule is what puts the no-findings line there, so a run that says the line before the handoff's Glob fails `says-no-findings`, and that failure is the skill's to fix, never the grader's target to move to the trace (Daneel's ruling).
- **Verify:**
  - **Testing scope:** the outcome is the whole path on the clean samples (AC4's first sentence). Four new graders, their D-21 checks, one run and its audits are the evidence. The other outcomes are Plans 5 and 6's, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and `git grep -n "come in a later release" -- evals/resume-later` prints nothing. Today it prints two lines.
  - (2) **D-21,** with a `node -e` script over hand-made inputs in the scratch area:
    - `says-no-findings` fails on a message without the line, and on one where the line is reworded
    - `asks-nothing` matches, and so fails the grader, on a message holding a question
    - `ends-on-new-project` fails on `/cad-phase add --brief .planning/seldon`, on `.planning/seldon/`, and on the command followed by more text
    - `no-other-agent`, before the case's first run, with its `input_match` run once with no flags and once with `m` over `JSON.stringify` of hand-made Agent inputs. It doesn't match an input naming `seldon:readiness` with `subagent_type` first, in the middle and last. It matches, and so fails the grader, on inputs naming `general-purpose`, `Explore` and `seldon:readiness-2`, on one with no `subagent_type`, and on one naming `general-purpose` whose prompt holds the text `"subagent_type":"seldon:readiness"`.
  - (3) The run exits 0 at 1.00. Both audits are reported, and the trace shows exactly one start of `seldon:readiness`. If it misses on the skill's or the agent's text, fix that text in this plan's lease, rerun, and stay within the retry terms.
  - (4) The trace copy is in `evals/results/phase-8-traces/`, and `ls -d` fails on the kept path.

### Task 4: Route the answer to the readiness question

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#15. The spine step, skills/seldon/SKILL.md#16. The spine draft, skills/seldon/SKILL.md#18. The epics step, skills/seldon/SKILL.md#19. The epics draft
- **Decisions:** D-09, D-10, D-11, D-19
- **Pins:** tests/skill.test.mjs
- **Action:** Section 1 gains a route the way the conflict question has one (D-09). Place it right after "Conflict question answered".
  - **When it applies:** your last turn ended on the readiness question, and this run's arguments answer it. A bare `/seldon`, with this run's arguments empty, isn't an answer. It's a new run, so the check runs again (D-10, D-17).
  - **Fix (D-10):**
    - In this same turn, rerun the earliest step any finding in that report names: the spine when any finding line ends naming `/seldon spine`, otherwise the epics.
    - Go to "The spine rerun" or "The epics rerun", in the working folder the check ran in.
    - The report's finding lines are that rerun's change. That's this phase's one exception to "never the earlier conversation", and the lines are the only thing taken from it.
    - It runs one step. After a spine rerun the epics are stale, and the next bare `/seldon` reruns them through the stale route before the check runs again.
  - **Hand off as it is (D-11):** write and edit nothing, and give the handoff as "The handoff" says, with no not-checked line.
  - **Anything else:** write nothing, and end on the readiness question again, on a line of its own, with nothing after it.
  - **The reruns take the lines:**
    - **"The spine rerun"** keeps its "not the conversation" rule, with the exception named: on a fix, the finding lines that name the spine are its change. It adds or changes the decisions those lines need. A new decision with no source words carries the `[ASSUMPTION]` tag as any guess does. It asks only what "The spine's questions" allows.
    - **"The epics rerun"** says the same for the lines that name the epics.
  - **The general rules name the exception too.** The skill states each exception where it states the rule, so two more sentences change, and a model reading the section-level rule doesn't rerun from the files alone:
    - section 15's sentence that begins "The one thing it takes from the conversation" (SKILL.md:1014-1016 today) adds: on a fix from the readiness question, the finding lines that name the spine are its change too
    - section 18's sentence that says "never the earlier conversation, whatever it holds" (SKILL.md:1298 today) adds the same for the finding lines that name the epics

    Section 15's "carry nothing from the conversation into the spine" sentence (SKILL.md:1021-1023 today) is brought into line the same way if it would still contradict the fix.
- **Verify:**
  - **Testing scope:** the outcome is CHECK-02's routing as text. Plan 6's `readiness-fix` and `readiness-hand-off` prove it live, and testing stops there.
  - (1) `grep -c 'Readiness question answered' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) Each rerun paragraph names the finding lines:
    - `perl -ne 'print if /^\*\*The spine rerun\.\*\*/../The spine check" and end the step/' skills/seldon/SKILL.md | grep -c 'finding lines'` prints at least 1
    - the same with `The epics rerun` and `The epics check` prints at least 1

    Both print 0 today.
  - (2a) The two general rules name it as well:
    - `perl -ne 'print if /^## 15\. /../^## 16\. /' skills/seldon/SKILL.md | grep -c 'finding lines'` prints at least 1
    - `perl -ne 'print if /^## 18\. /../^## 19\. /' skills/seldon/SKILL.md | grep -c 'finding lines'` prints at least 1

    Both print 0 today.
  - (3) `wc -c skills/seldon/SKILL.md` is at most 90000, and `node --test tests/skill.test.mjs` passes.
