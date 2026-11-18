---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
match: not_contains
pattern: '^## (?:Requirements|Non-functional requirements)[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?(?![^\n]*\[ASSUMPTION\])- \*\*[^*\n]+\*\*:[^\n]*(?:\n(?![ \t]*>)|(?![\s\S]))|^## Non-goals[ \t]*\r?\n(?:(?!## )[^\n]*\n)*?(?![ \t]*(?:>|\(|\r?$))(?!## )(?![^\n]*\[ASSUMPTION\])[^\n]+(?:\n(?![ \t]*>)|(?![\s\S]))'
flags: m
---
