---
phase: 9
plan: 4
depends_on: [1, 3]
requirements:
  - EVAL-02
files:
  - evals/results/phase-9-traces/
---

# Phase 9: The full graders - Plan 4: The kept-trace checks and the two real runs

## Goal

The full graders check every run that writes what they grade, and a unit test proves the README's suite command covers every case, with nothing for a person to check by hand. This plan shows the new and changed graders pass on real runs, both kept and fresh.

## Must be true when done

- Each new or changed grader passes on its case's kept trace in `evals/results/phase-8-traces/full-run-3/`. The graders that read a file are checked against epics.md rebuilt from that trace's Write and Edit inputs, and the report quotes each result.
- One run of full-walk with the README's grant scores 1.00, and its scored graders include `every-requirement-traced.md` and `at-most-five-ids.md`.
- One run of readiness-agent with the README's grant scores 1.00, and its scored graders include `says-no-findings.md` and `agent-finds-nothing.md`. That shows a trace grader sees the Agent tool's result, which settles D-07's question.

## Context

- **Locked:** D-07 (stop at Daneel if the agent half can't see the result), D-10 (one real run per new grader kind, at most three tries, any miss to Daneel), D-12 (no binary) and D-27 (kept traces stay local, and the report carries the evidence).
- **The runs:** these two are runs 9 and 10 of the ten listed in PLAN-3.md's Notes. They follow PLAN-3.md's Context "How a run is made", which covers the command, the audits, the trace copies, the tries and the no-binary rule.
- **Evidence goes in:** `evals/results/phase-9-traces/`, which git ignores. Nothing in this plan is committed.

## Tasks

### Task 1: Match every new and changed grader against its kept trace

- **Files:** evals/results/phase-9-traces/
- **Reads:** evals/results/phase-8-traces/full-run-3/full-walk.trace.jsonl, evals/results/phase-8-traces/full-run-3/readiness-agent.trace.jsonl, tests/graders.test.mjs
- **Decisions:** D-10, D-12, D-27
- **Action:** Write a scratch script in the session scratchpad that reads each grader's frontmatter the way `tests/graders.test.mjs` does. It applies the pattern with its flags and `match` to the right text from the case's `full-run-3/<case>.trace.jsonl`:
  - **`target: trace`:** the trace file's text.
  - **`target: last_message`:** check both the final `result` event's `result` text and the last top-level assistant text, since the runner's choice between them is unverified (D-12). Both must pass.
  - **File targets:** rebuild `.planning/seldon/epics.md` from the trace's Write and Edit inputs, applied in order over the seeded fixture. None of these cases seeds epics, so the first Write is the base. full-walk's trace has a Write and then an Edit. Save each rebuilt file as `evals/results/phase-9-traces/kept-check/<case>.epics.md`.

  Eighteen checks:
  - full-walk: `every-requirement-traced.md` and `at-most-five-ids.md`, on the rebuilt file.
  - epics-from-spine: `at-most-five-ids.md`, on the rebuilt file.
  - epics-split: `every-requirement-traced.md`, on the rebuilt file.
  - resume-later, handoff-cadence, handoff-named and readiness-agent: `says-no-findings.md` on the last message and `agent-finds-nothing.md` on the trace.
  - fast-path and cadence-dump: `recommends-fast-path.md`. asks-for-dump: `recommends-a-path.md`.
  - stale-spine, readiness-fix and readiness-fix-answer: `ends-on-confirm.md`, on the last message. The latter two are Plan 3's byte copies.

  A failing check goes to Daneel with the grader, the text it ran on and the reason. No grader is changed in this plan. If the agent half fails a kept trace whose Agent result holds the no-findings line, stop there (D-07).
- **Verify:** The report lists all 18 checks by case, grader and target, each with its pass result and, for the file targets, the rebuilt file's `**Requirements:**` lines. All 18 pass. Testing scope: this is the kept-trace match D-10 asks of each new or changed grader, and testing stops there.

### Task 2: Run full-walk once with the README's grant

- **Files:** evals/results/phase-9-traces/
- **Decisions:** D-03, D-10, D-12
- **Action:** Run full-walk solo under PLAN-3.md's run terms. It replays the fast path from the Toolshed dump through the spine confirm, and its graded turn writes epics.md. This is the one real run for the trace and size graders. Keep the trace as `full-walk-try-<n>.trace.jsonl`. A miss goes to Daneel, with at most three tries.
- **Verify:** The run scores 1.00. Its results under `evals/results/` list `every-requirement-traced.md`, `at-most-five-ids.md` and `writes-epics.md` among full-walk's scored graders, all passed. The report quotes the score, those grader results and both audits. Testing scope: one run per new grader kind (D-10), and testing stops there.

### Task 3: Run readiness-agent once with the README's grant

- **Files:** evals/results/phase-9-traces/
- **Decisions:** D-07, D-10, D-12
- **Action:** Run readiness-agent solo under PLAN-3.md's run terms. This is the one real run for both halves of readiness-passes. Keep the trace as `readiness-agent-try-<n>.trace.jsonl`. If `agent-finds-nothing.md` fails while the kept trace shows the Agent result holding the no-findings line, the grader can't see the Agent tool's result. Work stops there and goes to Daneel, with no fallback to the last message alone (D-07). Any other miss also goes to Daneel, with at most three tries.
- **Verify:** The run scores 1.00. Its results list `says-no-findings.md` and `agent-finds-nothing.md` among readiness-agent's scored graders, both passed. The report quotes the Agent result line from the kept trace, the score, those grader results and both audits, and states D-07's answer. Testing scope: one run per new grader kind (D-10), and testing stops there.
