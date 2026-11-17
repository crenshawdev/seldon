# Seldon's document format

This is the contract for the four documents Seldon writes. Cadence's reader is built against it, and `node lib/check.mjs <dir>` enforces it. `samples/` in this repository holds one complete set that conforms. Seldon also writes one more file, `architecture.md`, but only when the user asks for it, and this contract gives it no shape (see "Location and ownership").

## Location and ownership

Seldon writes the four documents of the contract, all in `.planning/seldon/`:

- `.planning/seldon/brief.md`
- `.planning/seldon/prd.md`
- `.planning/seldon/spine.md`
- `.planning/seldon/epics.md`

It writes nothing outside `.planning/seldon/`. A design folder the project already has, such as `docs/design/`, is read as input and never written to. Cadence stays the only writer of its own files.

### The architecture document

Seldon also writes one more file, `.planning/seldon/architecture.md`, and only when the user asks for it with `/seldon architecture`. It's the one file Seldon writes only on request.

- It expands on the spine's decisions by their S- IDs, drawing on the brief, the PRD and the spine.
- It adds no decision and no ID of its own, so the spine's S- IDs stay the only decisions a reader locks.
- This document defines no shape for it, and no check reads it. The full check ignores it, as it ignores any other file in the folder.

## Rules for every file

- The file is UTF-8 Markdown. Lines end in `\n`, and a reader also accepts `\r\n`.
- The first non-blank line is a `# ` title.
- A line that starts with `## ` is a section heading. A section runs from its heading to the next `## ` heading or the end of the file, and its body is everything in between, `### ` subheadings included.
- A body is empty when it has no non-blank line. No section is empty.
- Headings are read line by line, with no Markdown parser, so a line inside a code block that starts with `## ` still counts as a heading. Seldon never starts a code-block line with `## `.
- Each file allows only the `## ` sections its own rules name, and no heading appears twice.
- Section names are matched exactly, with ASCII punctuation (`What's different` uses a straight `'`).

## brief.md

The brief has these eight `## ` sections, written in this order:

1. `## Problem`
2. `## Solution`
3. `## Who it serves`
4. `## What's different`
5. `## Success criteria`
6. `## Scope`
7. `## What it refuses`
8. `## Vision`

Each one is present and not empty. A reader finds a section by its name, not its position.

### Refusals

`## What it refuses` names what the product won't do, and why. Each refusal is a `- ` bullet that says what it won't do, then `because` and the reason, in the same bullet:

```
- It won't send invoices, because treasurers already invoice from their bank.
```

One shape means a reader always finds the reason in the same place. The check requires the section present and not empty, like every brief section, and doesn't read its bullets.

A refusal is never a guess, so this section never carries `[ASSUMPTION]`. When the user says the project refuses nothing, the section holds their own words on a quoted line instead, with no bullet:

```
> it doesn't refuse anything, it's a toy for my kids
```

## prd.md

The PRD has these five `## ` sections, written in this order:

1. `## Requirements`
2. `## Non-functional requirements`
3. `## User journeys`
4. `## Non-goals`
5. `## MVP scope`

Each one is present and not empty.

### Requirement bullets

Every line in `## Requirements` and `## Non-functional requirements` that starts with `- ` at column 0 is a requirement, and has exactly this form:

```
- **CAT-01**: <one line>
```

- Only the ID goes inside the bold span. The colon, a space and the text follow it outside the span. `- **CAT-01:** text` and `- CAT-01: text` are both wrong.
- The text after `: ` is one line and not empty.
- The form is Cadence's `## Active` bullet, so a requirement carries into Cadence's `REQUIREMENTS.md` unchanged.

Other lines in these sections, such as prose and indented lines, are not requirements, and Seldon doesn't write indented bullets there.

In `## Requirements`, every requirement sits under a `### <Category>` subheading, so no requirement comes before the section's first `### ` line. `## Non-functional requirements` uses the same bullet form, and its bullets need no subheading.

Each of the two sections holds at least one requirement in this form. Prose and `### ` lines alone don't count, so a section without one fails the check, for example `prd.md: Requirements: no "- **CAT-01**: text" requirement`. A missing or empty section is reported as that instead, with no second line.

### Requirement IDs

A requirement ID is a prefix, a dash and a number:

- The prefix is 2 to 8 characters, uppercase letters or digits, and has at least one letter. That's Cadence's admission test (`REQ_ID_EXACT` in Cadence's `planning-files.mjs`), so Cadence's audit counts every Seldon requirement.
- The number is two or more digits (`01`, `12`, `104`).
- An ID appears once in `prd.md`, across both sections.
- A dropped requirement's ID is retired and never reused (see "IDs are stable").

Examples: `**CAT-01**`, `**SYNC-03**`, `**NFR-01**`, `**2FA-01**`.

### Non-goals

Each refusal in the brief's `## What it refuses` carries into `## Non-goals` in the brief refusal's own shape: a `- ` bullet that says what the product won't do, then `because` and the reason. The brief's quote for that refusal sits under it, word for word:

```
- It won't send invoices, because treasurers already invoice from their bank.
  > no invoices, we do those from the bank
```

- The PRD keeps exactly its five sections. Refusals go in `## Non-goals`, never in a section of their own.
- `## Non-goals` can hold other non-goals too, each under the quote-or-tag rule (see "In the PRD", under "The user's own words").
- When the brief refuses nothing, its refusal section holds only the user's quote saying so. No refusal is carried, and Seldon invents none.
- The check reads `## Non-goals` only for being present and not empty, and doesn't read its bullets.

## spine.md

The spine holds one `## ` section per decision, and no other `## ` sections:

```
## S-01: <decision>
Kind: <kind>
<the decision>
```

- The ID is `S`, a dash, then two or more digits. The heading has text after `: `.
- The body states the decision, so it isn't empty.
- An ID appears once. The file has at least one decision.

### The Kind line

Each decision's body holds exactly one line that starts at column 0 with `Kind: `. The rest of that line is exactly one of six kinds, and nothing else goes on it:

- `design approach`
- `boundaries`
- `how state changes`
- `who owns shared data`
- `stack`
- `hosting`

These six are the decisions that would clash if two parts were built separately, and that's all a spine holds. A spine doesn't have to use all six.

- The line can sit anywhere in the body. It names the kind and doesn't state the decision, so the body also holds the decision's text. A body holding nothing but its `Kind:` line, and perhaps the tag, is empty.
- The line is read exactly, like section names: lowercase and spelled as above. A seventh kind, another spelling, a second `Kind:` line or a tag on the line fails the check, for example `spine.md: S-02: Kind: missing line`.

## epics.md

The epics file holds one `## ` section per epic, in build order, and no other `## ` sections:

```
## E-01: <name>
```

- The ID is `E`, a dash, then two or more digits. The heading has text after `: `.
- An ID appears once. The file has at least one epic.

File order is build order, and Cadence's reader takes the epics in file order:

- An epic depends only on epics before it in the file.
- Epics carrying MVP-scope requirements come before the rest.
- E- numbers need not ascend through the file. An epic split off on a rerun takes the next unused number, wherever it sits.

### Epic fields

Each epic carries six fields, each once and in this order. A field starts on a line that begins with its bold label, with the colon inside the bold:

1. `**Outcome:**`
2. `**Boundaries:**`
3. `**Done when:**`
4. `**Depends on:**`
5. `**Requirements:**`
6. `**Spine decisions:**`

- A field's value is the rest of its label line plus every line below it, up to the next label line or the next `## ` heading.
- No value is empty.
- The epic body is the six fields and nothing else, so the first non-blank line under the heading is the `**Outcome:**` line.

`**Done when:**` is always a `- ` list on the lines below its label, one item per bullet:

- An item is a line in the field's value that starts with `- ` at column 0. An indented line continues the bullet above it and isn't an item.
- Text on the label line is no item, so done-when never sits on its label line: one line can't hold the 2 items it needs.
- It holds 2 to 5 items, the same 2 to 5 success criteria Cadence's `/cad-new-project` gives a phase.
- Every epic is shippable on its own, so one item is the integrated item, in exactly these words:

```
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
```

- At least one more item is the epic's own. The integrated item can sit anywhere in the list.
- Items are free text, so the tag is allowed in them and not required (see "The [ASSUMPTION] tag").

Three fields hold IDs, written plainly (not bolded) and separated by commas:

| Field | Value |
|---|---|
| `**Depends on:**` | `None`, or one or more epic IDs (`E-01, E-02`) |
| `**Requirements:**` | one or more requirement IDs (`CAT-01, SYNC-03`) |
| `**Spine decisions:**` | `None`, or one or more spine IDs (`S-01, S-02`) |

- `**Requirements:**` holds at most 5 requirement IDs, non-functional ones included, since they share the ID space.
- `**Depends on:**` names only epics whose headings come earlier in the file, or `None`.
- The requirements and spine decisions an epic names are declared in `prd.md` and `spine.md`.

The check reads the spelling of all three ID fields, holds `**Requirements:**` to at most 5 IDs and holds `**Depends on:**` to earlier epics. Whether a requirement or spine ID is declared in `prd.md` or `spine.md` is a cross-reference between files, which a later trace check covers.

## IDs are stable

An ID is never renumbered or reused. When a requirement, decision or epic is removed, its ID stays retired, and the next new one takes the next unused number. Everything downstream, Cadence's `REQUIREMENTS.md` and the phases built from the epics, refers to these IDs.

When a rerun drops a requirement, `prd.md` keeps its ID on one prose line directly under `## Requirements`, before the first `### ` category, so it belongs to no category and a reader finds it in one place:

```
Retired: CAT-03, LOAN-02
```

- The IDs are plain, not bold, separated by commas and listed in the order they were retired.
- The line is absent until an ID is retired. A later retirement extends the same line.
- A retired ID is never reused, by a requirement or a non-functional requirement, because IDs carry into Cadence's `REQUIREMENTS.md` unchanged.
- The check reads only `- ` bullets in the requirement sections, so to it this line is prose.

When a spine rerun drops a decision, `spine.md` keeps its ID on one prose line directly under the `# ` title, before the first `## ` decision:

```
Retired: S-03
```

- The rules are the PRD line's: the IDs are plain and separated by commas, in the order they were retired. The line is absent until the first retirement, and a later one extends it.
- A retired ID is never reused, because the epics and the phases built from them cite decisions by ID.
- To the check this is text before the first decision, which no rule reads.

When an epics rerun drops an epic, `epics.md` keeps its ID on one prose line directly under the `# ` title, before the first `## ` epic:

```
Retired: E-03
```

- The rules are the spine line's: the IDs are plain and separated by commas, in the order they were retired. The line is absent until the first retirement, and a later one extends it.
- A retired ID is never reused, because Cadence's phases are built from the epics by ID.
- It sits under the title because after the last epic the check would read it as part of that epic's last field.
- To the check this is text before the first epic, which no rule reads.

Spine decisions and epics use a one-letter prefix on purpose. Cadence's audit admits only a prefix of 2 to 8 characters before the dash as a requirement ID, so it never counts `S-01` or `E-01` as a requirement.

## The [ASSUMPTION] tag

On the fast path Seldon drafts with guesses, and it tags each one so a reader can tell a guess from what the user said.

- The tag is spelled exactly `[ASSUMPTION]`, uppercase, in square brackets. No other spelling counts.
- It goes inline, right after the guessed text it marks.
- It goes only in free text: prose or a bullet's text in a section body, or the value of a free-text epic field (`**Outcome:**`, `**Boundaries:**`, `**Done when:**`).
- It never goes inside an ID-list field (`**Depends on:**`, `**Requirements:**`, `**Spine decisions:**`), on a `## ` heading line, on a spine decision's `Kind:` line, inside a bold field label or inside a requirement's bold ID span. The check reads all of those exactly, so a tag there fails it. `**Depends on:** None [ASSUMPTION]` is reported as not an epic ID, for example. A guessed ID is noted in free text instead.

Tagged text is a guess Seldon made that the user hasn't confirmed, and a reader treats it as one to confirm. Untagged text is the user's own, or a design document's when its quote names a source file (see "The user's own words").

In the free-text places above, `lib/check.mjs` neither requires nor rejects the tag, so text there checks the same with or without it. The tag on its own isn't text, so a section body or field holding only the tag is empty.

```
A treasurer closes the month in under ten minutes. [ASSUMPTION]
```

## The user's own words

When Seldon writes an item in `brief.md` from the user's own words, the item keeps the exact phrase it came from, word for word, on a quoted line directly under it. No paraphrase, no summary and no tidied wording.

- The user's own words are anything the user wrote, in the dump or in a reply to a question Seldon asked.
- An item quotes only the phrase it came from, never the whole dump.
- The quoted line starts with `> `. Under a `- ` bullet it's indented two spaces, `  > `, so it stays with its bullet.
- A phrase that runs over several lines keeps its line breaks, and each line starts the same way.
- When one answer feeds several items, each item quotes the part of it that item rests on, as one run of the user's exact words.
- An item with no source words is a guess, so it carries `[ASSUMPTION]` and no quote.

The check neither requires nor rejects a quoted line. To the check it's body text.

```
- It won't take reservations, because a tool goes to whoever is at the counter.
  > no reservations, whoever's at the counter gets the drill
```

This rule covers `brief.md`, `prd.md` and `spine.md` (see "In the PRD" and "In the spine" below).

### Words from a design folder

Seldon also reads a design folder, such as `docs/design/`, and an item it drafts from words there is quoted the same way, word for word. The line right after the quote names the source file, relative to the project root, in parentheses and indented like the quote, so nobody mistakes an old design document for something the user just said:

```
- Members pay their dues once a year.
  > dues are collected annually, every January
  (docs/design/ledger.md)
```

A multi-line quote takes the source line after its last line. A quote with no source line under it is the user's own words. To the check the source line is body text too. The user sees these items before Seldon drafts, when they confirm the path.

### In the PRD

In `prd.md` the rule holds every requirement bullet, in both `## Requirements` and `## Non-functional requirements`, and every non-goal in `## Non-goals`. Each one carries one of two things:

- A `> ` quote directly under it. Under a `- ` bullet the quote is indented two spaces, `  > `, as in the brief.
- An inline `[ASSUMPTION]` tag.

A PRD quote comes from one of two sources:

- The brief's `> ` lines, word for word. A quote is a whole `> ` line or one unbroken run of that line's exact words. Where the brief's quote had a design-file source line under it, the PRD's quote keeps that source line under it too.
- The user's own replies during the PRD step.

The brief's item text is Seldon's wording, not the user's, so it's never a quote source. A requirement with no source words is a guess and carries the tag, never inside the bold ID span (see "The [ASSUMPTION] tag").

`## User journeys` and `## MVP scope` aren't held to this rule. In the PRD, as in the brief, the check neither requires nor rejects a quoted line.

```
- **LEDG-01**: A treasurer records a payment against a member.
  > one place to record each payment
- **NFR-01**: The ledger loads in under a second for 200 members. [ASSUMPTION]
```

### In the spine

In `spine.md` the rule holds every decision. Its body carries one of two things:

- A `> ` quote directly under the decision's text.
- An inline `[ASSUMPTION]` tag, never on the `## ` heading and never on the `Kind:` line.

A spine quote comes from one of two sources, and nowhere else:

- The brief's `> ` lines, word for word. A quote is a whole `> ` line or one unbroken run of that line's exact words. Where the brief's quote had a design-file source line under it, the spine's quote keeps that source line under it too, as the PRD's does.
- The user's replies to the spine step's own questions.

The brief's item text and the PRD's text are Seldon's wording, not the user's, so neither is ever a quote source. In the spine, as in the brief and the PRD, the check neither requires nor rejects a quoted line or a tag.

```
## S-01: Payments are the only stored truth
Kind: how state changes
Balances are computed from payments and never stored.
> one place to record each payment
```

## The check

```
node lib/check.mjs <dir>
```

`<dir>` holds the four files: `.planning/seldon/` in a project, `samples/` in this repository. This is the full check, and it needs all four.

- It exits 0 when all four conform, and prints one line: `seldon check: all four documents conform`.
- It exits 1 when anything doesn't conform, and prints one line per problem, every problem it finds rather than the first. Each line names the file, then the epic or decision ID when there is one, then the section or field, then what's wrong, for example `epics.md: E-02: Done when: missing field`.
- It exits 2 when the directory argument is missing or isn't a directory.

The check covers what this document defines and nothing more. It holds each epic to the three epic limits: at most 5 requirement IDs, 2 to 5 done-when items, and `**Depends on:**` naming only earlier epics. It doesn't trace requirements into epics.

### The brief alone

```
node lib/check.mjs --brief <dir>
```

This is for a step that has written only the brief and needs to check what it wrote.

- It reads only `<dir>/brief.md` and holds it to the brief rules above. Whether the other three files exist doesn't matter.
- It exits 0 when the brief conforms, and prints one line: `seldon check: brief.md conforms`.
- Otherwise it reports exactly as the full check does. It exits 1 with one line per problem, and prints `brief.md: missing file` when there's no brief. It exits 2 when the directory argument is missing or isn't a directory.

The full check above still needs all four files, so a folder holding only the brief fails it.

### The PRD alone

```
node lib/check.mjs --prd <dir>
```

This is for the PRD step, which has written the PRD and needs to check what it wrote before the spine and epics exist.

- It reads only `<dir>/prd.md` and holds it to the PRD rules above. Whether the other three files exist doesn't matter.
- It exits 0 when the PRD conforms, and prints one line: `seldon check: prd.md conforms`.
- Otherwise it reports exactly as the full check does. It exits 1 with one line per problem, and prints `prd.md: missing file` when there's no PRD. It exits 2 when the directory argument is missing or isn't a directory.

The full check above still needs all four files, so a folder holding only the brief and the PRD fails it.

### The spine alone

```
node lib/check.mjs --spine <dir>
```

This is for the spine step, which has written the spine and needs to check what it wrote before the epics exist.

- It reads only `<dir>/spine.md` and holds it to the spine rules above, the `Kind:` line included. Whether the other three files exist doesn't matter.
- It exits 0 when the spine conforms, and prints one line: `seldon check: spine.md conforms`.
- Otherwise it reports exactly as the full check does. It exits 1 with one line per problem, and prints `spine.md: missing file` when there's no spine. It exits 2 when the directory argument is missing or isn't a directory.

The full check above still needs all four files, so a folder holding only the brief, the PRD and the spine fails it.

### The epics alone

```
node lib/check.mjs --epics <dir>
```

This is for the epics step, which has written the epics and needs to check what it wrote. The step runs this mode, never the full check.

- It reads only `<dir>/epics.md` and holds it to the epics rules above. Whether the other three files exist doesn't matter.
- It exits 0 when the epics conform, and prints one line: `seldon check: epics.md conforms`.
- Otherwise it reports exactly as the full check does. It exits 1 with one line per problem, and prints `epics.md: missing file` when there's no epics file. It exits 2 when the directory argument is missing or isn't a directory.

The full check above still needs all four files, so a folder holding only the epics fails it.

## Examples

These are minimal. `samples/` has a complete set.

### brief.md

```markdown
# Tally

## Problem
Small clubs track dues in spreadsheets that drift out of date.
> our dues spreadsheet is always out of date

## Solution
A shared ledger that records each payment once and shows who owes what.
> one place to record each payment that shows who still owes

## Who it serves
Treasurers of clubs with under 200 members.
> treasurers like me, clubs under 200 members

## What's different
It records payments, not balances, so a balance is never typed by hand. [ASSUMPTION]

## Success criteria
A treasurer closes the month in under ten minutes. [ASSUMPTION]

## Scope
Members, dues and payments.
> members, dues, payments, that's it

## What it refuses
- It won't send invoices, because treasurers already invoice from their bank.
  > no invoices, we do those from the bank

## Vision
Every small club's books are right without anyone checking them. [ASSUMPTION]
```

### prd.md

```markdown
# Tally - PRD

## Requirements

### Ledger
- **LEDG-01**: A treasurer records a payment against a member.
  > one place to record each payment

### Members
- **MEMB-01**: A treasurer adds and archives members.
  > members, dues, payments

## Non-functional requirements
- **NFR-01**: The ledger loads in under a second for 200 members. [ASSUMPTION]

## User journeys
The treasurer opens the ledger, records three payments and checks who still owes.

## Non-goals
- It won't send invoices, because treasurers already invoice from their bank.
  > no invoices, we do those from the bank

## MVP scope
LEDG-01 and MEMB-01.
```

### spine.md

```markdown
# Tally - architecture spine

## S-01: Payments are the only stored truth
Kind: how state changes
Balances are computed from payments and never stored.
> one place to record each payment
```

### epics.md

```markdown
# Tally - epics

## E-01: Members
**Outcome:** A treasurer manages the member list.
**Boundaries:** Members only; no payments.
**Done when:**
- A member can be added and archived.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** None
**Requirements:** MEMB-01
**Spine decisions:** None

## E-02: Ledger
**Outcome:** A treasurer records payments and sees balances.
**Boundaries:** Payments and computed balances.
**Done when:**
- A balance always equals the sum of its payments.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** E-01
**Requirements:** LEDG-01, NFR-01
**Spine decisions:** S-01
```
