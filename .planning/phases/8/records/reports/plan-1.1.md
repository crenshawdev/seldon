PLAN CHECKPOINT: human-verify
Plan: .planning/phases/8/PLAN-1.md
Tasks: 0 of 1
| Task | Commit | Note |
|---|---|---|
| 1 - Measure how the readiness agent starts (in progress: approval, docs, stand-ins, validator, probe case done; stopped at the seed vet before run 1) | none (the plan commits nothing) | see the sections below |

## SECURITY approval (Context checkpoint), recorded

From the lead, Daneel [e140f7], 2026-11-18, quoted as the dispatch carried it:

"ITEM 1, phase 8's eval runs: approved on the terms in PLAN-1.md:39-50 as you quoted them, plus these.
A. While the stand-ins are in place (the edited SKILL.md, agents/readiness.md, evals/readiness-probe/): no commit, no eval run other than the two probe runs, and no other change in the main tree. After the restore, all three must hold: `wc -c skills/seldon/SKILL.md` prints 74471, `git diff --exit-code` is clean, and `git status --porcelain` shows only `?? .idea/`. On any miss: `git checkout -- skills/seldon/SKILL.md`, remove the untracked stand-ins by exact path, and checkpoint to me.
B. The agent-start audit also lists every tool call the agent itself made, wherever the kept trace or the kept session transcript shows them. A call to any tool other than Read, or a Read of a path its prompt did not name, stops and comes to me. If the agent's own calls appear in neither file, say so as its own line in the probe report: then `tools: Read` cannot be shown from a run, and I rule on that with the probe's four answers.
C. Run 2's start being refused is the only result that counts as scoped. Anything else is 'not scoped, or not shown' and stops, as PLAN-1.md's Outcome says.
ITEM 2, phase 6 Plan 7's read-only listing ruling: approved again for phase 8, in phase 6's words (.planning/phases/6/SUMMARY.md:65), plus these.
D. It covers the skill's own thread only. A Bash call from an agent is never covered and stops the run. Each such listing is quoted whole in the audit with its permission record. A phase 8 seed that copies code or a `.env` into the run gets the no-secret grader, as phase 6 did (.planning/phases/6/SUMMARY.md:63); I check that at the seed vet.
Still held, unchanged: no push, tag, PR, GitHub change, install or publish. The probe's seed.sh comes to me quoted whole with its blob hash before run 1."

Verify (1): the approval and, beside it, the answer on phase 6 Plan 7's read-only listing ruling (ITEM 2: approved again, with term D) are recorded above.

## Docs step (looked up by the coordinator through Context7, library /websites/code_claude)

1. Agent tool and the one-subagent rule: https://code.claude.com/docs/en/sub-agents - "Use the format Agent(subagent-name) where subagent-name matches the subagent's name field", example deny rules ["Agent(Explore)", "Agent(my-custom-agent)"]. https://code.claude.com/docs/en/settings-reference - rules are `Tool` or `Tool(specifier)`, Agent rules in permissions.md. The sub-agents frontmatter table: names can't contain ':', "which is reserved for plugin-scoped identifiers such as my-plugin:reviewer". Documented entry: `Agent(seldon:readiness)`. Pointer: the phase 7 init record (evals/results/phase-7-traces/full-run-2/resume-later.trace.jsonl, line 1) lists `"tools":["Task",...,"TaskStop",...]` on `"claude_code_version":"2.1.327"`; run 1's trace settles the spelling.
2. Plugin agent frontmatter: https://code.claude.com/docs/en/plugins/components - supported: name, description, model, effort, maxTurns, autoCompactWindow, tools, disallowedTools, skills, memory, background, omitClaudeMd, isolation, color, experimental.cacheTtl; permissionMode, hooks, mcpServers and initialPrompt are ignored. https://code.claude.com/docs/en/sub-agents - `tools` and `disallowedTools` take a comma-separated string or a YAML list; a disallowedTools entry with a specifier still removes the whole tool.
3. engines in plugin.json: https://code.claude.com/docs/en/plugins/manifest-reference - no engines field in what Context7 returned; an unrecognized top-level key is stripped and the plugin loads, `claude plugin validate` warns, --strict turns warnings into failures. Docs predicted `validate --strict` refuses engines. The validator run below contradicts that.

## Stand-ins written (temporary, uncommitted)

- SKILL.md saved byte for byte to the scratch area first: /tmp/claude-1000/-code-seldon/8e645b01-f58e-4a35-9c78-089fd8a306cb/scratchpad/SKILL.md.orig (74471 bytes, blob e2b3e8c1252810815890a16e4fc22a163a9d7c45 = HEAD's blob).
- skills/seldon/SKILL.md (now 74507 bytes): `allowed-tools` gains `  - Agent(seldon:readiness)` after the Bash entry; the "All four documents, nothing stale, and empty arguments" bullet keeps its bold label and its body is now: "write nothing. Start the agent `seldon:readiness` with the `Agent` tool, its prompt holding exactly `.planning/seldon/prd.md`, `.planning/seldon/spine.md` and `.planning/seldon/epics.md`, one per line. Never Read those three files yourself. End your message with the agent's reply, word for word." The "exactly these words" lead-in, the later-release line and its fence are gone. `git diff --stat`: 1 file, 5 insertions, 7 deletions, no line outside the bullet and the list.
- agents/readiness.md: `name: readiness`, one-line description, `tools: Read`, `disallowedTools: Write, Edit, Bash`; body: Read each path the prompt names and nothing else, reply with each file's first line, one per line, nothing more.
- evals/readiness-probe/: case.yaml (runs 1, scaffold_script seed.sh, max_turns 20, timeout_seconds 600, allowed_tools `[Skill, Read, Glob, Grep, "Agent(seldon:readiness)"]`), prompt.md `/seldon`, seed.sh (below), graders/starts-agent.md (`tool_used`, tool Agent, min 1), graders/no-read-documents.md (`tool_used`, tool Read, input_match `'"file_path"\s*:\s*"[^"]*\.planning/seldon/(?:prd|spine|epics)\.md"'`, min 0, max 0).

## Seed vet (Verify 2)

evals/readiness-probe/seed.sh, blob 19d19bf531c0e263099db2039957d871f9cb0288 (`git hash-object evals/readiness-probe/seed.sh`), quoted whole:

```
#!/usr/bin/env bash
set -euo pipefail

# The case lives in evals/readiness-probe/, so the repo is two levels up.
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# All four documents are on disk, so a bare /seldon lands on the readiness start.
mkdir -p .planning/seldon
cp "$repo/samples/brief.md" .planning/seldon/brief.md
cp "$repo/samples/prd.md" .planning/seldon/prd.md
cp "$repo/samples/spine.md" .planning/seldon/spine.md
cp "$repo/samples/epics.md" .planning/seldon/epics.md
```

It differs from evals/resume-later/seed.sh only in its two comment lines. It copies no code and no `.env`, only the four samples.

`node --test tests/scaffold.test.mjs` with the probe case in place (predicted: all pass; observed: all pass, exit 0):

```
✔ every scaffold a case names sits in its case folder and only copies fixtures from samples/ (6.924566ms)
✔ every allowed form passes (0.447781ms)
✔ any other line fails, named by its line (0.597439ms)
✔ a case names its scaffold only as scaffold_script: <name>, and any other form is flagged, not skipped (0.149891ms)
ℹ tests 4
ℹ pass 4
ℹ fail 0
```

## Validator (Verify 3), on Claude Code 2.1.327 (`claude --version`)

- `claude plugin validate --strict .` in /code/seldon with the stand-in agent: exit 0. Output: "Validating marketplace manifest: /code/seldon/.claude-plugin/marketplace.json ... Provides: skills: seldon:seldon, agents: seldon:readiness ... ⚠ Found 1 plugin directory warning: .claude-plugin/plugin.json icon: No icon (ICON_MISSING) ... These plugin directory checks do not change the result below ... ✔ Validation passed". `--json`: manifest errors [], warnings [], provides.agents ["seldon:readiness"], success true.
- `claude plugin validate --strict agents` in /code/seldon: "Validating components in: /code/seldon/agents ✔ Validation passed", exit 0.
- What a pass shows, from two scratch-only controls (copies under the scratchpad, nothing in the tree): an agent file with no `description` fails --strict ("⚠ description: No description in frontmatter ... ✘ Validation failed (--strict treats warnings as errors)", exit 1), so the validator reads agent frontmatter; an agent file with an unknown key `zzprobe: 1` passes (exit 0), so it does not flag unknown agent keys. Answer 4 so far: `validate --strict` takes the stand-in's frontmatter, but that pass does not prove each field is honored at run time.
- `claude plugin validate --strict agents/readiness.md` (a single file) is parsed as a JSON manifest ("json: Invalid JSON syntax"); that is the wrong target form, not a refusal of the agent.
- engines: the scratch copy of `.claude-plugin/` with `"engines": {"claude-code": ">=2.1.327"}` added to its plugin.json. `claude plugin validate --strict .` on the copy: validates the marketplace manifest, "✔ Validation passed", exit 0. `claude plugin validate --strict --json .claude-plugin/plugin.json` on the copy: `"type": "plugin"`, `"errors": []`, `"warnings": []`, `"success": true`, exit 0 (its only finding is the directory profile's README_MISSING, which "do[es] not change the result" because the copy has no README). Control copy with an unknown key `"zzprobe": {"x":1}` instead: "⚠ zzprobe: Unknown field 'zzprobe'. Claude Code ignores it at load time. ✘ Validation failed (--strict treats warnings as errors)", exit 1. So on 2.1.327 `validate --strict` takes `engines["claude-code"]` as a known field. Per the plan's Outcome, Plan 2's Task 3 is not stopped by the validator. The tracked plugin.json was never edited.

## Not yet done (after the vet)

Run 1, its Bash and agent-start audits (with term B's own-call listing), run 2, the restore and its checks, the four answers from the traces, the outcome, the report to Daneel.

Deviations:
- [deviation] The docs step predicted `claude plugin validate --strict` refuses `engines` in plugin.json as an unrecognized key; on 2.1.327 it passes with no warning, while an unknown key (`zzprobe`) fails --strict. Recorded as the engines result; nothing else changed.

Open items:
- Static analysis was not run: this plan makes no commit, and step 3 runs before a commit.
- This report file is itself an untracked path in the main tree. Term A's third restore check (`git status --porcelain` shows only `?? .idea/`) will also show `?? .planning/phases/8/records/reports/` unless the orchestrator has committed the report by then.
- tests/skill.test.mjs (a pin) is expected red while the edited SKILL.md is in place; it was not run, and the suite runs only after the restore.
