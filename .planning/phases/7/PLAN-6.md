---
phase: 7
plan: 6
depends_on: [4]
requirements:
  - CHECK-03
files:
  - skills/seldon/SKILL.md
---

# Phase 7: PRD changes flow downstream - Plan 6: The conflict check in the skill

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan writes the skill's conflict check. Before a PRD change is applied, Seldon names each spine decision the change conflicts with, then asks whether to go ahead. The answer is either applied in full or declined with nothing written.

## Must be true when done

- The PRD step and the PRD rerun read `spine.md`, when it's there, only to name conflicts, and nothing from it enters the PRD (D-06).
- **When the check runs:** at three routes, once the change is worked out and before the first Edit, and only with `spine.md` there:
  - the PRD rerun, whether named or reached through the stale route
  - "PRD questions answered", when it carries a rerun on
  - "Names changes" at the PRD's confirm question
- **When it stops:** a change that alters or drops something a spine decision states or quotes. Nothing is written, each conflicting decision is named by its S- ID, and the turn ends on the fixed conflict question. With no conflict, the change goes on as it does today.
- Conflicts are found by comparing decision text and quotes with the requirement text and quotes the change alters or drops, never by requirement ID (D-07).
- A section 1 route takes the answer:
  - a go-ahead applies exactly the reported change, records the stamp, runs the PRD check and ends on the PRD confirm question
  - a decline writes nothing, and ends on the brief decline line or the nothing-changed line, depending on where the change came from
  - any other reply asks the question again
- `node --test tests/skill.test.mjs` passes, and SKILL.md stays within Plan 1's budget.

## Context

- **Locked:** D-06, D-07, D-14, D-15 and D-19. From Plan 4: "Stamps and stale links", and the stale route into "The PRD rerun".
- **Fixed words (mine):**
  - conflict question: `Do you want me to apply this change to the PRD anyway?`
  - brief decline line: `I've changed nothing, so the PRD stays behind the brief. To take the change back out of the brief, run /seldon brief.`
  - nothing-changed line: `I've changed nothing, so the PRD stays as it was.`
  - the paragraph name **The conflict check.** in "The PRD draft", and the section 1 route label **Conflict question answered:**, on the pattern of "PRD questions answered"
- **Only a PRD change gets the check:** the spine and epics routes stay as they are.
- **Out of scope:** eval files (Plan 7), and any write to `spine.md` or `epics.md` from the PRD step.
- **Checks here are on the text.** Plan 7's runs prove the behavior.

## Tasks

### Task 1: Report conflicts before a PRD change is applied

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#12. The PRD step, skills/seldon/SKILL.md#13. The PRD draft, skills/seldon/SKILL.md#1. Where the conversation stands, samples/spine.md, samples/prd.md
- **Decisions:** D-06, D-07, D-19
- **Pins:** tests/skill.test.mjs
- **Action:** A PRD change that hits a spine decision stops before anything is written.
  - **Reads (D-06):**
    - In "The PRD step", the sentence naming "The one other file a PRD step reads" now also names `spine.md`, when it's there. It's read only to name conflicts, as "The conflict check" says, and nothing from it enters the PRD.
    - The read list in "The PRD rerun" ("and nothing else") gains the same.
  - **Add "The conflict check." to "The PRD draft", after "The PRD rerun":**
    - **Where:** the three routes that change a `prd.md` that's there:
      - the PRD rerun, however it's reached
      - "PRD questions answered", when it carries a rerun on
      - "Names changes" at the PRD's confirm question

      It runs once the change is worked out and before the first Edit, and only when `spine.md` is there. Look for it with Read or Glob.
    - **What conflicts (D-07):** a spine decision conflicts when its text or one of its `> ` quotes states or quotes something the change alters or drops. Compare each decision's text and quotes with the requirement text and quotes the change alters or drops. Never compare by requirement ID, since a spine decision names none. The plain case is a decision quoting the same brief line as a requirement the change drops.
    - **No conflict:** carry the change on with Edit, as that route says.
    - **A conflict:** write and edit nothing. Name each conflicting decision by its S- ID, saying what it states or quotes and what the change alters or drops. Then end on the conflict question, in exactly those words, on a line of its own, with nothing after it.
    - **The spine and epics stay untouched:** the check never writes or edits `spine.md` or `epics.md`.
  - **The routes point to it:** the steps of "The PRD rerun", "PRD questions answered", and both "Names changes" texts for the PRD (in section 1 and in the route list of "The PRD draft") run "The conflict check" before their first Edit.
  - Keep SKILL.md within the 90,000-byte budget (D-19).
- **Verify:**
  - **Testing scope:** text only. Plan 7's prd-conflict, stale-prd and prd-change-conflict cases prove the report at the named rerun, on the stale route and at "Names changes". "PRD questions answered" hands its change to "The PRD rerun", which runs the check, and it rests on the text check in (2) alone. The checks below show it's wired into each route, and testing stops there.
  - (1) `grep -cF 'Do you want me to apply this change to the PRD anyway?' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) With SKILL.md's wrapped lines joined (`tr -s '\n ' ' ' < skills/seldon/SKILL.md`), `grep -o 'The conflict check' | wc -l` prints at least 4: the paragraph itself, plus its use in the PRD rerun, in "PRD questions answered" and in "Names changes". It prints 0 today. The "PRD questions answered" bullet holds it itself: `perl -ne 'print if /^- \*\*PRD questions answered:/../^- \*\*(?!PRD questions answered:)/' skills/seldon/SKILL.md | sed '$d' | tr -s '\n ' ' ' | grep -c 'The conflict check'` prints 1. It prints 0 today.
  - (3) In that joined text, the sentence starting "The one other file a PRD step reads" names `spine.md`, and so does the PRD rerun's read list.
  - (4) `node --test tests/skill.test.mjs` passes, and `wc -c skills/seldon/SKILL.md` prints at most 90000.

### Task 2: Route the answer to the conflict question

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#13. The PRD draft, skills/seldon/SKILL.md#14. The PRD check, skills/seldon/SKILL.md#Stamps and stale links
- **Decisions:** D-14, D-15, D-19
- **Pins:** tests/skill.test.mjs
- **Action:** The conflict question gets its own route in section 1.
  - **Add "Conflict question answered" after "PRD questions answered":** the user answered the conflict question that ended your last turn.
    - **A go-ahead:** apply exactly the change the report described, with Edit, never a fresh Write.
      - For a change named at the PRD's confirm question, the change comes from the conversation.
      - For a rerun, work it out again from the files, as "The PRD rerun" says.
      - Then record the stamp as "Stamps and stale links" says, run "The PRD check", and end the step the way that section says, on the PRD's confirm question. A go-ahead runs no second conflict check (D-14).
    - **A decline:** write and edit nothing. End on one line, on a line of its own with nothing after it (D-15):
      - when the change came from the brief (the PRD rerun, however it's reached, or "PRD questions answered" carrying one on), the brief decline line
      - when the change was named at the PRD's confirm question, the nothing-changed line

      Only the brief decline line names `/seldon brief`.
    - **Anything else:** write nothing, and end on the conflict question again.
  - **The route list in "The PRD draft":** the list of routes that change a PRD that's there gains this go-ahead, with Edit. The two sentences that count those routes change to match the new list, with no number: "Three routes change a PRD that's there, and all three do it with Edit" (SKILL.md line 692) and "one of the three routes "The PRD draft" lets change a `prd.md` that's there" in section 1's "Names changes" (line 147).
  - **The name test still comes first:** it sits at the top of section 1, so a step name typed as the reply takes that step's route.
  - Keep SKILL.md within the 90,000-byte budget (D-19).
- **Verify:**
  - **Testing scope:** text only. Plan 7's three decline and apply cases prove the route. The checks below pin the two lines and the route, and testing stops there.
  - (1) `grep -cF` prints at least 1 for each of the brief decline line and the nothing-changed line, and 0 today.
  - (2) With SKILL.md's wrapped lines joined, `grep -o 'Conflict question answered' | wc -l` prints at least 2: the route, plus its entry in the route list of "The PRD draft". It prints 0 today.
  - (3) The nothing-changed line holds no `/seldon brief`, so `grep -F 'stays as it was' skills/seldon/SKILL.md | grep -c '/seldon brief'` prints 0.
  - (4) `node --test tests/skill.test.mjs` passes, and `wc -c skills/seldon/SKILL.md` prints at most 90000.
  - (5) With SKILL.md's wrapped lines joined, `grep -cF 'Three routes change a PRD'` and `grep -cF 'one of the three routes "The PRD draft"'` each print 0. Each prints 1 today.
