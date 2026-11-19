# Quaylost - PRD
Built from: brief.md sha256:21f15a531063927a

## Requirements

### Reports
- **REP-01**: A passenger reports a lost item with a description, the crossing they were on and a phone number.
  > a page where passengers tell us what they lost
- **REP-02**: A passenger reports without making an account first. [ASSUMPTION]

### Found items
- **FOUND-01**: Desk staff log each item that turns up, with where and when it was found.
  > the found log
- **FOUND-02**: Desk staff match a report to a found item and mark the item returned.
  > a screen where we match it to what's turned up

## Non-functional requirements
- **NFR-01**: Most lost items are matched to their owner within a day of turning up.
  > I want most things matched to their owner within a day of turning up
- **NFR-02**: Only the desk staff see reports and the found log.
  > nobody but us sees the reports, they've got people's phone numbers in them

## User journeys
A passenger who left a bag on a crossing fills in the report page from the car park. Later, one of the desk staff logs a bag found on that crossing, sees the report beside it on the matching screen, and rings the passenger to come and collect it.

## Non-goals
- It won't show reports to the public, because a report holds a passenger's phone number and what they lost.
  > nobody but us sees the reports, they've got people's phone numbers in them
- It won't charge for a return, because getting a lost bag back is free.
  > no charging people, getting your bag back is free

## MVP scope
REP-01, REP-02, FOUND-01 and FOUND-02.
