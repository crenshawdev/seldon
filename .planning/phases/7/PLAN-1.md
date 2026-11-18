---
phase: 7
plan: 1
requirements:
  - CHECK-03
  - CHECK-04
files:
  - skills/seldon/SKILL.md
---

# Phase 7: PRD changes flow downstream - Plan 1: The size probe

## Goal

A changed PRD flows through to the spine and epics, and every upstream rerun marks the documents built from it stale, proven by eval cases this phase adds. This plan answers D-19's question before any phase 7 text is written: does SKILL.md still load whole at the size that text will bring it to? It also gets the owner's approval for the phase's eval runs, since this is the phase's first run.

## Must be true when done

- The owner's answer on phase 7's eval runs is recorded in the task report.
- One probe run loaded a SKILL.md padded to at least 90,000 bytes. Its kept session transcript shows whether the loaded skill text reached the file's last sentence and `</process>`.
- SKILL.md is back byte for byte as it was, at 65,786 bytes, and the probe's kept folder is gone.
- The report states the outcome. Either the skill loaded whole, which sets a 90,000-byte budget for SKILL.md through this phase, or it was cut, and the report gives the byte offset where the loaded text ends and which of the two cut cases in Task 1's Outcome applies.

## Context

- **Locked:** D-19. SKILL.md is 65,786 bytes today. I estimate phase 7's text at 10 to 15 KB, so the probe pads to at least 90,000 bytes, which leaves about 24 KB of margin (my choice). If the loader cuts by size, a file that loads whole at 90,000 bytes shows that phase 7's text fits under that budget. The projected final size is 81,000 bytes (65,786 plus the 15 KB high estimate, rounded up), and a cut is judged against it: a cut at or above it still leaves room for phase 7's text in SKILL.md.
- **Why the probe comes first:** D-19 measures in the first task, before any of phase 7's text exists, so filler stands in for that text. AC6, in Plan 8, then confirms the load at the size the phase actually ends at.
- **Eval runs (SECURITY):** phases 4 to 6 each ran cases on the owner's approval for that phase. Phase 7 has no approval on record. Before the probe run, stop at a checkpoint marked SECURITY and ask the owner to approve phase 7's runs on the terms below. Record the answer in the task report.
  - **The runs covered:**
    - this plan's one probe run, with SKILL.md padded in the main tree for its length and restored afterwards
    - the per-case runs in Plans 5 and 7
    - Plan 8's full-suite run: the README's command verbatim, with only `--keep-temp` added before `--allow-tools`. A second full run is covered only when a case in the first missed on model variance the trace shows. Two full runs is the most.
  - **How a run is made:** from `/code/seldon`, the main tree, never a worktree. A per-case run is `claude plugin eval . --case <name> --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. `--allow-tools` goes last, with exactly those two grants. `--keep-temp` is for the audit only and goes in no committed file.
  - **Bash audit:** after every run, report every Bash command in each kept `out/trace.jsonl`, with its permission record. Judge each command by its text.
    - Allowed: `node /code/seldon/lib/check.mjs` with `--brief`, `--prd`, `--spine`, `--epics` or `--stale`, followed by `.planning/seldon`, `.planning/seldon/repair-log` or `.planning/seldon/sowlist`.
    - Also allowed, if the owner approves phase 6 Plan 7's ruling again for this phase: a command that only lists or reads files, that the permission layer accepted as read-only (`subcommandResults`), and that ran inside the run's sandbox, provided the case's no-secret grader passes where it has one.
    - Anything else is a checkpoint marked SECURITY.
  - **Retries:** at most three tries per case. A retry comes only after a fix, or after a miss the trace shows is model variance. A case still failing after its third try is a checkpoint.
  - **Cleanup:** before a plan finishes, remove only the folders its runs printed as kept, by their exact paths. Never remove by a glob such as `/tmp/claude-eval-*`.
  - **Where things are:** a kept run's workspace is `<kept>/sealed/home/cwd/`. Its session transcript is under `config/projects/` in the kept folder. `out/trace.jsonl` holds no skill text (phase 5 Plan 4's deviation).
- **Held:** no push, tag, PR or GitHub change, and no install of any kind.

## Tasks

### Task 1: Measure whether SKILL.md loads whole at phase 7's size

- **Files:** skills/seldon/SKILL.md
- **Reads:** skills/seldon/SKILL.md#21. The architecture document, .planning/phases/5/PLAN-4.md#Task 1, .planning/phases/6/PLAN-7.md#Task 2
- **Decisions:** D-19
- **Action:** This is D-19's measurement. Get the SECURITY approval in Context first, and run nothing before it.
  - **Pad:** save a copy of SKILL.md in the scratch area. Insert filler as one block directly above the `## 21. The architecture document` heading. Use prose paragraphs copied from SKILL.md's own sections 12 to 20, with their `## ` heading lines left out, so the filler reads like the skill's own text and the last section and its last sentence stay at the end. Add filler until `wc -c` reports at least 90,000 bytes. Change no other line.
  - **Run:** run the case `no-dump` once, with the per-case command in Context. Its score doesn't matter: the run exists only to load the padded skill. If it errors before the skill loads, retry on the retry terms.
  - **Read the transcript:** take the loaded skill text from the kept session transcript under `config/projects/`, and compare it with the padded file's body the way phase 5 Plan 4 did. Report:
    - the loaded text's length and the padded file's size
    - whether the loaded text holds SKILL.md's last sentence (`grep 'this route never ends a turn on one'`) and ends at `</process>`
    - any substitution the loader makes, such as the run's arguments in place of `$ARGUMENTS`. Any other difference counts as a cut.
  - **Restore:** restore SKILL.md from the saved copy, then remove the kept folder by its exact path.
  - **Outcome:**
    - **Whole:** phase 7's text goes into SKILL.md, and SKILL.md stays at or under 90,000 bytes for the rest of the phase. Plans 4 to 8 check that budget.
    - **Cut at or above 81,000 bytes:** stop at a checkpoint that reports the byte offset where the loaded text ends. Phase 7's text still fits, so it stays in SKILL.md under a budget of that offset less 2,000 bytes, which Plans 4 to 8 check wherever they say 90,000. Plans 4 and 6 aren't revised.
    - **Cut below 81,000 bytes:** stop at a checkpoint that reports the offset. D-19 then moves phase 7's rules to a reference file the skill Reads, and Plans 4 and 6 are revised for that before they start.
  - **No commit:** SKILL.md ends byte-identical, and the measurement lives in the task report.
- **Verify:**
  - **Testing scope:** the outcome is D-19's load question at the size phase 7 brings SKILL.md to, which nothing answers today. One probe run and its transcript are the evidence. AC6 in Plan 8 confirms the answer at the final size, and testing stops there.
  - (1) The owner's approval of phase 7's runs is recorded. This is the SECURITY checkpoint in Context.
  - (2) Before the run, `wc -c skills/seldon/SKILL.md` reports at least 90,000, and `git diff --name-only` lists only `skills/seldon/SKILL.md`.
  - (3) The run prints no `not granted` and no `scaffold failed`, and the Bash audit is reported.
  - (4) The report gives the loaded length, the padded size, and the last-sentence and `</process>` results from the kept session transcript. It states the outcome: whole with the 90,000-byte budget, or a cut with its offset, which is a checkpoint, and which of the two cut cases applies, with the budget it sets when the cut is at or above 81,000 bytes.
  - (5) After the restore, `git diff --exit-code -- skills/seldon/SKILL.md` exits 0 and `wc -c skills/seldon/SKILL.md` prints 65786.
  - (6) `ls -d` fails on the exact kept path the run printed.

## Notes

- A cut at or above the 81,000-byte projected final size leaves phase 7's text in SKILL.md under a tighter budget, since D-19 moves the rules only when the text doesn't fit. A cut below it sends phase 7's rules to a reference file. Which rules move then depends on where the loader cuts, and only this run can say that. So that case is a checkpoint that sends Plans 4 and 6 back to the planner for revision, rather than a branch written into them now.
