---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
pattern: '(?:^|\n)## Requirements[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?Retired:[^\n]*\bLOAN-03\b'
---
