# Roadmap: Seldon v0.1.0

## Overview

Seldon gets built the way it tells others to build, in small phases with one capability each. Phase 1 fixes the `.planning/seldon/` document format with sample files, because every later step writes that format and Cadence's reader is built against it. It also stands up the eval harness, so every later phase proves its interactive behavior with eval cases it adds rather than with checks done by hand. Phases 2 to 5 then build the walk one document at a time: the brief, the PRD (along with resume and rerun), the spine, and finally the epics, which close the full walk. Phase 6 covers projects already under Cadence, and Phase 7 carries changes to the PRD through to the spine and epics. Phase 8 adds the readiness check and the handoff command. Phase 9 adds the full graders and a test that the suite command covers every case; the full suite runs once at release. One dependency sits outside this repository: the Cadence side (`--brief` taking the Seldon folder, `/cad-milestone` and `/cad-phase` reading epics, `/cad-context` locking spine decisions) is a Cadence phase after 4.4.0, built in the Cadence repository against phase 1's sample files.

## Phases

- [x] **Phase 1: The document format and eval harness** - Fix the .planning/seldon/ format with sample files, make the plugin install, and run the eval harness locally
- [x] **Phase 2: The brief** - /seldon takes the user's dump, confirms fast path or coaching, and writes the brief
- [x] **Phase 3: The PRD, resume and rerun** - The PRD builds from the brief alone, the walk survives a /clear, and any step can be rerun
- [x] **Phase 4: The architecture spine** - Record only the decisions that would clash if built separately, each with a stable ID
- [x] **Phase 5: Epics and the full walk** - Small epics in build order, and /seldon walks all four steps end to end
- [x] **Phase 6: Existing projects and design folders** - Design the next body of work under Cadence in its own folder, with the spine reading the existing code
- [x] **Phase 7: PRD changes flow downstream** - Show what a PRD change conflicts with, and walk the documents built from a changed one again
- [x] **Phase 8: Readiness check and handoff** - An independent check before the handoff, then the exact Cadence command to run
- [x] **Phase 9: The full graders** - The full graders check every run that writes what they grade, and a unit test proves the suite command covers every case

## Phase Details

### Phase 1: The document format and eval harness
**Goal:** Seldon's four documents have a fixed, documented format with sample files Cadence's reader can be built against, the plugin installs, and the eval harness runs locally.
**Depends on:** Nothing (first phase)
**Requirements:** DOCS-04, REL-01, EVAL-01, EVAL-03
**Success Criteria:**
1. A format document in the repository defines the brief, PRD, spine and epics files under `.planning/seldon/`: the sections each carries, how requirement IDs and spine decision IDs are spelled, and the fields every epic carries.
2. A sample set of all four documents sits in the repository, and the format check passes on it, while the same check on a sample epic missing a required field fails and names that field.
3. `claude plugin eval` runs locally with two sample cases passing: a fast-path case that gives Seldon a full project description up front, and a saved conversation replayed through `context.history_file`.
4. `claude plugin validate --strict .` passes, and the plugin installs from a local marketplace in the `plugin-validate` CI job.
5. The README credits the method as "inspired by BMad", and "BMad" appears in no plugin name, command name or manifest field.

### Phase 2: The brief
**Goal:** A user runs `/seldon` on a new project, dumps what they have, confirms fast path or coaching, and gets a brief in `.planning/seldon/`, proven by eval cases this phase adds.
**Depends on:** Phase 1
**Requirements:** FLOW-06, FLOW-07, DOCS-01, DOCS-03
**Success Criteria:**
1. A replayed conversation shows `/seldon` on a project with no `.planning/seldon/` asking for the user's dump, recommending the fast path or coaching, and writing nothing until the user confirms the choice.
2. A fast-path eval case shows the brief in `.planning/seldon/` carrying every section the format names (problem, solution, who it serves, what's different, success criteria, scope, what it refuses, vision), with every guess tagged `[ASSUMPTION]`.
3. A replayed conversation whose dump never says who the project is for shows Seldon asking about it before writing the brief.
4. An eval case with a `docs/design/` folder shows Seldon reading it, the folder byte-identical afterward, and nothing written outside `.planning/seldon/`.

### Phase 3: The PRD, resume and rerun
**Goal:** The PRD step builds from the brief alone, the walk survives a `/clear`, and any one step can be rerun, proven by eval cases this phase adds.
**Depends on:** Phase 2
**Requirements:** DOCS-02, FLOW-02, FLOW-03, FLOW-04
**Success Criteria:**
1. An eval case shows the PRD written after a confirmed brief carrying requirements with stable IDs, non-functional requirements, user journeys, non-goals and MVP scope, and naming no library, framework or hosting choice.
2. A replayed conversation shows `/seldon`, run after a confirmed brief and a `/clear`, starting at the PRD step without asking again for anything the brief answers.
3. An eval case shows a fact changed in the brief file appearing in the PRD after `/seldon prd`, and a fact said only in the earlier conversation not appearing.
4. An eval case shows a rerun of `/seldon prd` keeping the ID of every requirement that didn't change.
5. A replayed conversation shows Seldon suggesting a `/clear` when a step is confirmed.

### Phase 4: The architecture spine
**Goal:** The spine step records only the decisions that would clash if two parts were built separately, each with a stable ID, proven by eval cases this phase adds.
**Depends on:** Phase 3
**Requirements:** ARCH-01, ARCH-02, ARCH-04
**Success Criteria:**
1. An eval case shows the spine written from a confirmed PRD holding only decisions on design approach, boundaries, how state changes, who owns shared data, stack and hosting, each with a stable ID spelled as the format fixes.
2. Replayed conversations show a design with a background job getting a question about what runs unattended and how it fails, and a design with no unattended work getting neither question.
3. Replayed conversations show a design that takes input from outside the system getting a trust-boundary question, and one that takes none not getting it.
4. Eval cases show no full architecture document written unless the user asks, and one written to `.planning/seldon/` when they do.

### Phase 5: Epics and the full walk
**Goal:** The epics step writes small epics in build order, and `/seldon` walks all four steps end to end, proven by eval cases this phase adds.
**Depends on:** Phase 4
**Requirements:** EPIC-01, EPIC-02, FLOW-01
**Success Criteria:**
1. A replayed conversation shows `/seldon` on a new project walking brief, PRD, spine and epics in that order, and stopping after each until the user confirms it.
2. An eval case shows every epic listing its outcome, boundaries, done-when, dependencies and the spine decision IDs it relies on, with every spine ID it names present in the spine.
3. An eval case shows no epic carrying more than 5 PRD requirement IDs or more than 5 done-when items, and a capability that needs 8 requirements coming out as at least two epics, split along a spine boundary.

### Phase 6: Existing projects and design folders
**Goal:** Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds.
**Depends on:** Phase 5
**Requirements:** FLOW-05, ARCH-03
**Success Criteria:**
1. An eval case shows `/seldon` in a project whose `.planning/` already holds a Cadence roadmap starting a walk for the next body of work instead of refusing, with every Cadence file byte-identical afterward.
2. An eval case on such a project shows the spine recording conventions read from the existing code as decisions with stable IDs.
3. An eval case on a project that already holds a design shows a new body of work written to its own folder under `.planning/seldon/`, with the existing design byte-identical.

### Phase 7: PRD changes flow downstream
**Goal:** A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds.
**Depends on:** Phase 6
**Requirements:** CHECK-03, CHECK-04
**Success Criteria:**
1. A replayed conversation shows `/seldon prd`, when it changes a requirement a spine decision relies on, naming that decision by ID before writing anything, and writing nothing when the user declines.
2. A replayed conversation shows the next `/seldon` after an applied PRD change resuming at the spine step and walking spine and epics again.

### Phase 8: Readiness check and handoff
**Goal:** An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds.
**Depends on:** Phase 7
**Requirements:** CHECK-01, CHECK-02, FLOW-08
**Success Criteria:**
1. An eval case shows the readiness report naming, by ID, a PRD requirement no epic names, and naming an epic that crosses a boundary the spine didn't fix.
2. An eval case shows the readiness check running as a separate agent that reads only the PRD, spine and epics files.
3. Replayed conversations show choosing fix rerunning the step a finding names, and choosing hand off going ahead with the documents unchanged.
4. Eval cases show Seldon ending with `/cad-new-project` reading `.planning/seldon/` on a project with no Cadence roadmap, and with the `/cad-phase` or `/cad-milestone` command that adds the epics on a project that has one.

### Phase 9: The full graders
**Goal:** The full graders check every run that writes what they grade, and a unit test proves the README's suite command covers every case, with nothing for a person to check by hand.
**Depends on:** Phase 8
**Requirements:** EVAL-02, EVAL-04
**Success Criteria:**
1. The graders fail a run when a document is missing, a PRD requirement ID traces into no epic, an epic carries more than 5 requirement IDs, or the readiness check reports a finding.
2. One eval case drives one user turn, so no single case runs the whole walk. full-walk replays the fast path from a full project description through the spine confirm, and its graded turn's epics pass the document, trace and size graders. The clean handoff cases (resume-later, handoff-cadence, handoff-named, readiness-agent) pass the readiness-passes grader.
3. A unit test fails when the README's eval command carries a case filter or its case list doesn't match the case folders under `evals/`, so the documented command runs every case phases 1 to 8 added, with nothing for a person to check by hand. The one full run happens at release, after Cadence's reader of the Seldon folder ships.
4. No workflow under `.github/workflows/` runs the eval suite or references a model key.
