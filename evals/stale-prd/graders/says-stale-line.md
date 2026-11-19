---
type: regex
target: trace
pattern: '^(?<![\s\S])(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)"))[^\n]*\n)*?(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+")[^\n]*\n(?:(?:(?![^\n]*"type":"tool_use")|(?=[^\n]*"name":"(?:Glob|Skill)")|(?=[^\n]*"name":"Bash"[^\n]*"command":"node [^"\s]*/lib/check\.mjs --stale [^"\s]+"))[^\n]*\n)*?[^\n]*"type":"tool_result"[^\n]*\n(?:(?![^\n]*"type":"tool_use")[^\n]*\n)*?[^\n]*"role":"assistant","content":\[\{"type":"text","text":"(?=(?:[^"\\]|\\.)*?PRD)(?=(?:[^"\\]|\\.)*?\.planning/seldon/brief\.md)(?=(?:[^"\\]|\\.)*?/seldon brief(?![\w-]))[\s\S]*?"name":"Read","input":\{(?:"\w+":(?:"(?:[^"\\]|\\.)*"|[^,"{}]*),)*"file_path":"(?:[^"]*/)?\.planning/seldon/prd\.md"'
---
