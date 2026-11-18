---
type: regex
target: trace
pattern: '^(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)")|(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+")|(?=[^\n]*"name":"Read"[^\n]*"file_path":"(?:[^"]*/)?\.planning/seldon/spine\.md"))[^\n]*\n)*?[^\n]*"type":"tool_result"[^\n]*\n(?:(?![^\n]*"type":"tool_use")[^\n]*\n)*?[^\n]*"role":"assistant","content":\[\{"type":"text","text":"(?:[^"\\]|\\.)*?I.m building the spine from \.planning/seldon/prd\.md, the PRD that.s already there, and the brief\. To revise the PRD instead, run /seldon prd\.[\s\S]*?"name":"Write","input":\{"file_path":"(?:[^"]*/)?\.planning/seldon/spine\.md"'
---
