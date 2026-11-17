# Seldon brief

Input for `/cad-new-project --brief BRIEF.md`. Every decision below was settled with John on 2026-11-16.

## What it is

Seldon is a Claude Code plugin in the Foundation suite. It sits in front of Cadence and does the design work Cadence doesn't: it interviews the developer, then writes a brief, a PRD, an architecture spine and a set of epics. Cadence turns each epic into a phase and builds it.

It exists because Cadence starts at requirements and a roadmap, and nothing decides how the system breaks apart. Without set boundaries, phases come out big, and a big phase makes the planner read too much and plan worse. Cadence's own phase 1 of the 4.4.0 cycle held 86 items, and its plan review found 32 problems. Seldon fixes the boundaries first, so small phases become the default without the user having to think of it.

It's for the developer who designs with it, someone who knows what they want to build and wants help thinking it through. It's not for a user who wants to type a prompt and walk away.

## Method

It follows the BMad Method's planning half (analyst, PM, architect, product owner) and writes its own prompts. It copies none of BMAD's files, uses no personas, and needs no installer. The README credits it as "inspired by BMad", which BMAD's TRADEMARK.md permits. "BMad" can't appear in Seldon's name or branding.

## How it runs

- One command, `/seldon` (`/seldon:seldon` always works). It walks brief, PRD, spine, then epics, and stops after each step for the user to confirm. It picks up where it left off after a `/clear`. `/seldon <step>`, such as `/seldon prd`, reruns one step to update its document.
- Each step reads only the documents before it, never the earlier conversation. Seldon suggests a `/clear` between steps.
- How much to ask follows BMAD's order. The user first dumps what they have, Seldon reads the stakes from it and recommends a fast path (draft with guesses tagged `[ASSUMPTION]`) or coaching (walk each decision), and the user confirms.
- The interview asks the questions the user wouldn't think to ask.

## What it writes

Everything goes in `.planning/seldon/`. A design folder the project already has, such as `docs/design/`, is read as input and never written to.

- **Brief:** problem, solution, who it serves, what's different, success criteria, scope, vision. The brief path only; the PRFAQ path is not included.
- **PRD:** capabilities, not implementation. Requirements with stable IDs, non-functional requirements, user journeys, non-goals, MVP scope. It's sized to the stakes.
- **Architecture spine:** only the decisions that would clash if two parts were built separately (design approach, boundaries, how state changes, who owns shared data, stack, hosting), each with a stable ID. On top of BMAD's list, it asks about trust boundaries, failure, and what runs unattended, each only when the design has the part it concerns. The full architecture document is written only on request, because a full document goes stale against the code.
- **Epics:** in build order, each with its outcome, boundaries, done-when, dependencies, and the spine decisions it relies on, by ID. Each epic is sized so one Cadence planner can hold it. Seldon keeps BMAD's boundary rule ("one source capability, or a tightly coupled pair") and splits any bigger epic along the spine's boundaries. Seldon stops at epics; Cadence's planner writes the plans.
- **UX:** not in the first version.

Before the handoff, one readiness check runs: an independent agent reads the PRD, spine and epics together, looking for requirements no epic covers, epics that cross a boundary the spine didn't fix, and decisions left open. The user sees what it finds.

## Handoff to Cadence

Cadence stays the only writer of its own files. On a new project, `/cad-new-project` reads `.planning/seldon/`, builds REQUIREMENTS from the PRD and the roadmap from the epics, and asks only about gaps. On a project already under Cadence, the epics become new phases through `/cad-milestone` or `/cad-phase`, and the architect reads the existing code and records its conventions. `/cad-context` brings in each epic's spine decisions as locked decisions, so the planner can't reopen a settled boundary.

When requirements change, rerunning `/seldon prd` updates the PRD and shows which earlier decisions the change conflicts with before applying anything. The handoff changes only phases Cadence hasn't started. A built phase is never rewritten; a change to one becomes a new phase.

The Cadence side (`--brief` taking the Seldon folder, `/cad-milestone` and `/cad-phase` reading epics, `/cad-context` locking spine decisions) is built in the Cadence repository as the first phase of this project.

## Testing

`claude plugin eval` can't play a simulated user. Each eval case gives Seldon a full project description up front, so it takes the fast path with nothing to ask, and graders check the output: every document present, PRD requirement IDs traced into epics, every epic within one planner's size, the readiness check passing. Single interview turns are covered by replaying saved conversations through `context.history_file`. Everything runs in CI, with nothing for a person to check by hand.

## Project facts

- Repository `crenshawdev/seldon`, local at `/code/seldon`. It gets listed as a third plugin in the Foundation marketplace (`/code/foundation/.claude-plugin/marketplace.json`) once it's published.
- Code is JavaScript on Node, like Cadence. No Python, no `uv`.
- License: MIT, copyright John Crenshaw.
- Out of scope: remembering a user across projects.
