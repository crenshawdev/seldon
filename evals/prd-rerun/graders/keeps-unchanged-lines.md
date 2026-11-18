---
type: regex
target:
  source: file
  path: .planning/seldon/prd.md
pattern: '^(?=[\s\S]*^- \*\*CAT-01\*\*: A volunteer adds a tool with a name, a category and a photo\. \[ASSUMPTION\]$)(?=[\s\S]*^- \*\*CAT-02\*\*: A member searches the catalog by name or category\.\n  > a catalog members can look at from home$)(?=[\s\S]*^- \*\*LOAN-01\*\*: A volunteer checks a tool out to a member with a due date\.\n  > something the volunteers can use at the counter to check tools out$)(?=[\s\S]*^- \*\*LOAN-02\*\*: A volunteer checks a tool back in\.\n  > check tools out and back in$)(?=[\s\S]*^- \*\*NFR-01\*\*: A checkout takes under three seconds on a phone over a slow connection\. \[ASSUMPTION\]$)(?=[\s\S]*^- \*\*NFR-02\*\*: Member emails and addresses are visible only to volunteers\. \[ASSUMPTION\]$)'
flags: m
---
