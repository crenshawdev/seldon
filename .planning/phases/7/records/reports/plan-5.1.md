PLAN CHECKPOINT: decision
Plan: /code/seldon/.planning/phases/7/PLAN-5.md
Tasks: 2 of 4
| Task | Commit | Note |
|---|---|---|
| 1 - Widen the two resume graders for the stale check | d86e125 | Added one alternative to each pattern's allowed-before group: `(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+")`. Nothing else in the patterns changed. Verify 1: the full-walk kept trace (/tmp/claude-eval-U9qEbl) has the call as one line, `{"type":"assistant","message":{...,"content":[{"type":"tool_use",...,"name":"Bash","input":{"command":"node /code/seldon/lib/check.mjs --stale .planning/seldon","description":...}}]...}`, so CONTEXT's Likely assumption holds. Verify 2 (D-21, 12 checks, inputs built from that trace): both patterns match the whole trace and reject `--spine`, `ls`, a Read of the spine (full-walk) or PRD (spine-from-prd) placed before the line, and a missing line. The HEAD pattern rejects the whole trace. Verify 3: full-walk 1.00 ($0.42), spine-from-prd 1.00 ($0.43), resume-later 1.00 ($0.34), which-design-answer 1.00 ($0.44). All exited 0 with 0 `not granted` and 0 `scaffold failed`, one try each. Bash audit (each `accept`, source config, reason_type subcommandResults; permission_denials [] in all four): full-walk `--stale .planning/seldon`, `--epics .planning/seldon`; spine-from-prd `--stale .planning/seldon`, `--spine .planning/seldon`; resume-later `--stale .planning/seldon`; which-design-answer `--stale .planning/seldon/sowlist`, `--prd .planning/seldon/sowlist`. All as `node /code/seldon/lib/check.mjs ...`. Kept folders /tmp/claude-eval-U9qEbl, -3MKanK, -8GORPM, -scfodr removed by exact path. Static analysis: detect-commands gives lint null and typecheck null, so none ran. |
| 2 - Prove each step stamps the document it creates | 3b28866 | Three `source: file` regex graders, `^# [^\n]*\n<stamp>\n`. The stamps come from `--stale` over scratch folders seeded as each case seeds: resume prd.md `Built from: brief.md sha256:c5fe3e61100c2e40`, spine-answers spine.md `Built from: prd.md sha256:ccbc4926ac3a5da7`, epics-from-spine epics.md `Built from: spine.md sha256:fce47dade8bb786c`. Verify 1 (D-21, 15 checks): each grader matches its good file (samples/prd.md, a hand-made Sowlist spine, samples/epics.md). Each rejects the same file with no stamp, with one hash digit changed, with the parent named wrongly, and with a blank line before the stamp. Verify 2: resume 1.00 ($0.43), spine-answers 1.00 ($0.41), epics-from-spine 1.00 ($0.43), the new grader passing in each. All exited 0 with 0 `not granted` and 0 `scaffold failed`, one try each. Bash audit (all `accept`, subcommandResults, permission_denials []): resume `--stale`, `--prd`; spine-answers `--stale`, `--spine`; epics-from-spine `--stale`, `--epics`, each `node /code/seldon/lib/check.mjs <mode> .planning/seldon`. Kept folders /tmp/claude-eval-Rd6Qxn, -anlCJY, -YDseJU removed by exact path. |
| 3 - Add the stale-spine case | none yet | Stopped at Verify 3, the coordinator's seed vet before the first run. All 11 lease files are written and uncommitted under evals/stale-spine/. Verify 1: `node --test tests/scaffold.test.mjs` 4 pass, 0 fail. The history is 4 lines that parse, with parentUuid chained, one fresh sessionId and cwd /tmp/seldon-stale-spine. Verify 2 (D-21, 24 checks, all as required): says-stale-line fails without the line and with the spine Edit before it; stamps-prd-hash (`Built from: prd.md sha256:afdfac3901d93404`, from `--stale` over this seed) fails on samples/spine.md and matches samples/epics-rerun/spine.md; retires-dropped-id the same; ends-on-confirm fails on a non-question last line, a question that isn't last, and the PRD confirm question; no-write-epics/no-edit-epics match relative, absolute and spaced-JSON epics.md and not spine.md. Over this seed, `--stale` prints only `stale: spine.md was built from an earlier prd.md` (exit 1). |
Deviations: none
Open items:
- In all four kept traces checked for it (full-walk, resume, spine-answers, epics-from-spine), every Bash tool_result reads `Exit code 1` and ends `zsh:1: read-only file system: <kept>/tmp/claude-1000/cwd-...`, even where check.mjs printed `seldon check: no stale link` (exit 0). The eval sandbox's read-only tmp breaks the shell's cwd-tracking write, so the exit code the model sees is not check.mjs's. Every route was still right. This is the harness's behavior, not this plan's.

SECURITY/seed vet - evals/stale-spine/seed.sh, quoted whole:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/stale-spine/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# The brief and PRD after reminders were dropped, next to the spine and epics built before that.
mkdir -p .planning/seldon
cp "$repo/samples/spine-rerun/brief.md" .planning/seldon/brief.md
cp "$repo/samples/spine-rerun/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
```
