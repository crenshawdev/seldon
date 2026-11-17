# Seldon

## What This Is

Seldon is a Claude Code plugin in the Foundation suite that does the design work before Cadence builds anything. It interviews the developer, then writes a brief, a PRD, an architecture spine and a set of epics, and Cadence turns each epic into a phase and builds it. It's for a developer who knows what they want to build and wants help thinking it through, someone who designs with it rather than typing a prompt and walking away.

## Core Value

Seldon fixes a system's boundaries before Cadence plans it, so every epic it hands over is small enough for one Cadence planner to hold and small phases become the default without the user having to think of it.

## Requirements

### Validated

(None yet - ship to validate)

### Active

Each of these is a hypothesis until it ships and proves itself.

- [ ] One command, `/seldon` (`/seldon:seldon` always works), walks brief, PRD, spine, then epics, and stops after each step for the user to confirm.
- [ ] `/seldon` picks up where it left off after a `/clear`.
- [ ] `/seldon <step>`, such as `/seldon prd`, reruns one step to update its document.
- [ ] Each step reads only the documents before it, never the earlier conversation, and Seldon suggests a `/clear` between steps.
- [ ] The user first dumps what they have. Seldon reads the stakes from it and recommends a fast path (a draft with guesses tagged `[ASSUMPTION]`) or coaching (walking each decision), and the user confirms which.
- [ ] The interview asks the questions the user wouldn't think to ask.
- [ ] The brief covers the problem, the solution, who it serves, what's different, success criteria, scope and vision.
- [ ] The PRD covers capabilities, not implementation: requirements with stable IDs, non-functional requirements, user journeys, non-goals and MVP scope, sized to the stakes.
- [ ] The architecture spine holds only the decisions that would clash if two parts were built separately (design approach, boundaries, how state changes, who owns shared data, stack, hosting), each with a stable ID. It also asks about trust boundaries, failure and what runs unattended, each only when the design has the part it concerns.
- [ ] On a project already under Cadence, the architect reads the existing code and records its conventions in the spine as decisions with stable IDs.
- [ ] The full architecture document is written only when the user asks for it.
- [ ] Epics come in build order, each with its outcome, boundaries, done-when, dependencies and the spine decisions it relies on, by ID.
- [ ] Each epic carries at most 5 PRD requirement IDs and at most 5 done-when items. An epic that breaks the size limit or the boundary rule (one source capability, or a tightly coupled pair) is split along the spine's boundaries.
- [ ] Before the handoff, one readiness check runs: an independent agent reads the PRD, spine and epics together, looking for requirements no epic covers, epics that cross a boundary the spine didn't fix, and decisions left open. The user sees what it finds and chooses to fix it (rerunning the step it names) or hand off as is.
- [ ] When `/seldon prd` changes the PRD, Seldon shows which earlier decisions the change conflicts with before applying anything, and the next `/seldon` resumes at the spine and walks spine and epics again.
- [ ] Everything Seldon writes goes in `.planning/seldon/`. A design folder the project already has, such as `docs/design/`, is read as input and never written to.
- [ ] The `.planning/seldon/` document format is fixed, with sample files Cadence's reader can be built against.
- [ ] `claude plugin eval` cases give Seldon a full project description up front, so it takes the fast path with nothing to ask, and graders check that every document is present, PRD requirement IDs trace into epics, every epic is within the size limit and the readiness check passes.
- [ ] Single interview turns are covered by replaying saved conversations through `context.history_file`.
- [ ] Every eval runs in CI, with nothing for a person to check by hand.
- [ ] The README credits the method as "inspired by BMad".

### Out of Scope

- A UX step - not in the first version.
- The PRFAQ path for the brief - the brief path only.
- A full architecture document by default - a full document goes stale against the code, so it's written only on request.
- Writing plans - Seldon stops at epics, and Cadence's planner writes the plans.
- Writing Cadence's files - Cadence stays the only writer of its own files.
- Rewriting a built phase - a change to one becomes a new phase.
- BMAD's files, personas and installer - Seldon follows the method's planning half with prompts of its own.
- "BMad" in Seldon's name or branding - BMAD's TRADEMARK.md permits the "inspired by BMad" credit, not the name.
- Remembering a user across projects - ruled out in the brief, with no reason recorded.
- Building the Cadence side in this repository - each repository keeps its own Cadence state, so that work is a Cadence phase in the Cadence repository.

## Context

**Why it exists.** Cadence starts at requirements and a roadmap, and nothing decides how the system breaks apart. Without set boundaries, phases come out big, and a big phase makes the planner read too much and plan worse. Phase 1 of Cadence's 4.4.0 cycle held 86 items, and its plan review found 32 problems. Seldon fixes the boundaries first.

**Method.** Seldon follows the BMad Method's planning half (analyst, PM, architect, product owner), keeps its boundary rule for epics ("one source capability, or a tightly coupled pair") and its order for how much to ask, and writes its own prompts.

**Handoff to Cadence.** Cadence stays the only writer of its own files. On a new project, `/cad-new-project` reads `.planning/seldon/` (its `--brief` taking the Seldon folder), builds REQUIREMENTS from the PRD and the roadmap from the epics, and asks only about gaps. On a project already under Cadence, the epics become new phases through `/cad-milestone` or `/cad-phase`. `/cad-context` brings in each epic's spine decisions as locked decisions, so the planner can't reopen a settled boundary. The handoff changes only phases Cadence hasn't started.

**The Cadence side.** Those Cadence changes are built in the Cadence repository (`/code/cadence`, `crenshawdev/cadence`), which keeps its own roadmap. They were kept out of Cadence's 4.4.0 prose cycle and go on Cadence's roadmap as a Cadence phase after 4.4.0 ships, built against the sample files Seldon's first phase produces. Nothing in this project runs Cadence commands in that repository.

**Cadence's own size limits.** `/cad-plan` flags a phase naming more than 12 requirements before it starts a planner (`--max-reqs 12`), and `/cad-new-project` gives every roadmap phase 2 to 5 success criteria. Seldon's epic limits sit under both, so an epic needs no reshaping at the handoff.

**Testing.** `claude plugin eval` can't play a simulated user, which is why the eval cases take the fast path and interview turns are tested by replaying saved conversations.

**Distribution.** Once published, Seldon is listed as the third plugin in the Foundation marketplace (`/code/foundation/.claude-plugin/marketplace.json`). Publishing is public and goes to John.

**Current state.** No code yet. The repository `crenshawdev/seldon` was created private on 2026-11-16, and `BRIEF.md` holds the design brief this project was initialized from.

## Constraints

- **Tech stack**: JavaScript on Node, like Cadence - no Python, no `uv`.
- **Packaging**: a Claude Code plugin - no installer.
- **License**: MIT, copyright John Crenshaw.
- **Naming**: "BMad" can't appear in Seldon's name or branding - the README credits it as "inspired by BMad".
- **File ownership**: Seldon writes only `.planning/seldon/` - Cadence stays the only writer of its own files, and an existing design folder is read-only input.
- **Testing**: everything runs in CI through `claude plugin eval` - nothing for a person to check by hand.
- **Dependency**: the handoff needs a Cadence phase after 4.4.0 ships - the Cadence side isn't built here.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Follow the BMad Method's planning half with Seldon's own prompts, no BMAD files, no personas, no installer | The method's order works; its files and branding aren't Seldon's to ship | - pending |
| One `/seldon` command walks brief, PRD, spine, epics, stopping after each for the user to confirm | One entry point, with the user deciding at every step | - pending |
| Each step reads only the documents before it, never the earlier conversation | A step's input is fixed on disk, so a `/clear` between steps loses nothing | - pending |
| Seldon recommends fast path or coaching from the stakes in the user's first dump, and the user confirms | BMAD's order for how much to ask | - pending |
| The spine holds only decisions that would clash if two parts were built separately; the full architecture document is on request | A full document goes stale against the code | - pending |
| An epic carries at most 5 PRD requirement IDs | A starting value with no data behind it, chosen to match the done-when cap; tune it from the eval runs | - pending |
| An epic's done-when is capped at 5 | Fits Cadence's 2 to 5 success criteria per phase with no reshaping at the handoff | - pending |
| Readiness check findings are shown, and the user fixes or hands off | Matches how Cadence treats its own size checks: a report, not a gate | - pending |
| After `/seldon prd` changes the PRD, the next `/seldon` resumes at the spine and walks spine and epics again | Each step reads only the documents before it, so a spine left over from the old PRD would feed stale boundaries into the handoff | - pending |
| An existing project's conventions go in the spine as decisions with stable IDs | `/cad-context` locks them the same way it locks every other spine decision | - pending |
| Seldon's first phase fixes the `.planning/seldon/` format with sample files; the Cadence side is a Cadence phase after 4.4.0 | Each repository keeps its own Cadence state, the reader gets built against a format that exists, and the work stays out of the 4.4.0 prose cycle | - pending |
| Everything Seldon writes goes in `.planning/seldon/` | Cadence stays the only writer of its own files, and an existing design folder is never touched | - pending |
| A built phase is never rewritten; a change to one becomes a new phase | Shipped work stays as built | - pending |
| Eval cases take the fast path, and interview turns are tested by replaying saved conversations | `claude plugin eval` can't play a simulated user | - pending |
| No UX step and no PRFAQ path in the first version | Kept out of the first version's scope | - pending |

---
*Last updated: 2026-11-16 after initialization*
