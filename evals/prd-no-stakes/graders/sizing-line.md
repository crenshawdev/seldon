---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
pattern: '(?:^|\n)## MVP scope[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?(?!## )[^\n]*\[ASSUMPTION\]'
---
