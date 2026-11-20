# Requirements: Toolshed

**Defined:** 2026-03-02
**Core Value:** Where every tool is comes from the checkout record, so nobody has to keep a logbook up to date by hand.

## Active

Committed scope. Each maps to exactly one roadmap phase. The design's S-05 and E-02 shaped this one, and v1.0's IDs are under `## Shipped`.

### Catalog

- [ ] **CAT-4**: A volunteer marks a tool as out for repair, and the catalog shows it as unavailable.

## Shipped

Delivered and verified. Kept as rows for shipped-scope trace; git history holds the full requirement text.

| Requirement | Phase | Status | Milestone |
|-------------|-------|--------|-----------|
| CAT-01 | 1 | Complete | v1.0 |
| CAT-02 | 1 | Complete | v1.0 |
| CAT-03 (A volunteer edits a tool's name, category or photo) | 1 | Complete | v1.0 |
| LOAN-01 | 2 | Complete | v1.0 |
| LOAN-02 | 2 | Complete | v1.0 |
| LOAN-03 | 3 | Complete | v1.0 |
| LOAN-04 | 2 | Complete | v1.0 |
| LOAN-05 (A volunteer sees every tool past its due date) | 3 | Complete | v1.0 |
| NFR-01 | 2 | Complete | v1.0 |
| NFR-02 | 2 | Complete | v1.0 |
| NFR-03 | 3 | Complete | v1.0 |

## v2 Requirements

Deferred. Tracked, not in the current roadmap.

### Accounts

- **2FA-02**: A volunteer signs in with a second factor.

### Reminders

- **SMS-01**: A member gets the due-date reminder by text message instead of email, as members asked in GH-9 and GH-12.

### Non-functional

- **NFR-04**: A reminder reaches the member within an hour of being sent.

## Out of Scope

Explicit exclusions. The reason prevents scope creep later.

| Feature | Reason |
|---------|--------|
| Fees | The library is free to members, and nobody has time to handle money |
| Reservations (LOAN-07) | A tool goes to whoever is at the counter |
| Self checkout | A volunteer looks each tool over going out and coming back |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CAT-4 | Phase 4 | Pending |

---
*Last updated: 2026-06-10 after v1.0*
