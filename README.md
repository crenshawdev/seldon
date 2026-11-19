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

`prd.md`, `spine.md` and `epics.md` each carry a stamp, one line under the title holding a hash of the file they were built from: the brief, the PRD and the spine. That's how Seldon tells when an earlier document has changed since, a hand edit included. The brief and `architecture.md` carry none.

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

In this release `/seldon` writes the brief, then the PRD, then the spine, then the epics, then checks the finished design and gives the command that hands it to Cadence. For the brief it reads your dump, plus `docs/design/` or any folder the dump names, and it never writes to that folder. Then it recommends one of two paths and writes nothing until you confirm one or pick the other. It recommends the fast path when the dump already answers most of what a brief needs and the stakes are modest. Before drafting, the fast path asks only what the dump left open that only you can decide, which always includes who the project is for and what it refuses when the dump doesn't say. Then it drafts the brief and tags each guess `[ASSUMPTION]` for you to check. It recommends coaching when much is still open or the stakes are high, and coaching asks one question per turn until the brief is settled. Either way it writes `.planning/seldon/brief.md` and runs the format check on it.

Every step ends the same way. Seldon runs the step's check, repeats its result line and asks whether you confirm the document or want changes. Once you confirm, it suggests `/clear` and then `/seldon` for the next step. The clear is never required.

The walk lives in the files, so it survives a `/clear`. A bare `/seldon` first checks those stamps. When a document has changed since the next one was built from it, Seldon says so, then reruns the earliest out-of-date step first, even ahead of a document that isn't there yet. The next `/seldon` takes the step after it. With nothing out of date, a bare `/seldon` starts at the first step whose document isn't in `.planning/seldon/` yet, and first names the file it's building from. With a brief and a PRD there, it resumes at the spine step and first names the PRD it builds from. With a brief, a PRD and a spine there, it resumes at the epics step and first names the spine it builds from. With all four there and none out of date, a bare `/seldon` runs the readiness check. A step name such as `/seldon spine` runs that step without the stamp check. When a brief is already there and you give `/seldon` a new dump, it writes nothing and offers to start that text as a new body of work in its own folder: reply with a short name for the folder, in lowercase letters, digits and hyphens. With one design there, it also asks whether to rerun the brief with that text or go on from the brief that's there. Either way the design that's there is left as it is. With more than one design, a bare `/seldon` or a step name such as `/seldon prd` first asks which design you want to work on, naming each by its brief's title, and asks again when your reply matches none of them or several. Then it goes on with that one. Once a design has a brief, every reply names it by the brief's title.

`/seldon` also runs on a project already under Cadence, one with `.planning/PROJECT.md`, and designs the next body of work there. It never writes Cadence's files, and the brief and PRD steps never read them, so the dump is what says what the next body of work is.

The PRD step builds from `brief.md` alone, never the conversation or a design folder, and writes `.planning/seldon/prd.md`. The PRD holds requirements with stable IDs, non-functional requirements, user journeys, non-goals that carry the brief's refusals, and the MVP scope. It's sized to the stakes the brief shows, quotes your words, tags each guess `[ASSUMPTION]` and names no technology, because that belongs to the spine. Then it runs the PRD check.

The spine step builds from `brief.md` and `prd.md`, plus the existing code on a project under Cadence, and writes `.planning/seldon/spine.md`. The spine holds only the decisions that would clash if two parts were built separately: the design approach, the boundaries between parts, how state changes, who owns shared data, the stack and the hosting. Each decision has a stable `S-` ID, such as `S-01`, and quotes your words or tags a guess `[ASSUMPTION]`. Seldon asks what people outside the project can send in, and what they must never see or change, only when the design takes input from outside or shows its data where they can reach it, and it asks what runs with nobody there, and who is told when that breaks, only when the design runs something unattended. A stack or host the brief never quotes you on is asked about, never guessed. On a project under Cadence, Seldon is told to read the code with Read, Glob and Grep only, and never to open a `.env` file or a key or credential file, though Claude Code may still let a read-only file listing through. It records the code's conventions that touch what this body of work builds, or the whole project, as decisions of those six kinds, each quoting the code with its file. It doesn't ask about a stack or host the code already settles, and it always asks who relies on what in the project today, putting each answer under the decision for the part it names. It asks all of these in one turn. Then it runs the spine check.

The epics step builds from `prd.md` and `spine.md` alone, asks no questions and writes `.planning/seldon/epics.md`. The epics come in build order, MVP first, and each has its outcome, boundaries, done-when items, the epics it depends on, its requirement IDs and the spine decision IDs it relies on. Each epic carries at most 5 requirement IDs and 2 to 5 done-when items, and one of those items says everything built so far works end to end. An epic covers one capability. One over a limit is split along a boundary in the spine, and the epics on both sides cite it. When no boundary cuts it, Seldon writes nothing and points you to `/seldon spine` to add one. Then it runs the epics check.

The readiness check is a separate agent that can only read. It reads the PRD, the spine and the epics and nothing else, and Seldon doesn't read them for it. It reports three kinds of finding: a requirement no epic names, an epic that crosses a boundary the spine didn't fix, and a decision left open, a choice between parts that an epic needs and no spine decision makes. A guess tagged `[ASSUMPTION]` isn't one. Each finding names its IDs and the step that fixes it, and Seldon repeats each one word for word. With none, Seldon says `The readiness check found nothing to fix.`, asks nothing and gives the handoff command. With findings, it asks whether you want to fix them or hand off the design as it is. Fixing reruns the earliest step a finding names, the spine before the epics, in the same turn, with the findings as its change. A spine rerun leaves the epics out of date, so the next bare `/seldon` reruns them, and the check runs again on a bare `/seldon` once nothing is out of date. Handing off changes nothing and gives the command. When the check can't run, Seldon says it did not run and why, says the design wasn't checked, and still gives the command. The next bare `/seldon` tries the check again.

The handoff is one command for you to run. On a project not under Cadence it's `/cad-new-project --brief .planning/seldon`. On one that is, it's `/cad-phase add --brief .planning/seldon`, followed by a line saying that if Cadence has already built this design, there's nothing to hand off. A design in its own folder gives that folder instead, `.planning/seldon/<name>`. The handoff writes nothing and keeps no record, so a later bare `/seldon` on the same documents checks again and gives the command again.

With a spine there, `/seldon architecture` writes the full architecture document, `.planning/seldon/architecture.md`. It expands on the spine's decisions by their IDs and adds none of its own. Just before the spine's confirm question, Seldon names the command so you know it's there, and nothing else ever writes the document.

`/seldon brief` and `/seldon prd` rerun one step. A brief rerun takes your change, keeps every item the change doesn't touch and leaves the PRD alone, even when the PRD is now out of date. The next bare `/seldon` brings the PRD in line. A PRD rerun also reads the existing `prd.md`, to keep its IDs: a requirement the change doesn't touch keeps its line and its ID, and a dropped ID goes on a `Retired:` line so it's never used again. `/seldon spine` reruns the spine the same way: it keeps every decision the change doesn't touch with its ID, and lists a dropped ID on a `Retired:` line. `/seldon epics` reruns the epics the way `/seldon spine` reruns the spine: it keeps every epic the change doesn't touch with its ID, and lists a dropped epic's ID on a `Retired:` line.

With a spine there, a PRD change is checked against it before anything is written, whether the change comes from a rerun or from changes you name at the PRD's confirm question. When the change alters or drops something a spine decision states or quotes, Seldon writes nothing yet. Its conflict report names each such decision by its `S-` ID, and it applies the change only when you go ahead. A decline changes nothing. When the change came from the brief, Seldon says the PRD stays behind the brief and points to `/seldon brief` to take the change back out of it. When you named the change yourself, it says only that nothing changed.

Every question Seldon asks is plain prose that ends its turn, never a menu, so a saved conversation can be replayed in a test.

## Evals

The eval cases live in `evals/`. Run them locally from the repository root:

```
claude plugin eval . --trust-plugin --no-publish --ablation none --scaffold --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"
```

The two `--allow-tools` rules are the whole grant. Seldon can write only inside `.planning/seldon/` and run its own check, though Claude Code may still let a read-only shell command, such as a file listing, through. Run from the root, `$PWD` is this repository, so the rule names the same `lib/check.mjs` the skill runs. For the readiness check, Seldon also starts one agent of its own, `seldon:readiness`, which has Read and nothing else by its own definition in `agents/readiness.md`. Claude Code's grants don't limit which agent a skill may start, so Seldon starting only that one rests on its instructions, and every case that expects the check fails a run that starts any other agent. `readiness-not-run` keeps the agent out with `disallowed_tools` in its `case.yaml`, to check what Seldon says when the check can't run. `--scaffold` runs the case scripts that copy fixtures from `samples/` into the run, and `tests/scaffold.test.mjs` allows them nothing more. Apart from the shebang, `set -euo pipefail` and the line that finds the repository, every line must be `mkdir -p` or `cp [-R]` from `"$repo/samples/..."`, with targets inside the run. Any other line fails the test. So does a `case.yaml` that names its scaffold in a form the test can't read.

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
- `resume` runs a bare `/seldon` in a fresh session with a confirmed brief already there, and checks that Seldon names that brief first, writes the PRD with the stamp of the brief it was built from, and asks neither for a dump nor who the project is for.
- `prd-from-brief` resumes from a brief whose quotes name a framework, a database and a host, and checks that the PRD passes the check, carries every refusal into Non-goals with its quote, quotes or tags every line and names none of that technology.
- `prd-no-stakes` resumes from a brief that never says who depends on the project or what breaks if it's wrong, and checks that the PRD's MVP scope carries one line, tagged `[ASSUMPTION]`, saying what size Seldon drafted it for.
- `confirm-clear` confirms a brief Seldon just wrote and checks that it ends on the words suggesting `/clear` and then `/seldon`, with nothing written or edited.
- `epics-from-spine` runs `/seldon epics` where a brief, a PRD and a spine are all there, and checks that Seldon writes epics that pass the check, every one with the six fields and the integrated item, each requirement on exactly one epic, citing only the spine's IDs and every stack, hosting and design-approach decision, with the stamp of the spine they were built from.
- `resume-later` runs a bare `/seldon` where all four documents are there and none is out of date, and checks that Seldon says the readiness check found nothing to fix, asks nothing, writes and edits nothing, starts no agent but the readiness check and ends on `/cad-new-project --brief .planning/seldon`.
- `prd-reads-brief` runs `/seldon prd` in a conversation that says one thing while the brief, edited by hand since, says another, and checks that the PRD carries the brief's fact and leaves the conversation's out.
- `prd-rerun` runs `/seldon prd` on a PRD whose brief has since dropped one requirement's source, and checks that every other requirement line stays byte-identical and the dropped ID goes on a `Retired:` line and never comes back.
- `brief-rerun` answers the question a `/seldon brief` rerun asks with a change, and checks that the brief takes the new words on a quoted line, an untouched item stays byte-identical and the PRD beside it is neither written nor edited.
- `brief-rerun-dump` answers the documents question with `/seldon brief`, and checks that the new words from the dump in that question's turn land on a quoted line in the brief in that same turn.
- `spine-from-prd` runs a bare `/seldon` where a brief and a PRD are there and no spine, and checks that Seldon names the PRD first, writes a spine that passes the check with one `Kind:` line and a quote or a tag on every decision, and writes or edits no other file.
- `spine-rerun` runs `/seldon spine` on a spine whose brief and PRD have since dropped what one decision rests on, and checks that every other decision stays byte-identical and the dropped ID goes on a `Retired:` line and never comes back.
- `spine-job` resumes a session that confirmed a PRD whose design runs a daily job with nobody there, and checks that a bare `/seldon` asks the unattended-work and failure questions but not the trust question, and writes and edits nothing.
- `spine-outside-input` resumes a session that confirmed a PRD whose design takes reports from the public and runs nothing unattended, and checks that a bare `/seldon` asks the trust question but neither the unattended-work nor the failure question, and writes and edits nothing.
- `spine-answers` answers the unattended-work and failure questions, and checks that the answers land word for word in the decision about the job they describe, in a spine that passes the check and carries the stamp of the PRD it was built from.
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
- `which-design` runs a bare `/seldon` with one design at the top of `.planning/seldon/` and one in `.planning/seldon/sowlist/`, and checks that Seldon writes and edits nothing, names both designs by their briefs' titles, Toolshed and Sowlist, and ends on the which-design question.
- `which-design-answer` answers that question with `sowlist`, and checks that Seldon names `.planning/seldon/sowlist/brief.md` first and then writes `.planning/seldon/sowlist/prd.md`.
- `spine-who-relies` runs `/seldon spine` on a project under Cadence whose code settles the stack and the host, and checks that Seldon asks the trust and who-relies questions but neither the unattended-work nor the failure question, writes and edits nothing, and keeps the fake token in the project's `.env` out of the trace.
- `spine-conventions` answers the trust and who-relies questions, and checks that Seldon writes a spine that passes the check, with the trust answer quoted in a decision that names the catalog, the who-relies answer quoted in the decision for the part it names, a convention quoted from `src/tools.mjs` with the file named under it, and the fake token nowhere in the trace.
- `stale-spine` resumes a session that brought the PRD in line with a brief that dropped reminders, where the spine and epics were built before that change, and checks that a bare `/seldon` says the spine is out of date before it edits the spine, lists the dropped decision's ID on a `Retired:` line, stamps the spine with the current PRD's hash, passes the check, ends on the spine confirm question and writes and edits no epics.
- `stale-epics` resumes a session that then brought the spine in line, where the epics were built before that, and checks that a bare `/seldon` says the epics are out of date before it edits them, stamps them with the current spine's hash, passes the check and reads nothing outside `.planning/seldon/`.
- `stale-prd` runs a bare `/seldon` where the brief has dropped reminders since the PRD and spine were built and there are no epics, and checks that Seldon says the PRD is out of date after the stamp check and before it reads any document, never says it's building the epics, names the spine decision that quotes the dropped requirement's line, and ends on the conflict question with nothing written or edited.
- `prd-conflict` runs `/seldon prd` on that same brief, PRD and spine, and checks that Seldon names the spine decision the change hits before writing anything and ends on the conflict question with nothing written or edited.
- `prd-conflict-decline` declines at that conflict question, and checks that Seldon writes and edits nothing and ends on the line saying the PRD stays behind the brief, which names `/seldon brief`.
- `prd-conflict-apply` goes ahead at that conflict question, and checks that Seldon keeps every untouched requirement line byte-identical, lists the dropped ID on a `Retired:` line and never on a requirement, takes it out of MVP scope, stamps the PRD with the current brief's hash, passes the check and ends on the PRD confirm question.
- `prd-change-conflict` answers the PRD confirm question with a change that drops the email reminders, where a brief, a PRD and a spine are there and in line, and checks that Seldon names the spine decision the change hits before writing anything and ends on the conflict question with nothing written or edited.
- `prd-change-decline` declines at that conflict question, and checks that Seldon writes and edits nothing and ends on the line saying nothing changed, without naming `/seldon brief`, since the change came from the conversation.
- `handoff-cadence` runs a bare `/seldon` on a project under Cadence whose finished design sits at the top of `.planning/seldon/` with nothing out of date, and checks that Seldon says the readiness check found nothing to fix, asks nothing, writes and edits nothing, starts no agent but the readiness check, never names `/cad-milestone`, and ends on `/cad-phase add --brief .planning/seldon` and the line saying there's nothing to hand off if Cadence has already built the design.
- `handoff-named` runs a bare `/seldon` on a project under Cadence whose one design is a finished one in `.planning/seldon/repair-log/`, and checks that Seldon says the readiness check found nothing to fix, writes and edits nothing, starts no agent but the readiness check, and ends on `/cad-phase add --brief .planning/seldon/repair-log` and that same already-built line.
- `readiness-not-run` runs a bare `/seldon` where all four documents are there and none is out of date, with the agent tool withheld, and checks that Seldon says the readiness check did not run and why, never says it found nothing to fix, asks nothing, and ends on the line saying the design was not checked, then `/cad-new-project --brief .planning/seldon`.
- `readiness-findings` runs a bare `/seldon` on a design where one requirement, `CAT-01`, is on no epic and one epic, `E-02`, spans two categories with no spine boundary between them, and checks that Seldon reports each by its ID with the step that fixes it, writes and edits nothing, starts no agent but the readiness check and ends on the readiness question.
- `readiness-crossing` runs a bare `/seldon` on a design where every requirement is on an epic and only `E-02` crosses a boundary the spine didn't fix, and checks that Seldon reports that crossing as its one finding, writes and edits nothing, starts no agent but the readiness check and ends on the readiness question.
- `readiness-hand-off` answers the readiness question on that crossing by handing the design off as it is, and checks that Seldon writes and edits nothing and ends on `/cad-new-project --brief .planning/seldon`.
- `readiness-fix` answers that question with a fix, and checks that Seldon edits `spine.md` in that turn so a new boundaries decision names loans and repairs, writes and edits no epics, and ends on the spine confirm question.
- `readiness-fix-answer` answers the who-relies question that a fix's spine rerun stopped to ask on a project under Cadence, and checks that Seldon carries the rerun on with Edit and never a Write of `spine.md`, adds a new boundaries decision naming loans and repairs, quotes the answer under a decision, writes and edits no epics, starts no agent and ends on the spine confirm question.
- `readiness-agent` runs a bare `/seldon` where all four documents are there and none is out of date, and checks that Seldon starts exactly one agent, `seldon:readiness`, hands it the paths of `prd.md`, `spine.md` and `epics.md` and no other path, and reads none of the three itself, while the agent reads each of the three and nothing else.
- `readiness-open-decision` runs a bare `/seldon` on a design where every requirement is on an epic and no epic crosses a boundary, but `E-03` has to keep a tool logged broken from being checked out while checkouts belong to `E-02`, and no spine decision says how the two meet. It checks that Seldon reports that decision left open with both epic IDs and the step that fixes it, writes and edits nothing, starts no agent but the readiness check and ends on the readiness question.

Results go to `evals/results/`, which git ignores.

## License

MIT, copyright John Crenshaw. See [LICENSE](LICENSE).
