---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
match: not_contains
pattern: '^## E-\d{2,}:[^\n]*(?:(?:\n(?!\*\*Outcome:\*\*)(?!## )[^\n]*)*|(?:\n(?!\*\*Boundaries:\*\*)(?!## )[^\n]*)*|(?:\n(?!\*\*Done when:\*\*)(?!## )[^\n]*)*|(?:\n(?!\*\*Depends on:\*\*)(?!## )[^\n]*)*|(?:\n(?!\*\*Requirements:\*\*)(?!## )[^\n]*)*|(?:\n(?!\*\*Spine decisions:\*\*)(?!## )[^\n]*)*)(?=\n## |(?![\s\S]))'
flags: m
---
