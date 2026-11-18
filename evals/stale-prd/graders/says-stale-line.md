---
type: regex
target: trace
pattern: '^(?<![\s\S])(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)"))[^\n]*\n)*?(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+")[^\n]*\n(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)")|(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+"))[^\n]*\n)*?[^\n]*"type":"tool_result"[^\n]*\n(?:(?![^\n]*"type":"tool_use")[^\n]*\n)*?[^\n]*"role":"assistant","content":\[\{"type":"text","text":"(?:[^"\\]|\\.)*?I.m updating the PRD, because \.planning/seldon/brief\.md has changed since the PRD was built from it\. To revise the brief instead, run /seldon brief\.[\s\S]*?"name":"Read","input":\{(?:"\w+":(?:"(?:[^"\\]|\\.)*"|[^,"{}]*),)*"file_path":"(?:[^"]*/)?\.planning/seldon/prd\.md"'
---
