# Toolshed - epics
Built from: spine.md sha256:13d597adba767ef4

## E-01: Catalog
**Outcome:** Volunteers keep a catalog of tools, and members can search it.
**Boundaries:** Tools and their categories only. No loans and no member records.
**Done when:**
- A volunteer can add a tool with a name, a category and a photo.
- A member can find that tool by name or by category.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** None
**Requirements:** CAT-01, CAT-02
**Spine decisions:** S-02, S-04, S-05, S-06

## E-02: Lending
**Outcome:** Volunteers check tools out and in at the counter.
**Boundaries:** Members, checkouts and returns. The repair log and reminders are not part of it.
**Done when:**
- A checkout records the member, the tool and a due date.
- A return closes the open loan for that tool.
- Member contact details are hidden from anyone who isn't a volunteer.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** E-01
**Requirements:** LOAN-01, LOAN-02, NFR-01, NFR-02
**Spine decisions:** S-01, S-02, S-03, S-04, S-05, S-06

## E-03: Repairs
**Outcome:** Volunteers keep a repair log of tools that come back broken, and a broken tool isn't lent until it's fixed.
**Boundaries:** The repair log only. Checkouts and returns stay with Lending.
**Done when:**
- A volunteer can log what's wrong with a tool that comes back broken, and later log it fixed.
- A tool logged broken can't be checked out until a volunteer logs it fixed.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** E-02
**Requirements:** REP-01
**Spine decisions:** S-02, S-04, S-05

## E-04: Reminders
**Outcome:** Members are reminded the day before a loan is due.
**Boundaries:** The daily job and its emails. It only reads the loan log.
**Done when:**
- Each loan due tomorrow gets exactly one reminder email.
- Everything built so far, this epic included, works end to end, with every test passing and nothing half-built showing.
**Depends on:** E-02
**Requirements:** LOAN-03
**Spine decisions:** S-01, S-02, S-03, S-04, S-05
