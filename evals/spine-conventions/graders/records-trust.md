---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*must never show them the repair notes)(?=[^\n]*\b[Cc]atalog|[^\n]*(?:\n(?!## )[^\n]*)*?\n(?!## )(?![ \t]*>)[^\n]*\b[Cc]atalog)'
flags: m
---
