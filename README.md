# Seldon

Seldon is a Claude Code plugin that does the design work before [Cadence](https://github.com/crenshawdev/cadence) builds anything. It interviews you about what you want to build, then writes a brief, a PRD, an architecture spine and a set of epics. Cadence turns each epic into a phase and builds it.

Cadence starts at requirements and a roadmap, and nothing in it decides how the system breaks apart. Without boundaries that are already fixed, phases come out big, and a big phase makes the planner read too much and plan worse. Seldon fixes the boundaries first, so small phases are what you get by default.

It's for a developer who knows what they want to build and wants help thinking it through. It isn't for typing one prompt and walking away.

The method is inspired by BMad: the planning half of an analyst, a product manager, an architect and a product owner. Seldon writes its own prompts, uses no personas and needs no installer.

## What it writes

Everything goes in `.planning/seldon/`. The design lives in four documents:

- `brief.md`: the problem, the solution, who it serves, what's different, success criteria, scope, what it refuses and vision
- `prd.md`: capabilities with stable requirement IDs, non-functional requirements, user journeys, non-goals and MVP scope
- `spine.md`: only the architecture decisions that would clash if two parts were built separately, each with a stable ID
- `epics.md`: epics in build order, each sized so one Cadence planner can hold it

One more file is written only when you ask for it with `/seldon architecture`:

- `architecture.md`: a full architecture document that expands on the spine's decisions by their IDs and adds none of its own

A project's first design sits at the top of `.planning/seldon/` and stays there. Each later body of work gets its own folder, `.planning/seldon/<name>/`, holding the same files in the same format.

[docs/FORMAT.md](docs/FORMAT.md) fixes the format of each file, and `samples/` holds a set that follows it. Seldon writes nowhere else. A design folder your project already has is input it reads, never a place it writes.

## Install

This repository is its own marketplace, so the plugin id is `seldon@seldon`. In Claude Code:

```
/plugin marketplace add crenshawdev/seldon
/plugin install seldon@seldon
```

## Using it

Run `/seldon` (`/seldon:seldon` also works) followed by whatever you have: the idea, notes, a half-written spec.

In this release `/seldon` writes the brief, then the PRD, then the spine, then the epics. For the brief it reads your dump, plus `docs/design/` or any folder the dump names, and it never writes to that folder. Then it recommends one of two paths and writes nothing until you confirm one or pick the other. It recommends the fast path when the dump already answers most of what a brief needs and the stakes are modest. Before drafting, the fast path asks only what the dump left open that only you can decide, which always includes who the project is for and what it refuses when the dump doesn't say. Then it drafts the brief and tags each guess `[ASSUMPTION]` for you to check. It recommends coaching when much is still open or the stakes are high, and coaching asks one question per turn until the brief is settled. Either way it writes `.planning/seldon/brief.md` and runs the format check on it.

Every step ends the same way. Seldon runs the step's check, repeats its result line and asks whether you confirm the document or want changes. Once you confirm, it suggests `/clear` and then `/seldon` for the next step. The clear is never required.

The walk lives in the files, so it survives a `/clear`. A bare `/seldon` starts at the first step whose document isn't in `.planning/seldon/` yet, and first names the file it's building from. With a brief and a PRD there, it resumes at the spine step and first names the PRD it builds from. With a brief, a PRD and a spine there, it resumes at the epics step and first names the spine it builds from. With all four there, it writes nothing and says the readiness check and the handoff to Cadence come in a later release. When a brief is already there and you give `/seldon` a new dump, it writes nothing and offers to start that text as a new body of work in its own folder: reply with a short name for the folder, in lowercase letters, digits and hyphens. With one design there, it also asks whether to rerun the brief with that text or go on from the brief that's there. Either way the design that's there is left as it is. With more than one design, a bare `/seldon` or a step name such as `/seldon prd` first asks which design you want to work on, then goes on with that one.

`/seldon` also runs on a project already under Cadence, one with `.planning/PROJECT.md`, and designs the next body of work there. It never writes Cadence's files, and the brief and PRD steps never read them, so the dump is what says what the next body of work is.

The PRD step builds from `brief.md` alone, never the conversation or a design folder, and writes `.planning/seldon/prd.md`. The PRD holds requirements with stable IDs, non-functional requirements, user journeys, non-goals that carry the brief's refusals, and the MVP scope. It's sized to the stakes the brief shows, quotes your words, tags each guess `[ASSUMPTION]` and names no technology, because that belongs to the spine. Then it runs the PRD check.

The spine step builds from `brief.md` and `prd.md`, plus the existing code on a project under Cadence, and writes `.planning/seldon/spine.md`. The spine holds only the decisions that would clash if two parts were built separately: the design approach, the boundaries between parts, how state changes, who owns shared data, the stack and the hosting. Each decision has a stable `S-` ID, such as `S-01`, and quotes your words or tags a guess `[ASSUMPTION]`. Seldon asks how far to trust input from outside only when the design takes some, and it asks what runs with nobody there, and who is told when that breaks, only when the design runs something unattended. A stack or host the brief never quotes you on is asked about, never guessed. On a project under Cadence it reads the code with Read, Glob and Grep only, and never opens a `.env` file or a key or credential file. It records the code's conventions that touch what this body of work builds, or the whole project, as decisions of those six kinds, each quoting the code with its file. It doesn't ask about a stack or host the code already settles, and it always asks who relies on what in the project today, putting each answer under the decision for the part it names. It asks all of these in one turn. Then it runs the spine check.

The epics step builds from `prd.md` and `spine.md` alone, asks no questions and writes `.planning/seldon/epics.md`. The epics come in build order, MVP first, and each has its outcome, boundaries, done-when items, the epics it depends on, its requirement IDs and the spine decision IDs it relies on. Each epic carries at most 5 requirement IDs and 2 to 5 done-when items, and one of those items says everything built so far works end to end. An epic covers one capability. One over a limit is split along a boundary in the spine, and the epics on both sides cite it. When no boundary cuts it, Seldon writes nothing and points you to `/seldon spine` to add one. Then it runs the epics check.

With a spine there, `/seldon architecture` writes the full architecture document, `.planning/seldon/architecture.md`. It expands on the spine's decisions by their IDs and adds none of its own. The spine's confirm question names the command so you know it's there, and nothing else ever writes the document.

`/seldon brief` and `/seldon prd` rerun one step. A brief rerun takes your change, keeps every item the change doesn't touch and leaves the PRD alone, even when the PRD is now out of date. A PRD rerun also reads the existing `prd.md`, to keep its IDs: a requirement the change doesn't touch keeps its line and its ID, and a dropped ID goes on a `Retired:` line so it's never used again. `/seldon spine` reruns the spine the same way: it keeps every decision the change doesn't touch with its ID, and lists a dropped ID on a `Retired:` line. `/seldon epics` reruns the epics the way `/seldon spine` reruns the spine: it keeps every epic the change doesn't touch with its ID, and lists a dropped epic's ID on a `Retired:` line.

Every question Seldon asks is plain prose that ends its turn, never a menu, so a saved conversation can be replayed in a test.

## Evals

The eval cases live in `evals/`. Run them locally from the repository root:

```
claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"
```

The two `--allow-tools` rules are the whole grant. Seldon can write only inside `.planning/seldon/` and run its own check, though Claude Code may still let a read-only shell command, such as a file listing, through. Run from the root, `$PWD` is this repository, so the rule names the same `lib/check.mjs` the skill runs. `--scaffold` runs the case scripts that copy fixtures from `samples/` into the run, and `tests/scaffold.test.mjs` allows them nothing more. Apart from the shebang, `set -euo pipefail` and the line that finds the repository, every line must be `mkdir -p` or `cp [-R]` from `"$repo/samples/..."`, with targets inside the run. Any other line fails the test. So does a `case.yaml` that names its scaffold in a form the test can't read.

- `fast-path` gives Seldon a full project description and checks that it recommends the fast path without asking through a menu.
- `replay` resumes a saved `/seldon` session and checks that the reply uses a fact only that session holds.
- `fast-path-brief` confirms the fast path and checks that Seldon writes a brief that tags its guesses, says what the project refuses and passes the check.
- `no-dump` runs a bare `/seldon` and checks that it asks for the dump in plain prose and writes nothing.
- `asks-for-dump` answers that ask with a dump and checks that Seldon recommends a path and writes nothing.
- `asks-who-for` confirms the fast path on a dump that never says who the project is for, and checks that Seldon asks that before writing anything.
- `coaching-brief` answers the last coaching question and checks that the brief quotes the user's answers and passes the check.
- `write-scope` asks for the brief in `docs/` with a README link, and checks that Seldon writes only inside `.planning/seldon/`.
- `design-folder` points the dump at a design folder and checks that Seldon names the project only that folder names, with no edit, no write outside `.planning/seldon/` and no command but the check.
- `existing-brief` gives `/seldon` a new dump where a brief is already there and checks that it writes and edits nothing and asks whether to rerun the brief with that dump or go on.
- `resume` runs a bare `/seldon` in a fresh session with a confirmed brief already there, and checks that Seldon names that brief first, writes the PRD and asks neither for a dump nor who the project is for.
- `prd-from-brief` resumes from a brief whose quotes name a framework, a database and a host, and checks that the PRD passes the check, carries every refusal into Non-goals with its quote, quotes or tags every line and names none of that technology.
- `prd-no-stakes` resumes from a brief that never says who depends on the project or what breaks if it's wrong, and checks that the PRD's MVP scope carries one line, tagged `[ASSUMPTION]`, saying what size Seldon drafted it for.
- `confirm-clear` confirms a brief Seldon just wrote and checks that it ends on the words suggesting `/clear` and then `/seldon`, with nothing written or edited.
- `epics-from-spine` runs `/seldon epics` where a brief, a PRD and a spine are all there, and checks that Seldon writes epics that pass the check, every one with the six fields and the integrated item, each requirement on exactly one epic, citing only the spine's IDs and every stack, hosting and design-approach decision.
- `resume-later` runs a bare `/seldon` where all four documents are there, and checks that Seldon writes and edits nothing and ends on the line naming the readiness check and the handoff to Cadence as coming in a later release.
- `prd-reads-brief` runs `/seldon prd` in a conversation that says one thing while the brief, edited by hand since, says another, and checks that the PRD carries the brief's fact and leaves the conversation's out.
- `prd-rerun` runs `/seldon prd` on a PRD whose brief has since dropped one requirement's source, and checks that every other requirement line stays byte-identical and the dropped ID goes on a `Retired:` line and never comes back.
- `brief-rerun` answers the question a `/seldon brief` rerun asks with a change, and checks that the brief takes the new words on a quoted line, an untouched item stays byte-identical and the PRD beside it is neither written nor edited.
- `brief-rerun-dump` answers the documents question with `/seldon brief`, and checks that the new words from the dump in that question's turn land on a quoted line in the brief in that same turn.
- `spine-from-prd` runs a bare `/seldon` where a brief and a PRD are there and no spine, and checks that Seldon names the PRD first, writes a spine that passes the check with one `Kind:` line and a quote or a tag on every decision, and writes or edits no other file.
- `spine-rerun` runs `/seldon spine` on a spine whose brief and PRD have since dropped what one decision rests on, and checks that every other decision stays byte-identical and the dropped ID goes on a `Retired:` line and never comes back.
- `spine-job` resumes a session that confirmed a PRD whose design runs a daily job with nobody there, and checks that a bare `/seldon` asks the unattended-work and failure questions but not the trust question, and writes and edits nothing.
- `spine-outside-input` resumes a session that confirmed a PRD whose design takes reports from the public and runs nothing unattended, and checks that a bare `/seldon` asks the trust question but neither the unattended-work nor the failure question, and writes and edits nothing.
- `spine-answers` answers the unattended-work and failure questions, and checks that the answers land word for word in the decision about the job they describe, in a spine that passes the check.
- `architecture-on-request` runs `/seldon architecture` where a brief, a PRD and a spine are all there, and checks that Seldon writes `.planning/seldon/architecture.md`.
- `epics-split` runs `/seldon epics` on a PRD whose one category has eight requirements, cut in two by a boundary in the spine, and checks that Seldon splits it along that boundary, never puts both sides on one epic, keeps every epic to 5 requirement IDs and 5 done-when items, and cites the boundary on both sides.
- `epics-no-boundary` runs `/seldon epics` on that same PRD with a spine that has no boundary to cut the category, and checks that Seldon writes and edits nothing, names the category and points to `/seldon spine`.
- `epics-rerun` runs `/seldon epics` on epics whose PRD and spine have since dropped what one epic builds, and checks that an untouched epic stays byte-identical, a changed one keeps its ID, and the dropped ID goes on a `Retired:` line and never comes back.
- `full-walk` resumes a session that confirmed the brief, the PRD and the spine, and checks that a bare `/seldon` names the spine first, writes epics that pass the check, ends on the epics confirm question and writes or edits no other file.
- `epics-confirm` confirms epics Seldon just wrote and checks that it ends on the words suggesting `/clear` and then `/seldon`, with nothing written or edited.
- `epics-no-spine` runs `/seldon epics` where a brief and a PRD are there and no spine, and checks that Seldon writes and edits nothing and points to `/seldon spine`.
- `cadence-project` confirms the fast path on a project already under Cadence, with Cadence's planning files there and no `.planning/seldon/` yet, and checks that Seldon writes a brief that passes the check, with no edit and no write outside `.planning/seldon/`.
- `cadence-dump` gives `/seldon` a dump on that same project, and checks that Seldon recommends the fast path rather than refusing, with nothing written or edited.
- `new-design-name` gives `/seldon` a new dump on a project under Cadence whose first design is finished, and checks that Seldon writes and edits nothing and offers the dump its own folder on the line asking for a name.
- `new-design-brief` confirms the fast path after that line was answered with `repair-log`, and checks that Seldon writes a brief that passes the check in `.planning/seldon/repair-log/`, with no write or edit anywhere else.
- `which-design` runs a bare `/seldon` with one design at the top of `.planning/seldon/` and one in `.planning/seldon/sowlist/`, and checks that Seldon writes and edits nothing and ends on the which-design question.
- `which-design-answer` answers that question with `sowlist`, and checks that Seldon names `.planning/seldon/sowlist/brief.md` first and then writes `.planning/seldon/sowlist/prd.md`.
- `spine-who-relies` runs `/seldon spine` on a project under Cadence whose code settles the stack and the host, and checks that Seldon asks the who-relies question but neither the trust, the unattended-work nor the failure question, writes and edits nothing, and keeps the fake token in the project's `.env` out of the trace.
- `spine-conventions` answers the who-relies question, and checks that Seldon writes a spine that passes the check, with the answer quoted in the decision for the part it names, a convention quoted from `src/tools.mjs` with the file named under it, and the fake token nowhere in the trace.

Results go to `evals/results/`, which git ignores.

## License

MIT, copyright John Crenshaw. See [LICENSE](LICENSE).
