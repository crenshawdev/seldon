---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '(?<![^\n])## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*Kind: boundaries[ \t]*\r?(?![^\n]))(?=[^\n]*(?:\n(?!## )[^\n]*)*?[Ll][Oo][Aa][Nn])(?=[^\n]*(?:\n(?!## )[^\n]*)*?[Rr][Ee][Pp][Aa][Ii][Rr])'
---
