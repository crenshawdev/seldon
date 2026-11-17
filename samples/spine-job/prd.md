# Sowlist - PRD

## Requirements

### Planting file
- **PLAN-01**: The gardener keeps every sowing, transplant and harvest, each with its date, in one planting file she edits herself.
  > I keep the whole season in one planting file, every sowing, transplant and harvest
- **PLAN-02**: The morning list reads the planting file and never changes it.
  > it never touches the file, that's my plan and I edit it

### Morning list
- **MORN-01**: Every morning, with nobody at the keyboard, the gardener gets the morning list by email: the sowings, transplants and harvests due that day.
  > reads my planting file every morning and emails me what's due that day
- **MORN-02**: Work left undone from an earlier day stays on the morning list until the planting file marks it done. [ASSUMPTION]

## Non-functional requirements
- **NFR-01**: Nothing is sown more than a day late.
  > nothing sown more than a day late
- **NFR-02**: A morning list holds everything due that day and nothing that isn't. [ASSUMPTION]

## User journeys
The gardener reads the morning list: two trays of lettuce to sow and the garlic to lift. She does both, marks them done in the planting file, and adds next month's sowings, which turn up on the morning list on their day.

## Non-goals
- It won't change the planting file, because the file is her plan and only she edits it.
  > it never touches the file, that's my plan and I edit it
- It won't track the weather, because she checks the sky herself.
  > no weather stuff, I can look at the sky

## MVP scope
PLAN-01, PLAN-02, MORN-01 and MORN-02.
