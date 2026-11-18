---
description: A full project description, so Seldon recommends the fast path and has nothing to ask through a menu.
runs: 1
max_turns: 10
timeout_seconds: 300
allowed_tools: [Skill, AskUserQuestion, Read, Glob, Grep]
---

/seldon I want to build Shelfmark, a small command-line tool that keeps track of the books I lend to friends.

Problem: I lend out a lot of books and lose track of who has which one. A notebook didn't work because I never have it with me, and a spreadsheet is too much ceremony for a ten-second job.

Solution: a single Node CLI. `shelfmark lend "Dune" to Priya` records a loan, `shelfmark back "Dune"` closes it, and `shelfmark out` lists what's still out, oldest first, with how many days each has been gone. Data lives in one JSON file in my home directory. No server, no accounts, no sync.

Who it serves: me, and maybe a few friends who lend books the same way. Everyone using it is comfortable in a terminal.

What's different: it's three commands and nothing else. The apps I tried want a full catalogue of every book you own before they'll track a single loan.

Success: I can record a loan in under ten seconds, and after three months I can say who has every book that's out without guessing.

Scope: lend, return and list, plus a `--json` flag on `out`. Not in scope: a catalogue of owned books, reminders, notifications, a web or phone app, or sharing between people.

Vision: it stays this small. If it grows at all, the next thing is an optional reminder after 60 days.

Stakes: it's a personal hobby project. If the data file is lost I retype a handful of loans, nobody pays for it, and nothing else depends on it.
