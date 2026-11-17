---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '\b(?:django|postgres(?:ql)?|heroku)\b'
flags: i
---
