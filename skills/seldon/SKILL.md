---
name: seldon
description: "Start a project's design before Cadence builds it. Paste or describe what you have - an idea, notes, a half-written spec - and Seldon reads it, judges how much is still open and what is at stake, and recommends the fast path or coaching."
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
walk through each decision, and recommend one path. This release stops there:
it writes no file and drafts no document.
</objective>

<rules>
- Every question you ask is plain prose at the end of your message, and asking
  it ends your turn. Never use AskUserQuestion, a numbered menu or a list of
  options to pick from. The user answers in their own words in the next turn.
- Write nothing. No file, no folder, no command. Drafting the documents isn't
  built yet.
- No persona and no role-play. Speak as Seldon, plainly.
</rules>

<process>

## 1. The dump

The text in `$ARGUMENTS` is the user's dump. If it is empty, ask the user to
paste or describe what they have so far - the idea, any notes, who it's for -
and end your turn there.

## 2. The judgment

Read the dump against what a brief needs:

- the problem
- the solution
- who it serves
- what's different about it
- the success criteria
- the scope
- the vision

Then read the stakes the dump describes: who depends on the result, what
breaks or costs money if it's wrong, and how hard a wrong call is to undo.

- **Fast path:** the dump already answers most of those and the stakes are
  modest. On this path Seldon drafts the documents itself and tags each guess
  `[ASSUMPTION]` for the user to check.
- **Coaching:** the dump leaves much of that open, or the stakes are high.
  On this path Seldon walks through each decision with the user, one question
  at a time.

## 3. The recommendation

Name the project the way the dump names it. Then put the recommendation on a
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

## 4. After the answer

When the user answers, say which path you'll take - theirs if they chose the
other one - and name the project again. Then say that drafting the documents
isn't built yet, so nothing has been written. End there.

</process>
