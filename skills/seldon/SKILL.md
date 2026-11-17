---
name: seldon
description: "Start a project's design before Cadence builds it. Paste or describe what you have - an idea, notes, a half-written spec - and Seldon reads it, judges how much is still open and what is at stake, recommends the fast path or coaching, and once you confirm a path writes the brief to .planning/seldon/brief.md."
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
path, write the project's brief to `.planning/seldon/brief.md`.
</objective>

<rules>
- Every question you ask is plain prose at the end of your message, and asking
  it ends your turn. Never use AskUserQuestion, a numbered menu or a list of
  options to pick from. The user answers in their own words in the next turn.
- The only file you write is `.planning/seldon/brief.md`. Never write, edit or
  create anything else, in the project or outside it. A design folder is input
  only.
- When the user asks for the brief, or anything else, somewhere else - a
  `docs/` file, the README - say that you write only inside `.planning/seldon/`,
  and don't do it.
- The only command you run is the check in "The check", exactly as written
  there.
- No persona and no role-play. Speak as Seldon, plainly.
</rules>

<process>

## 1. Where the conversation stands

Before anything else, find your place in this conversation. Read only the
conversation to find it, never a file: rebuilding a run after `/clear` comes
in a later release. Then pick up at the step your place names, checking them
in this order:

- **Run finished:** you've already repeated the check's result line in a
  final message in this conversation. That run is over, whatever the user
  says now. Go to "A brief already there".
- **New run:** you haven't asked for the dump or given a recommendation in
  this conversation. Start at "A brief already there".
- **Dump given:** you asked for the dump, and the user's message gives it.
  That message is the dump. Go to "The design folder".
- **Path chosen:** you gave your recommendation, and the user answered it. Go
  to "After the answer" with the path the user chose. Never recommend again.
- **Interview under way:** you asked the fast-path questions or a coaching
  question, and the user answered. Carry on from there.

This skill can be loaded again on a later turn with a summary of the
conversation as its arguments. On a later turn `$ARGUMENTS` is that summary,
not a new dump, so never read it as one. Only a new run takes its dump from
`$ARGUMENTS`.

The recommendation turn writes nothing. Drafting starts only on a later turn,
after the user confirms a path.

## 2. A brief already there

When a run starts or a run has finished, before you ask for or read a dump,
look for `.planning/seldon/brief.md` in the project with Read or Glob. An
error or no match means there isn't one, so go on to "The dump".

If it's there, write nothing, and don't edit or replace it. Say that a brief
is already there, and that a rerun of a step comes in a later release. Then
end.

This check runs when a run starts and on every turn after a run has finished.
While a run is still under way, the brief you just wrote is expected.

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
plain-prose message that ends your turn, and write nothing in that turn. Ask
about who it serves plainly, as who the project is for. Ask about refusals as
what the project won't do, and why. Once the user answers, look at What it
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

</process>
