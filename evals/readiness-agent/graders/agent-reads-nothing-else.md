---
type: regex
target: trace
match: not_contains
pattern: '(?<![^\n])(?=[^\n]*"parent_tool_use_id":"toolu_)[^\n]*"name":"Read","input":\{[^}]*"file_path":"(?!(?:[^"]*/)?\.planning/seldon/(?:prd|spine|epics)\.md")'
---
