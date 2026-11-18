---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
match: not_contains
pattern: '^## S-\d{2,}:[^\n]*(?:\n(?!## )(?!Kind: (?:design approach|boundaries|how state changes|who owns shared data|stack|hosting)\r?$)[^\n]*)*(?=\n## |(?![\s\S]))'
flags: m
---
