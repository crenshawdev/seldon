# Toolshed repair log - PRD

## Requirements

### Repairs
- **REPAIR-01**: The coordinator logs a tool that came back broken, with what's wrong with it.
  > logging a broken tool and what's wrong with it
- **REPAIR-02**: The coordinator marks a logged tool fixed.
  > marking it fixed
- **REPAIR-03**: The coordinator sees every tool waiting for repair in one list.
  > the coordinator sees everything waiting for repair in one list

### Shelf
- **SHELF-01**: A tool the log holds as broken stays off the shelf, and can't be checked out to a member, until the coordinator marks it fixed.
  > keeping it off the shelf until then

## Non-functional requirements
- **NFR-01**: Logging a broken tool takes the coordinator under a minute. [ASSUMPTION]

## User journeys
A drill comes back to the counter with a burnt-out motor. The volunteer hands it to the coordinator, who logs it with its fault, and it stays off the shelf. A week later she fixes it and marks it fixed, and it goes back on the shelf.

## Non-goals
- It won't track repair costs or parts, because the library doesn't pay for repairs and nobody wants to keep accounts.
  > It won't track what repairs cost or which parts they took, because the library doesn't pay for repairs and nobody wants to keep accounts.

## MVP scope
REPAIR-01, REPAIR-02, REPAIR-03 and SHELF-01.
