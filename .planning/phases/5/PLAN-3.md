---
phase: 5
plan: 3
depends_on: [1, 2]
requirements:
  - EPIC-01
  - EPIC-02
  - FLOW-01
files:
  - skills/seldon/SKILL.md
---

# Phase 5: Epics and the full walk - Plan 3: The epics check, rerun and routes

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan adds the epics check and the epics rerun to SKILL.md, and routes every run to the epics step by which documents exist.

## Must be true when done

- SKILL.md holds "20. The epics check", between "19. The epics draft" and "21. The architecture document". The epics step runs `--epics` and ends on its fixed confirm question.
- A `/seldon epics` rerun changes `epics.md` with Edit only, keeps untouched epics byte-identical and IDs stable, and lists a dropped epic on a `Retired:` line under the title.
- These routes hold:
  - A bare `/seldon` with a brief, a PRD and a spine, and no epics, says the fixed epics resume line naming `spine.md`, then runs the step.
  - `/seldon epics` with no spine writes nothing and names `/seldon spine`.
  - A bare `/seldon` with all four documents ends on the new later-release line naming the readiness check and the handoff.
  - Going on from the documents question takes the same branches.
- `grep -c 'The epics step comes in a later release' skills/seldon/SKILL.md` prints 0. `tests/skill.test.mjs` still pins phase 2 D-02's five `allowed-tools` entries, and `claude plugin validate --strict .` exits 0.

## Context

- **Locked:** D-05, D-06, D-08, D-10, D-11 and D-14 to D-18, as each task names them. From Plan 1: the token `--epics`, the pass line `seldon check: epics.md conforms` and the epics `Retired:` line under the title. From Plan 2: "18. The epics step" and "19. The epics draft".
- **SECURITY (D-18, phase 2 D-02):** SKILL.md's `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`. No task touches it or `argument-hint`, which already names `epics`. `epics.md` falls inside `Edit(.planning/seldon/**)`, and the `--epics` command falls inside the check's Bash rule.
- **Size (Plan 2's call on the flagged assumption):** the epics step goes into SKILL.md, not into reference files. Phase 4's full suite followed the file's last section at 45,308 bytes, and a reference file would put a Read before the resume line that the resume graders forbid.
  - "20. The epics check" goes between "19. The epics draft" and "21. The architecture document". That keeps the walk's order and leaves the file's last section one that an existing case exercises.
  - Write the text tight. Point to an existing section by name ("as 'The spine draft' says") rather than restating it.
  - Plan 4 checks where the answer lives, in a run's trace.
- **Fixed words:** every sentence a grader matches gets fixed words, on a line of its own in a fenced block introduced with "exactly these words", the way §2's resume lines are written. This plan fixes three: the epics confirm question, the epics resume line and the new later-release line. Plan 2 fixed the integrated item. The case tasks in Plans 4 to 6 copy each line from SKILL.md, never from this plan.
- **Stop points:** the epics step asks no questions (D-15), so its one stop point is its confirm question, which §1's "Step confirm answered" already carries. D-08's no-boundary stop ends without a question and needs no route back.
- **Grepping prose:** SKILL.md wraps its prose near 78 columns, so a phrase can break across two lines. A Verify that counts a phrase joins the lines first, then counts with `grep -o '<phrase>' | wc -l`. For the whole file that's `tr -s '\n ' '  ' < skills/seldon/SKILL.md`. For one section, pipe `perl -ne 'print if /^## 18\./../^## 21\./' skills/seldon/SKILL.md` through the same `tr`. A fenced line keeps its words on one line, so a plain `grep -c` reads it.
- **Eval runs:** this plan runs no case. Plans 4 to 6 run them once every task here is in.
- **Owner's words:** committed files never carry the owner's own words.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Check the epics with --epics and end the step

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#17. The spine check, skills/seldon/SKILL.md#11. The check, skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#rules, tests/skill.test.mjs
- **Decisions:** D-11, D-17, D-18, D-15, D-05
- **Pins:** tests/skill.test.mjs
- **Action:** Add "20. The epics check" after the epics draft.
  - **The command (D-11):** once `epics.md` is written, run exactly `node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --epics .planning/seldon` from the project root, with the path unquoted. It's the plugin's own check. The step never runs the full check.
  - **On exit 1:** fix each problem it names in `epics.md` with Edit, inside `.planning/seldon/`, and run it again until it passes.
  - **Ending:** end the step the way "The check" says. Name the file, repeat the result line word for word on a line of its own, and end the turn on the epics confirm question. Its words are fixed, on a line of their own in a fenced block introduced with "exactly these words", so Plan 6's `ends-on-confirm` grader can copy them. They follow the README's "asks whether you confirm the document or want changes":

    ```
    Do you confirm the epics, or do you want changes?
    ```

    "The check" and the other steps' questions don't change.
  - **Confirms (D-17):** §1's "Confirms" carries it to the same `/clear` words as every other step. Those words don't change.
  - **Names changes:** §1's "Names changes" covers the epics. Make the changes in `epics.md` with Edit, with no quote, since epics carry none (D-05). Then run the epics check again. "The epics draft" names this route as one that changes an existing `epics.md`.
  - **Rules (D-18):** `<rules>` says the commands Seldon runs are the four checks, the epics' in "The epics check", each exactly as written there. No grant changes.
- **Verify:**
  - **Testing scope:** Plans 4 to 6 prove the run and the confirm by eval. The pinned prefix test plus text checks that fail today are enough, and testing stops there.
  - (1) `grep -c 'lib/check.mjs --epics .planning/seldon' skills/seldon/SKILL.md` prints 1. It prints 0 today. "every check command in the body starts with the Bash rule's command" in `tests/skill.test.mjs` passes with it.
  - (2) Counted on the joined file, `three checks` appears 0 times and `four checks` at least once. Today they appear 1 and 0 times. "Names changes" names `epics.md`.
  - (3) **No new stop point (D-15):** `perl -ne 'print if /^## 1\. Where/../^## 2\. Where/' skills/seldon/SKILL.md | grep -c '^- \*\*[^*]*answered:\*\*'` still prints 5. The plan report says that "Step confirm answered" reads the epics confirm question.
  - (4) `claude plugin validate --strict .` exits 0.
  - (5) `grep -c '^Do you confirm the epics, or do you want changes?$' skills/seldon/SKILL.md` prints 1. It prints 0 today.

### Task 2: Rerun the epics in place

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#16. The spine draft, docs/FORMAT.md#IDs are stable, samples/epics.md
- **Decisions:** D-10, D-06, D-14, D-15, D-08
- **Pins:** tests/skill.test.mjs
- **Action:** "19. The epics draft" gains "The epics rerun", which mirrors "The spine rerun" (D-10).
  - **What it does:** a rerun brings `epics.md` in line with the PRD and the spine as they stand now.
  - **What it reads (D-14):** `epics.md` first, the previous version of this document, then `prd.md` and `spine.md`, and nothing else. It asks no question (D-15).
  - **Edit only:** change the epics with Edit, never a fresh Write over them, so a line the change doesn't touch is never typed again.
    - An epic the change doesn't touch keeps its heading and all six fields byte-identical.
    - An epic the change alters keeps its ID and takes the new text. A retired S- ID leaving its `**Spine decisions:**` is one such change.
    - An epic with nothing left to build is removed, its heading and its whole body. Its ID goes on the `Retired:` line, one prose line directly under the `# ` title, before the first epic. Make the line when the first ID retires, and add each later one to its end, plain and comma-separated.
    - A new epic, a split-off one included, takes the next unused number wherever it sits in build order (D-06). Never give it an ID that's in use or on the `Retired:` line.
  - **Same rules:** the sizing in "The epics step", D-08's stop included, and the draft's build order and citations hold on a rerun.
  - **Next:** then run "The epics check" and end the step the way it says.
  - **The step:** "18. The epics step" adds that the one other file it reads is the `epics.md` a rerun updates. "The epics draft" names the rerun as a route that changes an existing `epics.md`. Task 3 wires `/seldon epics` to it.
- **Verify:**
  - **Testing scope:** Plan 4's epics-rerun case proves this by eval. Text checks that fail today, plus the pinned test, are enough, and testing stops there.
  - (1) `grep -c 'Retired: E-' skills/seldon/SKILL.md` prints at least 1. It prints 0 today.
  - (2) "The epics rerun" says five things:
    - it reads `epics.md` first
    - it changes the epics with Edit only
    - it keeps untouched epics byte-identical
    - it puts a dropped ID on a `Retired:` line under the title
    - it never reuses an ID
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 3: Route a run by which of the four documents exist

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#1. Where the conversation stands, skills/seldon/SKILL.md#2. Where a run starts
- **Decisions:** D-16, D-17
- **Pins:** tests/skill.test.mjs
- **Action:** Once the epics step exists, a run goes where the files say.
  - **§2, the look:** look for `brief.md`, `prd.md`, `spine.md` and `epics.md` in `.planning/seldon/` with Read or Glob. The routes:
    - **Unchanged:** no brief; a brief with no PRD; a brief and a PRD with no spine; a brief with a non-empty argument.
    - **A brief, a PRD and a spine, no epics, empty argument (D-16):** a resume into the epics step.
      - Say the epics resume line as the first text of the reply, before the next tool call and before reading the PRD or the spine.
      - Its fixed words go on a line of their own in a fenced block, mirroring the spine resume line. They name `.planning/seldon/spine.md` and say `/seldon spine` revises the spine instead.
      - Never Write `epics.md` on a resume until that line is in the reply. Then go to "18. The epics step".
    - **All four, empty argument (D-17):** write nothing, and end on the new later-release line, with nothing after it. Its fixed words go on a line of their own in a fenced block. They say:
      - all four documents are there
      - the readiness check and the handoff to Cadence come in a later release
      - nothing was written this time

      Phase 7 replaces this line.
  - **§1, `epics` (D-16):** replace the route. Look for `spine.md` and `epics.md`.
    - **No spine there:** write nothing. Say there's no spine yet and that `/seldon spine` builds it. The wording is free.
    - **A spine, no epics:** go to "18. The epics step", with no resume line, since the user named the step.
    - **`epics.md` there:** this is the epics rerun (Task 2).
  - **§1, going on (D-16):** "Go on from the brief" follows §2's routes exactly as a resume does. Its branch "A brief, a PRD and a spine: write nothing, and end on the later-release line" is replaced by two:
    - a brief, a PRD and a spine, no epics: the epics resume line, then the epics step
    - all four: the new later-release line

    No branch is left for a brief, a PRD and a spine that doesn't say whether `epics.md` is there. Going on never runs the epics step over an `epics.md` that's there.
  - **Retire the old line:** remove `The epics step comes in a later release, so I've written nothing this time.` from SKILL.md. Every remaining mention of the later-release line now means the new one.
- **Verify:**
  - **Testing scope:** Plan 6's full-walk, resume-later and epics-no-spine cases prove these routes by eval. Text checks that fail today, plus the pinned test, are enough here, and testing stops there.
  - (1) `grep -c 'The epics step comes in a later release' skills/seldon/SKILL.md` prints 0. It prints 1 today.
  - (2) §2 holds two new fenced lines:
    - the epics resume line, naming `.planning/seldon/spine.md` and `/seldon spine`
    - the new later-release line, which says "later release" and names the readiness check and the handoff. `grep -c 'readiness check' skills/seldon/SKILL.md` prints at least 1, and 0 today.
  - (3) §1's `epics` route has the three branches above, and "Go on from the brief" has the two new ones. Joined, `grep -o 'A brief, a PRD and a spine: write nothing' | wc -l` prints 0, so the old going-on branch is gone. It prints 1 today.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (5) The plan report gives `wc -c skills/seldon/SKILL.md`, so Plan 4's size check reads against a known figure.

## Notes

- **The split from Plan 2:** Plans 2 and 3 were one plan, whose brief passed the 32 KB ceiling. Plan 2 writes sections 18 and 19, and this plan adds section 20, the rerun and the routes, in the same task order as before.
- **Task order:** Plan 2 writes the draft and Task 2 the rerun before Task 3 wires the resume and `/seldon epics` to them, so no route points at a missing section for a commit. Phase 4 Plan 2 ordered its tasks the same way.
- **The resume line's timing:** D-16 says the line comes before any tool call. The look for the files is itself a tool call, so this plan reads it the way the PRD and spine resume lines are written: after the look, and before the next tool call. Phase 4 Plan 2 read D-07 the same way.
- **No branch for a spine with no PRD:** D-16 names only the no-spine case for `/seldon epics`, so no task adds a branch for a spine sitting without a PRD.
