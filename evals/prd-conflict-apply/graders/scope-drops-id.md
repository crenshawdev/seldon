---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '(?:^|\n)## MVP scope[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?(?!## )[^\n]*\bLOAN-03\b'
---
