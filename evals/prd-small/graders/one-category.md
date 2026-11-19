---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '^### [\s\S]*?\n### '
flags: m
---
