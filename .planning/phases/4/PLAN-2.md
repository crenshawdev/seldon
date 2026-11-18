---
phase: 4
plan: 2
depends_on: [1]
requirements:
  - ARCH-01
files:
  - skills/seldon/SKILL.md
---

# Phase 4: The architecture spine - Plan 2: The spine step

## Goal

The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds. This plan builds the spine step in SKILL.md, and Plan 3 proves it with two cases:

- a bare `/seldon` over a brief and a PRD resumes into the spine step and writes a conforming `spine.md` (AC1), touching no other `.planning/seldon/` file (AC5's negative half)
- `/seldon spine` over an existing spine reruns it in place, keeping its IDs (AC6)

It also retires the "spine and epics come in a later release" line from SKILL.md.

## Must be true when done

- SKILL.md holds "15. The spine step", "16. The spine draft" and "17. The spine check". A spine is drafted from `brief.md` and `prd.md` alone. Every decision gets an `S-NN` heading, one `Kind:` line naming one of the six kinds, and a `> ` quote or an `[ASSUMPTION]` tag. The step ends on the `--spine` pass line and a confirm question. A rerun changes `spine.md` with Edit only, keeping its IDs and listing a dropped one on a `Retired:` line.
- These routes hold:
  - `/seldon spine` with no PRD writes nothing and says so.
  - A bare `/seldon` with a brief, a PRD and a spine, and `/seldon epics`, both end on the fixed epics-only later-release line.
  - The PRD step's create guard ends on its own fixed line pointing to `/seldon prd`.
  - Going on from the documents question with a brief and a PRD resumes at the spine step.
- `grep -c 'The spine and epics steps come in a later release' skills/seldon/SKILL.md` prints 0. `tests/skill.test.mjs` still pins phase 2 D-02's five `allowed-tools` entries, and `claude plugin validate --strict .` exits 0.

## Context

- **Locked:** D-01, D-03, D-04, D-06, D-07, D-08, D-10, D-11 and D-13. From Plan 1: the token `--spine`, the pass line `seldon check: spine.md conforms`, the `Kind: ` line form and the six kinds' spelling. Phase 3 D-09 (keeping IDs, `.planning/phases/3/CONTEXT.md`) is the PRD rerun this plan's spine rerun mirrors.
- **SECURITY (phase 2 D-02, D-13):** SKILL.md's `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`. No task touches it. `spine.md` falls inside `Edit(.planning/seldon/**)`, and the `--spine` command falls inside the check's Bash rule.
- **New sections, my naming:** this plan adds "15. The spine step", "16. The spine draft" and "17. The spine check" after "14. The PRD check", in SKILL.md's numbered style. Plans 5 and 6 refer to them by those names.
- **Fixed words:** every sentence a grader matches gets fixed words in SKILL.md, on a line of its own in a fenced block introduced with "exactly these words", the way §2's resume line is written. This plan fixes three:
  - the spine resume line
  - the epics-only later-release line
  - the PRD create guard's line

  The case tasks in Plans 3 and 4 copy each line they match from SKILL.md, never from this plan.
- **Stop points:** every point where a turn stops to ask needs a §1 route that carries the same step on with the answer (phase 3 SUMMARY, the three-review deviation). This plan adds one stop point, the spine's confirm question, and §1's "Step confirm answered" carries it. Task 3 checks that.
- **Eval runs:** this plan runs no case. Plan 3 runs `spine-from-prd` and `spine-rerun` once every task here is in.
- **Owner's words:** committed files never carry the owner's own words. The example in Task 2 uses a coined project.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Build the spine step from the brief and the PRD

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#12. The PRD step, skills/seldon/SKILL.md#objective, skills/seldon/SKILL.md#rules, docs/FORMAT.md#spine.md
- **Decisions:** D-06, D-01
- **Pins:** tests/skill.test.mjs
- **Action:** Add "15. The spine step" after "14. The PRD check".
  - **What it reads (D-06):** `.planning/seldon/brief.md` and `.planning/seldon/prd.md`, and nothing else: no `docs/design/` or other design folder, no dump, no earlier conversation.
    - A fact from a design folder reaches the spine only through a quote the brief already carries.
    - Stack and hosting words the user said reach it only through the brief's `> ` quotes, since the PRD leaves them out.
    - The one thing it takes from the conversation is the user's answers to this step's own questions.
  - **Files as they stand:** the files on disk are the confirmed ones, even where they differ from something said earlier. Build from them, and don't point out the difference, as "The PRD step" says.
  - **The go-ahead:** running the step is the go-ahead. Recommend no path, ask for no confirmation first, and never ask the brief's or the PRD's questions again.
  - **What the spine holds (ARCH-01):** only the decisions that would clash if two parts of the system were built separately. Each decision is exactly one of the six kinds, named the way `docs/FORMAT.md` spells them. A choice one part can make alone, such as a page layout or a library used inside one part, stays out. A spine doesn't need all six kinds.
  - **Drafting:** draft the spine in this same turn, as "The spine draft" says. The `Kind:` line itself is Task 2's to describe.
  - **Around the step:** `<objective>` and the frontmatter `description` name the spine step and `.planning/seldon/spine.md`. In `<rules>`, `spine.md` joins the files Seldon writes. `allowed-tools` and `argument-hint` don't change.
- **Verify:**
  - **Testing scope:** Plan 3's spine-from-prd case proves the behavior by eval. Text checks that fail today, plus the pinned test, are enough here, and testing stops there.
  - (1) "15. The spine step" says what the step reads (only `brief.md` and `prd.md`, never a design folder, the dump or the conversation), names the six kinds and drafts in the same turn. `grep -c 'how state changes' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) `<rules>` names `.planning/seldon/spine.md` among the files Seldon writes. `grep -c 'spine.md' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 2: Draft spine.md with Kind lines and quoted or tagged decisions

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#13. The PRD draft, docs/FORMAT.md#spine.md, docs/FORMAT.md#In the spine, samples/spine.md
- **Decisions:** D-01, D-03, D-11
- **Pins:** tests/skill.test.mjs
- **Action:** Add "16. The spine draft" after the spine step.
  - **Write only creates:** write `.planning/seldon/spine.md` with the Write tool, and use Write only to create a spine that isn't there yet. Never Write over a `spine.md` that's there. One that's there changes only with Edit, through the routes this section names, as later tasks add them.
  - **Shape, as `docs/FORMAT.md` fixes it:**
    - a `# <Project> - architecture spine` title
    - one `## S-01: <decision>` section per decision, numbered from S-01 with two or more digits
    - no tag on a heading
    - a body that states the decision in prose and holds exactly one `Kind:` line, naming one of the six kinds spelled exactly
    - no other `## ` heading, and no body line starting with `## `
  - **Quotes and tags (D-03):** a decision drawn from source words has a `> ` quote under its text. The words come from one of two sources:
    - the brief's `> ` lines, word for word, as a whole line or one unbroken run of one, keeping any `(docs/design/...)` line under it
    - the user's replies to this step's own questions

    The brief's item text and the PRD's text are Seldon's words and are never quoted. A decision with no source words carries `[ASSUMPTION]` inline in its body, never on the heading or the `Kind:` line. Never paraphrase or tidy a quote.
  - **Example:** one fenced block in the fixed shape, for a coined project. The executor writes it, and it isn't the owner's words.
  - **Next:** then run "The spine check" (Task 3).
- **Verify:**
  - **Testing scope:** Plan 3's spine-from-prd graders prove this by eval. A text check that fails today, plus the pinned test, is enough, and testing stops there.
  - (1) "16. The spine draft" says four things:
    - Write only creates a missing `spine.md`.
    - Every decision holds one `Kind:` line naming one of the six.
    - Quotes come only from the brief's `> ` lines and replies to this step's questions.
    - A tag never sits on a heading or a `Kind:` line.

    `grep -c 'Kind:' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 3: Check the spine with --spine and end the step

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#14. The PRD check, skills/seldon/SKILL.md#11. The check, skills/seldon/SKILL.md#1. Where the conversation stands, tests/skill.test.mjs
- **Decisions:** D-10, D-13
- **Pins:** tests/skill.test.mjs
- **Action:** Add "17. The spine check" after the spine draft.
  - **The command:** once the spine is written, run exactly `node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --spine .planning/seldon` from the project root, with the path unquoted. It's the plugin's own check, never a `lib/check.mjs` in the user's project.
  - **On exit 1:** fix each problem it names in `spine.md` with Edit, inside `.planning/seldon/`, and run it again until it passes.
  - **Ending:** end the step the way "The check" says. Name the file, repeat the result line word for word on a line of its own, and end the turn on one plain-prose question asking whether the user confirms the spine or wants changes.
  - **Names changes:** §1's "Names changes" covers the spine. Make the changes in `spine.md` with Edit, quote the user's new words as "The spine draft" says, and run the spine check again. In "The spine draft", this route is named as one that changes an existing `spine.md`.
  - **Rules:** `<rules>` says the commands Seldon runs are the three checks, each exactly as written in its section. No grant changes, because the command falls inside the existing Bash rule (D-13).
- **Verify:**
  - **Testing scope:** Plan 3's spine-from-prd case proves the run by eval. The pinned prefix test plus text checks that fail today are enough, and testing stops there.
  - (1) `grep -c 'lib/check.mjs --spine .planning/seldon' skills/seldon/SKILL.md` prints 1. It prints 0 today. "every check command in the body starts with the Bash rule's command" in `tests/skill.test.mjs` passes with it.
  - (2) "Names changes" names the spine and `spine.md`, and `<rules>` names three checks.
  - (3) **Stop point:** the spine's confirm question repeats a check's result line and asks the user to confirm or change, so "Step confirm answered" in §1 reads it. Report that mapping in the plan report.
  - (4) `claude plugin validate --strict .` exits 0.

### Task 4: Rerun the spine in place

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#13. The PRD draft, docs/FORMAT.md#IDs are stable
- **Decisions:** D-04, D-06, D-11
- **Pins:** tests/skill.test.mjs
- **Action:** "16. The spine draft" gains a "The spine rerun" paragraph that mirrors "The PRD rerun" (D-04, phase 3 D-09).
  - **What it does:** a rerun brings `spine.md` in line with the brief and the PRD as they stand now.
  - **What it reads:** `spine.md` first, the previous version of this document, then `brief.md` and `prd.md`, and nothing else.
  - **Edit only:** change the spine with Edit, never a fresh Write over it, so a line the change doesn't touch is never typed again.
    - A decision the change doesn't touch keeps its heading, its `Kind:` line, its text and its quote or tag lines byte-identical.
    - A decision the change alters keeps its ID and takes the new text, with its new quote or tag.
    - A decision that no longer applies is removed, its heading and its whole body. Its ID goes on the `Retired:` line, one prose line directly under the `# ` title, before the first decision. Make the line when the first ID retires, and add each later one to its end, plain and comma-separated.
    - A new decision takes the next unused number. Never give it an ID that's in use or on the `Retired:` line.
  - **Next:** then run "The spine check" and end the step the way it says.
  - **The spine step:** "15. The spine step" adds that the one other file it reads is the `spine.md` a rerun updates.
  - **Routes:** "The spine draft" names the rerun as a route that changes an existing `spine.md`. `/seldon spine` with a spine there reaches it through Task 6.
- **Verify:**
  - **Testing scope:** Plan 3's spine-rerun case proves this by eval. A text check that fails today, plus the pinned test, is enough, and testing stops there.
  - (1) "The spine rerun" says five things:
    - it reads `spine.md` first
    - it changes the spine with Edit only
    - it keeps untouched decisions byte-identical
    - it puts a dropped ID on a `Retired:` line under the title
    - it never reuses an ID

    `grep -c 'Retired: S-' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 5: Give the PRD create guard its own line

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#13. The PRD draft, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-08
- **Pins:** tests/skill.test.mjs
- **Action:** "The PRD draft" ends on the later-release line in two places when `prd.md` is there: the guard right before the Write, and "Every other route that reaches this step and finds `prd.md`". Both now end on a new fixed line of their own (D-08).
  - **The new line:** fixed words, on a line of its own, in a fenced block introduced with "exactly these words". It says `.planning/seldon/prd.md` is already there, that nothing was written, and that `/seldon prd` revises it. It carries no later-release wording.
  - **Names changes:** §1's "Names changes" calls the guard "its later-release guard". Rename it the PRD's create guard.
  - **Unchanged:** the three Edit routes into an existing PRD.
- **Verify:**
  - **Testing scope:** text checks that fail today, plus the pinned test, are enough. No case reaches this guard, and testing stops there.
  - (1) `grep -c 'later-release guard' skills/seldon/SKILL.md` prints 0. It prints 1 today.
  - (2) `perl -ne 'print if /^## 13\./../^## 14\./' skills/seldon/SKILL.md` shows a fenced line holding `/seldon prd`, and no "later-release line" or "later release".
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 6: Route a run by which of the three documents exist

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-07, D-08, D-04
- **Pins:** tests/skill.test.mjs
- **Action:** Once the spine step exists, a run goes where the files say (D-07).
  - **§2, the look:** look for `brief.md`, `prd.md` and `spine.md` in `.planning/seldon/` with Read or Glob. The routes:
    - **No brief:** unchanged.
    - **A brief, no PRD, empty argument:** the PRD resume, unchanged.
    - **A brief and a PRD, no spine, empty argument:** a resume into the spine step. Say the spine resume line as the first text of the reply, before the next tool call and before reading the brief or the PRD or drafting. Its fixed words go on a line of their own, in a fenced block, mirroring the PRD's resume line. The line names `.planning/seldon/prd.md` and says `/seldon prd` revises the PRD instead. Never Write `spine.md` until that line is in the reply. Then go to "15. The spine step".
    - **A brief, a PRD and a spine, empty argument:** write nothing, and end on the epics-only later-release line. Its fixed words go on a line of their own, with nothing after them. It says the epics step comes in a later release and that nothing was written this time, and it names no other step.
    - **A brief and a non-empty argument:** the documents question, unchanged.
  - **§1, the step names:** `spine` and `epics` get routes of their own.
    - **`spine`:** look for the three files.
      - No PRD there: write nothing. Say there's no PRD yet, and name `/seldon prd` as what builds it, or a bare `/seldon` when there's no brief either. The wording is free.
      - A brief and a PRD, no spine: go to "15. The spine step", with no resume line, since the user named the step.
      - A spine there: the spine rerun (Task 4).
    - **`epics`:** write nothing, edit nothing and run nothing, and end on the epics-only later-release line.
  - **§1, going on (D-08):** "Go on from the brief" follows §2's routes exactly as a resume does:
    - only a brief: the PRD resume line, then the PRD step
    - a brief and a PRD, no spine: the spine resume line, then the spine step
    - all three: the epics-only line

    Going on never runs the PRD step over a PRD that's there, or the spine step over a spine that's there.
  - **Retire the old line:** remove `The spine and epics steps come in a later release, so I've written nothing this time.` from SKILL.md. Every remaining mention of the later-release line now means the epics-only line.
- **Verify:**
  - **Testing scope:** Plan 3's spine-from-prd case proves the spine resume by eval, and Plan 4 proves the epics-only line. Text checks that fail today, plus the pinned test, are enough here, and testing stops there.
  - (1) `grep -c 'The spine and epics steps come in a later release' skills/seldon/SKILL.md` prints 0. It prints 1 today.
  - (2) §2 holds two new fenced lines:
    - the spine resume line, naming `.planning/seldon/prd.md` and `/seldon prd`
    - the epics-only line, which says "later release", names epics and doesn't say "spine"
  - (3) §1 has separate `spine` and `epics` routes with the branches above. "Go on from the brief" has the three branches.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

## Notes

- **Task order:** Task 4 writes the rerun before Task 6 wires `/seldon spine` to it. Otherwise the route would point at nothing for a commit. Task 5 comes before Task 6 so Task 6 can remove the old line from every place in one pass.
- **The resume line's timing:** D-07 says the line comes before any tool call. The look for the files is itself a tool call, so this plan reads it the way the PRD resume line is written: after the look, and before the next tool call.
- **Unstated stack or hosting:** this plan's spine step asks nothing. Plan 5 adds every spine question, stack and hosting the brief never names included, together with the route back from them. That keeps every stop point and its route in one plan.
