---
type: regex
target: trace
pattern: '(?<![\s\S])(?=[\s\S]*(?<![^\n])(?=[^\n]*"parent_tool_use_id":"toolu_)[^\n]*"name":"Read","input":\{[^}]*"file_path":"(?:[^"]*/)?\.planning/seldon/prd\.md")(?=[\s\S]*(?<![^\n])(?=[^\n]*"parent_tool_use_id":"toolu_)[^\n]*"name":"Read","input":\{[^}]*"file_path":"(?:[^"]*/)?\.planning/seldon/spine\.md")(?=[\s\S]*(?<![^\n])(?=[^\n]*"parent_tool_use_id":"toolu_)[^\n]*"name":"Read","input":\{[^}]*"file_path":"(?:[^"]*/)?\.planning/seldon/epics\.md")'
---
