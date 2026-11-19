---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '(?<![^\n])## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*Kind: hosting[ \t]*\r?(?![^\n]))(?=[^\n]*(?:\n(?!## )[^\n]*)*?\[ASSUMPTION\])'
---
