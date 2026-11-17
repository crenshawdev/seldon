---
type: regex
target:
  source: file
  path: .planning/seldon/spine.md
pattern: '^(?=[\s\S]*^## S-01: Loans are an append-only event log\nKind: how state changes\nCheckouts and returns are stored as events and never edited\. Who has a tool, and whether it\x27s overdue, is computed from the log\.\n> nobody knows who has what or when it\x27s due(?:\n\n?## |\n*(?![\s\S])))(?=[\s\S]*^## S-02: One server-rendered web app\nKind: design approach\nThe counter screens and the public catalog are pages of one app\. There\x27s no separate API\.\n> something the volunteers can use at the counter to check tools out and back in, plus a catalog members can look at from home(?:\n\n?## |\n*(?![\s\S])))(?=[\s\S]*^## S-04: Node with one SQLite database\nKind: stack\nThe app runs on Node and keeps the catalog, the members and the loan log in one SQLite database file\. \[ASSUMPTION\](?:\n\n?## |\n*(?![\s\S])))(?=[\s\S]*^## S-05: One small rented server\nKind: hosting\nThe app and its database file run on one small rented virtual server\. \[ASSUMPTION\](?:\n\n?## |\n*(?![\s\S])))(?=[\s\S]*^## S-06: Members reach only the catalog\nKind: boundaries\nThe catalog pages are the only part members and the public reach from outside, and what they type there is only ever read as search text\. Member emails and addresses sit behind the volunteer login, and no catalog page shows them\. \[ASSUMPTION\](?:\n\n?## |\n*(?![\s\S])))'
flags: m
---
