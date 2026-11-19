---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '(?:\*\*[A-Z0-9]+-\d\d+\*\*[\s\S]*?){6}'
---
