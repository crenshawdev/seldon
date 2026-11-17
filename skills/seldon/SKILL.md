---
name: seldon
description: "Start a project's design before Cadence builds it. Paste or describe what you have - an idea, notes, a half-written spec - and Seldon reads it, judges how much is still open and what is at stake, recommends the fast path or coaching, and once you confirm a path writes the brief to .planning/seldon/brief.md. Then it builds the PRD from that brief at .planning/seldon/prd.md, and after a /clear it picks up from those files."
argument-hint: "[what you have: the idea, notes or spec, pasted or described]"
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
PRD from that brief alone, at `.planning/seldon/prd.md`. A new run picks up
from the files in `.planning/seldon/`, so the walk survives a `/clear`.
</objective>

<rules>
- Every question you ask is plain prose at the end of your message, and asking
  it ends your turn. Never use AskUserQuestion, a numbered menu or a list of
  options to pick from. The user answers in their own words in the next turn.
- The only files you write are `.planning/seldon/brief.md` and
  `.planning/seldon/prd.md`. Never write, edit or create anything else, in the
  project or outside it. A design folder is input only.
- When the user asks for the brief, or anything else, somewhere else - a
  `docs/` file, the README - say that you write only inside `.planning/seldon/`,
  and don't do it.
- The only command you run is the check in "The check", exactly as written
  there.
- No persona and no role-play. Speak as Seldon, plainly.
</rules>

<process>

## 1. Where the conversation stands

Before anything else, find your place. The conversation decides it only inside
a step that's already under way, which the message that ended your last turn
shows. Check these in order:

- **Run finished:** the message that ended your last turn repeated a check's
  result line. That run is over, whatever the user says now. Start a new run
  at "Where a run starts".
- **Dump given:** your last turn asked for the dump, and the user's message
  gives it. That message is the dump. Go to "The design folder".
- **Path chosen:** your last turn gave your recommendation, and the user
  answered it. Go to "After the answer" with the path the user chose. Never
  recommend again.
- **Interview under way:** your last turn asked the fast-path questions or a
  coaching question, and the user answered. Carry on from there.
- **PRD questions answered:** your last turn asked the PRD step's questions,
  and the user answered. Go to "The PRD draft" and draft with those answers.
- **Documents question answered:** your last turn ended on the documents
  question in "A dump when documents are there", and the user answered it.
  Look for the files again, as "Where a run starts" says. Going on from the
  brief follows that section's routes, exactly as a resume does:
  - Only a brief there: start with the resume line, then go to "The PRD step".
  - A brief and a PRD there: write nothing, and end on the later-release line.
    Going on never runs the PRD step over a PRD that's there.

  The text from the question's turn isn't input to the PRD. When the user
  asks to rerun the brief instead, `/seldon brief` typed as the reply
  included, write nothing and say that rerunning the brief comes in a later
  release.

Anything else is a new run: start at "Where a run starts". The files in
`.planning/seldon/` decide where a new run goes, even when this conversation
still holds an earlier run. Suggesting a `/clear` is fine, but never ask for
one: a new run builds from the files alone, whatever the conversation holds.

This skill can be loaded again on a later turn with a summary of the
conversation as its arguments. On a later turn `$ARGUMENTS` is that summary,
not a new dump, so never read it as one. Only a new run takes its dump from
`$ARGUMENTS`.

The recommendation turn writes nothing. Drafting starts only on a later turn,
after the user confirms a path.

## 2. Where a run starts

Before you ask for or read any dump, look for `.planning/seldon/brief.md` and
`.planning/seldon/prd.md` in the project with Read or Glob. An error or no
match means that file isn't there. A brief on disk counts as confirmed, so
there's no record of a confirmation to look for. `$ARGUMENTS` counts as empty
when it holds nothing but blanks. Then:

- **No brief:** go on to "The dump".
- **A brief, no PRD and empty `$ARGUMENTS`:** this is a resume. Before you
  draft or write anything, start your message with exactly these words, on a
  line of their own:

  ```
  I'm building the PRD from .planning/seldon/brief.md, the brief that's already there. To revise the brief instead, run /seldon brief.
  ```

  Then go to "The PRD step".
- **A brief and a PRD, and empty `$ARGUMENTS`:** write nothing. End your
  message with exactly these words, on a line of their own, with nothing after
  them. This is the later-release line:

  ```
  The spine and epics steps come in a later release, so I've written nothing this time.
  ```

- **A brief, and `$ARGUMENTS` isn't empty:** write nothing, and go to "A dump
  when documents are there".

### A dump when documents are there

The user's words are never set aside without asking. When a brief is already
there and `$ARGUMENTS` isn't empty, write nothing in this turn. Don't read a
design folder and don't judge a path on that text. Use no AskUserQuestion and
no menu. End your message with exactly these words, on a line of their own,
with nothing after them. This is the documents question:

```
Do you want to rerun the brief with this text, using /seldon brief, or go on from the brief that's already there?
```

That question ends your turn.

## 3. The dump

On a new run the text in `$ARGUMENTS` is the user's dump. If it is empty, ask
for the dump and write nothing in that turn. End your message with exactly
these words, on a line of their own, with nothing after them:

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

Write `.planning/seldon/brief.md` with the Write tool. The brief has this
shape, and the check holds it to it:

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

Then end with your final message: name the file you wrote, and repeat the
check's result line word for word on a line of its own.

## 12. The PRD step

The PRD is built from `.planning/seldon/brief.md` and nothing else. Read that
file and nothing more for it: never `docs/design/` or any other design folder,
never the dump, and never the earlier conversation, whatever it holds. A fact
from a design folder reaches the PRD only through a quote the brief already
carries.

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
there and this run isn't a `/seldon prd` rerun, write nothing, and end your
message on the later-release line from "Where a run starts", on a line of its
own, with nothing after it. Only a `/seldon prd` rerun changes a PRD that's
there, and it does that with Edit, never a fresh Write.

The PRD has this shape, and the check holds it to it:

- It opens with a `# ` title naming the project, in the form
  `# <Project> - PRD`.
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

**Non-goals.** What the product won't do.

**MVP scope.** Which requirement IDs come first.

**Capabilities, not implementation.** The PRD says what the product does,
never how it's built. Name no library, framework, format or hosting choice,
even when the brief names one: those belong to the spine. A technical word the
user said stays in the brief and isn't carried into the PRD.

Once the PRD is written, run "The PRD check".

</process>
