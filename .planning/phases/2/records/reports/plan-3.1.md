PLAN CHECKPOINT: decision
Plan: .planning/phases/2/PLAN-3.md
Tasks: 0 of 7
| Task | Commit | Note |
|---|---|---|
| 1 - fast-path brief case, first D-16 grant run | none (uncommitted) | Case files written in evals/fast-path-brief/ (all eight leased files, untracked, not committed). Static Verify (3) and (4) pass: check-passes matches `seldon check: brief.md conforms` and not `seldon check: all four documents conform`; runs-check's input_match matches `{"command":"node /code/seldon/lib/check.mjs --brief .planning/seldon",...}`; states-refusal matches samples/brief.md and misses both the because-stripped copy and the because-only-in-Vision copy; `/home/` count 0; sessionId 3c45949b-9f68-44d8-8187-8ca16aa40e5e, UUID-shaped, not phase 1's. Verify (1) FAILED and hit D-16's fail-closed condition, so the plan stopped here. |

## First run of the D-16 grant (Task 1)

Command, run from /code/seldon (main tree):

```
claude plugin eval . --case fast-path-brief --trust-plugin --no-publish --ablation none --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node /code/seldon/lib/check.mjs:*)"
```

Exit 1. What it printed, word for word:

```
Plugin under test: "seldon" version "0.1.0" at "/code/seldon"
  fast-path-brief: not granted (missing --allow-tools grant, or a malformed entry): Write
  kept temp: /tmp/claude-eval-vIhKn1
  fast-path-brief run 1/1: score 0.40  $0.31
    ✗ check-passes (weight 1): pattern not found in last_message
    ✗ runs-check (weight 1): Bash called 0x (expected 1..∞)
    ✗ states-refusal (weight 1): pattern not found in file .planning/seldon/brief.md
    ✓ tags-assumption (weight 1): matched \[ASSUMPTION\]
    ✓ writes-brief (weight 1): .planning/seldon/brief.md exists as expected
✗ fast-path-brief  score 0.40  (1 run)  $0.31
Report: /code/seldon/evals/results/2026-11-17T10-53-59-841Z/report.html
```

(The run also printed the kept-directory warning: home/ and tmp/ sealed under /tmp/claude-eval-vIhKn1/sealed, mode 000.)

What the kept trace (/tmp/claude-eval-vIhKn1/out/trace.jsonl) shows:

- **The `not granted` line is for plain Write, yet the Write went through.** The case lists Write in `allowed_tools`, and the harness flags it because the grant names only `Edit(.planning/seldon/**)`. The model's Write call to `.planning/seldon/brief.md` still succeeded ("File created successfully"), so the path-scoped Edit rule did let Write through. Write also created the missing `.planning/seldon/` directory itself. The plan expected `not granted` to mean "the grant wasn't honored", and here it doesn't mean that. D-16 still says to stop on it, so I stopped.
- **Where `.planning/seldon/**` resolved:** against the run's workspace cwd. The brief was written at `/tmp/claude-eval-vIhKn1/home/cwd/.planning/seldon/brief.md`, inside the run's workspace (init cwd `/tmp/claude-eval-vIhKn1/home/cwd`), not under `/code/seldon`, where the command ran. `/code/seldon/.planning/seldon` does not exist after the run. The plugin loaded in place from `/code/seldon` (`seldon@inline`), so `/code/seldon` is the right root for the Bash rule.
- **The resumed turn never loaded the skill.** The trace has 0 Skill calls. The model answered the confirmation from the history alone and wrote a brief that ignores SKILL.md: it has sections like `## Users`, `## Out of scope`, `## Stakes`, `## Assumptions to check` and `## Open questions`, no `## What it refuses`, and no check run. The plan's Notes say this case can't prove SKILL.md's behavior then, and to stop with a checkpoint rather than change D-15's history shape. The 3 failing graders all come from this, not from the grant.
- **Bash outside the check rule:** `ls -la <workspace>/home/cwd ...` RAN, even though the Bash grant covers only the check command. The auto-allow for read-only commands seems to let it through, because Bash is in the case's `allowed_tools`. `mkdir -p .../.planning/seldon` was refused ("denied because Claude Code is running in don't ask mode"). Nothing was written outside the workspace. This matters for AC4/D-03's "Bash max 0 for anything but the check command" graders (plan 4).

Deviations:
- [deviation] Plan Task 1 assumed a `not granted` line would only appear when the harness doesn't honor the grant. Actually the harness prints `not granted ... Write` whenever a case lists plain Write and the grant names only `Edit(.planning/seldon/**)`, even though the scoped rule let the Write through and the brief was created. I stopped at D-16's fail-closed checkpoint, widened nothing and changed no case.
- [deviation] Plan Notes / D-15 assumed a resumed turn on a hand-written history loads the seldon skill, as phase 1's replay did. In this run the resumed turn made 0 Skill calls and wrote a brief in its own shape. I stopped per the plan's Notes, with no change to the history shape.

Open items:
- Task 1's eight files sit untracked in evals/fast-path-brief/ (the run's session file 3c45949b-...jsonl beside them is ignored by evals/.gitignore). Commit them, or rework them, once the decision is made.
- Read-only Bash commands (`ls`) run under a Bash grant scoped to the check command, whenever Bash is in a case's allowed_tools. Plan 4's "Bash max 0 for anything but the check" grader would catch it, but it means a model can probe the workspace through Bash.
