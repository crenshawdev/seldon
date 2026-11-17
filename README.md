# Seldon

Seldon is a Claude Code plugin that does the design work before [Cadence](https://github.com/crenshawdev/cadence) builds anything. It interviews you about what you want to build, then writes a brief, a PRD, an architecture spine and a set of epics. Cadence turns each epic into a phase and builds it.

Cadence starts at requirements and a roadmap, and nothing in it decides how the system breaks apart. Without boundaries that are already fixed, phases come out big, and a big phase makes the planner read too much and plan worse. Seldon fixes the boundaries first, so small phases are what you get by default.

It's for a developer who knows what they want to build and wants help thinking it through. It isn't for typing one prompt and walking away.

The method is inspired by BMad: the planning half of an analyst, a product manager, an architect and a product owner. Seldon writes its own prompts, uses no personas and needs no installer.

## What it writes

Everything goes in `.planning/seldon/`, in four files:

- `brief.md`: the problem, the solution, who it serves, what's different, success criteria, scope, what it refuses and vision
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

In this release `/seldon` writes the brief and then the PRD. For the brief it reads your dump, plus `docs/design/` or any folder the dump names, and it never writes to that folder. Then it recommends one of two paths and writes nothing until you confirm one or pick the other. It recommends the fast path when the dump already answers most of what a brief needs and the stakes are modest. Before drafting, the fast path asks only what the dump left open that only you can decide, which always includes who the project is for and what it refuses when the dump doesn't say. Then it drafts the brief and tags each guess `[ASSUMPTION]` for you to check. It recommends coaching when much is still open or the stakes are high, and coaching asks one question per turn until the brief is settled. Either way it writes `.planning/seldon/brief.md` and runs the format check on it.

Every step ends the same way. Seldon runs the step's check, repeats its result line and asks whether you confirm the document or want changes. Once you confirm, it suggests `/clear` and then `/seldon` for the next step. The clear is never required.

The walk lives in the files, so it survives a `/clear`. A bare `/seldon` starts at the first step whose document isn't in `.planning/seldon/` yet, and first names the file it's building from. When a brief is already there and you give `/seldon` a new dump, it writes nothing and asks whether to rerun the brief with that text or go on from the brief that's there.

The PRD step builds from `brief.md` alone, never the conversation or a design folder, and writes `.planning/seldon/prd.md`. The PRD holds requirements with stable IDs, non-functional requirements, user journeys, non-goals that carry the brief's refusals, and the MVP scope. It's sized to the stakes the brief shows, quotes your words, tags each guess `[ASSUMPTION]` and names no technology, because that belongs to the spine. Then it runs the PRD check.

`/seldon brief` and `/seldon prd` rerun one step. A brief rerun takes your change, keeps every item the change doesn't touch and leaves the PRD alone, even when the PRD is now out of date. A PRD rerun also reads the existing `prd.md`, to keep its IDs: a requirement the change doesn't touch keeps its line and its ID, and a dropped ID goes on a `Retired:` line so it's never used again. `/seldon spine` and `/seldon epics` come in a later release, and until then they write nothing.

Every question Seldon asks is plain prose that ends its turn, never a menu, so a saved conversation can be replayed in a test.

## Evals

The eval cases live in `evals/`. Run them locally from the repository root:

```
claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"
```

The two `--allow-tools` rules are the whole grant. Seldon can write only inside `.planning/seldon/` and run only its own check, and nothing broader. Run from the root, `$PWD` is this repository, so the rule names the same `lib/check.mjs` the skill runs. `--scaffold` runs the case scripts that copy fixtures from `samples/` into the run, and `tests/scaffold.test.mjs` allows them nothing more. Apart from the shebang, `set -euo pipefail` and the line that finds the repository, every line must be `mkdir -p` or `cp [-R]` from `"$repo/samples/..."`, with targets inside the run. Any other line fails the test. So does a `case.yaml` that names its scaffold in a form the test can't read.

- `fast-path` gives Seldon a full project description and checks that it recommends the fast path without asking through a menu.
- `replay` resumes a saved `/seldon` session and checks that the reply uses a fact only that session holds.
- `fast-path-brief` confirms the fast path and checks that Seldon writes a brief that tags its guesses, says what the project refuses and passes the check.
- `no-dump` runs a bare `/seldon` and checks that it asks for the dump in plain prose and writes nothing.
- `asks-for-dump` answers that ask with a dump and checks that Seldon recommends a path and writes nothing.
- `asks-who-for` confirms the fast path on a dump that never says who the project is for, and checks that Seldon asks that before writing anything.
- `coaching-brief` answers the last coaching question and checks that the brief quotes the user's answers and passes the check.
- `write-scope` asks for the brief in `docs/` with a README link, and checks that Seldon writes only inside `.planning/seldon/`.
- `design-folder` points the dump at a design folder and checks that Seldon names the project only that folder names, with no edit, no write outside `.planning/seldon/` and no command but the check.
- `existing-brief` runs `/seldon` where a brief is already there and checks that it writes and edits nothing and says a rerun comes later.

Results go to `evals/results/`, which git ignores.

## License

MIT, copyright John Crenshaw. See [LICENSE](LICENSE).
