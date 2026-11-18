---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*parish newsletter copies the tool records)(?=[^\n]*\b[Tt]ools?(?:\x27s?|’s?)? records?\b|[^\n]*(?:\n(?!## )[^\n]*)*?\n(?!## )(?![ \t]*>)[^\n]*\b[Tt]ools?(?:\x27s?|’s?)? records?\b)'
flags: m
---
