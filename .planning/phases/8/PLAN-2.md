---
phase: 8
plan: 2
depends_on: [1]
requirements:
  - CHECK-01
files:
  - agents/readiness.md
  - tests/skill.test.mjs
  - .claude-plugin/plugin.json
  - .github/workflows/test.yml
---

# Phase 8: Readiness check and handoff - Plan 2: The readiness agent and its pin

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan builds the independent half: the `seldon:readiness` agent with its checking rules, the test that pins its tools, and the Claude Code version the plugin now needs.

## Must be true when done

- `agents/readiness.md` exists with `tools: Read` and `disallowedTools: Write, Edit, Bash`, holds the checking rules for CHECK-01's three kinds and the fixed report forms, and `claude plugin validate --strict .` passes with it.
- SKILL.md's `allowed-tools` stays the pinned five, with no agent entry, and `tests/skill.test.mjs`'s grant list doesn't change (Daneel's ruling on Plan 1's report).
- `tests/skill.test.mjs` also fails unless `agents/readiness.md`'s frontmatter is exactly `tools: Read` with `disallowedTools: Write, Edit, Bash`.
- `plugin.json` states `engines["claude-code"]` as `>=2.1.327`, the version Plan 1's probe ran on, to be revisited at release, and CI's plugin-validate job installs a version that meets it.

## Context

- **Locked:** D-01, D-02, D-03, D-06, D-07 and D-08.
- **Plan 1 binds this plan:** Plan 1 ended on "not scoped, or not shown". A start of `seldon:readiness` ran in the eval with no Agent entry anywhere, and no entry was shown to scope one. Daneel's ruling on its report:
  - no grant change in phase 8, so SKILL.md's `allowed-tools` stays the pinned five (D-02 is settled that way)
  - `claude plugin validate --strict .` takes the agent's frontmatter, and takes `engines` on 2.1.327
  - the agent's own `tools: Read` held at run time, and the pin in Task 2 keeps both frontmatter lines, since run 4 had both and can't say which one held
- **The report forms** (the wording is my call, per CONTEXT). Plan 3 shows the same lines in SKILL.md byte for byte:
  - no findings: `The readiness check found nothing to fix.`
  - a requirement no epic names: `Requirement no epic names: <requirement ID>. Fixed by rerunning /seldon epics.`
  - a crossed boundary: `Epic crossing a boundary the spine didn't fix: <epic ID> (<categories>). Fixed by rerunning /seldon spine.` `<categories>` lists every category the epic spans, in the PRD's order: two are joined by "and", as in `(Loans and Repairs)`, and three or more by commas with "and" before the last, as in `(Catalog, Loans and Repairs)`.
  - a decision left open: `Decision left open: <epic IDs, comma-separated> (<the choice, in a few words>). Fixed by rerunning /seldon spine.`
- **No eval runs** in this plan. Plan 3's `resume-later` run is the first live proof of the agent.
- **No binary:** nothing is read or copied out of the Claude binary or the files it ships with.
- **Held:** no push, tag, PR or GitHub change, no install of any kind, and nothing published (D-16).

## Tasks

### Task 1: Write the readiness agent

- **Files:** agents/readiness.md
- **Reads:** /code/cadence/agents/cad-assumptions-analyzer.md, docs/FORMAT.md, samples/prd.md, samples/spine.md, samples/epics.md, skills/seldon/SKILL.md#18. The epics step
- **Decisions:** D-01, D-03, D-06, D-07, D-08
- **Action:** The checking rules live here and nowhere else (D-01).
  - **Frontmatter:**
    - `name: readiness`
    - a `description` saying it is Seldon's readiness check, started by `/seldon` over one design's `prd.md`, `spine.md` and `epics.md`, and not for any other use
    - `tools: Read`
    - `disallowedTools: Write, Edit, Bash`

    Add no other field unless Plan 1's validator result or Daneel's ruling requires it.
  - **What it reads (D-03):** each of the three paths its prompt names, with Read, and nothing else: not the brief, `architecture.md`, any other file under `.planning/`, the project's code or Cadence's files. When a path can't be read, its whole reply is one plain line saying which. That isn't a report form, so the skill says the check didn't run.
  - **The three kinds, exactly (D-07).** Each is defined so the clean samples raise none:
    - **A requirement no epic names:** an ID declared on a requirement bullet in the PRD's `## Requirements` or `## Non-functional requirements` that no epic's `**Requirements:**` line lists. An ID on the PRD's `Retired:` line isn't a requirement. One finding per ID, and the step is the epics.
    - **An epic crossing a boundary the spine didn't fix:** an epic whose `**Requirements:**` line holds IDs from two or more of the PRD's `### ` categories, while no `Kind: boundaries` decision in the spine draws the line between those categories' parts. Non-functional IDs belong to no category. The finding names the epic and every category it spans, in the PRD's order and joined as Context's form says, and the step is the spine.
    - **A decision left open:** a choice between parts that an epic needs and no spine decision makes. That means two epics change the same data, or one epic's work depends on how a part another epic builds is made, and no spine decision of any kind settles who owns it or how the parts meet. The finding names the epics and the choice in a few words, and the step is the spine.
      - A choice one part can make alone isn't one.
      - A choice between the parts one crossing epic spans is that crossing, reported once, never also as a decision left open.
      - A choice the spine makes at all isn't open, whether loosely or as an `[ASSUMPTION]` guess.
  - **Not findings:**
    - an `[ASSUMPTION]` tag anywhere, which is an answered question
    - a retired ID
    - a stamp, a `Built from` line or a stale link (D-06)
    - an epic's size, a quote, or anything the format checks hold

    Report no fourth kind.
  - **The reply (D-08):**
    - findings: one line per finding in Context's forms, the requirement lines first, then crossings, then decisions left open
    - none: the no-findings line alone
    - nothing else either way: no heading, bullet, number, fence or other sentence
- **Verify:**
  - **Testing scope:** the outcome is the agent's shape and its rules as text. The validator and these checks prove the file. Its judgments are proven live by Plan 3's `resume-later` and by Plans 5 and 6, and testing stops there.
  - (1) `claude plugin validate --strict .` passes with the file in place (ci: plugin-validate). Today there's no `agents/` folder.
  - (2) `grep -cx 'tools: Read' agents/readiness.md` and `grep -cx 'disallowedTools: Write, Edit, Bash' agents/readiness.md` each print 1.
  - (3) `grep -cF` finds the no-findings line and each of the three finding forms from Context in the file.

### Task 2: Pin the agent's tools

- **Files:** tests/skill.test.mjs
- **Reads:** tests/skill.test.mjs, agents/readiness.md
- **Decisions:** D-01, D-02
- **Pins:** tests/skill.test.mjs
- **Action:**
  - **No grant (Daneel's ruling on Plan 1's report):** SKILL.md's `allowed-tools` and `GRANT` in `tests/skill.test.mjs` stay the pinned five, byte for byte. Plan 1's run 3 started `seldon:readiness` with no Agent entry anywhere, so an entry would claim a limit nothing enforces.
  - **The agent's pin (Daneel's ruling, a security pin):** one more test in `tests/skill.test.mjs` reads `agents/readiness.md`'s frontmatter and fails unless its `tools` value is exactly `Read` and its `disallowedTools` value is exactly `Write, Edit, Bash`. Claude Code's grants don't limit which agent the skill starts, and Plan 1's run 4 showed the agent's own frontmatter is what held it to Read. This pin is what keeps that agent from being given a tool that writes or runs a command.
  - **What to avoid:** any Agent entry in `allowed-tools`, scoped or not. No run showed one scoping anything (D-02, settled by Daneel's ruling).
- **Verify:**
  - **Testing scope:** the outcome is the agent's pinned tools, with AC6's pinned grant left as it is. The existing test, the new one and the planted failures below prove them, and testing stops there.
  - (1) `node --test tests/skill.test.mjs` passes, and `git diff skills/seldon/SKILL.md` is empty.
  - (2) Three planted failures, each restored afterwards:
    - an added `Agent(seldon:readiness)` line in SKILL.md's `allowed-tools` makes the grant test fail
    - `tools: Read, Bash` in `agents/readiness.md` makes the agent test fail
    - `Bash` taken off the agent's `disallowedTools` line makes the agent test fail

    `git diff` then shows only this task's change.
  - (3) `claude plugin validate --strict .` passes.

### Task 3: State the minimum Claude Code version

- **Files:** .claude-plugin/plugin.json, .github/workflows/test.yml
- **Reads:** .claude-plugin/plugin.json, .github/workflows/test.yml#plugin-validate
- **Action:** This is the planner's call CONTEXT left open, for the agent file.
  - **The manifest:** `plugin.json` states `engines["claude-code"]` as `>=2.1.327`, the version Plan 1's probe ran on and the only one where the agent is proven. Plan 1 found that `validate --strict` takes `engines` on 2.1.327. The floor is revisited at release (Daneel's ruling).
  - **The CI pin:** when that version is above the plugin-validate job's pin, 2.1.326, move the pin in that one `npm install -g` line to that version. CI then installs a Claude Code that meets the manifest's own minimum, and the comment saying the pin moves by hand stays true. Change nothing else in the workflow.
- **Verify:**
  - **Testing scope:** the outcome is a manifest CI can still install. Local validation plus the plugin-validate job are the evidence, and testing stops there.
  - (1) `claude plugin validate --strict .claude-plugin/plugin.json` and `claude plugin validate --strict .` pass.
  - (2) `node -e` reading `plugin.json` prints the `engines["claude-code"]` value, `>=2.1.327`. It prints undefined today.
  - (3) When that version is above 2.1.326, `grep -c '@anthropic-ai/claude-code@<version>' .github/workflows/test.yml` prints 1, and `git diff .github/workflows/test.yml` changes only that line.
  - (4) The plugin-validate job installs and runs the plugin on the pinned version (ci: plugin-validate). This phase doesn't push, so `/cad-verify` reads it later through `ci-status`.

## Notes

- **Test pins:** the grant pin in `tests/skill.test.mjs` doesn't change, since the grant doesn't (Daneel's ruling on Plan 1's report). Task 2 adds only the agent's pin.
- **The crossing rule:** the rule reads a crossing from an epic's requirement IDs spanning `### ` categories, so the clean samples raise none. One known edge: the epics step lets a tightly coupled pair of categories share an epic, and the check reports that epic until the spine fixes a boundary between them. I chose that so the kind has a pass/fail definition, which D-07 asks of a kind.
- **The version floor:** using the probe's version as the floor refuses older versions it never tried, 2.1.326 included. If that's stricter than John wants, the floor and the CI pin move together.
