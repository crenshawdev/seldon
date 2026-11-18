---
phase: 7
plan: 2
requirements:
  - CHECK-04
files:
  - lib/check.mjs
  - tests/check.test.mjs
  - docs/FORMAT.md
---

# Phase 7: PRD changes flow downstream - Plan 2: The stamp and the stale check

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan adds three things:

- the stamp format
- `lib/check.mjs`'s stale check, which reports stale links and prints the stamp each step records
- the per-file rule that holds a present stamp to its form

`docs/FORMAT.md` documents all three.

## Must be true when done

- `node lib/check.mjs --stale <dir>` reads one design folder:
  - With any stale link, it prints one line per stale link and exits 1.
  - With none, it prints `seldon check: no stale link` and exits 0.
  - Either way, it then prints the stamp each of `prd.md`, `spine.md` and `epics.md` records, for each one whose parent is there.
  - A missing or non-directory argument exits 2.
- A link reads stale exactly when the child's stamp holds a hash other than its parent's current hash:
  - One changed byte in a parent makes its child stale, and that includes a change to the parent's own stamp line.
  - A folder of unstamped documents exits 0.
- The full check and `--prd`, `--spine` and `--epics` pass a document with no stamp or a well-formed one. They exit 1, naming the problem, on a malformed stamp or a second stamp line.
- `docs/FORMAT.md` does four things:
  - documents the stamp line, its hash, the stale rule and the stale check
  - tells a reader to skip the stamp line
  - says the brief and `architecture.md` carry no stamp
- `node --test tests/*.test.mjs` passes. So does the coverage job's command from `.github/workflows/test.yml`, with both lcov guards.

## Context

- **Locked:** D-01, D-03, D-04, D-08, D-10, D-11, D-17 and D-18.
  - The full check and the four per-file modes keep reading only their own files, and no hash comparison goes into them (D-11).
  - Neither grant changes (D-18): the new mode already falls inside SKILL.md's and the README's `lib/check.mjs:*` rules.
- **The stamp (my choice; CONTEXT flags the algorithm, length and wording as the planner's call):**
  - **Form:** `Built from: <parent> sha256:<hash>`.
  - **Parent:** the bare file name (D-08): `brief.md` for `prd.md`, `prd.md` for `spine.md`, and `spine.md` for `epics.md`.
  - **Hash:** the first 16 lowercase hex digits of the SHA-256 of the parent file's raw bytes, the whole file, its own stamp line included (D-01). Sixteen digits keep the line short enough for a model to copy exactly, and 64 bits are far more than change detection needs.
  - **Placement:** Seldon writes the stamp as the line right after the `# ` title, above any `Retired:` line under the title (D-03; the order is my choice).
- **The stale check's output (my choice, fixed here because SKILL.md and the graders key on it):**
  - one line per stale link, in chain order: `stale: prd.md was built from an earlier brief.md`, `stale: spine.md was built from an earlier prd.md` and `stale: epics.md was built from an earlier spine.md`
  - with no stale link, the single line `seldon check: no stale link`
  - then, in chain order, a line starting `stamp for <file>: ` and followed by the stamp that file records now, for each of the three whose parent is there, whether or not the file itself is there yet
- **Out of scope:**
  - stamping the samples (Plan 3)
  - any SKILL.md text
  - a stamp on the brief or `architecture.md`
  - whether an ID one file names is declared in another (phase 5 D-12 stays)

## Tasks

### Task 1: Add the stale check mode

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** lib/check.mjs#main, lib/check.mjs#MODES, lib/check.mjs#parse, lib/check.mjs#isDir, tests/check.test.mjs#run, tests/check.test.mjs#copy
- **Decisions:** D-01, D-04, D-08, D-11, D-18
- **Pins:** tests/check.test.mjs
- **Action:** Add a `--stale <dir>` mode to `main`. Put it beside the one-file `MODES` table rather than in it, since it reads several files and runs no format rule. It reads whichever of `brief.md`, `prd.md`, `spine.md` and `epics.md` are in that one folder, and nothing outside it (D-08).
  - **Reading a stamp:** a stamp is a line before the file's first `## ` line that has exactly the stamp form in Context and names that file's own parent. The mode reads a stamp only when there is exactly one such line. A file with none, a malformed one or two reads as unstamped here (D-04). Task 2's per-file rule is what names a malformed stamp.
  - **Stale:** a link is stale when the child is there with a stamp, its parent is there, and the parent's current hash differs from the stamp's. A missing child, a missing parent or an unstamped child is never stale.
  - **Hash:** use `node:crypto`'s `createHash('sha256')` over the parent's raw bytes, and keep the first 16 characters of the hex digest. Don't normalize newlines or whitespace: a changed byte is a change (D-01; CONTEXT accepts that a whitespace-only edit reads stale).
  - **Output and exit:** print exactly the lines in Context, in that order. Exit 1 when any link is stale, otherwise 0. A missing or non-directory argument exits 2, the way the other modes do.
  - **Usage and comments:** the usage line names `--stale` too. Update the existing test that pins the usage text to match the new line, and update the file's opening comment to name the mode.
  - **Leave alone:** the full check and the four per-file modes keep reading what they read today (D-11).
  - **Tests,** in `tests/check.test.mjs`:
    - **Folders:** build each one in a temp dir from copies of the samples, with every `Built from:` line stripped first, then insert only the stamps the test means. That keeps the tests valid after Plan 3 stamps the samples.
    - **Hashes:** the test works every expected hash out itself with `node:crypto`, never through the module.
    - **The tests:**
      - stripped samples exit 0 with `seldon check: no stale link` and the three stamp lines, holding the hashes the test computed
      - a `prd.md` stamped with the brief's hash reads fresh, and one changed byte in `brief.md` makes it exit 1 with the PRD's stale line as its only `stale:` line. The test asserts the `stale:` lines, not the whole stdout, since the `stamp for` lines follow them.
      - a `spine.md` stamped with the stamped `prd.md`'s hash reads fresh, and goes stale once `prd.md`'s stamp line changes. This pins that the hash covers the parent's own stamp.
      - two stale links print two lines, in chain order
      - a folder holding only `brief.md` exits 0 and prints only the `prd.md` stamp line
      - unstamped documents whose parents have changed exit 0
      - no directory exits 2 with the usage line, and a file given as the directory exits 2 with the not-a-directory line, as the other modes do
- **Verify:**
  - **Testing scope:** the outcomes are AC3's mode behaviors on hand-built folders:
    - fresh
    - stale on one changed byte
    - the chain carried through a stamp line
    - unstamped documents reading fresh
    - the stamp lines and the exit codes

    Nothing covers these today, and the seven tests above are the smallest set. The sample-seeded folders and the pin on the samples' own stamps wait for Plan 3's stamped samples, and testing stops there.
  - (1) `node lib/check.mjs --stale samples` exits 0 and prints `seldon check: no stale link` and three `stamp for` lines. Their hashes equal the first 16 digits `sha256sum` prints for `samples/brief.md`, `samples/prd.md` and `samples/spine.md`, in that order. Today it exits 2, because it reads `--stale` as the directory.
  - (2) `node --test tests/check.test.mjs` passes, with the seven new tests among the passing names.
  - (3) `node lib/check.mjs samples` still prints `seldon check: all four documents conform`, and each per-file mode still passes `samples/`.
  - (4) The coverage job's command from `.github/workflows/test.yml` passes, with both lcov guards.

### Task 2: Hold a present stamp to its form

- **Files:** lib/check.mjs, tests/check.test.mjs
- **Reads:** lib/check.mjs#checkSpine, lib/check.mjs#checkPrd, lib/check.mjs#checkEpics, lib/check.mjs#CHECKS, lib/check.mjs#quote, tests/check.test.mjs#cases
- **Decisions:** D-03, D-04, D-11
- **Pins:** tests/check.test.mjs
- **Action:** `prd.md`, `spine.md` and `epics.md` each hold a present stamp to its exact form, the way a `Kind:` line is read (D-04): no trim, no case folding, and a tag on the line makes it no stamp.
  - **What counts as a stamp line:** any line before the file's first `## ` that starts with `Built from:`. A file with no such line passes, so the samples and every document Seldon wrote before this phase still pass (D-04).
  - **Problems:**
    - A stamp line that isn't exactly the form in Context, naming that file's parent, gives one problem line. That covers the wrong parent, a short, long or uppercase hash, a tag and trailing text.
    - More than one stamp line gives one line saying so, as `Kind:` does.
    - A problem line follows the file's convention: the file, then `Built from`, then what's wrong. The offending line is quoted through the existing `quote` helper, and the expected form names the right parent.
  - **Where the rule lives:** put it where the full check and the matching per-file mode both apply it, the way the PRD's bullet rule is placed (see the comment in `checkPrd`). `brief.md` gets no stamp rule, since the brief carries none (D-01). Nothing here compares hashes (D-11).
  - **One definition:** reuse Task 1's stamp reading, so the two never disagree on what a stamp is.
  - **Tests:** build folders the way Task 1's do, from stripped copies.
    - A well-formed stamp passes the full check and each of `--prd`, `--spine` and `--epics`.
    - For each of those three modes, a stamp with the wrong parent and one with a bad hash each exit 1 with one line naming the file and `Built from`.
    - Two stamp lines in one file give the repeated line.
    - A stamp above a spine's `Retired:` line passes.
    - A fully stripped copy of `samples/`, every `Built from:` line removed, passes the full check and each of `--prd`, `--spine` and `--epics`, each with its OK line. This pins D-04's no-stamp pass once Plan 3 stamps every sample.
- **Verify:**
  - **Testing scope:** the outcome is AC3's malformed-stamp clause in each per-file mode, plus D-04's no-stamp pass. After Plan 3 no sample is unstamped, so the existing tests stop covering that pass, and the stripped-copy test above pins it instead. The tests above add the well-formed pass, two malformed forms per mode, the repeat and the no-stamp pass, and testing stops there.
  - (1) In a scratch copy of `samples/` with `Built from: brief.md sha256:ZZ` inserted under `prd.md`'s title, `node lib/check.mjs --prd <copy>` exits 1 with one line starting `prd.md: Built from`. Today it exits 0.
  - (2) In that copy, with the line replaced by the stamp `node lib/check.mjs --stale <copy>` prints for `prd.md`, both `--prd` and the full check pass.
  - (3) `node --test tests/*.test.mjs` passes, and so does the coverage job's command, with both lcov guards.

### Task 3: Document stamps and the stale check in the format

- **Files:** docs/FORMAT.md
- **Reads:** docs/FORMAT.md#IDs are stable, docs/FORMAT.md#The check, docs/FORMAT.md#The architecture document, docs/FORMAT.md#Location and ownership
- **Decisions:** D-17, D-01, D-02, D-03, D-04, D-08, D-10, D-11
- **Action:** Document what Tasks 1 and 2 built, in the format's own voice. Copy every quoted line from what the code actually prints.
  - **A new `## Stamps` section, after "IDs are stable",** covering:
    - the stamp line's form
    - which file stamps which parent, named by bare file name and compared within one design folder (D-08)
    - the hash: the first 16 hex digits of the SHA-256 of the parent's whole file, its stamp line included, which is what carries a change down the chain (D-01)
    - where it sits: the line right after the `# ` title, above a `Retired:` line and before the first `## ` (D-03)
    - that Seldon writes it on every write of the file, on create and on rerun alike (D-02)
    - the stale rule: a link is stale when the parent's current hash differs from the stamp, a hand edit included
    - that a document with no stamp reads fresh (D-04)
    - that `brief.md` and `architecture.md` carry none (D-01, D-10)
    - a direction to readers to skip the stamp line, since it records where the document came from and isn't part of its content (D-17)
  - **Under "The check":**
    - the full check holds a present stamp to its form and compares no hashes
    - the same sentence goes in each of "The PRD alone", "The spine alone" and "The epics alone"
    - one example problem line, taken from Task 2's output
  - **A new `### Stale links` subsection under "The check":** the command `node lib/check.mjs --stale <dir>`, what it reads, its lines and its exit codes as Task 1 prints them, and that it never reports `architecture.md`.
  - **"The architecture document":** add one sentence saying it carries no stamp and nothing reports it stale (D-10).
  - **Unchanged:** the Examples carry no stamp. They stay minimal, and a document with no stamp reads fresh.
- **Verify:**
  - **Testing scope:** this documents AC3's mode and D-17. The checks below compare the text with the code's own output, and testing stops there.
  - (1) `grep -c '^## Stamps$' docs/FORMAT.md` and `grep -c '^### Stale links$' docs/FORMAT.md` each print 1, and `grep -c 'check.mjs --stale' docs/FORMAT.md` prints at least 1. Each prints 0 today.
  - (2) Every line the new text quotes as the check's output, with any hash shown as a placeholder, comes from one of these:
    - `node lib/check.mjs --stale` on `samples/`
    - `node lib/check.mjs --stale` on a scratch folder holding a stamped `prd.md` beside a `brief.md` with one changed byte
    - Task 2's problem output
  - (3) The `## Stamps` section tells a reader to skip the stamp line, and says neither `brief.md` nor `architecture.md` carries one.

## Notes

- **Tests ride with their code:** `plan-graph.md` puts edits to test pins in one last plan. Here, each task's tests ride with its code instead, because the coverage job holds `lib/**` to 85% at every commit. Code whose tests came later would fail that gate in between. `tests/check.test.mjs` belongs to this plan alone.
- **Recalled memory:** the recalled D-01, D-02 and D-04 (phases/7/CONTEXT.md, phase 7) are this phase's own decisions, applied here as written.
