---
phase: 5
plan: 2
depends_on: [1]
requirements:
  - EPIC-01
  - EPIC-02
files:
  - skills/seldon/SKILL.md
---

# Phase 5: Epics and the full walk - Plan 2: The epics step and its draft

## Goal

The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds. This plan writes the epics step and its draft into SKILL.md: what the step reads, how it cuts and sizes epics, the shape of `epics.md`, and its build order and citations. Plan 3 adds the check, the rerun and the routes.

## Must be true when done

- SKILL.md holds "18. The epics step" and "19. The epics draft", and "The architecture document" is renumbered 21. The epics step:
  - reads `prd.md` and `spine.md` alone and asks no questions
  - cuts epics by capability, splitting an oversized one along a `Kind: boundaries` decision that both sides cite
  - writes nothing and points to `/seldon spine` when no boundary cuts an oversized capability
  - writes `epics.md` in build order, with done-when lists that hold the integrated item and the required spine citations
- `tests/skill.test.mjs` still pins phase 2 D-02's five `allowed-tools` entries, and `claude plugin validate --strict .` exits 0.

## Context

- **Locked:** D-01 to D-09, D-14, D-15 and D-18, as each task names them. From Plan 1: the integrated item's words in `docs/FORMAT.md`.
- **SECURITY (D-18, phase 2 D-02):** SKILL.md's `allowed-tools` stays exactly its five entries, pinned by `tests/skill.test.mjs`. No task touches it or `argument-hint`, which already names `epics`. `epics.md` falls inside `Edit(.planning/seldon/**)`, and the `--epics` command falls inside the check's Bash rule.
- **Size (my call on the flagged assumption):** the epics step goes into SKILL.md, not into reference files. Phase 4's full suite followed the file's last section at 45,308 bytes, and a reference file would put a Read before the resume line that the resume graders forbid.
  - The new sections go between "17. The spine check" and "The architecture document". That keeps the walk's order and leaves the file's last section one that an existing case exercises.
  - Write the text tight. Point to an existing section by name ("as 'The spine draft' says") rather than restating it.
  - Plan 4 checks where the answer lives, in a run's trace.
- **Fixed words:** every sentence a grader matches gets fixed words, on a line of its own in a fenced block introduced with "exactly these words", the way §2's resume lines are written. This plan fixes one: the integrated item, copied from `docs/FORMAT.md`. Plan 3 fixes the epics confirm question, the epics resume line and the new later-release line. The case tasks in Plans 4 to 6 copy each line from SKILL.md, never from this plan.
- **Stop points:** the epics step asks no questions (D-15), so its one stop point is its confirm question, which §1's "Step confirm answered" already carries. Plan 3 writes that question. D-08's no-boundary stop ends without a question and needs no route back.
- **Grepping prose:** SKILL.md wraps its prose near 78 columns, so a phrase can break across two lines. A Verify that counts a phrase joins the lines first, then counts with `grep -o '<phrase>' | wc -l`. For the whole file that's `tr -s '\n ' '  ' < skills/seldon/SKILL.md`. For one section, pipe `perl -ne 'print if /^## 18\./../^## 21\./' skills/seldon/SKILL.md` through the same `tr`. A fenced line keeps its words on one line, so a plain `grep -c` reads it.
- **Eval runs:** this plan runs no case. Plans 4 to 6 run them once this plan and Plan 3 are in.
- **Owner's words:** committed files never carry the owner's own words. The example in Task 3 uses a coined project.
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Build the epics step from the PRD and the spine

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#15. The spine step, skills/seldon/SKILL.md#objective, skills/seldon/SKILL.md#rules, skills/seldon/SKILL.md#18. The architecture document, docs/FORMAT.md#epics.md
- **Decisions:** D-14, D-15, D-18
- **Pins:** tests/skill.test.mjs
- **Action:** Add "18. The epics step" after "17. The spine check", and renumber "18. The architecture document" to "21. The architecture document". Task 3 adds 19, and Plan 3 adds 20. Nothing refers to a section by number, so the renumbering breaks no reference.
  - **What it reads (D-14):** `.planning/seldon/prd.md` and `.planning/seldon/spine.md`, and nothing else. It never reads the brief, a design folder, the dump or the earlier conversation. Plan 3 adds the one other file, the `epics.md` a rerun updates.
  - **Files as they stand:** the PRD and the spine on disk are the confirmed ones, even where they differ from something said earlier. Build from them as "The PRD step" says of the brief.
  - **The go-ahead (D-15):** running the step is the go-ahead.
    - Recommend no path and ask for no confirmation first.
    - Ask no question of its own. The PRD and the spine count as answered, their `[ASSUMPTION]` guesses included.
    - Draft in the same turn, as "The epics draft" says.
    - The step adds no stop point to §1 besides its confirm question.
  - **Around the step (D-18):**
    - The frontmatter `description` names the epics step and `.planning/seldon/epics.md`.
    - `<objective>` names the epics step.
    - In `<rules>`, `.planning/seldon/epics.md` joins the files Seldon writes.
- **Verify:**
  - **Testing scope:** Plans 4 to 6 prove the behavior by eval. Text checks that fail today, plus the pinned test, are enough here, and testing stops there.
  - (1) `grep -c '^## 18\. The epics step' skills/seldon/SKILL.md` and `grep -c '^## 21\. The architecture document' skills/seldon/SKILL.md` each print 1, and `grep -c '^## 18\. The architecture document' skills/seldon/SKILL.md` prints 0. Today they print 0, 0 and 1.
  - (2) `grep -c 'epics.md' skills/seldon/SKILL.md` prints at least 1. It prints 0 today. The frontmatter `description` and `<rules>` each hold `epics.md`.
  - (3) "18. The epics step" names `prd.md` and `spine.md` as its only inputs and says the step asks no questions of its own.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 2: Size epics and split them along the spine's boundaries

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#18. The epics step, docs/FORMAT.md#Epic fields, samples/prd.md, samples/spine.md, samples/epics.md
- **Decisions:** D-04, D-07, D-08, D-01, D-15
- **Pins:** tests/skill.test.mjs
- **Action:** "18. The epics step" says how epics are cut, before any drafting.
  - **Capability (D-07):** one `### ` category in the PRD's Requirements is one source capability. A tightly coupled pair of categories counts as one. NFRs aren't a capability.
  - **Each requirement once (D-04):** every requirement ID in the PRD, NFRs included, lands in exactly one epic.
    - An NFR rides with the epic whose capability it constrains, and counts toward that epic's limit.
    - Never repeat an NFR across the epics it constrains.
  - **The limits (D-01):** an epic carries at most 5 requirement IDs and 2 to 5 done-when items.
  - **The split (D-07):** an epic covers one capability, or a tightly coupled pair. An epic over a limit, or covering more than one capability, is split along a `Kind: boundaries` decision in the spine that cuts it.
    - Each requirement goes to the side that decision puts it on.
    - Every epic on either side cites that decision's S- ID in `**Spine decisions:**`.
    - Never split by count, such as the first five requirements and then the rest.
  - **No boundary to split on (D-08, D-15):** size every capability before writing anything. When one is over a limit and no `Kind: boundaries` decision cuts it:
    - Write nothing.
    - Name the capability by its `### ` category name.
    - Say a boundary has to be added first, with `/seldon spine`.
    - Ask no question, and end the turn there. Never split anyway with an `[ASSUMPTION]` boundary.
- **Verify:**
  - **Testing scope:** Plan 5's split and no-boundary cases prove this by eval. Text checks that fail today, plus the pinned test, are enough, and testing stops there.
  - (1) Counted on the joined file, `Kind: boundaries` appears at least once. It appears 0 times today.
  - (2) Inside "18. The epics step", joined (`perl -ne 'print if /^## 18\./../^## 21\./'`, since 19 isn't there yet), all four appear. Before this task the section holds none of them:
    - `### `, as what a capability is
    - `exactly one epic`
    - `/seldon spine`
    - a sentence ruling out a split by count
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

### Task 3: Draft epics.md with six fields and a done-when list

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#16. The spine draft, docs/FORMAT.md#epics.md, docs/FORMAT.md#Epic fields, samples/epics.md
- **Decisions:** D-02, D-03, D-05, D-09
- **Pins:** tests/skill.test.mjs
- **Action:** Add "19. The epics draft" after the epics step.
  - **Write only creates:** write `.planning/seldon/epics.md` with the Write tool, and use Write only to create an `epics.md` that isn't there yet. Never Write over one that's there. It changes only with Edit, through the routes this section names, which Plan 3 adds.
  - **Shape, as `docs/FORMAT.md` fixes it:**
    - a `# <Project> - epics` title, the form `samples/epics.md` and the Tally example use
    - one `## E-01: <name>` section per epic, with no tag on a heading
    - six fields in order, each starting on a line with its bold label and the colon inside the bold. The first non-blank line under the heading is `**Outcome:**`.
    - the three ID fields plain and comma-separated. `**Depends on:**` holds `None` or epic IDs, and `**Spine decisions:**` holds `None` or S- IDs.
  - **Done when (D-02, D-03):** a `- ` list on the lines below its label, with nothing on the label line, one item per bullet and 2 to 5 items.
    - One item is the integrated item. Copy its words exactly from `docs/FORMAT.md` into a fenced block introduced with "exactly these words".
    - At least one other item is the epic's own.
  - **No quotes (D-05):** epics don't follow the quote-or-tag rule. An epic's source is its `**Requirements:**` and `**Spine decisions:**` IDs, so it carries no `> ` lines.
    - `[ASSUMPTION]` stays allowed, not required, in Outcome, Boundaries and Done when.
    - It never goes in an ID field or on a heading.
  - **Example:** one fenced block for a coined project, two epics in the fixed shape, each with the integrated item. The spine example's Gristmill would do. The executor writes it, and it isn't the owner's words.
    - Its citations follow D-09 against that project's spine example, so it never teaches a pattern Task 4's rules forbid: both epics cite every `design approach`, `stack` and `hosting` decision the spine example holds, and every S- ID it holds is cited by at least one epic.
    - With Gristmill, both epics cite S-02, the design approach, and at least one cites S-01.
  - **Next:** then run "The epics check".
- **Verify:**
  - **Testing scope:** the graders in Plans 4 and 5 prove this by eval. Text checks that fail today, plus the pinned test, are enough, and testing stops there.
  - (1) `grep -c 'Everything built so far, this epic included' skills/seldon/SKILL.md` prints at least 1. It prints 0 today. A `node -e` script confirms that the fenced line in SKILL.md, minus any leading `- `, equals the item's words in `docs/FORMAT.md`.
  - (2) `grep -c '^## 19\. The epics draft' skills/seldon/SKILL.md` prints 1. It prints 0 today.
  - (3) "19. The epics draft" says four things:
    - Write only creates a missing `epics.md`.
    - Done-when is a 2-to-5 `- ` list.
    - Epics carry no `> ` quotes.
    - The tag never goes in an ID field.
  - (4) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.
  - (5) In the section (`perl -ne 'print if /^## 19\./../^## 21\./' skills/seldon/SKILL.md`), `grep -c '^\*\*Spine decisions:\*\* .*S-02'` prints 2 and `grep -c '^\*\*Spine decisions:\*\* .*S-01'` prints at least 1, if the example is Gristmill's. For another spine example, the plan report shows that example's citations meet the rule above.

### Task 4: Order epics for building and cite the spine

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#19. The epics draft, docs/FORMAT.md#epics.md, samples/epics.md, samples/spine.md
- **Decisions:** D-06, D-09, D-07
- **Pins:** tests/skill.test.mjs
- **Action:** "19. The epics draft" gains build order and citations.
  - **Build order (D-06):** file order is build order.
    - Epics carrying the requirement IDs the PRD's MVP scope names come before the rest.
    - An epic depends only on epics before it. `**Depends on:**` names each earlier epic it builds on, or `None`.
    - A first draft numbers epics from E-01 upward in file order.
  - **Citations (D-09):** `/cad-context` locks each epic's spine decisions, so:
    - Every S- ID in the spine is cited by at least one epic.
    - Every epic cites every `design approach`, `stack` and `hosting` decision.
    - A split's epics on both sides cite the boundary, as "The epics step" says (D-07).
  - **Only real IDs:** cite only S- IDs that are decisions in `spine.md`, and list only requirement IDs that `prd.md` declares. The check reads spelling, never whether an ID is declared (D-12), so this rule is the step's to keep.
- **Verify:**
  - **Testing scope:** Plan 4's epics-from-spine graders prove the citations by eval. Text checks that fail today, plus the pinned test, are enough, and testing stops there.
  - (1) Inside "19. The epics draft" (`perl -ne 'print if /^## 19\./../^## 21\./' skills/seldon/SKILL.md`, since 20 isn't there yet), `grep -c 'MVP'` and `grep -c 'hosting'` each print at least 1. Task 3's text names neither, so each prints 0 before this task.
  - (2) Joined, the same section holds `design approach`, and a sentence saying every S- ID in the spine is cited by at least one epic.
  - (3) `node --test tests/skill.test.mjs` passes, and `claude plugin validate --strict .` exits 0.

## Notes

- **The split into Plan 3:** Plans 2 and 3 were one plan, whose brief passed the 32 KB ceiling. This plan writes sections 18 and 19, and Plan 3 adds section 20, the rerun and the routes, in the same task order as before.
- **A pointer ahead of its section:** "The epics draft" ends by naming "The epics check", which Plan 3's Task 1 adds. No run reaches the epics step before Plan 3's Task 3 wires it, because until then `/seldon epics` and the resume still end on the old later-release line, so no run follows the pointer before its section exists.
