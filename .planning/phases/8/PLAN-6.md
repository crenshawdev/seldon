---
phase: 8
plan: 6
depends_on: [3, 4, 5]
requirements:
  - CHECK-01
  - CHECK-02
files:
  - evals/readiness-findings/case.yaml
  - evals/readiness-findings/prompt.md
  - evals/readiness-findings/seed.sh
  - evals/readiness-findings/graders/names-uncovered.md
  - evals/readiness-findings/graders/names-crossing.md
  - evals/readiness-findings/graders/ends-on-question.md
  - evals/readiness-findings/graders/no-write.md
  - evals/readiness-findings/graders/no-edit.md
  - evals/readiness-crossing/case.yaml
  - evals/readiness-crossing/prompt.md
  - evals/readiness-crossing/seed.sh
  - evals/readiness-crossing/graders/names-crossing.md
  - evals/readiness-crossing/graders/one-finding.md
  - evals/readiness-crossing/graders/ends-on-question.md
  - evals/readiness-crossing/graders/no-write.md
  - evals/readiness-crossing/graders/no-edit.md
  - evals/readiness-hand-off/case.yaml
  - evals/readiness-hand-off/prompt.md
  - evals/readiness-hand-off/seed.sh
  - evals/readiness-hand-off/history.jsonl
  - evals/readiness-hand-off/graders/ends-on-new-project.md
  - evals/readiness-hand-off/graders/no-write.md
  - evals/readiness-hand-off/graders/no-edit.md
  - evals/readiness-fix/case.yaml
  - evals/readiness-fix/prompt.md
  - evals/readiness-fix/seed.sh
  - evals/readiness-fix/history.jsonl
  - evals/readiness-fix/graders/edits-spine.md
  - evals/readiness-fix/graders/fixes-boundary.md
  - evals/readiness-fix/graders/no-epics-write.md
  - evals/readiness-fix/graders/no-epics-edit.md
  - evals/readiness-fix/graders/ends-on-confirm.md
  - evals/readiness-agent/case.yaml
  - evals/readiness-agent/prompt.md
  - evals/readiness-agent/seed.sh
  - evals/readiness-agent/graders/one-agent.md
  - evals/readiness-agent/graders/starts-readiness.md
  - evals/readiness-agent/graders/hands-three-paths.md
  - evals/readiness-agent/graders/no-other-path.md
  - evals/readiness-agent/graders/no-skill-read.md
  - evals/readiness-agent/graders/agent-reads-three.md
  - evals/readiness-agent/graders/agent-reads-nothing-else.md
  - skills/seldon/SKILL.md
  - agents/readiness.md
---

# Phase 8: Readiness check and handoff - Plan 6: The findings cases

## Goal

An independent check reads the finished design before the handoff, and Seldon ends with the exact Cadence command to run, proven by eval cases this phase adds. This plan proves success criteria 1 to 3: the report names what it finds by ID, the check is a separate agent that reads only the three documents, and the two answers to the question do what they say (AC1, AC2, AC3).

## Must be true when done

- `readiness-findings` scores 1.00 (AC1). Over the uncovered design, a bare `/seldon`:
  - names CAT-01 on a requirement-no-epic-names line with `/seldon epics`
  - names E-02 on a crossed-boundary line with `/seldon spine`
  - makes no Write and no Edit, and ends on the readiness question with nothing after its question mark
- `readiness-crossing` scores 1.00. Over the crossing design, a bare `/seldon` reports exactly one finding, E-02's crossed boundary, and ends on the readiness question. This is the live report the two replays below copy.
- `readiness-agent` scores 1.00 (AC2). The skill starts exactly one agent, `seldon:readiness`, hands it the three paths and no other, and Reads none of the three itself. The agent's own reads are graded as Daneel ruled on Plan 1's report.
- `readiness-fix` scores 1.00 (AC3). After a report whose one finding is E-02's crossing, a fix edits `spine.md` so that a `Kind: boundaries` decision names both loans and repairs, makes no Write or Edit to `epics.md`, and ends on the spine confirm question. Its workspace then reads the epics as stale.
- `readiness-hand-off` scores 1.00 (AC3). After that same report, a hand-off makes no Write and no Edit and ends on `/cad-new-project --brief .planning/seldon`.
- Every kept trace passed the Bash audit and the agent-start audit, and `node --test tests/scaffold.test.mjs` passes.

## Context

- **Locked:** D-03, D-07, D-08, D-09, D-10, D-11, D-18 and D-19, and Daneel's ruling on Plan 1's report for AC2's graders (D-04).
- **Seeds:**
  - `readiness-findings`: `samples/brief.md`, `samples/readiness/prd.md`, `samples/readiness/spine.md` and `samples/readiness-uncovered/epics.md` into `.planning/seldon/`
  - `readiness-crossing`, `readiness-fix` and `readiness-hand-off`: `samples/brief.md` and `samples/readiness/`'s three files
  - `readiness-agent`: `evals/resume-later/seed.sh`'s lines
- **Histories (D-19):** `readiness-fix` and `readiness-hand-off` replay one exchange the skill at HEAD produced from their seed, which Task 2's `readiness-crossing` run shows live:
  - the user runs `/seldon`
  - Seldon's reply is the crossed-boundary line for E-02, across Loans and Repairs, then the readiness question. Both are copied from the last message of `readiness-crossing`'s passing trace, and checked against SKILL.md's forms.

  No history is written before that run has passed. If the real agent reports anything other than that one finding, the fixture or the agent's rules are wrong: stop at a checkpoint to Daneel, and never write the replays around it (Daneel's ruling).

  A history is text-only user and assistant lines with chained `parentUuid`, a fresh `sessionId` and `cwd` set to `/tmp/seldon-<case>`, like `evals/epics-confirm/history.jsonl`. Its user words are invented, never the owner's.
- **Case rules:**
  - Every case here has `allowed_tools: [Skill, Read, Glob, Grep, "<the entry Plan 1 recorded>"]` (D-18). Only Plan 5's `readiness-not-run` withholds it.
  - `readiness-findings`, `readiness-crossing` and `readiness-agent` take `resume-later`'s `max_turns` and `timeout_seconds`. `readiness-fix` edits, so it takes 20 and 600. `readiness-hand-off` writes nothing and starts no agent, so it takes 10 and 300.
  - No line of a `case.yaml` or `prompt.md` says "scaffold" except `scaffold_script: seed.sh`, and none holds a double-quoted backslash.
- **Fixed words:** every line a grader or a history matches is copied from SKILL.md, never from a plan.
- **Shared graders:** `no-write` and `no-edit` are byte copies of `resume-later`'s. `readiness-hand-off`'s `ends-on-new-project` is too. `readiness-fix`'s `ends-on-confirm` is a byte copy of `evals/stale-spine/graders/ends-on-confirm.md`. `cmp` shows each.
- **D-21:** every new grader must fail when the behavior it claims is missing. Check that with a `node -e` script that reads each pattern from its grader file, over hand-made inputs kept in the scratch area and never committed. For trace graders, model the inputs on the trace copies in `evals/results/phase-8-traces/`.
- **Eval runs (SECURITY):** on Plan 1's recorded approval and terms. If none is recorded, stop at a checkpoint marked SECURITY before the first run.
  - **Seed vet:** each new `seed.sh` is vetted at a checkpoint quoting it before its first run (D-04 e).
  - **Audits:** the per-case command, the Bash audit, the agent-start audit, the retries, the cleanup with trace copies, and the rule against reading the Claude binary are Plan 1's Context, unchanged.
- **SKILL.md and the agent in the lease:** they're declared only so a run that fails on their text can be fixed here. After any such edit:
  - rerun `resume-later`, Plan 5's three cases and every case this plan has passed
  - keep SKILL.md at or under 90,000 bytes
  - run `node --test tests/*.test.mjs`
  - run `claude plugin validate --strict .` after an edit to the agent
- **Held:** no push, tag, PR or GitHub change, no install of any kind, and nothing published (D-16).

## Tasks

### Task 1: Add the readiness-findings case

- **Files:** evals/readiness-findings/case.yaml, evals/readiness-findings/prompt.md, evals/readiness-findings/seed.sh, evals/readiness-findings/graders/names-uncovered.md, evals/readiness-findings/graders/names-crossing.md, evals/readiness-findings/graders/ends-on-question.md, evals/readiness-findings/graders/no-write.md, evals/readiness-findings/graders/no-edit.md
- **Reads:** evals/resume-later/case.yaml, evals/prd-conflict/graders/ends-on-question.md, skills/seldon/SKILL.md#22. The readiness check, agents/readiness.md
- **Decisions:** D-07, D-08, D-09, D-18
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC1.
  - **The case:** Context's seed, the prompt `/seldon`, and no history.
  - **`case.yaml`:** the description says one PRD requirement is on no epic and one epic spans two capabilities with no spine boundary between them. A bare `/seldon` has to report both by ID, each with the step that fixes it, write nothing and end on the readiness question.
  - **Graders:**
    - **`names-uncovered`:** `last_message` holds, on a line of its own, the requirement-no-epic-names line for `CAT-01`, ending on `/seldon epics`.
    - **`names-crossing`:** `last_message` holds, on a line of its own, a crossed-boundary line naming `E-02` as its epic, ending on `/seldon spine`. The categories in its parentheses are left free.
    - **`ends-on-question`:** `last_message` ends on the readiness question on a line of its own, allowing only blanks or a closing fence after it, in `prd-conflict`'s `ends-on-question` form.
    - the shared `no-write` and `no-edit`
- **Verify:**
  - **Testing scope:** the outcome is AC1, which no case covers. Three new graders, their D-21 checks and one run are the evidence. Extra findings don't fail it here. Task 2's `readiness-crossing` is the case that holds a report to exactly one finding, so testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and `cmp` shows the shared graders equal to `resume-later`'s.
  - (2) **D-21:**
    - `names-uncovered` fails on `CAT-02`, on `CAT-011`, and on the line ending `/seldon spine`
    - `names-crossing` fails on `E-01`, on `E-021`, and on the line ending `/seldon epics`
    - `ends-on-question` fails on text after the question, and on a word of the question changed
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported.

### Task 2: Add the readiness-crossing case

- **Files:** evals/readiness-crossing/case.yaml, evals/readiness-crossing/prompt.md, evals/readiness-crossing/seed.sh, evals/readiness-crossing/graders/names-crossing.md, evals/readiness-crossing/graders/one-finding.md, evals/readiness-crossing/graders/ends-on-question.md, evals/readiness-crossing/graders/no-write.md, evals/readiness-crossing/graders/no-edit.md
- **Reads:** evals/readiness-findings/case.yaml, evals/readiness-findings/graders/names-crossing.md, skills/seldon/SKILL.md#22. The readiness check, agents/readiness.md, samples/readiness/epics.md
- **Decisions:** D-07, D-08, D-09, D-19
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is the live check under the two replays. Tasks 3 and 4 replay a report with one finding, and a history has to be a turn the skill can produce (D-19). Phase 7's `stale-spine` history was written by hand and no run ever produced it. This case is the run that produces this one.
  - **The case:** Context's seed, the prompt `/seldon`, and no history.
  - **`case.yaml`:** the description says every requirement is on an epic and one epic spans Loans and Repairs with no spine boundary between them, so a bare `/seldon` has to report that one crossing and nothing else, write nothing and end on the readiness question.
  - **Graders:**
    - **`names-crossing`** and **`ends-on-question`:** byte copies of `readiness-findings`'s.
    - **`one-finding`:** `last_message` holds exactly one finding line. A regex with `match: not_contains` that matches when two or more lines start with one of the three kind labels SKILL.md's forms open with.
    - the shared `no-write` and `no-edit`
- **Verify:**
  - **Testing scope:** the outcome is the one-finding report Tasks 3 and 4 replay. One new grader, its D-21 check and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, and `cmp` shows the copied graders equal to their sources.
  - (2) **D-21:** `one-finding` matches, and so fails the grader, on a message with the E-02 crossing line plus a requirement-no-epic-names line, and on one with the crossing line plus a decision-left-open line. It doesn't match a message with the crossing line alone.
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported. This run is approved in advance as a per-case run inside the three-tries terms (Daneel's ruling).
  - (5) If any try reports anything other than the one E-02 crossing, a second finding or none, stop at a checkpoint to Daneel with the last message and the fixture lines it read. Don't retry past it, don't change the fixture or the agent's rules to fit, and write no history.
  - (6) The passing trace's copy is in `evals/results/phase-8-traces/`, and its last message is quoted in the report for Tasks 3 and 4 to copy from.

### Task 3: Add the readiness-hand-off case

- **Files:** evals/readiness-hand-off/case.yaml, evals/readiness-hand-off/prompt.md, evals/readiness-hand-off/seed.sh, evals/readiness-hand-off/history.jsonl, evals/readiness-hand-off/graders/ends-on-new-project.md, evals/readiness-hand-off/graders/no-write.md, evals/readiness-hand-off/graders/no-edit.md
- **Reads:** evals/epics-confirm/history.jsonl, evals/prd-conflict-decline/history.jsonl, skills/seldon/SKILL.md#1. Where the conversation stands
- **Decisions:** D-09, D-11, D-19
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC3's hand-off.
  - **The case:** Context's seed and history.
  - **`prompt.md`:** a hand-off in invented words, such as `/seldon hand it off as it is`.
  - **Graders:** the three shared copies, `ends-on-new-project`, `no-write` and `no-edit`.
- **Verify:**
  - **Testing scope:** the outcome is D-11's hand-off. The shared graders with their D-21 checks carried over by `cmp`, and one run, are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, the history parses with `parentUuid` chained, and `cmp` shows the three graders equal to `resume-later`'s.
  - (2) A `node -e` check shows the history's assistant text holds exactly one finding line and ends on the readiness question, each as SKILL.md spells it, and that the finding line equals the one in `readiness-crossing`'s passing trace byte for byte.
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported.

### Task 4: Add the readiness-fix case

- **Files:** evals/readiness-fix/case.yaml, evals/readiness-fix/prompt.md, evals/readiness-fix/seed.sh, evals/readiness-fix/history.jsonl, evals/readiness-fix/graders/edits-spine.md, evals/readiness-fix/graders/fixes-boundary.md, evals/readiness-fix/graders/no-epics-write.md, evals/readiness-fix/graders/no-epics-edit.md, evals/readiness-fix/graders/ends-on-confirm.md
- **Reads:** evals/readiness-hand-off/history.jsonl, evals/stale-spine/graders/ends-on-confirm.md, evals/stale-epics/graders/no-read-outside.md, evals/stale-epics/graders/stamps-spine-hash.md, samples/readiness/spine.md, docs/FORMAT.md, skills/seldon/SKILL.md#16. The spine draft
- **Decisions:** D-10, D-19
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC3's fix.
  - **`seed.sh`:** Task 3's lines, with only the folder comment changed.
  - **`history.jsonl`:** Task 3's turns, with only `sessionId`, `cwd` and the uuids changed. A `node -e` comparison of the two parsed histories shows every other field equal.
  - **`prompt.md`:** a fix in invented words, such as `/seldon fix them`.
  - **Graders:**
    - **`edits-spine`:** `tool_used` Edit, `input_match` on a `file_path` ending `.planning/seldon/spine.md`, `min: 1`.
    - **`fixes-boundary`:** a `regex` on the file `.planning/seldon/spine.md`, in `stamps-spine-hash`'s file-target form. It matches one spine decision, from its `## S-` heading to the next heading, that holds a `Kind: boundaries` line and names both loans and repairs, in any case. That's the boundary the finding asked for, so an edit that only renews the stamp, or changes something else, fails it.
    - **`no-epics-write`** and **`no-epics-edit`:** `tool_used` Write and Edit, `input_match` on a `file_path` ending `.planning/seldon/epics.md`, `max: 0`.
    - **`ends-on-confirm`:** the shared copy.
- **Verify:**
  - **Testing scope:** the outcome is D-10's fix: one step, the spine, with the finding carried. Four new graders, their D-21 checks, one run and the stale check in (5) are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes, the history parses with `parentUuid` chained, and `cmp` shows `ends-on-confirm.md` equal to `stale-spine`'s.
  - (2) **D-21:** each `input_match` matches an Edit input whose `replace_all` key comes before `file_path`, which is the order an Edit's input has. Each fails on the other file's path and on `spine.md.bak`. `fixes-boundary` fails on the unchanged `samples/readiness/spine.md`, on that file with only its stamp line changed, and on a copy that names repairs in a decision of another kind. It passes on a copy given a `Kind: boundaries` decision between the loan log and the repair log.
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported.
  - (5) Before the kept folder is removed, `node lib/check.mjs --stale <kept workspace>/.planning/seldon` prints `stale: epics.md was built from an earlier spine.md` and no other stale line. That's the epics left for the next bare `/seldon`, as D-10 says.

### Task 5: Add the readiness-agent case

- **Files:** evals/readiness-agent/case.yaml, evals/readiness-agent/prompt.md, evals/readiness-agent/seed.sh, evals/readiness-agent/graders/one-agent.md, evals/readiness-agent/graders/starts-readiness.md, evals/readiness-agent/graders/hands-three-paths.md, evals/readiness-agent/graders/no-other-path.md, evals/readiness-agent/graders/no-skill-read.md, evals/readiness-agent/graders/agent-reads-three.md, evals/readiness-agent/graders/agent-reads-nothing-else.md
- **Reads:** evals/stale-epics/graders/no-read-outside.md, evals/stale-epics/graders/says-stale-line.md, skills/seldon/SKILL.md#22. The readiness check
- **Decisions:** D-03, D-04, D-18
- **Pins:** tests/scaffold.test.mjs
- **Action:** This is AC2. Plan 1's report and Daneel's ruling on it decide each grader's form. Where the ruling differs from what follows, the ruling governs.
  - **The case:** Context's seed, the prompt `/seldon`, and no history.
  - **Graders.** The agent tool is named as Plan 1's trace spells it.
    - **`one-agent`:** `tool_used` on the agent tool, `min: 1`, `max: 1`.
    - **`starts-readiness`:** `tool_used` on the agent tool, `input_match` on the agent-type field naming `seldon:readiness`, `min: 1`. With `one-agent`, that's exactly one start, and it's this one.
    - **`hands-three-paths`:** the start's input names `prd.md`, `spine.md` and `epics.md` under `.planning/seldon/`.
    - **`no-other-path`:** `max: 0` on a start whose input names any other path, such as `brief.md`, `architecture.md`, another file under `.planning/` or a path outside it.
    - **`no-skill-read`:** the skill makes no Read of the three files.
      - If Plan 1 found that `tool_used` doesn't count the agent's calls: `tool_used` Read with that `input_match` and `max: 0`.
      - If it found that it does: a `regex` on the trace with `match: not_contains`, matching such a Read only in a record not marked as the agent's.
    - **`agent-reads-three`** and **`agent-reads-nothing-else`:** written only if Plan 1 found the trace carries the agent's records. The first is a regex on the trace for a Read of each of the three in a record marked as the agent's. The second is `not_contains` for any Read in such a record whose path isn't one of the three.
  - **No agent records in the trace:** write neither agent-reads grader, and stop at a checkpoint with one question to Daneel about AC2's last sentence, before anything is reworded or dropped. That's CONTEXT's flagged assumption.
- **Verify:**
  - **Testing scope:** the outcome is AC2, which no case covers. The graders, their D-21 checks against the kept probe traces and one run are the evidence, and testing stops there.
  - (1) `node --test tests/scaffold.test.mjs` passes.
  - (2) **D-21,** over trace lines modeled on the copies in `evals/results/phase-8-traces/`:
    - `starts-readiness` fails on another agent type
    - `hands-three-paths` fails with any one path missing
    - `no-other-path` matches, and so fails the grader, on an input that adds `.planning/seldon/brief.md`
    - `no-skill-read` matches, and so fails the grader, on a skill Read of `.planning/seldon/epics.md`, and doesn't match the same Read in an agent record
    - where written, `agent-reads-nothing-else` matches, and so fails the grader, on an agent Read of `.planning/seldon/brief.md`
  - (3) The seed is vetted. This is a checkpoint.
  - (4) The run exits 0 at 1.00, and both audits are reported.
