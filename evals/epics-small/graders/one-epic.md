---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^## E-[\s\S]*?\n## E-'
flags: m
---
