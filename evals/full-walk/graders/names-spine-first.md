---
type: regex
target: trace
pattern: '^(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)")|(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+")|(?=[^\n]*"name":"Read"[^\n]*"file_path":"(?:[^"]*/)?\.planning/seldon/epics\.md"))[^\n]*\n)*?[^\n]*"type":"tool_result"[^\n]*\n(?:(?![^\n]*"type":"tool_use")[^\n]*\n)*?[^\n]*"role":"assistant","content":\[\{"type":"text","text":"(?:[^"\\]|\\.)*?I.m building the epics from \.planning/seldon/spine\.md, the spine that.s already there, and the PRD\. To revise the spine instead, run /seldon spine\.[\s\S]*?"name":"Write","input":\{"file_path":"(?:[^"]*/)?\.planning/seldon/epics\.md"'
---
