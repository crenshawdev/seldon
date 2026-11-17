# Seldon

Seldon is a Claude Code plugin that does the design work before [Cadence](https://github.com/crenshawdev/cadence) builds anything. It interviews you about what you want to build, then writes a brief, a PRD, an architecture spine and a set of epics. Cadence turns each epic into a phase and builds it.

Cadence starts at requirements and a roadmap, and nothing in it decides how the system breaks apart. Without boundaries that are already fixed, phases come out big, and a big phase makes the planner read too much and plan worse. Seldon fixes the boundaries first, so small phases are what you get by default.

It's for a developer who knows what they want to build and wants help thinking it through. It isn't for typing one prompt and walking away.

The method is inspired by BMad: the planning half of an analyst, a product manager, an architect and a product owner. Seldon writes its own prompts, uses no personas and needs no installer.

## What it writes

Everything goes in `.planning/seldon/`, in four files:

- `brief.md`: the problem, the solution, who it serves, what's different, success criteria, scope and vision
- `prd.md`: capabilities with stable requirement IDs, non-functional requirements, user journeys, non-goals and MVP scope
- `spine.md`: only the architecture decisions that would clash if two parts were built separately, each with a stable ID
- `epics.md`: epics in build order, each sized so one Cadence planner can hold it

[docs/FORMAT.md](docs/FORMAT.md) fixes the format of each file, and `samples/` holds a set that follows it. Seldon writes nowhere else. A design folder your project already has is input it reads, never a place it writes.

## Install

This repository is its own marketplace, so the plugin id is `seldon@seldon`. In Claude Code:

```
/plugin marketplace add crenshawdev/seldon
/plugin install seldon@seldon
```

## Using it

Run `/seldon` (`/seldon:seldon` also works) followed by whatever you have: the idea, notes, a half-written spec.

In this release `/seldon` reads that dump and recommends one of two paths. On the fast path it would draft the documents itself and tag each guess for you to check, and it recommends that when the dump already answers most of what a brief needs and the stakes are modest. Coaching walks through each decision with you, and it recommends that when much is still open or the stakes are high. You confirm the path or pick the other one. It doesn't write anything yet. The brief step comes next.

Every question Seldon asks is plain prose that ends its turn, never a menu, so a saved conversation can be replayed in a test.

## Evals

The eval cases live in `evals/`. Run them locally from the repository root:

```
claude plugin eval . --trust-plugin --no-publish --ablation none
```

`fast-path` gives Seldon a full project description and checks that it recommends the fast path without asking through a menu. `replay` resumes a saved `/seldon` session and checks that the reply uses a fact only that session holds. Results go to `evals/results/`, which git ignores.

## License

MIT, copyright John Crenshaw. See [LICENSE](LICENSE).
