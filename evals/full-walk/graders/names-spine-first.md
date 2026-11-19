---
type: regex
target: trace
pattern: '^(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)")|(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+")|(?=[^\n]*"name":"Read"[^\n]*"file_path":"(?:[^"]*/)?\.planning/seldon/epics\.md"))[^\n]*\n)*?[^\n]*"type":"tool_result"[^\n]*\n(?:(?![^\n]*"type":"tool_use")[^\n]*\n)*?[^\n]*"role":"assistant","content":\[\{"type":"text","text":"(?=(?:[^"\\]|\\.)*?[Ee]pics)(?=(?:[^"\\]|\\.)*?\.planning/seldon/spine\.md)(?=(?:[^"\\]|\\.)*?/seldon spine(?![\w-]))[\s\S]*?"name":"Write","input":\{"file_path":"(?:[^"]*/)?\.planning/seldon/epics\.md"'
---
