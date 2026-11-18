---
phase: 7
plan: 4
depends_on: [1, 2]
requirements:
  - CHECK-04
files:
  - skills/seldon/SKILL.md
---

# Phase 7: PRD changes flow downstream - Plan 4: Stamps and the stale routes in the skill

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan writes the skill's half of that:

- every write of the PRD, the spine and the epics records its stamp
- a bare `/seldon` sends a run to the earliest stale document's rerun before anything else

## Must be true when done

- The rules list names five commands, the stale check among them.
- "Stamps and stale links" in section 2 says what the stale check prints, and how every write of `prd.md`, `spine.md` or `epics.md` records the stamp line copied from it.
- The PRD, spine and epics drafts write the stamp when they create the file, and keep it current on every Edit route, including a rerun over a stale link that changes nothing else.
- `architecture.md` carries no stamp, and a brief rerun still never touches `prd.md`.
- A bare `/seldon` with a brief, and the "go on" answer, run the stale check:
  - after the Glob and any which-design question, and before any resume line
  - the earliest stale link takes the run to that document's rerun, after its fixed line
  - with nothing stale, today's routes run, and the later-release line comes only when all four documents are there
- A named step routes on no stale line. It runs the command only for its own stamp line.
- `node --test tests/skill.test.mjs` passes, and SKILL.md stays within Plan 1's budget.

## Context

- **Locked:** D-01, D-02, D-03, D-05, D-08, D-09, D-10, D-12, D-13, D-18 and D-19.
- **Plan 1's outcome:** this plan starts once Plan 1 has set SKILL.md's budget. If the skill loaded whole at the probed size, SKILL.md stays at or under 90,000 bytes. If Plan 1 recorded a cut at or above 81,000 bytes, the budget is the one Plan 1 reports, and every 90,000 in this plan's checks reads as that budget. If Plan 1 recorded a cut below 81,000 bytes, this plan is revised before it starts.
- **From Plan 2:** the stamp form and the stale check's output lines. Copy them from what `node lib/check.mjs --stale` actually prints.
- **Fixed words (mine, on the pattern of the resume lines):**
  - PRD stale line: `I'm updating the PRD, because .planning/seldon/brief.md has changed since the PRD was built from it. To revise the brief instead, run /seldon brief.`
  - Spine stale line: `I'm updating the spine, because .planning/seldon/prd.md has changed since the spine was built from it. To revise the PRD instead, run /seldon prd.`
  - Epics stale line: `I'm updating the epics, because .planning/seldon/spine.md has changed since the epics were built from it. To revise the spine instead, run /seldon spine.`
  - Subsection name: `### Stamps and stale links`.
- **Named designs:** section 2 already makes every `.planning/seldon/` path in a fixed line or a check command name the working folder, so the new lines and the command follow it unchanged.
- **Out of scope:**
  - the conflict check (Plan 6)
  - any eval file (Plan 5)
  - the `allowed-tools` grant (D-18)
  - a stale check on a named step (D-05)
- **Checks here are on the text.** Plan 5's runs prove the behavior.

## Tasks

### Task 1: Record each step's stamp on every write

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#rules, skills/seldon/SKILL.md#Which design, skills/seldon/SKILL.md#13. The PRD draft, skills/seldon/SKILL.md#16. The spine draft, skills/seldon/SKILL.md#19. The epics draft, skills/seldon/SKILL.md#21. The architecture document, docs/FORMAT.md#Stamps
- **Decisions:** D-01, D-02, D-03, D-08, D-09, D-10, D-18, D-19
- **Pins:** tests/skill.test.mjs
- **Action:** Every write of `prd.md`, `spine.md` or `epics.md` records the parent's current hash, and the model never works one out (D-01, D-02).
  - **Add a `### Stamps and stale links` subsection to section 2, after "Which design".**
    - It gives the stale check's command, exactly `node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --stale .planning/seldon`, run from the project root with the path unquoted, and names what it prints, in the words Plan 2's code prints them.
    - **Where the stamp sits:** `prd.md`, `spine.md` and `epics.md` each carry one stamp line, the line right after the `# ` title, above a `Retired:` line under the title when there is one (D-03).
    - **What it holds:** the text after `stamp for <file>: ` in the command's output, copied exactly. Never work out, shorten or retype a hash.
    - **Writes:** every Write of one of these files puts the line in. Every Edit route that changes one makes its stamp line hold the current stamp, adding the line when the file has none and replacing it when it differs. A rerun records the current stamp even when nothing else in the file changes (D-02).
    - **Which output:** the stamp comes from this turn's output of the command. A route that writes one of these files and hasn't run the command in this turn runs it right before its first Write or Edit. Here the step uses the output only for its stamp line and says nothing about any `stale:` line. Routing on those lines is Task 2's, and only for a bare `/seldon`.
    - **Whose stamp:** a step records only its own file's stamp (D-09). The brief carries none, and the brief rerun's rule that it never writes or edits `prd.md` stays as it is.
  - **The rules block:** the commands bullet names five commands, adding the stale check in "Stamps and stale links" to the four checks.
  - **"The PRD draft", "The spine draft" and "The epics draft":** each shape list says the stamp line follows the title, as "Stamps and stale links" says. Each rerun's bullets say the stamp line takes the current stamp.
  - **The `Retired:` bullets in "The spine rerun" and "The epics rerun":** today they put the `Retired:` line "directly under the `# ` title" (SKILL.md lines 1012-1014 and 1209-1210), which clashes with the stamp on that line. Reword both to put it directly under the stamp line, before the first decision or epic. Leave every other rule in those sections as it stands.
  - **"The architecture document":** add that it carries no stamp (D-10). The route still runs no command.
  - **Not here:** routing on stale lines (Task 2) and the conflict check (Plan 6). Keep SKILL.md within the 90,000-byte budget (D-19).
- **Verify:**
  - **Testing scope:** text only. Plan 5 proves the behavior: one create-stamp grader per step, plus the stamp graders on the stale cases. The checks below show the rule is in every place a write happens, and testing stops there.
  - (1) `grep -c '^### Stamps and stale links$' skills/seldon/SKILL.md` prints 1, and `grep -cF 'node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --stale .planning/seldon' skills/seldon/SKILL.md` prints at least 1. Both print 0 today.
  - (2) For each of sections 13, 16 and 19, take the section with `perl -ne 'print if /^## 13\. /../^## 14\. /'` (and likewise 16 to 17 and 19 to 20). Join its wrapped lines with `tr -s '\n ' ' '`, and `grep -o 'Stamps and stale links' | wc -l` prints at least 1. Section 21's range holds `stamp`. Every one of these prints 0 today.
  - (3) `perl -ne 'print if /^<rules>/../^<\/rules>/' skills/seldon/SKILL.md | grep -c 'stale'` prints at least 1. It prints 0 today.
  - (4) `node --test tests/skill.test.mjs` passes. That covers the grant's five entries and every check command starting with the plugin root.
  - (5) `wc -c skills/seldon/SKILL.md` prints at most 90000.
  - (6) `tr -s '\n ' ' ' < skills/seldon/SKILL.md | grep -o 'one prose line directly under the `# ` title' | wc -l` prints 0, and the same grep for `directly under the stamp line` prints at least 2. Today they print 2 and 0.

### Task 2: Route a bare /seldon by its stale links

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#2. Where a run starts, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#13. The PRD draft, skills/seldon/SKILL.md#16. The spine draft, skills/seldon/SKILL.md#19. The epics draft
- **Decisions:** D-05, D-12, D-13, D-19
- **Pins:** tests/skill.test.mjs
- **Action:** A bare `/seldon` routes on its stale links before anything else (D-05, D-12).
  - **Section 2's route list:** once the Glob has found the files and any which-design question is settled, a brief there with an empty `$ARGUMENTS` runs the stale check from "Stamps and stale links" before any text. Then the earliest stale link wins, and it outranks a missing later document:
    - `prd.md` stale: say the PRD stale line, then go to "The PRD rerun".
    - Otherwise, `spine.md` stale: say the spine stale line, then go to "The spine rerun".
    - Otherwise, `epics.md` stale: say the epics stale line, then go to "The epics rerun".
    - Otherwise, today's routes run as written: the PRD, spine and epics resume lines, and the later-release line, which now comes only when all four documents are there and nothing is stale.
  - **How a stale line is said:** the way the resume lines are. Those exact words, on a line of their own, as the first text of the reply, before the next tool call and before any document is read. Never Edit the document on that route until its line is in the reply. The stamp the rerun records comes from this same output.
  - **No check elsewhere:**
    - A named step (`/seldon prd`, `/seldon spine`, `/seldon epics`) runs as it does today and routes on no stale line (D-05).
    - A `$ARGUMENTS` that isn't empty goes to "A dump when documents are there" with no stale check.
  - **Section 1's "Go on from the brief":**
    - It mirrors a bare `/seldon`, the stale check and its three routes included, instead of keeping its own list.
    - Replace the sentence starting "Going on never runs the PRD step over a PRD that's there" with a rule that going on runs a step over its document only as the rerun a stale link calls for.
    - Keep the sentence saying the question's text isn't input to any step.
  - **The ways into each rerun:**
    - "The PRD rerun", "The spine rerun" and "The epics rerun" each open by naming a bare `/seldon` whose stale check found that document stale as a way in, beside its named step.
    - The route lists in sections 13, 16 and 19 say the same.
    - In section 1, "PRD questions answered", "Spine questions answered" and "Who-relies question answered" treat a turn that was a stale-route rerun the same as one that was a named rerun.
  - **The epics rerun's reads:** still `epics.md`, `prd.md` and `spine.md` and nothing else, however it's reached (D-13).
  - Keep SKILL.md within the 90,000-byte budget (D-19).
- **Verify:**
  - **Testing scope:** text only. Plan 5's stale-spine, stale-epics and widened resume cases prove the routes, and Plan 7's stale-prd proves the PRD route. The checks below pin the fixed lines, their order and the go-on change, and testing stops there.
  - (1) `grep -cF` for each of the three stale lines in Context prints 1. Each prints 0 today.
  - (2) In `grep -nF` output, each stale line's line number is below `### Designs and the working folder` and above the PRD resume line's, so the stale routes come before today's routes.
  - (3) `grep -cF "Going on never runs the PRD step over a PRD that's there" skills/seldon/SKILL.md` prints 0. It prints 1 today.
  - (4) The later-release route's bullet says nothing is stale, and the "Go on from the brief" bullet names the stale check: `grep -n 'stale'` lands in both.
  - (5) `node --test tests/skill.test.mjs` passes, and `wc -c skills/seldon/SKILL.md` prints at most 90000.

## Notes

- **No second stale check after a write (my call; CONTEXT leaves it to the planner):** a step doesn't run the stale check again after writing its stamp.
  - The stamp is copied from the tool's output, and the per-file check holds its form.
  - The stamp graders on Plans 5 and 7's cases catch a mis-copy in the evals.
  - In use, a mis-copied hash only reads stale, and the next bare `/seldon` reruns that step and writes the stamp again (D-02).
  - A second run would add a tool call per step, and its output would show the downstream links going stale, which the step would have to be told to ignore.
- **Recalled memory:** the recalled D-02 and D-05 (phases/7/CONTEXT.md, phase 7) are this phase's own decisions, applied here as written.
