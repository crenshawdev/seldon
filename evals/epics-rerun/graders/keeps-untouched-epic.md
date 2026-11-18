---
type: regex
target:
  source: file
  path: .planning/seldon/epics.md
pattern: '^## E-01: Catalog\n\*\*Outcome:\*\* Volunteers keep a catalog of tools, and members can search it\.\n\*\*Boundaries:\*\* Tools and their categories only\. No loans and no member records\.\n\*\*Done when:\*\*\n- A volunteer can add a tool with a name, a category and a photo\.\n- A member can find that tool by name or by category\.\n- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing\.\n\*\*Depends on:\*\* None\n\*\*Requirements:\*\* CAT-01, CAT-02\n\*\*Spine decisions:\*\* S-02, S-04, S-05, S-06(?:\n\n?## |\n*(?![\s\S]))'
flags: m
---
