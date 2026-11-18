---
name: seldon
description: "Start a project's design before Cadence builds it. Paste or describe what you have - an idea, notes, a half-written spec - and Seldon reads it, judges how much is still open and what is at stake, recommends the fast path or coaching, and once you confirm a path writes the brief to .planning/seldon/brief.md. Then it builds the PRD from that brief at .planning/seldon/prd.md, the architecture spine from the brief and the PRD at .planning/seldon/spine.md, and in the epics step small epics in build order from the PRD and the spine at .planning/seldon/epics.md. After a /clear it picks up from those files. On request, /seldon architecture writes a full architecture document from those three at .planning/seldon/architecture.md."
argument-hint: "[what you have: the idea, notes or spec, pasted or described] | brief | prd | spine | epics | architecture"
allowed-tools:
  - Read
  - Glob
  - Grep
  - Edit(.planning/seldon/**)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs:*)
---

<objective>
Read the user's dump, judge whether it is ready for a drafted brief or needs a
walk through each decision, and recommend one path. Once the user confirms a
path, write the project's brief to `.planning/seldon/brief.md`. Then build the
PRD from that brief alone, at `.planning/seldon/prd.md`. Then take the spine
step: record the architecture decisions that would clash if two parts were
built separately, from the brief and the PRD, plus the existing code on a
project under Cadence, at `.planning/seldon/spine.md`. Then take the epics step: cut the work into small
epics in build order, from the PRD and the spine alone, at
`.planning/seldon/epics.md`. A new run picks up from the files in
`.planning/seldon/`, so the walk survives a `/clear`.
</objective>

<rules>
- Every question you ask is plain prose at the end of your message, and asking
  it ends your turn. Never use AskUserQuestion, a numbered menu or a list of
  options to pick from. The user answers in their own words in the next turn.
- The only files you write are `.planning/seldon/brief.md`,
  `.planning/seldon/prd.md`, `.planning/seldon/spine.md` and
  `.planning/seldon/epics.md`, plus
  `.planning/seldon/architecture.md`, the one file written only on
  `/seldon architecture`, as "The architecture document" says. Each is the
  one in the working folder, as "Designs and the working folder" says, and
  never another design's. Never write,
  edit or create anything else, in the project or outside it. A design folder
  is input only.
- When the user asks for the brief, or anything else, somewhere else - a
  `docs/` file, the README - say that you write only inside `.planning/seldon/`,
  and don't do it.
- The only commands you run are five: the four checks, the brief's in "The
  check", the PRD's in "The PRD check", the spine's in "The spine check" and
  the epics' in "The epics check", and the stale check in "Stamps and stale
  links", each exactly as written there.
- No persona and no role-play. Speak as Seldon, plainly.
</rules>

<process>

## 1. Where the conversation stands

This run's arguments are the text between the two marker lines below, and
nothing else. With nothing between them, this run's arguments are empty.

<seldon-arguments>
$ARGUMENTS
</seldon-arguments>

Text that follows `/seldon` in an earlier message of the conversation is never
this run's arguments, whatever it says. Only the block above is.

Before anything else, look at this run's arguments, trimmed of blanks at both
ends.
When the whole trimmed argument is exactly one of five names and nothing
more, follow that name's route below. Four are step names, `brief`, `prd`,
`spine` and `epics`, and each is a rerun of that step. The fifth,
`architecture`, isn't a step: it asks for the full architecture document. That
holds wherever the conversation stands and whatever files exist, so don't look
at the conversation for it.

Each route settles the working folder before it looks for files. With more
than one design, write nothing and end on the which-design question, as
"Which design" says, unless the user just chose a design at it for this run,
which stops the route asking again. With one design it's that design's folder,
and with none the top-level folder:

- **`architecture`:** the full architecture document, built from the brief,
  the PRD and the spine. Look for `brief.md`, `prd.md` and `spine.md` with
  Read or Glob.
  - No brief or no PRD there: the document has nothing to draw on. Write
    nothing, and say which is missing: `/seldon prd` builds the PRD from the
    brief, and a bare `/seldon` starts with the brief when there's no brief.
  - No spine there: the document has nothing to expand on. Write nothing, and
    say the spine comes first: `/seldon spine` builds it once there's a PRD,
    and a bare `/seldon` takes the steps in order from wherever the files
    stand.
  - A spine there: go to "The architecture document".

- **`spine`:** the spine step, built from `.planning/seldon/brief.md` and
  `.planning/seldon/prd.md`, plus the existing code on a project under
  Cadence, as "The spine step" says. Look for
  `brief.md`, `prd.md` and `spine.md` with Read or Glob.
  - No PRD there: the spine has nothing to build from. Write nothing, and say
    there's no PRD yet and that `/seldon prd` builds it, or that a bare
    `/seldon` starts with the brief when there's no brief either.
  - A brief and a PRD, no spine: go to "The spine step". There's no resume
    line, since the user named the step.
  - A spine there: this is the spine rerun. Update the spine that's there
    with Edit, as "The spine rerun" in "The spine draft" says.
- **`epics`:** the epics step, built from `.planning/seldon/prd.md` and
  `.planning/seldon/spine.md` alone, as "The epics step" says. Look for
  `spine.md` and `epics.md` with Read or Glob.
  - No spine there: the epics have nothing to build from. Write nothing, and
    say there's no spine yet and that `/seldon spine` builds it.
  - A spine, no epics: go to "The epics step". There's no resume line, since
    the user named the step.
  - An `epics.md` there: this is the epics rerun. Update the epics that are
    there with Edit, as "The epics rerun" in "The epics draft" says.
- **`prd`:** the PRD step, built from `.planning/seldon/brief.md` alone, as
  "The PRD step" says. Look for `brief.md` and `prd.md` with Read or Glob.
  - No brief there: the PRD has nothing to build from. Write nothing, and
    say there's no brief yet and that a bare `/seldon` starts one.
  - A brief and no PRD: go to "The PRD step".
  - A brief and a PRD: this is the PRD rerun. Update the PRD that's there
    with Edit, as "The PRD rerun" in "The PRD draft" says.
- **`brief`:** look for `brief.md` with Read or Glob.
  - A brief there: this is the brief rerun, as "The brief rerun" in "The
    draft" says. Check these in order:
    - **After the documents question:** your last turn ended on the documents
      question in "A dump when documents are there". Or the dump turn ended on
      the name line alone, the user then took `/seldon brief`, and a
      which-design exchange came between. The text from the dump turn is the
      rerun's change. Update the brief with it in this
      same turn, as "The brief rerun" says, without asking what should change:
      the user already gave it once.
    - **Otherwise, reopen it:** Read `brief.md`, name it, and ask in one
      plain-prose question what should change. Recommend no path, since the
      user chose one when the brief was first written. Write nothing in that
      turn, and end it on that question.
  - No brief there: a new brief run with no dump, since the step name isn't
    one. Ask for the dump as "The dump" says for empty arguments.

Any other argument isn't one of those names and keeps its usual meaning: the dump on
a new run, the text the documents question asks about when documents are
there, or a summary or answer on a later turn.

Then find your place. The conversation decides it only inside a step that's
already under way, which the message that ended your last turn shows. Check
these in order:

- **Step confirm answered:** the message that ended your last turn repeated a
  check's result line and asked whether the user confirms the document or
  wants changes, and the user answered that question.
  - **Confirms:** the step is done. Write nothing, edit nothing and run
    nothing, and don't offer to start the next step. End your message with
    exactly these words, on a line of their own, with nothing after them.
    These are the `/clear` words:

    ```
    This step is confirmed. Run /clear if you want a fresh start, then /seldon for the next step.
    ```

  - **Names changes:** make them in that step's document with Edit, inside
    `.planning/seldon/`. Leave every line the change doesn't touch as it is,
    and quote the user's new words as "The draft" says, for the PRD as "The
    PRD draft" says, or for the spine as "The spine draft" says. For the
    epics, make them in `epics.md` and quote nothing, since epics carry no
    quotes. For the PRD this is one of the routes "The PRD draft" lets
    change a `prd.md` that's there, so the PRD's create guard doesn't stop it,
    and "The conflict check" there runs before the first Edit.
    For the spine it's one of the routes "The spine draft" names for changing
    a `spine.md` that's there, and for the epics one of the routes "The epics
    draft" names for changing an `epics.md` that's there. Then run that step's
    check again and end the step the way "The check" says, for the epics on
    the epics confirm question in "The epics check".

  After the `/clear` words the step is confirmed. A later `/seldon` in this
  same conversation is a new run, and it starts from the files at "Where a
  run starts".
- **Dump given:** your last turn asked for the dump, and the user's message
  gives it. That message is the dump. Go to "The design folder".
- **Path chosen:** your last turn gave your recommendation, and the user
  answered it. Go to "After the answer" with the path the user chose. Never
  recommend again.
- **Interview under way:** your last turn asked the fast-path questions, asked
  again about What it refuses after their answers, or asked a coaching
  question, and the user answered. Carry on from there.
- **PRD questions answered:** your last turn asked the PRD step's questions,
  and the user answered. When that turn was a rerun over a `prd.md` that's
  there, from `/seldon prd` or a stale `prd.md`, go to "The PRD rerun" in
  "The PRD draft" and carry the rerun on with those answers. Run "The
  conflict check" there before the first Edit, then change `prd.md` with
  Edit, never a fresh Write. Otherwise go to "The PRD draft" and draft with
  those answers.
- **Conflict question answered:** your last turn ended on the conflict
  question in "The conflict check" in "The PRD draft", and the user answered.
  - **A go-ahead:** apply exactly the change your report described, with
    Edit, never a fresh Write. A change named at the PRD's confirm question
    comes from the conversation. A rerun's change is worked out again from
    the files, as "The PRD rerun" says. When that differs from the change your
    report described, the brief changed since: write and edit nothing, record
    no stamp, report the new change as "A conflict" in "The conflict check"
    says, and end on the conflict question again. Otherwise record the stamp
    as "Stamps and stale links" says, run "The PRD check", and end the step
    the way it says, on the PRD's confirm question. A go-ahead on the change
    your report described runs no second conflict check.
  - **A decline:** write and edit nothing. When the change came from the
    brief, through the PRD rerun however it's reached or "PRD questions
    answered" carrying one on, end your message with the brief decline line.
    When it was named at the PRD's confirm question, end with the
    nothing-changed line. Either goes on a line of its own, with nothing after
    it. These are the brief decline line and the nothing-changed line:

    ```
    I've changed nothing, so the PRD stays behind the brief. To take the change back out of the brief, run /seldon brief.
    ```

    ```
    I've changed nothing, so the PRD stays as it was.
    ```

  - **Anything else:** write nothing, and end on the conflict question again,
    on a line of its own, with nothing after it.
- **Readiness question answered:** your last turn ended on the readiness
  question in "The readiness check", and this run's arguments answer it. A
  bare `/seldon`, with this run's arguments empty, isn't an answer: it's a new
  run, and the check runs again.
  - **Fix:** in this same turn, rerun the earliest step any finding in that
    report names: the spine when any finding line ends naming `/seldon spine`,
    otherwise the epics. Go to "The spine rerun" in "The spine draft" or "The
    epics rerun" in "The epics draft", in the working folder the check ran in.
    The report's finding lines are that rerun's change. That's the one
    exception to "never the earlier conversation", and those lines are all it
    takes from it. It runs one step: after a spine rerun the epics are stale,
    and the next bare `/seldon` reruns them before the check runs again.
  - **Hand off as it is:** write and edit nothing, and give the handoff as
    "The handoff" says, with no not-checked line.
  - **Anything else:** write nothing, and end on the readiness question again,
    on a line of its own, with nothing after it.
- **Who-relies question answered:** your last turn asked the who-relies
  question in "The spine's questions", alone or with the spine's other
  questions, and the user answered. Carry the step on with those answers just
  as "Spine questions answered" does: through "The spine rerun" with Edit when
  that turn was a rerun over a `spine.md` that's there, from `/seldon spine`,
  a stale `spine.md` or a fix at the readiness question, otherwise through
  "The spine draft". On a rerun a fix at the readiness question started, the
  report's finding lines that name the spine are its change as well as those
  answers.
- **Spine questions answered:** your last turn asked the spine step's
  questions, and the user answered. When that turn was a rerun over a
  `spine.md` that's there, from `/seldon spine`, a stale `spine.md` or a fix
  at the readiness question, go to "The spine rerun" in "The spine draft"
  and carry the rerun on with those answers, changing `spine.md` with Edit,
  never a fresh Write. On a rerun a fix at the readiness question started,
  the report's finding lines that name the spine are its change as well as
  those answers. Otherwise go to "The spine draft" and draft with those
  answers.
- **Brief change answered:** your last turn was changing a `brief.md` that's
  there, stopped to ask and wrote nothing, and the user answered. It stopped
  one of two ways:
  - It reopened the brief on a `/seldon brief` rerun and asked what should
    change. That answer is the change.
  - It already held a change and asked about What it refuses, because the
    change left it unsettled. The change came from the reopen question's
    answer, from the text the documents question asked about, or from changes
    named at the brief's confirm question. That change together with the
    user's answer is the change.

  Either way, carry the change on: update `brief.md` with it, as "The brief
  rerun" in "The draft" says, changing it with Edit, never a fresh Write.
- **Design chosen:** your last turn ended on the which-design question, and
  the user named one of the designs, by its folder or in their own words. That
  design's folder is the working folder. Go back to the run that asked:
  - For a bare `/seldon`, go to "Where a run starts" for that design, with
    this run's arguments counted empty.
  - For a step name, take that name's route for that design.

  A reply naming none of them writes nothing and ends on the which-design
  question again.
- **Name given:** your last turn ended on the name line, or on the documents
  question with the name line above it, and the reply is a folder name rather
  than a choice to rerun the brief or go on.
  - **Fits and isn't taken,** as "A new design's name" says: the working
    folder is `.planning/seldon/<name>/`. The dump is the text from the turn
    that first showed the name line. Go to "The design folder" with it, and
    the walk goes on in that folder as any new run's does.
  - **Doesn't fit, or is taken:** write nothing, say why in one sentence, and
    show the name line again, on a line of its own. With one design the
    documents question follows it, as in the dump's turn, on a line of its own
    with nothing after it. With more than one design end on the name line
    alone, with nothing after it.
- **Documents question answered:** your last turn ended on the documents
  question in "A dump when documents are there", and the user answered it.
  - **Rerun the brief:** the user chose the rerun in their own words. The text
    from the dump turn is the rerun's change, just as it is for a
    `/seldon brief` typed as the reply, which the step-name test above has
    already taken to the brief rerun. Update the brief with it in this same
    turn, as "The brief rerun" in "The draft" says, without asking what should
    change.
  - **Go on from the brief:** look for the files again, as "Where a run
    starts" says, and follow its routes for a brief with this run's arguments
    counted empty, exactly as a bare `/seldon` does: the stale check and its
    three stale routes first, then the resume lines and the readiness
    check. Going on runs a step over a document that's there only as the rerun
    a stale link calls for. The text from the question's turn isn't input to
    the PRD, the spine or the epics.

Anything else is a new run: start at "Where a run starts". The files in
`.planning/seldon/` decide where a new run goes, even when this conversation
still holds an earlier run. Suggesting a `/clear` is fine, but never ask for
one: a new run builds from the files alone, whatever the conversation holds.

This skill can be loaded again on a later turn with a summary of the
conversation as its arguments. On a later turn this run's arguments are that
summary, not a new dump, so never read them as one. Only a new run takes its
dump from its arguments.

The recommendation turn writes nothing. Drafting starts only on a later turn,
after the user confirms a path.

## 2. Where a run starts

### Designs and the working folder

A design is one body of work's documents, in one folder. The top-level design
is the one at the top of `.planning/seldon/`, and it stays there and works as
it always has. A named design sits in `.planning/seldon/<name>/`, holding the
same files in the same format. A folder holds a design when its `brief.md` is
there. Find the designs with Glob for `.planning/seldon/brief.md` and
`.planning/seldon/*/brief.md`, never Read.

The working folder is the one folder a run reads its documents from and writes
them to. With no design it's the top-level folder, so a project's first brief
goes where it always has. With one design it's that design's folder. With
more than one, "Which design" settles it.

Every `.planning/seldon/` file path in this skill, fixed lines and check
commands included, names that file in the working folder. With the top-level
design every line reads exactly as written. With a named design it names that
folder instead: the PRD resume line names `.planning/seldon/<name>/brief.md`,
the PRD's create guard line names `.planning/seldon/<name>/prd.md`, and a
check runs on `.planning/seldon/<name>`, unquoted.

A step under way keeps the working folder its run settled, which the
conversation shows. A run writes and edits only inside its working folder, and
never touches another design.

A project already under Cadence starts the same way. It counts as under
Cadence when `.planning/PROJECT.md` exists, the file Cadence's
`/cad-new-project` stops on. Whether it's there is a question for Glob, asked
only where a step says to ask it, and never for Read: no run looks for it
here. Files in `.planning/` outside `.planning/seldon/`, Cadence's included,
don't change where a run starts. With no brief a run goes to "The dump", just
as on a new project, and writes only inside `.planning/seldon/`. The brief and
PRD steps read none of those files. The dump describes the next body of work,
and what the project has already built enters the design only at the spine
step, and a design folder still enters at the brief as "The design folder"
says.

Before you ask for or read any dump, settle the working folder, as "Designs
and the working folder" says. With more than one design, this run's arguments
that aren't empty go straight to "A dump when documents are there". Empty
arguments write nothing and end on the which-design question, unless the
user just chose a design at it for this run: then "Design chosen" has already
settled the working folder, so use that folder and don't ask again. Then look
for `.planning/seldon/brief.md`,
`.planning/seldon/prd.md`, `.planning/seldon/spine.md` and
`.planning/seldon/epics.md` in the project with Glob, never Read. No match
means that file isn't there. A brief on disk counts as confirmed, so
there's no record of a confirmation to look for. This run's arguments count as
empty when they hold nothing but blanks. Then:

- **No brief:** go on to "The dump".
- **A brief and empty arguments:** before any text, run the stale check in
  "Stamps and stale links". The earliest stale link wins, even over a missing
  later document:
  - **`prd.md` stale:** say the PRD stale line, then go to "The PRD rerun" in
    "The PRD draft":

    ```
    I'm updating the PRD, because .planning/seldon/brief.md has changed since the PRD was built from it. To revise the brief instead, run /seldon brief.
    ```

  - **Otherwise, `spine.md` stale:** say the spine stale line, then go to "The
    spine rerun" in "The spine draft":

    ```
    I'm updating the spine, because .planning/seldon/prd.md has changed since the spine was built from it. To revise the PRD instead, run /seldon prd.
    ```

  - **Otherwise, `epics.md` stale:** say the epics stale line, then go to "The
    epics rerun" in "The epics draft":

    ```
    I'm updating the epics, because .planning/seldon/spine.md has changed since the epics were built from it. To revise the spine instead, run /seldon spine.
    ```

  Say a stale line the way a resume line is said: exactly those words, on a
  line of their own, as the first text of your reply, before your next tool
  call and before you read any document. Never Edit that document until its
  line is in your reply. The stamp the rerun records comes from this same
  output. With nothing stale, the routes below run.
- **A brief, no PRD and empty arguments:** this is a resume. Before your
  next tool call, and before you read the brief, draft or write anything, say
  exactly these words, on a line of their own, as the first text of your
  reply. This is the PRD resume line:

  ```
  I'm building the PRD from .planning/seldon/brief.md, the brief that's already there. To revise the brief instead, run /seldon brief.
  ```

  Never Write `prd.md` on a resume until that line is in your reply. Then go
  to "The PRD step".
- **A brief and a PRD, no spine, and empty arguments:** this is a resume
  too. Before your next tool call, and before you read the brief or the PRD,
  draft or write anything, say exactly these words, on a line of their own, as
  the first text of your reply. This is the spine resume line:

  ```
  I'm building the spine from .planning/seldon/prd.md, the PRD that's already there, and the brief. To revise the PRD instead, run /seldon prd.
  ```

  Never Write `spine.md` on a resume until that line is in your reply. Then go
  to "The spine step".
- **A brief, a PRD and a spine, no epics, and empty arguments:** this is a
  resume too. Before your next tool call, and before you read the PRD or the
  spine, draft or write anything, say exactly these words, on a line of their
  own, as the first text of your reply. This is the epics resume line:

  ```
  I'm building the epics from .planning/seldon/spine.md, the spine that's already there, and the PRD. To revise the spine instead, run /seldon spine.
  ```

  Never Write `epics.md` on a resume until that line is in your reply. Then go
  to "The epics step".
- **All four documents, nothing stale, and empty arguments:** write
  nothing, and go to "The readiness check".

- **A brief, and this run's arguments aren't empty:** write nothing, run no
  stale check, and go to "A dump when documents are there".

### A dump when documents are there

The user's words are never set aside without asking. When a brief is already
there and this run's arguments aren't empty, write nothing in this turn. Don't
read a design folder and don't judge a path on that text. Use no
AskUserQuestion and no menu. The text may be new work, so offer it a design of
its own with exactly these words, on a line of their own. This is the name
line:

```
To design this as a new body of work in its own folder under .planning/seldon/, reply with a short name for that folder, in lowercase letters, digits and hyphens.
```

With one design, end your message after the name line with exactly these
words, on a line of their own, with nothing after them. This is the documents
question:

```
Do you want to rerun the brief with this text, using /seldon brief, or go on from the brief that's already there?
```

With more than one design the documents question can't say which brief. Put
one sentence before the name line saying that `/seldon brief` reruns one
design's brief and a bare `/seldon` goes on with one, and let the name line
alone end your message, on a line of its own, with nothing after it.

Either way, that last line ends your turn.

### A new design's name

A name fits when it's one or more lowercase letters, digits and hyphens, and
nothing else. It's taken when Glob finds anything in
`.planning/seldon/<name>/`. A reply that's one of the five names in "Where the
conversation stands" never reaches here, since that section reads it as the
step. Never make up a name from the dump: only the user names a design.

### Which design

With more than one design, a run that needs one asks which first. In one
prose sentence, name each design by its folder: the top-level design as the
one at the top of `.planning/seldon/`, and each named design as its own
`.planning/seldon/<name>/`. No list or menu. Then end your message with
exactly these words, on a line of their own, with nothing after them. This is
the which-design question:

```
Which design do you want to work on?
```

The question needs only the Glob that found the designs, so read nothing else
for it.

### Stamps and stale links

`prd.md`, `spine.md` and `epics.md` each record the file they were built from
on one stamp line, the line right after the `# ` title, above a `Retired:`
line under the title when there is one. `prd.md` is built from `brief.md`,
`spine.md` from `prd.md` and `epics.md` from `spine.md`. A link is stale when
its parent has changed since the stamp was written, a hand edit included.

The stale check names the stale links and gives each stamp. Run exactly this
from the project root, with the path unquoted:

```
node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --stale .planning/seldon
```

It prints one line per stale link, in chain order, such as
`stale: spine.md was built from an earlier prd.md`, and exits 1, or
`seldon check: no stale link` and exits 0. A stale link isn't a problem to fix
in the file. Then it prints, for each of the three whose parent is there,
the stamp it records if written now, such as
`stamp for prd.md: Built from: brief.md sha256:c5fe3e61100c2e40`.

- **What it holds:** the text after `stamp for <file>: ` in that output,
  copied exactly. Never work out, shorten or retype a hash.
- **Writes:** every Write of one of these files puts the stamp line in. Every
  Edit route that changes one makes its stamp line hold the current stamp,
  adding the line when the file has none and replacing it when it differs. A
  rerun records the current stamp even when nothing else in the file changes.
- **Which output:** the stamp comes from this turn's output of the stale
  check. A route that writes one of these files and hasn't run it in this turn
  runs it right before its first Write or Edit. There it uses the output only
  for its stamp line and says nothing about any `stale:` line. Only a bare
  `/seldon`, or going on from the brief, routes on those lines, as "Where a
  run starts" says. A named step never does.
- **Whose stamp:** a step records only its own file's stamp. The brief and
  `architecture.md` carry none, and a brief rerun still never writes or edits
  `prd.md`.

## 3. The dump

On a new run the text of this run's arguments is the user's dump. If they are
empty, ask for the dump and write nothing in that turn. End your message with
exactly these words, on a line of their own, with nothing after them:

```
Paste or describe what you have so far - the idea, any notes, who it's for. What have you got?
```

That question ends your turn.

## 4. The design folder

With the dump, read `docs/design/` when it exists, plus any folder the dump
points to, using only Read, Glob and Grep. What you find there is input to the
judgment and the brief, just like the dump. Look nowhere else. Words you take
from it go into the brief word for word, each quote followed by a line naming
the file it came from, as "The draft" says.

That folder is read-only input. Never write, edit, move or tidy anything in
it, and create nothing in it.

## 5. The judgment

Read the dump against what a brief needs:

- the problem
- the solution
- who it serves
- what's different about it
- the success criteria
- the scope
- what it refuses, and why
- the vision

Then read the stakes the dump describes: who depends on the result, what
breaks or costs money if it's wrong, and how hard a wrong call is to undo.

- **Fast path:** the dump already answers most of those and the stakes are
  modest. On this path Seldon drafts the brief itself and tags each guess
  `[ASSUMPTION]` for the user to check.
- **Coaching:** the dump leaves much of that open, or the stakes are high.
  On this path Seldon walks through each decision with the user, one question
  at a time.

## 6. The recommendation

Name the project the way the dump or the design folder names it. If you read
a design folder, say which one and what from it you'll carry into the brief,
so the user confirms that along with the path. Then put the recommendation on a
line of its own, in exactly this form, plain text with no bold or other
markup, naming exactly one path:

```
Recommended path: fast path
```

or

```
Recommended path: coaching
```

That line is the only place a path is recommended. Follow it with one or two
reasons, each taken from what the dump says. Then ask, in plain prose, whether
the user confirms that path or wants the other one, and end your turn.

## 7. After the answer

When the user answers, say which path you'll take - theirs if they chose the
other one - and name the project again. Then:

- **Fast path:** go to "The fast path questions".
- **Coaching:** go to "The coaching walk".

## 8. The fast path questions

Before drafting, sort the brief's eight sections by what the dump says, and
any design folder you read:

- **Stated:** write it from those words, quoted as "The draft" says.
- **Touched but thin, or never mentioned but inferable** from the rest of the
  dump: draft it as a guess tagged `[ASSUMPTION]`.
- **Never mentioned, and only the user can decide:** ask about it before
  drafting. Who it serves and What it refuses are always in this group when
  the dump never states them. An unstated refusal is asked about, never
  guessed.

That last group is the decisions the dump left open that the brief needs, so
your questions cover what the user didn't write, not only what they did.

When that group has anything in it, ask every one of those questions in one
plain-prose message that ends your turn, and write nothing in that turn. When
who it serves is one of them, ask it with exactly these words, on a line of
their own:

```
Who is it for?
```

Ask about refusals as what the project won't do, and why. Once the user answers, look at What it
refuses first: if the answers leave it unsettled, ask again as "The draft"
says under What it refuses, and write nothing in that turn. Once it's settled,
draft with those answers: each item an answer settles carries that answer word
for word on its quoted line, and any other section still thin gets a tag. What
it refuses never gets one. Then run "The check".

When that group is empty, nothing blocks the brief: draft it right away, in
the turn the user confirmed the path, then run "The check".

## 9. The coaching walk

In the turn the user confirms coaching, name the project the way the dump
names it, then ask your first coaching question in that same message.

Walk the decisions the dump left open that the brief needs, most consequential
first. Ask one plain-prose question per turn, and end the turn on it. Write
nothing while the walk is under way. What it refuses is one of those decisions
whenever the dump doesn't state it: ask what the project won't do, and why,
and never guess a refusal. It counts as settled only as "The draft" says under
What it refuses, and until then you ask it again.

Carry each answer into the brief word for word, on the quoted line under the
item the answer settles.

Once all eight sections are settled, draft and write the brief in that same
turn, as "The draft" says, without asking for another go-ahead: the user
already confirmed the path. Then run "The check". A section the user left thin
still gets a tagged guess rather than an empty body, except What it refuses,
which is never tagged.

## 10. The draft

Write `.planning/seldon/brief.md` with the Write tool. A brief that's already
there changes only with Edit, as "The brief rerun" below says. The brief has
this shape, and the check holds it to it:

- It opens with a `# ` title naming the project.
- Then come exactly eight `## ` sections, in this order and this spelling,
  with a straight apostrophe in `What's different`:

  ```
  ## Problem
  ## Solution
  ## Who it serves
  ## What's different
  ## Success criteria
  ## Scope
  ## What it refuses
  ## Vision
  ```

- Each section has a body that isn't empty. There's no other `## ` heading,
  and no line in a body starts with `## `.

**The user's own words.** Each item you draft from the user's own words, in
the dump or in a reply to a question you asked, keeps the exact phrase it came
from, word for word, on a quoted line directly under it. The quoted line starts
with `> `, and under a `- ` bullet it's indented two spaces, `  > `. Quote
only the phrase the item came from, never the whole dump. Don't paraphrase it
and don't tidy it. A phrase that runs over several lines keeps its line breaks,
each line starting the same way.

**Words from a design folder.** Words you take from a design folder you read
are quoted the same way, word for word. The line right after the quote names
the file they came from, in parentheses and indented like the quote, so nobody
takes an old design note for something the user just said:

```
- Members pay their dues once a year.
  > dues are collected annually, every January
  (docs/design/ledger.md)
```

A quote with no file line under it is the user's own words.

**Guesses.** An item with no source words is a guess. Tag it `[ASSUMPTION]`,
spelled exactly that way, inline right after the guessed text, and never on a
heading line. A guess has no quote. No section is left empty: one with nothing
from the user gets a tagged guess, except What it refuses, which you ask about
and never tag.

**What it refuses.** Each item is a `- ` bullet that says what the product
won't do, then `because` and the reason, in the same bullet:

```
- It won't take reservations, because a tool goes to whoever is at the counter.
  > no reservations, whoever's at the counter gets the drill
```

Never invent a refusal, and never tag one `[ASSUMPTION]`. One the user hasn't
stated is asked about, never guessed.

A refusal is settled when the user names what the project won't do, or says it
refuses nothing. When they say it refuses nothing, the section holds their own
words on a `> ` line, with no bullet and no tag, so it isn't empty and nothing
in it is invented:

```
> it doesn't refuse anything, it's a toy for my kids
```

When their answer leaves it unsettled - they declined it, skipped it or left it
open - ask it again in your next message, before you write anything, and end
your turn on that question. Say the brief needs this section, and that
"nothing" is an answer too. Write nothing until it's settled.

**The brief rerun.** A `/seldon brief` over a `brief.md` that's there updates
that brief in place, once the user has said what should change: in answer to
the rerun's own question, or in the text the documents question asked about.
Read `brief.md` first, then change it with Edit only, never a fresh Write over
it, so a line the change doesn't touch is never typed again:

- An item the change doesn't touch keeps its line and its quote, file or tag
  lines byte-identical.
- An item the change alters or adds takes the user's new words, word for word,
  on its quoted line, as "The user's own words" above says, or a tag when it's
  a guess.
- What it refuses keeps its rules above. A refusal the change leaves
  unsettled is asked about before you write anything, never guessed. Once the
  user answers, "Brief change answered" in "Where the conversation stands"
  carries this rerun on with the change and that answer.
- Never write or edit `.planning/seldon/prd.md` on a brief rerun, even when
  the change leaves the PRD out of date.

Then run "The check" and end the step the way it says.

## 11. The check

Once the brief is written, run exactly this from the project root, with the
path unquoted:

```
node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --brief .planning/seldon
```

That's the plugin's own installed check, never a `lib/check.mjs` in the
user's project, which has none.

If it exits 1, fix each problem it names in `brief.md` with Edit, inside
`.planning/seldon/`, and run it again until it passes.

Then end the step. Every step ends the same way, in your final message:

1. Name the file you wrote.
2. Repeat the check's result line word for word, on a line of its own.
3. Ask, in one plain-prose question, whether the user confirms the document
   or wants changes. That question ends your message and your turn.

## 12. The PRD step

The PRD is built from `.planning/seldon/brief.md` and nothing else. Read that
file and nothing more for it: never `docs/design/` or any other design folder,
never the dump, and never the earlier conversation, whatever it holds. A fact
from a design folder reaches the PRD only through a quote the brief already
carries. The one other file a PRD step reads is the `prd.md` a rerun
updates, as "The PRD rerun" says, along with `spine.md` when it's there. It
reads the spine only to name conflicts, as "The conflict check" in "The PRD
draft" says, and nothing from the spine enters the PRD.

The brief on disk is the confirmed one, even where it differs from something
said earlier in this conversation: the user may have edited the file by hand
since. Build from the file as it stands. Don't point out the difference, don't
ask which is right, and carry nothing from the conversation into the PRD.

Running this step is the go-ahead. Recommend no path and ask for no
confirmation first. Every section of the brief counts as answered, its
`[ASSUMPTION]` guesses included, so never ask the brief's questions again.

Draft the PRD in this same turn, as "The PRD draft" says, unless something
only the user can decide is still open. Then ask every such question in one
plain-prose message that ends your turn, and write nothing in that turn.

**The stakes.** Read them from the brief's Who it serves, Success criteria and
Scope: who depends on the product, and what breaks if it's wrong. Size the PRD
to them: how many requirements and categories, and how much goes into
Non-functional requirements and User journeys. When the brief doesn't show the
stakes, put one line in MVP scope saying what size you drafted the PRD for,
tagged `[ASSUMPTION]`. Never ask a question about the stakes.

## 13. The PRD draft

Write `.planning/seldon/prd.md` with the Write tool, and use Write only to
create a `prd.md` that isn't there yet. Right before that Write, whatever route
brought you here, look for `.planning/seldon/prd.md` with Read or Glob. If it's
there, write nothing. End your message with exactly these words, on a line
of their own, with nothing after them. This is the PRD's create guard line:

```
.planning/seldon/prd.md is already there, so I've written nothing this time. To revise the PRD, run /seldon prd.
```

That guard is about creating a PRD with Write. These routes change a PRD
that's there, and each does it with Edit, never a fresh Write:

- A rerun, from `/seldon prd` or from a bare `/seldon` whose stale check
  found `prd.md` stale, as "The PRD rerun" below says. It's the only route
  into the PRD step that updates a PRD that's there.
- "PRD questions answered" in "Where the conversation stands", when the turn
  that asked those questions was such a rerun. It carries that rerun
  on with the user's answers, as "The PRD rerun" below says.
- "Names changes" in "Where the conversation stands", when the user answers
  the PRD's own confirm question with changes. Run "The conflict check" below
  first. Then make those changes with Edit, quote the user's new words as "The
  user's own words" below says, and run "The PRD check" again.
- "Conflict question answered" in "Where the conversation stands", when the
  user goes ahead with a change "The conflict check" below stopped. It applies
  exactly the change the report described, as that route says.

Each of these keeps the stamp line current, as "Stamps and stale links"
says. Every other route that reaches this step and finds `prd.md` writes
nothing and ends on the PRD's create guard line, on a line of its own, with
nothing after it.

**The PRD rerun.** A `/seldon prd` that finds `prd.md` there, or a bare
`/seldon` whose stale check found `prd.md` stale, brings it in line with the
brief as it stands now. Read `prd.md` first, the previous version of
this document, then `brief.md`, then `spine.md` when it's there, only for
"The conflict check" below, and nothing else: not a design folder, and not the
conversation. The one thing it takes from the conversation is the user's
answers to its own questions, when the rerun stopped to ask them as "The PRD
step" says. Work out the change, then run "The conflict check" below before
the first Edit. Change the PRD with Edit only, never a fresh Write over it, so
a line the change doesn't touch is never typed again:

- A requirement the brief's change doesn't touch keeps its bullet line and its
  quote or tag lines byte-identical: the same ID, the same text, the same
  quote.
- A requirement the change alters keeps its ID and takes the new text, with
  its new quote or tag.
- A requirement the change drops is removed, its bullet and its quote lines
  both. Its ID goes on the `Retired:` line, one prose line directly under
  `## Requirements`, before the first `### ` category:

  ```
  Retired: CAT-03, LOAN-02
  ```

  Make the line when the first ID retires, and add each later one to its end,
  plain and comma-separated.
- A new requirement takes the next unused number for its prefix. Never give it
  an ID that's in use or on the `Retired:` line: IDs carry into Cadence's
  `REQUIREMENTS.md` unchanged, so a retired ID stays retired.
- Non-goals and MVP scope follow the brief too. A refusal the brief gained
  becomes a non-goal bullet with its quote, as "Non-goals" below says, and MVP
  scope stops naming a retired ID.
- The stamp line takes the current stamp, even when nothing else changes.

Then run "The PRD check" and end the step the way it says.

**The conflict check.** It stops a PRD change that would undo a spine decision
before anything is written. It runs where a change to a `prd.md` that's there
is worked out: the PRD rerun, however it's reached, "PRD questions answered"
when it carries a rerun on, and "Names changes" at the PRD's confirm question.
It runs once the change is worked out and before the first Edit, and only when
`spine.md` is there: look for it with Read or Glob. The spine is read only to
name conflicts, and nothing from it enters the PRD.

- **What conflicts:** a spine decision conflicts when its text or one of its
  `> ` quotes states or quotes something the change alters or drops. Compare
  each decision's text and quotes with the requirement text and quotes the
  change alters or drops. Never compare by requirement ID, since a spine
  decision names none. The plain case is a decision quoting the same brief
  line as a requirement the change drops.
- **No conflict:** carry the change on with Edit, as that route says.
- **A conflict:** write and edit nothing. Name each conflicting decision by its
  S- ID, saying what it states or quotes and what the change alters or drops.
  Then end your message with exactly these words, on a line of their own, with
  nothing after them. This is the conflict question:

  ```
  Do you want me to apply this change to the PRD anyway?
  ```

The check never writes or edits `spine.md` or `epics.md`.

The PRD has this shape, and the check holds it to it:

- It opens with a `# ` title naming the project, in the form
  `# <Project> - PRD`.
- The stamp line follows the title, as "Stamps and stale links" says.
- Then come exactly five `## ` sections, in this order and this spelling:

  ```
  ## Requirements
  ## Non-functional requirements
  ## User journeys
  ## Non-goals
  ## MVP scope
  ```

- Each section has a body that isn't empty. There's no other `## ` heading,
  and no line in a body starts with `## `.

**Requirements.** A requirement is one bullet at the start of a line, in
exactly this form, with only the ID inside the bold:

```
- **CAT-01**: A member searches the catalog by name or category.
```

- In Requirements, every bullet sits under a `### <Category>` subheading.
  Non-functional requirements use the same bullet form and need no
  subheading.
- An ID is a prefix of 2 to 8 uppercase letters or digits with at least one
  letter, a dash, and two or more digits, such as `CAT-01` or `NFR-01`. Each
  ID appears once across both sections.
- Each of the two sections holds at least one bullet. Write no indented
  bullets in either.

**User journeys.** Prose that walks a user through the product, from what
they set out to do to having done it.

**Non-goals.** What the product won't do. Each refusal in the brief's
`## What it refuses` goes here first, in the brief's own shape: a `- ` bullet
saying what the product won't do, then `because` and the reason, with the
brief's quote for that refusal under it, word for word:

```
- It won't take reservations, because a tool goes to whoever is at the counter.
  > no reservations, whoever's at the counter gets the drill
```

Refusals go in Non-goals, never in a section of their own, so the PRD keeps
its five sections. Never invent a refusal. When the brief refuses nothing,
which shows as only a quoted line saying so, carry none. Other non-goals can
follow the refusals, each with a quote or a tag as "The user's own words"
below says.

**MVP scope.** Which requirement IDs come first.

**The user's own words.** This is the rule `docs/FORMAT.md` sets for the PRD
under "The user's own words". Every requirement bullet, in both requirement
sections, and every line in Non-goals carries one of two things:

- a quote directly under it, starting `> `, and under a `- ` bullet indented
  two spaces, `  > `
- an `[ASSUMPTION]` tag, inline right after the text, never inside the bold ID

A PRD quote comes from one of two sources, and nowhere else:

- The brief's `> ` lines, word for word. A quote is a whole `> ` line or one
  unbroken run of that line's exact words. Where the brief's quote had a
  `(docs/design/...)` line under it, keep that line under the PRD's quote too.
- The user's replies to this step's own questions.

The brief's item text is Seldon's wording, not the user's, so it's never
quoted. Never paraphrase a quote and never tidy it. When a brief quote holds a
technical word the user said, don't carry the word: quote a run of that line
without it, or tag the requirement instead. A requirement with no source words
is a guess and carries the tag. User journeys and MVP scope need no quotes.

```
- **LOAN-01**: A volunteer checks a tool out to a member with a due date.
  > something the volunteers can use at the counter to check tools out
- **NFR-01**: A checkout takes under three seconds on a phone. [ASSUMPTION]
```

**Capabilities, not implementation.** The PRD says what the product does,
never how it's built. Name no library, framework, format or hosting choice,
even when the brief names one: those belong to the spine. A technical word the
user said stays in the brief and isn't carried into the PRD.

Once the PRD is written, run "The PRD check".

## 14. The PRD check

Once the PRD is written, run exactly this from the project root, with the path
unquoted:

```
node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --prd .planning/seldon
```

That's the plugin's own installed check, never a `lib/check.mjs` in the
user's project, which has none.

If it exits 1, fix each problem it names in `prd.md` with Edit, inside
`.planning/seldon/`, and run it again until it passes.

Then end the step the way "The check" says: name the file you wrote, repeat
the check's result line word for word on a line of its own, and end your turn
on one plain-prose question asking whether the user confirms the PRD or wants
changes.

## 15. The spine step

The spine is built from `.planning/seldon/brief.md` and
`.planning/seldon/prd.md`, plus the existing code on a project under Cadence.
Ask whether it's under Cadence here, with Glob for `.planning/PROJECT.md` as
"Where a run starts" says, never Read. Under Cadence, also read the files
outside `.planning/`, with Read, Glob and Grep only, never a shell command,
enough to find the conventions "What the spine holds" asks for. Otherwise read
those two files and nothing more. Either way, never read `docs/design/` or any
other design folder, anything in `.planning/` but this design's brief, PRD and
spine, the dump, or the earlier conversation, whatever it holds. In the code,
never read inside a `.env*` file or a key or credential file with any tool or
command: skip it by name, even where Glob lists it. Any Grep not scoped to a
named source file excludes them with its glob, such as `!**/.env*`, `!**/*.pem`
and `!**/*.key`. Never quote a line elsewhere that holds a password, token, key,
or a connection string with credentials. A fact from a design folder
reaches the spine only through a quote the brief already carries. A stack or
hosting word the user said reaches it only through the brief's `> ` quotes,
since the PRD leaves those words out. On a project under Cadence the code can
settle a stack or hosting choice too, as "Stack and hosting" below says. From
the conversation it takes only the user's answers to this step's own
questions, the ones "The spine's questions" below asks and the confirm question
"The spine check" ends on, and, on a fix from the readiness question, the
finding lines that name the spine. The one other `.planning/` file a spine
step reads is the `spine.md` a rerun updates, as "The spine rerun" says.

The brief and the PRD on disk are the confirmed ones, even where they differ
from something said earlier in this conversation, as "The PRD step" says of
the brief. Build from the files as they stand. Don't point out the difference,
don't ask which is right, and carry nothing else from the conversation into
the spine.

Running this step is the go-ahead. Recommend no path and ask for no
confirmation first. The brief and the PRD count as answered, their
`[ASSUMPTION]` guesses included, so never ask their questions again.

**What the spine holds.** Only the decisions that would clash if two parts of
the system were built separately. Each decision is exactly one of six kinds,
spelled the way `docs/FORMAT.md` spells them:

- `design approach`
- `boundaries`
- `how state changes`
- `who owns shared data`
- `stack`
- `hosting`

A choice one part can make alone, such as a page layout or a library used
inside one part, stays out. A spine doesn't need all six kinds.

On a project under Cadence, a convention the existing code follows is a
decision when a part this body of work builds would clash with it if built
separately. Record it only as one of the six kinds, and leave out one that
fits none. Record only a convention that touches a part this work builds, or
a project-wide one (design approach, stack, hosting), since every S- ID needs
an epic that cites it, as "Citations" in "The epics draft" says.

**The spine's questions.** Draft the spine in this same turn, as "The spine
draft" says, unless something only the user can decide is still open. Then ask
every such question in one plain-prose message that ends your turn, and write
nothing in that turn. Use no AskUserQuestion and no menu. Once the user
answers, "Spine questions answered" in "Where the conversation stands" carries
the step on with those answers, or "Who-relies question answered" when that
turn asked the who-relies question. Only these are open:

- **Stack and hosting:** a `stack` or `hosting` decision the brief's `> `
  quotes never name. The PRD leaves those words out, so the brief's quotes are
  the only place the user settled them, and one they never name is asked
  about, never guessed. On a project under Cadence, a stack or hosting choice
  the code settles counts as settled even when the brief never quotes it, and
  isn't asked about: its decision quotes the code, as "The spine draft" says.
  A choice that shows only in a secret-bearing file or line, which the code
  reading never reads or quotes, isn't one the code settles, so ask about it.
- **The parts' questions:** the questions below, for the parts the design has.
- **Who relies on what:** on a project under Cadence, always open, a rerun
  included, so there the step never drafts in the turn it starts.

Read the brief and the PRD for two kinds of part:

- **Outside input:** anything typed or sent in by people or systems the
  project doesn't control: users, members, the public, another service. The
  operator's own data, such as a file or list the owner keeps themselves,
  isn't outside input.
- **Unattended work:** anything the system does with no person present, such
  as a scheduled job.

A design with outside input gets the trust-boundary question. So does a
design whose data shows on a page or service people outside the project can
reach, whether the design writes, changes or only reads that data. Read that
reach from the brief, the PRD and, on a project under Cadence, the code this
step already reads: there the code counts too. Ask the question with exactly
these words, on a line of their own:

```
What can people outside the project send in, and what must they never see or change?
```

A design with unattended work gets the unattended-work question and the
failure question, each with exactly these words, on a line of its own:

```
When should it run with nobody there?
```

```
If it breaks with nobody there, who is told, and how?
```

Prose before those lines can name the part they're about. The failure question
goes with unattended work only: never ask it about an outside dependency the
system leans on, such as an email provider. A design with neither outside
input nor data people outside the project can reach gets no trust-boundary
question, and one without unattended work gets neither the unattended-work nor
the failure question.

On a project under Cadence, ask the who-relies question with the spine's other
open questions, in the same message, with exactly these words, on a line of
its own:

```
Who relies on what in this project today?
```

Prose before it can say it means people and systems outside this repository.

**On a rerun.** A spine rerun reads a `spine.md` that's there, and
every decision in it counts as answered, its `[ASSUMPTION]` guesses included.
The rerun asks only about what that spine doesn't decide yet and only the user
can decide, under the same rules, and otherwise carries on in the same turn.
The one exception is the who-relies question, which a rerun on a project under
Cadence always asks.

## 16. The spine draft

Write `.planning/seldon/spine.md` with the Write tool, and use Write only to
create a spine that isn't there yet. Never Write over a `spine.md` that's
there: one that's there changes only with Edit, never a fresh Write, through
these routes:

- A rerun, from `/seldon spine`, from a bare `/seldon` whose stale check
  found `spine.md` stale, or from a fix at the readiness question, as "The
  spine rerun" below says. It's the only
  route into the spine step that updates a spine that's there.
- "Spine questions answered" or "Who-relies question answered" in "Where the
  conversation stands", when the turn that asked those questions was such a
  rerun. It carries that rerun
  on with the user's answers, as "The spine rerun" below says.
- "Names changes" in "Where the conversation stands", when the user answers
  the spine's own confirm question with changes. Make those changes in
  `spine.md` with Edit, quote the user's new words as "The user's own words"
  below says, then run "The spine check" again.

Each of these keeps the stamp line current, as "Stamps and stale links" says.

**The spine rerun.** A `/seldon spine` that finds `spine.md` there, a bare
`/seldon` whose stale check found `spine.md` stale, or a fix at the readiness
question, brings it in line with the
brief and the PRD as they stand now. Read `spine.md` first,
the previous version of this document, then `brief.md` and `prd.md`, plus the
code on a project under Cadence as "The spine step" says, and nothing else:
not a design folder, not the dump, and not the conversation.
The one thing it takes from the conversation is the user's answers to its own
questions, when the rerun stopped to ask them as "The spine step" says, except
on a fix from the readiness question: then the finding lines that name the
spine are its change too. It adds or changes the decisions those lines need,
tags a new decision with no source words `[ASSUMPTION]` as any guess is, and
asks only what "The spine's questions" allows. Every
decision in that `spine.md` counts as answered, its `[ASSUMPTION]` guesses
included, so the rerun asks only about what it doesn't decide yet, except the
who-relies question: on a project under Cadence the rerun always asks it, as
"The spine's questions" says. Change the
spine with Edit only, never a fresh Write over it, so a line the change doesn't
touch is never typed again:

- A decision the change doesn't touch keeps its heading, its `Kind:` line,
  its text and its quote or tag lines byte-identical: the same ID, the same
  kind, the same text, the same quote.
- A decision the change alters keeps its ID and takes the new text, with its
  new quote or tag.
- A decision that no longer applies is removed, its heading and its whole
  body. Its ID goes on the `Retired:` line, one prose line directly under the
  stamp line, before the first decision:

  ```
  Retired: S-03
  ```

  Make the line when the first ID retires, and add each later one to its end,
  plain and comma-separated.
- A new decision takes the next unused number. Never give it an ID that's in
  use or on the `Retired:` line: the epics and the phases built from them cite
  decisions by ID, so a retired ID stays retired.
- The stamp line takes the current stamp, even when nothing else changes.

Then run "The spine check" and end the step the way it says.

The spine has this shape, as `docs/FORMAT.md` fixes it, and the check holds it
to it:

- It opens with a `# ` title in the form `# <Project> - architecture spine`.
- The stamp line follows the title, as "Stamps and stale links" says.
- Then comes one `## ` section per decision, in exactly this form, numbered
  from `S-01` with two or more digits:

  ```
  ## S-01: <decision>
  ```

- No tag ever sits on a heading. There's no other `## ` heading, and no line
  in a body starts with `## `.
- Each body states the decision in prose and holds exactly one line that
  starts at column 0 with `Kind: `, naming one of the six kinds in "The spine
  step", spelled exactly, lowercase, with nothing else on that line.

**The user's own words.** Every decision's body carries one of two things:

- a `> ` quote directly under the decision's text
- an `[ASSUMPTION]` tag, inline right after the decision's text, never on the
  `## ` heading and never on the `Kind:` line

A spine quote comes from one of three sources, and nowhere else:

- The brief's `> ` lines, word for word. A quote is a whole `> ` line or one
  unbroken run of that line's exact words. Where the brief's quote had a
  `(docs/design/...)` line under it, keep that line under the spine's quote
  too.
- The user's replies to this step's own questions.
- On a project under Cadence, the existing code outside `.planning/`, quoted
  word for word from the file. The line right after the quote names the file,
  relative to the project root, in parentheses and indented like the quote,
  as "Words from a design folder" in "The draft" does.

The brief's item text and the PRD's text are Seldon's wording, not the user's,
so neither is ever quoted. Never paraphrase a quote and never tidy it. A
decision with no source words is a guess and carries the tag. A convention
quoted from the code carries no `[ASSUMPTION]`, because what the code shows
isn't a guess:

```
## S-03: Orders are stored in SQLite
Kind: stack
New work stores its data through better-sqlite3, as the existing code does.
> import Database from 'better-sqlite3';
(src/db.js)
```

**The answers to the spine's questions.** Each answer goes into its part's
own decision, word for word, on a `> ` line under that decision's text:

- The trust-boundary answer goes into the decision for the part people
  outside the project reach, whether it takes their input or shows them data.
- The unattended-work and failure answers, who is told when it breaks and how
  included, go into that job's own decision, the one that says what the job
  does.
- A stack or hosting answer goes into the `stack` or `hosting` decision.
- A who-relies answer goes into the decision for the part it names. An answer
  naming several parts puts each run of its words into the decision for the
  part that run names. One that names no part, such as nothing outside the
  repository relying on the project, or names only a part this body of work
  doesn't build, goes into no decision: say it back to the user in one
  sentence and record nothing. A dependent of code this work doesn't touch
  doesn't shape this design, and a decision for it would carry an S- ID no
  epic can cite.

Never put an answer into a decision of a new kind, one outside the six, or
into a decision that holds only the answer.

```
# Gristmill - architecture spine

## S-01: Orders are an append-only log
Kind: how state changes
An order's changes are stored as events and never edited. Its current state is computed from the log.
> every change to an order has to be traceable

## S-02: One server-rendered web app
Kind: design approach
The shop pages and the staff screens are pages of one app, with no separate API. [ASSUMPTION]
```

Once the spine is written, run "The spine check".

## 17. The spine check

Once the spine is written, run exactly this from the project root, with the
path unquoted:

```
node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --spine .planning/seldon
```

That's the plugin's own installed check, never a `lib/check.mjs` in the
user's project, which has none.

If it exits 1, fix each problem it names in `spine.md` with Edit, inside
`.planning/seldon/`, and run it again until it passes.

Then end the step the way "The check" says: name the file you wrote, repeat
the check's result line word for word on a line of its own, and end your turn
on one plain-prose question asking whether the user confirms the spine or
wants changes. Just before that question, a sentence names
`/seldon architecture` as the way to ask for the full architecture document
once the spine is confirmed. It goes on the question's own line or on a line
of its own just before it, such as: `/seldon architecture` can write the full
architecture document once you confirm. Do you confirm the spine, or do you
want changes?
The question mark is the last thing in your turn: nothing comes after the
question, `/seldon architecture` included.

Naming it writes nothing. Only `/seldon architecture` itself writes the
document, as "The architecture document" says, and a `/seldon architecture`
typed as the reply goes through the name test in "Where the conversation
stands" first, like any step name.

## 18. The epics step

The epics are built from `.planning/seldon/prd.md` and
`.planning/seldon/spine.md` and nothing else. Read those two files and nothing
more for it: never the brief, never `docs/design/` or any other design folder,
never the dump, and never the earlier conversation, whatever it holds, except
the finding lines that name the epics on a fix from the readiness question.
The one other file an epics step reads is the `epics.md` a rerun updates, as "The
epics rerun" says.

The PRD and the spine on disk are the confirmed ones, even where they differ
from something said earlier in this conversation, as "The PRD step" says of
the brief. Build from the files as they stand.

Running this step is the go-ahead. Recommend no path and ask for no
confirmation first. The PRD and the spine count as answered, their
`[ASSUMPTION]` guesses included. The step asks no questions of its own: draft
in this same turn, as "The epics draft" says. Its one stop point is the
confirm question "The epics check" ends on, which "Step confirm answered" in
"Where the conversation stands" already carries.

**Cutting the epics.** Size every capability before you write anything:

- A capability is one `### ` category in the PRD's Requirements. A tightly
  coupled pair of categories counts as one. Non-functional requirements aren't
  a capability.
- Every requirement ID in the PRD, non-functional ones included, lands in
  exactly one epic. A non-functional requirement rides with the epic whose
  capability it constrains and counts toward that epic's limit. Never repeat
  one across the epics it constrains.
- An epic covers one capability, or a tightly coupled pair, and carries at
  most 5 requirement IDs and 2 to 5 done-when items.
- An epic over a limit, or covering more than one capability, is split along
  the spine's `Kind: boundaries` decision that cuts it. Each requirement goes
  to the side that decision puts it on, and every epic on either side cites
  that decision's S- ID in `**Spine decisions:**`. Never split by count, such
  as the first five requirements and then the rest.

**No boundary to split on.** When a capability is over a limit and no
`Kind: boundaries` decision cuts it, write nothing. Name the capability by its
`### ` category name, and say a boundary has to be added to the spine first,
with `/seldon spine`. Ask no question, and end the turn there. Never split
anyway with an `[ASSUMPTION]` boundary.

## 19. The epics draft

Write `.planning/seldon/epics.md` with the Write tool, and use Write only to
create an `epics.md` that isn't there yet. Never Write over an `epics.md`
that's there: one that's there changes only with Edit, never a fresh Write,
through these routes:

- A rerun, from `/seldon epics`, from a bare `/seldon` whose stale check
  found `epics.md` stale, or from a fix at the readiness question, as "The
  epics rerun" below says. It's the only
  route into the epics step that updates an `epics.md` that's there.
- "Names changes" in "Where the conversation stands", when the user answers
  the epics confirm question with changes. Make those changes in `epics.md`
  with Edit, with no quote, then run "The epics check" again.

Each of these keeps the stamp line current, as "Stamps and stale links" says.

**The epics rerun.** A `/seldon epics` that finds `epics.md` there, a bare
`/seldon` whose stale check found `epics.md` stale, or a fix at the readiness
question, brings it in line with the PRD and the spine as they stand now. Read
`epics.md` first, the previous version of this document, then `prd.md` and
`spine.md`, and nothing else, however the rerun was reached. On a fix from
the readiness question, the finding lines that name the epics are its change:
it adds or changes the epics those lines need, and takes nothing else from the
conversation. It asks no question. Change the epics with Edit only, never a
fresh Write over them, so a line the change doesn't touch is never typed
again:

- An epic the change doesn't touch keeps its heading and all six fields
  byte-identical.
- An epic the change alters keeps its ID and takes the new text. A retired S-
  ID leaving its `**Spine decisions:**` is one such change.
- An epic with nothing left to build is removed, its heading and its whole
  body. Its ID goes on the `Retired:` line, one prose line directly under the
  stamp line, before the first epic:

  ```
  Retired: E-03
  ```

  Make the line when the first ID retires, and add each later one to its end,
  plain and comma-separated.
- A new epic, a split-off one included, takes the next unused number wherever
  it sits in build order, so E- numbers need not ascend through the file.
  Never give it an ID that's in use or on the `Retired:` line: Cadence's
  phases are built from the epics by ID, so a retired ID stays retired.
- The stamp line takes the current stamp, even when nothing else changes.

The sizing in "The epics step", its stop when no boundary cuts a capability
included, and the build order and citations below hold on a rerun too. Then
run "The epics check" and end the step the way it says.

The epics file has this shape, as `docs/FORMAT.md` fixes it, and the check
holds it to it:

- It opens with a `# ` title in the form `# <Project> - epics`.
- The stamp line follows the title, as "Stamps and stale links" says.
- Then comes one `## ` section per epic, in exactly this form, with two or
  more digits:

  ```
  ## E-01: <name>
  ```

- No tag ever sits on a heading. There's no other `## ` heading.
- Each epic holds six fields and nothing else, each once and in this order:
  `**Outcome:**`, `**Boundaries:**`, `**Done when:**`, `**Depends on:**`,
  `**Requirements:**`, `**Spine decisions:**`. Each starts a line with its
  bold label, the colon inside the bold, so the first non-blank line under
  the heading is `**Outcome:**`.
- The three ID fields hold plain IDs separated by commas. `**Depends on:**`
  holds `None` or epic IDs, and `**Spine decisions:**` holds `None` or S- IDs.

**Done when.** A `- ` list on the lines below its label, with nothing on the
label line, one item per bullet and 2 to 5 items. At least one item is the
epic's own, and one is the integrated item, in exactly these words:

```
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
```

**No quotes.** Epics don't follow the quote-or-tag rule. An epic's source is
its `**Requirements:**` and `**Spine decisions:**` IDs, so it carries no `> `
lines. `[ASSUMPTION]` is allowed, not required, in Outcome, Boundaries and
Done when. The tag never goes in an ID field or on a heading.

**Build order.** File order is build order:

- Epics carrying the requirement IDs the PRD's MVP scope names come before
  the rest.
- An epic depends only on epics before it. `**Depends on:**` names each
  earlier epic it builds on, or `None`.
- A first draft numbers epics from E-01 upward in file order.

**Citations.** `/cad-context` locks each epic's spine decisions for the phase
built from it, so:

- Every S- ID in the spine is cited by at least one epic.
- Every epic cites every `design approach`, `stack` and `hosting` decision.
- A split's epics on both sides cite the boundary, as "The epics step" says.
- Cite only S- IDs that are decisions in `spine.md`, and list only
  requirement IDs that `prd.md` declares. The check reads how an ID is
  spelled, never whether it's declared, so this rule is yours to keep.

```
# Gristmill - epics

## E-01: Ordering
**Outcome:** A customer orders flour from the shop pages, and staff see each order.
**Boundaries:** Placing an order and listing orders for staff. An order isn't changed once placed.
**Done when:**
- A customer can place an order, and it shows on the staff screen.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** None
**Requirements:** SHOP-01, SHOP-02, NFR-01
**Spine decisions:** S-01, S-02

## E-02: Order history
**Outcome:** Staff mark orders packed and shipped, and every change can be traced.
**Boundaries:** Changing an order's state, only by appending to its log.
**Done when:**
- Each change to an order shows in its history, oldest first.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** E-01
**Requirements:** ORD-01, ORD-02
**Spine decisions:** S-01, S-02
```

Once the epics are written, run "The epics check".

## 20. The epics check

Once the epics are written, run exactly this from the project root, with the
path unquoted:

```
node ${CLAUDE_PLUGIN_ROOT}/lib/check.mjs --epics .planning/seldon
```

That's the plugin's own installed check, as "The check" says. The epics step
runs this one, never the full check.

If it exits 1, fix each problem it names in `epics.md` with Edit, inside
`.planning/seldon/`, and run it again until it passes.

Then end the step the way "The check" says: name the file you wrote and repeat
the check's result line word for word on a line of its own. End your turn on
the epics confirm question, in exactly these words, on a line of their own,
with nothing after them:

```
Do you confirm the epics, or do you want changes?
```

## 21. The architecture document

`/seldon architecture` over a `spine.md` that's there writes the full
architecture document, `.planning/seldon/architecture.md`. It's not a step and
it has no confirm. The exact name in "Where the conversation stands" is the
only route that writes it. A reply that asks for the document in other words,
at the spine's confirm question or anywhere else, isn't that name and never
writes `architecture.md`.

Read `.planning/seldon/brief.md`, `.planning/seldon/prd.md` and
`.planning/seldon/spine.md`, and nothing else: not a design folder, not the
dump, and not the conversation.

**What it holds.** Open it with a `# <Project> - architecture` title. Then
take every decision in `spine.md`, in the spine's order, and expand on each
one under its S- ID: what it means for the parts the PRD describes, what in
the brief and the PRD leads to it, and what it rules out. Name every decision
in the spine, and draw on those three files only. It carries no stamp line.

**No decision of its own.** Every decision in the document is the spine's,
cited by its S- ID. Add no decision, give nothing an ID of its own, and cite
no S- ID that isn't a decision in `spine.md`. `/cad-context` locks only S-
IDs, so a decision made here would be a second, unlocked source a planner
could follow against the spine. Where expanding on a decision seems to need a
new one, leave it out: a new decision goes in the spine, through
`/seldon spine`.

**What it leaves alone.** Never write or edit `spine.md`, `brief.md` or
`prd.md` here, even where the expansion shows one of them out of date.

**No check.** No check runs on it, so this route runs no command.

**A second request.** When `architecture.md` is already there, Read it, then
replace it whole with Write, from the brief, the PRD and the spine as they
stand now. It holds nothing of its own to keep.

**The ending.** Name the file you wrote, and say that every decision in it is
the spine's and that a change to one goes in the spine. End there, without a
question: this route never ends a turn on one.

## 22. The readiness check

A bare `/seldon` with all four documents there and nothing stale comes here.
An independent check reads the finished design, and you repeat what it
reports. Write and edit nothing, and never Read `prd.md`, `spine.md` or
`epics.md` yourself, before the check or after it.

**The start.** Start exactly one agent, `seldon:readiness`, with the Agent
tool, and start no other agent. Its prompt is the paths of the working
folder's `prd.md`, `spine.md` and `epics.md`, one per line, and nothing else:

```
.planning/seldon/prd.md
.planning/seldon/spine.md
.planning/seldon/epics.md
```

**One message.** Every tool call this route makes comes before the first line
of its report: the stale check, the agent start and, when the handoff follows,
the handoff's Glob for `.planning/PROJECT.md`. Once the agent's reply is in
hand, do that Glob before you write any line of the report. Then the report,
the handoff's lead-in and the command are one final message, with no tool call
after its first line. Text written before a tool call isn't in the message the
user sees last.

**The reply.** It's either the no-findings line alone:

```
The readiness check found nothing to fix.
```

or one or more finding lines, each starting with one of three kind labels and
ending with the step that fixes it, in these forms:

```
Requirement no epic names: <requirement ID>. Fixed by rerunning /seldon epics.
Epic crossing a boundary the spine didn't fix: <epic ID> (<categories>). Fixed by rerunning /seldon spine.
Decision left open: <epic IDs, comma-separated> (<the choice, in a few words>). Fixed by rerunning /seldon spine.
```

- **No findings:** say the no-findings line on a line of its own, ask nothing,
  and give the handoff as "The handoff" says.
- **Findings:** repeat each finding line word for word, each on a line of its
  own, adding none and dropping none. Then end on the readiness question, in
  exactly these words, on a line of their own. Its question mark is the last
  thing in the turn, and nothing follows it:

  ```
  Do you want to fix these, or hand off the design as it is?
  ```

- **Did not run:** the start is denied or refused, the Agent tool isn't there,
  or the reply isn't in those forms. Never say the no-findings line, and ask
  nothing. Say the did-not-run line with the reason in a few words, then the
  not-checked line, each on a line of its own, then give the handoff. A later
  bare `/seldon` tries the check again.

  ```
  The readiness check did not run: <the reason, in a few words>.
  ```

  ```
  The design was not checked before this handoff.
  ```

## 23. The handoff

"The readiness check" and a hand-off answer to its question end here. Ask
whether `.planning/PROJECT.md` exists with Glob, never Read, as "The spine
step" does. That Glob comes before the handoff's first line, and before any
report line when the readiness check leads here. No tool call follows the
lead-in. Read none of Cadence's files to decide anything.

Say the lead-in on a line of its own, then the command on a line of its own:

```
To hand this design to Cadence, run:
```

- **No `.planning/PROJECT.md`:** the command is the last line of the turn:

  ```
  /cad-new-project --brief .planning/seldon
  ```

- **`.planning/PROJECT.md` there:** the command, then the already-built
  sentence on a line of its own as the last thing in the turn, for a named
  design too:

  ```
  /cad-phase add --brief .planning/seldon
  ```

  ```
  If Cadence has already built this design, there's nothing to hand off.
  ```

With a named design both commands name `.planning/seldon/<name>`, unquoted and
with no trailing slash, as "Designs and the working folder" says.

The handoff writes and edits nothing and leaves no record, so a later bare
`/seldon` on the same documents checks again and prints the command again.

</process>
