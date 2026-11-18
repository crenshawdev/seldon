# Requirements: Seldon

**Defined:** 2026-11-16
**Core Value:** Seldon fixes a system's boundaries before Cadence plans it, so every epic it hands over is small enough for one Cadence planner to hold and small phases become the default without the user having to think of it.

## Active

Committed scope. Each maps to exactly one roadmap phase.

### Flow

- [ ] **FLOW-01**: User can run `/seldon` (or `/seldon:seldon`) to walk brief, PRD, spine and epics in that order, and Seldon stops after each step until the user confirms it.
- [ ] **FLOW-02**: User can run `/seldon` after a `/clear`, and Seldon resumes at the first step not yet confirmed.
- [ ] **FLOW-03**: User can run `/seldon <step>` (`brief`, `prd`, `spine` or `epics`) to rerun that one step and update its document.
- [ ] **FLOW-04**: Each step reads only the documents written by the steps before it, never the earlier conversation, and Seldon suggests a `/clear` when a step is confirmed.
- [ ] **FLOW-05**: User can run `/seldon` on a project that already has `.planning/`, and Seldon designs the next body of work instead of refusing.
- [ ] **FLOW-06**: After the user dumps what they have, Seldon recommends the fast path (a draft with guesses tagged `[ASSUMPTION]`) or coaching (walking each decision) from the stakes it reads in the dump, and drafting starts only once the user confirms the choice.
- [ ] **FLOW-07**: User is asked about the decisions their dump left open that the next document needs, not only about what they already wrote.
- [ ] **FLOW-08**: Once the epics are confirmed and the readiness findings are settled, Seldon ends by giving the exact Cadence command for the handoff: `/cad-new-project` reading `.planning/seldon/` on a new project, or the `/cad-phase` or `/cad-milestone` command that adds the epics on a project already under Cadence.

### Documents

- [ ] **DOCS-01**: The brief step writes a brief covering the problem, the solution, who it serves, what's different, success criteria, scope, what it refuses (each refusal with its reason) and vision. Each item written from a user answer keeps that answer verbatim beside it as a quoted line.
- [ ] **DOCS-02**: The PRD step writes a PRD of capabilities, not implementation: requirements with stable IDs, non-functional requirements, user journeys, non-goals and MVP scope, sized to the stakes.
- [ ] **DOCS-03**: Seldon writes only inside `.planning/seldon/`, and reads a design folder the project already has, such as `docs/design/`, as input without writing to it.
- [ ] **DOCS-04**: The `.planning/seldon/` document format is fixed and documented, with sample files Cadence's reader can be built and tested against.

### Spine

- [ ] **ARCH-01**: The spine step writes only the decisions that would clash if two parts were built separately (design approach, boundaries, how state changes, who owns shared data, stack, hosting), each with a stable ID.
- [ ] **ARCH-02**: The spine step asks about trust boundaries, failure and what runs unattended, each only when the design has the part it concerns.
- [ ] **ARCH-03**: On a project already under Cadence, the spine records the existing code's conventions as decisions with stable IDs.
- [ ] **ARCH-04**: User can ask for a full architecture document, and Seldon writes one only on that request.

### Epics

- [ ] **EPIC-01**: The epics step writes epics in build order, each with its outcome, boundaries, done-when, dependencies and the spine decision IDs it relies on.
- [ ] **EPIC-02**: Every epic carries at most 5 PRD requirement IDs and at most 5 done-when items, and an epic over either limit, or covering more than one source capability (a tightly coupled pair counts as one), is split along the spine's boundaries.

### Checks

- [ ] **CHECK-01**: Before the handoff, an independent agent reads the PRD, spine and epics together and reports requirements no epic covers, epics that cross a boundary the spine didn't fix, and decisions left open.
- [ ] **CHECK-02**: User sees the readiness findings and chooses to fix them (rerunning the step a finding names) or hand off as is.
- [ ] **CHECK-03**: When `/seldon prd` changes the PRD, Seldon shows which earlier decisions the change conflicts with before applying anything.
- [ ] **CHECK-04**: After a PRD change, the next `/seldon` resumes at the spine and walks spine and epics again.

### Testing

- [ ] **EVAL-01**: `claude plugin eval` cases give Seldon a full project description up front, and Seldon takes the fast path with nothing to ask.
- [ ] **EVAL-02**: Eval graders check that every document is present, every PRD requirement ID traces into an epic, every epic is within the size limit and the readiness check passes.
- [ ] **EVAL-03**: Single interview turns are tested by replaying saved conversations through `context.history_file`.
- [ ] **EVAL-04**: Every eval runs locally under `/cad-verify`, with nothing for a person to check by hand.

### Release

- [ ] **REL-01**: The README credits the method as "inspired by BMad".

## v2 Requirements

Deferred. Tracked, not in the current roadmap.

None. Every core feature is in v1.

## Out of Scope

Explicit exclusions. The reason prevents scope creep later.

| Feature | Reason |
|---------|--------|
| A UX step | It comes later, per the brief |
| The PRFAQ path for the brief | The brief path only |
| Remembering a user across projects | John dropped it |
| Listing Seldon in the Foundation marketplace | It's public and edits another repository, so it's John's step when he publishes |
| A full architecture document by default | A full document goes stale against the code, so it's written only on request (ARCH-04) |
| Writing plans | Seldon stops at epics, and Cadence's planner writes the plans |
| Writing Cadence's files | Cadence stays the only writer of its own files |
| Rewriting a built phase | A change to one becomes a new phase |
| Building the Cadence side in this repository | It's a Cadence phase after 4.4.0, in the Cadence repository |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DOCS-04 | Phase 1 | Complete |
| EVAL-01 | Phase 1 | Complete |
| EVAL-03 | Phase 1 | Complete |
| REL-01 | Phase 1 | Complete |
| DOCS-01 | Phase 2 | Complete |
| FLOW-06 | Phase 2 | Complete |
| FLOW-07 | Phase 2 | Complete |
| DOCS-03 | Phase 2 | Complete |
| DOCS-02 | Phase 3 | Complete |
| FLOW-02 | Phase 3 | Complete |
| FLOW-04 | Phase 3 | Complete |
| FLOW-03 | Phase 5 | Complete |
| ARCH-01 | Phase 4 | Complete |
| ARCH-04 | Phase 4 | Complete |
| ARCH-02 | Phase 4 | Complete |
| EPIC-01 | Phase 5 | Complete |
| EPIC-02 | Phase 5 | Complete |
| FLOW-01 | Phase 5 | Complete |
| FLOW-05 | Phase 6 | Complete |
| ARCH-03 | Phase 6 | Complete |
| CHECK-03 | Phase 7 | Complete |
| CHECK-04 | Phase 7 | Complete |
| CHECK-01 | Phase 8 | Pending |
| CHECK-02 | Phase 8 | Pending |
| FLOW-08 | Phase 8 | Pending |

Bare headers - `/cad-plan` seeds a row per requirement when its phase is
planned (`references/req-traceability.md`).

---
*Last updated: 2026-11-16 after initialization*
