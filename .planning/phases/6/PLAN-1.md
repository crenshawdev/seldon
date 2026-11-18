---
phase: 6
plan: 1
requirements:
  - FLOW-05
  - ARCH-03
files:
  - docs/FORMAT.md
---

# Phase 6: Existing projects and design folders - Plan 1: The format for named designs and code quotes

## Goal

Seldon designs the next body of work on a project already under Cadence, in its own design folder beside any design already there, and the spine records the existing code's conventions, proven by eval cases this phase adds. This plan gives the format contract both halves: where each design lives, and how the spine quotes the code.

## Must be true when done

- `docs/FORMAT.md`'s "Location and ownership" says a project's first design sits at the top of `.planning/seldon/` and stays there, and each later body of work gets its own named design in `.planning/seldon/<name>/`, holding the same four files under the same rules, its name made of lowercase letters, digits and hyphens. It still says Seldon writes nothing outside `.planning/seldon/`.
- "The check" says `<dir>` can be a named design's folder.
- "In the spine" names three quote sources: the brief's `> ` lines, the user's replies to the spine step's questions, and, on a project already under Cadence, the existing code, quoted word for word with a `(path)` line under it.
- The new spine example, under a `# ` title in a temp folder, passes `node lib/check.mjs --spine`.
- `lib/check.mjs` is unchanged (D-07).

## Context

- **Locked:** D-02, D-03, D-04 (the name's characters) and D-07. D-01's test, `.planning/PROJECT.md` exists, says when the code is a quote source.
- **Words (my choice):** "design folder" already means a project's own design notes, such as `docs/design/`, in "Location and ownership" and in "Words from a design folder". The new folders are "named designs" or "a design's folder", never a bare "design folder", so a reader never takes Seldon's input for its output. Plans 3 and 8 use the same words.
- **Out:** `lib/check.mjs`, `samples/` and SKILL.md. Which Cadence command takes a named design belongs to the readiness and handoff phase, and nothing here names one.
- **Owner's words:** committed files never carry the owner's own words. Examples use Tally, Toolshed or another coined project.

## Tasks

### Task 1: Say where each design lives

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#Location and ownership, docs/FORMAT.md#The architecture document, docs/FORMAT.md#The check
- **Decisions:** D-02, D-03, D-04
- **Action:** "Location and ownership" says where each body of work's design goes, and "The check" follows it.
  - **The top-level design (D-03):** the first design sits at the top of `.planning/seldon/`, at the four paths the section lists today, and stays there. Seldon never moves it into a named folder.
  - **Named designs (D-02):** each later body of work gets its own folder, `.planning/seldon/<name>/`, holding the same four files under every rule in this document. Write the path in exactly that form, `<name>` included.
  - **The name (D-04):** lowercase letters, digits and hyphens.
  - **The architecture document:** "The architecture document" says it sits in its design's folder, beside the spine it expands on, so a named design's is `.planning/seldon/<name>/architecture.md`.
  - **Kept:** "It writes nothing outside `.planning/seldon/`.", the sentence on a design folder the project already has, and "Cadence stays the only writer of its own files."
  - **"The check":** `<dir>` is `.planning/seldon/` for the top-level design, `.planning/seldon/<name>/` for a named one, and `samples/` in this repository.
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today are enough, and testing stops there.
  - (1) `.planning/seldon/<name>/` appears in each of the three sections, counted per section so none can carry another's count. Each of these prints at least 1, and each prints 0 today:
    - `perl -ne 'print if /^## Location and ownership/../^### The architecture document/' docs/FORMAT.md | grep -c '\.planning/seldon/<name>/'`
    - `perl -ne 'print if /^### The architecture document/../^## Rules for every file/' docs/FORMAT.md | grep -c '\.planning/seldon/<name>/'`
    - `perl -ne 'print if /^## The check/../^### The brief alone/' docs/FORMAT.md | grep -c '\.planning/seldon/<name>/'`
  - (2) `perl -ne 'print if /^## Location and ownership/../^## Rules for every file/' docs/FORMAT.md | grep -c 'lowercase letters, digits and hyphens'` prints 1. It prints 0 today.
  - (3) `grep -c 'It writes nothing outside' docs/FORMAT.md` still prints 1.

### Task 2: Add the code as the spine's third quote source

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#In the spine, docs/FORMAT.md#Words from a design folder, docs/FORMAT.md#The [ASSUMPTION] tag
- **Decisions:** D-07, D-01
- **Action:** "In the spine" adds the existing code as a third quote source (D-07).
  - **The source:** on a project already under Cadence, one with `.planning/PROJECT.md` (D-01), words from the project's existing code outside `.planning/`, quoted word for word from the file. The line right after the quote names the file, relative to the project root, in parentheses and indented like the quote, the way "Words from a design folder" quotes a design note.
  - **No tag:** a convention quoted from the code carries no `[ASSUMPTION]`, since what the code shows isn't a guess. Say so in one sentence.
  - **"two sources":** "A spine quote comes from one of two sources, and nowhere else" becomes three. The brief's lines and the user's replies stay as they are.
  - **Example:** one more fenced example under the existing one, a Tally decision whose quote is one line of code with its `(path)` line under it and a `Kind:` line naming one of the six kinds. It holds no `## ` line other than its heading.
  - **The tag section:** "Untagged text is the user's own, or a design document's when its quote names a source file" also names the code's.
  - **The check:** say nothing new about it. To the check the source line is body text, as "Words from a design folder" already says, and `lib/check.mjs` doesn't change (D-07).
- **Verify:**
  - **Testing scope:** documentation only. Greps that fail today and one run of the example through the check are enough, and testing stops there.
  - (1) `perl -ne 'print if /^### In the spine/../^## The check/' docs/FORMAT.md` piped to `grep -ci cadence` prints at least 1, and piped to `grep -c '^ *([^)]*)$'` prints at least 1. Each prints 0 today.
  - (2) The new example, with `# Tally - architecture spine` above it, saved as `spine.md` in a temp folder: `node lib/check.mjs --spine <folder>` exits 0.
  - (3) `git diff --stat -- lib/` prints nothing.
  - (4) The rest of the Action's edits, each a grep that fails while its edit is missing:
    - `grep -c 'one of two sources, and nowhere else' docs/FORMAT.md` prints 0. It prints 1 today.
    - `perl -ne 'print if /^### In the spine/../^## The check/' docs/FORMAT.md | grep -ci 'three sources'` prints at least 1, or whatever exact words replace "two sources", named in the task's report.
    - The no-tag sentence: the same "In the spine" range piped to `grep -c 'ASSUMPTION'` prints at least 2. It prints 1 today. The task's report names the sentence.
    - `perl -ne 'print if /^## The \[ASSUMPTION\] tag/.../^## The user/' docs/FORMAT.md | grep -ci 'code'` prints at least 1, so "Untagged text is ..." names the code's quotes. It prints 0 today.
