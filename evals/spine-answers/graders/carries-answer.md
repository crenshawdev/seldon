---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*half past five every morning)(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*text my phone so I know to check the file myself)(?=[^\n]*(?:[Mm]orning (?:[Ll]ist|[Ee]mail)|\bMORN-\d{2,}\b)|[^\n]*(?:\n(?!## )[^\n]*)*?\n(?!## )(?![ \t]*>)[^\n]*(?:[Mm]orning (?:[Ll]ist|[Ee]mail)|\bMORN-\d{2,}\b))'
flags: m
---
