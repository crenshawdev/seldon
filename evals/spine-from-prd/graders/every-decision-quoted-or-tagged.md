---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
match: not_contains
pattern: '^## S-\d{2,}:[^\n]*(?:\n(?!## )(?![ \t]*> )(?![^\n]*\[ASSUMPTION\])[^\n]*)*(?=\n## |(?![\s\S]))'
flags: m
---
