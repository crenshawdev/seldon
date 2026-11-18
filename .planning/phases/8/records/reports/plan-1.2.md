PLAN CHECKPOINT: human-verify
Plan: .planning/phases/8/PLAN-1.md
Tasks: 0 of 1
| Task | Commit | Note |
|---|---|---|
| 1 - Measure how the readiness agent starts (both runs, audits, restore and checks done; stopped at the report checkpoint, outcome NOT SCOPED, OR NOT SHOWN) | none (the plan commits nothing) | see the sections below |

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

## Seed-vet checkpoint outcome, recorded

From the lead, Daneel [e140f7], 2026-11-18, quoted as the continuation dispatch carried it:

"SECURITY ruling from Daneel [e140f7], Seldon phase 8 plan 1: the probe seed is cleared and term A takes your option (a). Run probe run 1, then run 2, on the approved terms.
ITEM 1, seed vet: cleared, checked by me directly in /code/seldon at HEAD d2bdf68.
- evals/readiness-probe/seed.sh: blob 19d19bf531c0e263099db2039957d871f9cb0288 by my own git hash-object, mode 755, 12 lines, 493 bytes, no non-ASCII or control characters (cat -A and a byte grep).
- Its diff against evals/resume-later/seed.sh is comment lines 4 and 7 only. The command lines are set, repo=, one mkdir and four single-file cp into relative .planning/seldon/.
- Sources at HEAD, all 100644 and not symlinks, samples/ clean: samples/brief.md 77fc6ce9, samples/prd.md 5054c0f2, samples/spine.md 71f74684, samples/epics.md be719be2. No credential pattern in the four. No code or .env copied, so term D asks for no no-secret grader here.
- The case folder holds only seed.sh, prompt.md, case.yaml and two graders, all regular files.
Clearance holds for that blob only.
ITEM 2, term A's restore check: option (a). After the restore, `git status --porcelain` must show exactly two lines, `?? .idea/` and `?? .planning/phases/8/records/reports/`, and anything else is a miss. The other two checks stand: `wc -c skills/seldon/SKILL.md` prints 74471 and `git diff --exit-code` is clean. Reason: the report rides in the phase's one docs commit as in every earlier phase, and a commit made only to satisfy my check would be a new habit for no gain.
What I read of the stand-ins, so you need not repeat it in the probe report: SKILL.md is 74,507 bytes and its diff against e2b3e8c is one added allowed-tools line, `Agent(seldon:readiness)`, and the one bullet body at :408-411. agents/readiness.md has `tools: Read` and `disallowedTools: Write, Edit, Bash`. case.yaml's allowed_tools is [Skill, Read, Glob, Grep, \"Agent(seldon:readiness)\"].
The engines result and the validator's limit (a pass does not show each agent field takes effect) I will rule on with the probe's four answers, not now."

Pre-run recheck (this dispatch, HEAD d2bdf68): seed.sh still blob 19d19bf531c0e263099db2039957d871f9cb0288, mode 755; SKILL.md 74507 bytes with the same two-hunk diff; case folder and agents/ hold only the files listed above.

## Validator (Verify 3), on Claude Code 2.1.327 (`claude --version`)

- `claude plugin validate --strict .` in /code/seldon with the stand-in agent: exit 0. Output: "Validating marketplace manifest: /code/seldon/.claude-plugin/marketplace.json ... Provides: skills: seldon:seldon, agents: seldon:readiness ... ⚠ Found 1 plugin directory warning: .claude-plugin/plugin.json icon: No icon (ICON_MISSING) ... These plugin directory checks do not change the result below ... ✔ Validation passed". `--json`: manifest errors [], warnings [], provides.agents ["seldon:readiness"], success true.
- `claude plugin validate --strict agents` in /code/seldon: "Validating components in: /code/seldon/agents ✔ Validation passed", exit 0.
- What a pass shows, from two scratch-only controls (copies under the scratchpad, nothing in the tree): an agent file with no `description` fails --strict ("⚠ description: No description in frontmatter ... ✘ Validation failed (--strict treats warnings as errors)", exit 1), so the validator reads agent frontmatter; an agent file with an unknown key `zzprobe: 1` passes (exit 0), so it does not flag unknown agent keys. Answer 4 so far: `validate --strict` takes the stand-in's frontmatter, but that pass does not prove each field is honored at run time.
- `claude plugin validate --strict agents/readiness.md` (a single file) is parsed as a JSON manifest ("json: Invalid JSON syntax"); that is the wrong target form, not a refusal of the agent.
- engines: the scratch copy of `.claude-plugin/` with `"engines": {"claude-code": ">=2.1.327"}` added to its plugin.json. `claude plugin validate --strict .` on the copy: validates the marketplace manifest, "✔ Validation passed", exit 0. `claude plugin validate --strict --json .claude-plugin/plugin.json` on the copy: `"type": "plugin"`, `"errors": []`, `"warnings": []`, `"success": true`, exit 0 (its only finding is the directory profile's README_MISSING, which "do[es] not change the result" because the copy has no README). Control copy with an unknown key `"zzprobe": {"x":1}` instead: "⚠ zzprobe: Unknown field 'zzprobe'. Claude Code ignores it at load time. ✘ Validation failed (--strict treats warnings as errors)", exit 1. So on 2.1.327 `validate --strict` takes `engines["claude-code"]` as a known field. Per the plan's Outcome, Plan 2's Task 3 is not stopped by the validator. The tracked plugin.json was never edited.

## Run 1 (case entry `Agent(seldon:readiness)`, SKILL.md entry `Agent(seldon:readiness)`)

Command, from /code/seldon: `claude plugin eval . --case readiness-probe --trust-plugin --no-publish --ablation none --scaffold --keep-temp --allow-tools "Edit(.planning/seldon/**)" "Bash(node $PWD/lib/check.mjs:*)"`. Kept temp printed: `/tmp/claude-eval-LCysU7`. No `scaffold failed`. Exit 1 (the eval's own exit on a score under 1).

Predicted: the start runs, starts-agent passes, no-read-documents passes only if tool_used ignores the agent's calls. Observed:

```
  readiness-probe run 1/1: score 0.50  $0.52
    ✗ no-read-documents (weight 1): Read called 3x (expected 0..0)
    ✓ starts-agent (weight 1): Agent called 1x (expected 1..∞)
1 case(s) · 12s · $0.52
```

- Version: init record (trace line 1) `"claude_code_version":"2.1.327"`, `"permissionMode":"dontAsk"`, `"tools":["Task","Bash","Edit","Glob","Grep","NotebookEdit","Read","Skill","TaskStop","ToolSearch","Write"]`, `"agents":[...,"seldon:readiness",...]`.
- The start (trace line 15): `tool_use name=Agent input={"description": "Readiness review of design docs", "subagent_type": "seldon:readiness", "prompt": ".planning/seldon/prd.md\n.planning/seldon/spine.md\n.planning/seldon/epics.md", "run_in_background": false}`. Line 16: `{"type":"system","subtype":"task_started",...,"tool_use_id":"toolu_015ofoyT1Mb4LMDs9Yg4JNjD",...,"subagent_type":"seldon:readiness",...,"spawn_depth":1,"task_type":"local_agent"}`. Its permission record (line 29 tool_result_meta): `{"decision": "accept", "source": "config"}`. Result line 29 `tool_use_result`: `"agentType":"seldon:readiness","toolsUsed":["Read"]`, `"toolStats":{"readCount":3,"searchCount":0,"bashCount":0,"editFileCount":0,...,"otherToolCount":0}`. Final result: `"subagent_stats":{"spawned":1,...,"by_type":{"seldon:readiness":1}}`, `"permission_denials":[]`, `"result":"# Toolshed - PRD\n# Toolshed - architecture spine\n# Toolshed - epics"`.
- The tool is spelled `Agent` in the tool_use, though the init `tools` list names it `Task`.
- The agent's records in the trace: lines 17, 19, 20, 22, 23, 25, 26 carry `"parent_tool_use_id":"toolu_015ofoyT1Mb4LMDs9Yg4JNjD"` (the Agent call's id); every skill-thread record carries `"parent_tool_use_id":null`. `task_progress` system records (18, 21, 24) sit between them. The agent's final text reply is not an assistant record in the trace; it comes back only inside the Agent tool_result (line 29).
- tool_used counts the agent's calls: the skill thread made no Read at all (its calls were Glob x3, Bash x1, Agent x1), so no-read-documents' 3 are the agent's three Reads (lines 19, 22, 25).

Agent-start audit, run 1: one start, line 15/16, `seldon:readiness`, permission `accept`/`config`. No other start.
Term B, the agent's own calls (in both the trace and the session transcript, `config/projects/-tmp-claude-eval-LCysU7-home-cwd/c87ad21b-549f-4725-b9ef-6f8fac28be26/subagents/agent-a08f5eda74752a208.jsonl`, lines 11, 13, 15; its meta.json `"agentType":"seldon:readiness","isBuiltIn":false`):
- Read `{"file_path": "/tmp/claude-eval-LCysU7/home/cwd/.planning/seldon/prd.md", "limit": 1}` -> `{"decision": "accept", "source": "config", "reason_type": "rule"}`
- Read `{"file_path": "/tmp/claude-eval-LCysU7/home/cwd/.planning/seldon/spine.md", "limit": 1}` -> same record
- Read `{"file_path": "/tmp/claude-eval-LCysU7/home/cwd/.planning/seldon/epics.md", "limit": 1}` -> same record
Only Read, only the three named paths (resolved under the run's cwd). Nothing stops.
The skill-thread calls in the session transcript match the trace (Glob, Glob, Glob, Bash, Agent; `isSidechain` false).

Bash audit, run 1: one Bash call, skill thread (line 11): `node /code/seldon/lib/check.mjs --stale .planning/seldon`, permission (line 12) `{"decision": "accept", "source": "config", "reason_type": "subcommandResults"}`. Allowed by the terms. Its result is `is_error: true`, "Exit code 1 ... seldon check: no stale link ... zsh:1: read-only file system: /tmp/claude-eval-LCysU7/tmp/claude-1000/cwd-00d9"; that zsh line is the sealed sandbox, and it is in phase 7's kept traces too (full-run-1/prd-conflict-apply, brief-rerun-dump, spine-from-prd; full-run-2/resume-later). No read-only listing, no agent Bash.
Other permission records: Glob x3 `accept`/`config`/`mode`.

Turns: result `"num_turns": 6`. Skill thread: 5 assistant messages (distinct message ids, parent null). Agent: 2 (msg_011ChAiQnh7oQojZRvXaBD3Y with the three Reads, msg_011ChAiR1FBPF3bLbuPbXGR9 the final text, from the subagent transcript). 6 = skill 5 + 1, the most common relation in phase 7's full-run-2 traces (num_turns = main messages + 1 in 20 of 48), and 6 < 5 + 2. Labeled as uncertain: phase 7 also shows num_turns far above main + 1 (prd-conflict-apply 4 -> 11, spine-conventions 6 -> 12), so this one run suggests, but does not prove, that max_turns does not count the agent's turns.

## Run 2 (case entry `Agent(seldon:not-readiness)`, SKILL.md entry unchanged `Agent(seldon:readiness)`)

Only change before it: case.yaml line 10 became `allowed_tools: [Skill, Read, Glob, Grep, "Agent(seldon:not-readiness)"]`; seed.sh rechecked as blob 19d19bf5..., SKILL.md 74507 bytes. Same command. Kept temp printed: `/tmp/claude-eval-8m0x7B`. No `scaffold failed`. Exit 1.

Predicted: the start is refused (error tool_result, a permission_denials entry, no task_started). Observed, the start ran:

```
  readiness-probe run 1/1: score 0.50  $0.39
    ✗ no-read-documents (weight 1): Read called 3x (expected 0..0)
    ✓ starts-agent (weight 1): Agent called 1x (expected 1..∞)
1 case(s) · 13s · $0.39
```

- Init: `"claude_code_version":"2.1.327"`, `"permissionMode":"dontAsk"`, same tools and agents lists as run 1.
- Line 17: `tool_use name=Agent input={"description": "Readiness check of design docs", "subagent_type": "seldon:readiness", "prompt": ".planning/seldon/prd.md\n.planning/seldon/spine.md\n.planning/seldon/epics.md", "run_in_background": false}`.
- Line 18: `{"type": "system", "subtype": "task_started", "task_id": "a175d4e8c0d945351", ..., "tool_use_id": "toolu_01FjVH8LyZL32qkmGUMrQ7bb", ..., "subagent_type": "seldon:readiness", "is_backgrounded": false, "spawn_depth": 1, "task_type": "local_agent", ...}`.
- The start's permission record (line 31 tool_result_meta): `{"id": "toolu_01FjVH8LyZL32qkmGUMrQ7bb", "permission_decision": {"decision": "accept", "source": "config"}}`. Line 31 `tool_use_result`: `"status": "completed", "agentType": "seldon:readiness", "toolsUsed": ["Read"]`, toolStats readCount 3, all other counts 0.
- Result: `"num_turns": 6`, `"permission_denials": []`, `subagent_stats` spawned 1, completed 1, refused all 0, `by_type {"seldon:readiness": 1}`, `"terminal_reason": "completed"`, result text "All four documents are there and none is stale. Here is what the readiness check returned:\n\n# Toolshed - PRD\n# Toolshed - architecture spine\n# Toolshed - epics".

Agent-start audit, run 2: one start, line 17/18, `seldon:readiness`, permission `accept`/`config`. No other start.
Term B, the agent's own calls (in the trace, lines 21, 24, 27 with `parent_tool_use_id` toolu_01FjVH8LyZL32qkmGUMrQ7bb, and in the transcript `config/projects/-tmp-claude-eval-8m0x7B-home-cwd/9e9f9864-83f8-4d95-8326-790e90eea183/subagents/agent-a175d4e8c0d945351.jsonl` lines 11, 13, 15; meta.json `"agentType":"seldon:readiness","isBuiltIn":false`):
- Read `{"file_path": "/tmp/claude-eval-8m0x7B/home/cwd/.planning/seldon/prd.md", "limit": 1}` -> `{"decision": "accept", "source": "config", "reason_type": "rule"}`
- Read `.../spine.md`, `"limit": 1` -> same record
- Read `.../epics.md`, `"limit": 1` -> same record
Only Read, only the three named paths. Nothing stops. Skill-thread calls in the session transcript: Glob x3, Bash, Agent, all `isSidechain` false, matching the trace.
Bash audit, run 2: one Bash call, skill thread (line 11): `node /code/seldon/lib/check.mjs --stale .planning/seldon`, permission (line 12) `{"decision": "accept", "source": "config", "reason_type": "subcommandResults"}`. Allowed. Same exit 1 with the sealed-sandbox zsh line as run 1. No read-only listing, no agent Bash. Glob x3 `accept`/`config`/`mode`.
Turns: `num_turns` 6; skill thread 5 assistant messages, agent 2 (msg_011ChAiZNyrNEAzVSzU3rKjm, msg_011ChAiZbLkhd6B4BPht4g1q). Same shape as run 1.
The skill made no Read in either run.

## Restore and checks (Verify 6, term A with option (a))

- Traces copied before removal, `cmp` identical: `evals/results/phase-8-traces/readiness-probe-run-1.trace.jsonl` (32431 bytes), `evals/results/phase-8-traces/readiness-probe-run-2.trace.jsonl` (33016 bytes). `git check-ignore`: covered by `evals/.gitignore:1:results/`.
- SKILL.md restored from the scratch copy (74471 bytes, blob e2b3e8c1252810815890a16e4fc22a163a9d7c45). Removed by exact path: agents/readiness.md, agents/, evals/readiness-probe/{case.yaml, prompt.md, seed.sh, graders/starts-agent.md, graders/no-read-documents.md}, graders/, evals/readiness-probe/. Kept folders removed by exact path: /tmp/claude-eval-LCysU7, /tmp/claude-eval-8m0x7B.
- Predicted and observed:
  - `wc -c skills/seldon/SKILL.md` -> `74471 skills/seldon/SKILL.md`
  - `git diff --exit-code` -> exit 0; `git diff --exit-code -- skills/seldon/SKILL.md` -> exit 0
  - `git status --porcelain` -> exactly `?? .idea/` and `?? .planning/phases/8/records/reports/`
  - `git status --porcelain -- agents evals/readiness-probe` -> nothing
  - `ls -d /tmp/claude-eval-LCysU7` and `ls -d /tmp/claude-eval-8m0x7B` -> "No such file or directory", exit 2 each
  - both trace copies present (listed above)

## The four answers, for Daneel

1. **Does a start run with the agent-tool entry in the case's allowed tools, and is the skill's own entry enough without it?** With `Agent(seldon:readiness)` in the case list, yes: run 1 trace line 15/16, permission `{"decision": "accept", "source": "config"}`. Whether the skill's entry alone is enough: not shown. In run 2 the case list held only `Agent(seldon:not-readiness)` and the start still ran (line 17/18, same permission record). That is consistent with the skill's `allowed-tools` entry being enough, but equally with the case list not gating agent starts at all, or with a scoped entry not restricting by name. The Agent permission records carry no `reason_type` (Read's say `rule`, Glob's `mode`, Bash's `subcommandResults`), so neither trace names which rule allowed the start.
2. **Spelling and scoping.** Spelled `Agent` in the tool_use (`name=Agent`, input key `"subagent_type": "seldon:readiness"`), while the init record's `tools` list names it `Task`; tool_used matches on `Agent` (`Agent called 1x`). The documented entry form `Agent(seldon:readiness)` was accepted in SKILL.md and case.yaml without complaint. Whether a scoped entry lets `seldon:readiness` start while one scoped to another name doesn't: **not shown**. Run 2's entry scoped to `seldon:not-readiness` did not refuse the start, and with SKILL.md's `Agent(seldon:readiness)` still in place the two runs cannot tell which entry allowed it.
3. **Does `out/trace.jsonl` carry the agent's own records?** Yes. The agent's user and assistant records (its prompt, its three Read tool_uses and their results) are in the trace, each with `"parent_tool_use_id"` set to the Agent call's id (run 1 `toolu_015ofoyT1Mb4LMDs9Yg4JNjD`, run 2 `toolu_01FjVH8LyZL32qkmGUMrQ7bb`); skill-thread records carry `null`. System records `task_started`, `task_progress`, `task_updated` and `task_notification` mark the start and end with `subagent_type` and `tool_use_id`. The agent's final text reply is not a trace record of its own; it is only inside the Agent tool_result. **tool_used counts them:** no-read-documents scored `Read called 3x` in both runs while the skill thread made no Read at all, so all three counted Reads are the agent's. A `tool_used` grader cannot tell the skill's calls from the agent's.
4. **Does `claude plugin validate --strict` take the agent file's frontmatter?** Yes: exit 0, `provides.agents ["seldon:readiness"]`, no warnings (Validator section above). Limit: it rejects a missing `description` but passes an unknown key, so a pass does not show each field takes effect. From the runs: the agent used only Read in both (toolStats bashCount 0, editFileCount 0, otherToolCount 0), which agrees with `tools: Read` but does not show the restriction acting, because the agent never tried another tool; the subagent transcript's api-request `params` carry no `tools` key, so its granted tool list is not visible there.

- **Version:** Claude Code 2.1.327 in both runs' init records (and `claude --version`).
- **engines:** `validate --strict` takes `engines["claude-code"]` on 2.1.327 (exit 0, no warning; an unknown key fails), per the Validator section.
- **Turns:** both runs `num_turns` 6 with the skill at 5 assistant messages and the agent at 2. Suggests max_turns does not count the agent's turns (6 = 5 + 1, the most common phase 7 relation, and less than 5 + 2), not proven (phase 7 shows num_turns well above main + 1 in other traces).

## Outcome

**Not scoped, or not shown.** Run 1's start of `seldon:readiness` ran, and run 2's start ran too, with the case entry scoped to `seldon:not-readiness` (term C: only a refusal counts as scoped). Per the plan's Outcome, D-02 and D-04 d, work stops here: nothing goes into SKILL.md's grant until Daneel rules. Validator: it takes the agent frontmatter and `engines`, so neither validator branch holds Plan 2 back on its own; Daneel said he rules on the engines result and the validator's limit together with these answers.

What a further run could separate (not run: the probe has two runs in all, D-04 a), for Daneel to weigh: case entry `Agent(seldon:not-readiness)` with SKILL.md carrying no Agent entry (does the case list gate at all, and does a scoped entry restrict by name), or case entry `Agent(seldon:readiness)` with no SKILL.md entry (is the case list alone enough).

Deviations:
- [deviation] Predicted run 2's start would be refused (the case list governs and a scoped entry does not match another name); observed it ran, `accept`/`config`, `permission_denials: []`. Recorded as the outcome "not scoped, or not shown" and stopped per D-02/D-04 d; nothing else changed.
- [deviation] The docs step predicted `claude plugin validate --strict` refuses `engines` in plugin.json as an unrecognized key; on 2.1.327 it passes with no warning, while an unknown key (`zzprobe`) fails --strict. Recorded as the engines result; nothing else changed.

Open items:
- Static analysis was not run: this plan makes no commit, and step 3 runs before a commit.
- The prior run's report was rotated to `.planning/phases/8/records/reports/plan-1.1.md` before this dispatch's first write; it sits in the same folder, inside the `?? .planning/phases/8/records/reports/` line term A allows.
- Each eval run also wrote its HTML report folder, `evals/results/2026-11-18T16-32-36-485Z/` and `evals/results/2026-11-18T16-34-32-223Z/`, git-ignored like every earlier run's; left in place, as the plan removes only the kept temp folders.
- tool_used counts the agent's calls (answer 3), so any AC2 grader that must show the skill itself did not Read a file needs something other than a plain `tool_used` count; that is Plan 6's design, after Daneel's ruling.
- tests/skill.test.mjs was not run: SKILL.md is byte-identical to HEAD's blob again (74471 bytes, `git diff --exit-code` clean). The full suite was not run, because the plan stops at this checkpoint rather than completing.
