# Toolshed - PRD

## Requirements

### Catalog
- **CAT-01**: A volunteer adds a tool with a name, a category and a photo.
- **CAT-02**: A member searches the catalog by name or category.

### Loans
- **LOAN-01**: A volunteer checks a tool out to a member with a due date.
- **LOAN-02**: A volunteer checks a tool back in.
- **LOAN-03**: A member gets an email reminder the day before a loan is due.

## Non-functional requirements
- **NFR-01**: A checkout takes under three seconds on a phone over a slow connection.
- **NFR-02**: Member emails and addresses are visible only to volunteers.

## User journeys
A member finds a ladder in the catalog at home, comes to the counter, and a volunteer checks it out for a week. The day before it's due, the member gets a reminder and brings it back, and the volunteer checks it in.

## Non-goals
Late fees, reservations, and members checking tools out themselves.

## MVP scope
CAT-01, CAT-02, LOAN-01 and LOAN-02. Reminders (LOAN-03) follow once checkouts are in use.
