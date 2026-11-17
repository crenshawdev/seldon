---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^## S-\d{2,}:(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*half past five every morning)(?=[^\n]*(?:\n(?!## )[^\n]*)*?\n[ \t]*> [^\n]*text my phone so I know to check the file myself)(?=[^\n]*(?:[Mm]orning (?:[Ll]ist|[Ee]mail)|\bMORN-\d{2,}\b)|[^\n]*(?:\n(?!## )[^\n]*)*?\n(?!## )(?![ \t]*>)[^\n]*(?:[Mm]orning (?:[Ll]ist|[Ee]mail)|\bMORN-\d{2,}\b))(?=[^\n]*(?:\b(?:[Ss]owings?|[Tt]ransplants?|[Hh]arvests?)\b|\b[Rr]eads?\b[^\n]*\bplanting file\b|\b[Ee]mails (?:her|the gardener|you|what)\b|\bday(?:\x27|’)s work\b|\b(?:[Ww]hat(?:\x27|’)s|work|jobs?|tasks?) due\b|\bdue (?:that|each|on that|today)\b)|[^\n]*(?:\n(?!## )[^\n]*)*?\n(?!## )(?![ \t]*>)[^\n]*(?:\b(?:[Ss]owings?|[Tt]ransplants?|[Hh]arvests?)\b|\b[Rr]eads?\b[^\n]*\bplanting file\b|\b[Ee]mails (?:her|the gardener|you|what)\b|\bday(?:\x27|’)s work\b|\b(?:[Ww]hat(?:\x27|’)s|work|jobs?|tasks?) due\b|\bdue (?:that|each|on that|today)\b))'
flags: m
---
