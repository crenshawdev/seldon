# Kilnlog - PRD
Built from: brief.md sha256:f1c381e5f9104665

## Requirements

### Firings
- **FIRE-01**: The potter records a firing with its date and the schedule she ran.
  > the schedule, what went in
- **FIRE-02**: The potter lists the pieces in a firing, with the glaze on each.
  > the pieces in each one
- **FIRE-03**: The potter records how each glaze came out in a firing.
  > how the glazes came out

### Glazes
- **GLAZE-01**: The potter looks up every firing a glaze was in, newest first.
  > look up every firing a glaze was in
- **GLAZE-02**: The potter marks each glaze result as good or failed. [ASSUMPTION]

## Non-functional requirements
- **NFR-01**: Finding the last good firing of a glaze takes under a minute.
  > find the last good firing of a glaze in under a minute
- **NFR-02**: Recording a firing takes no more than five minutes after the kiln is unloaded. [ASSUMPTION]

## User journeys
After unloading the kiln, the potter records the firing, the pieces that went in and how each glaze came out. Weeks later a celadon crazes, so she looks up the glaze, finds its last good firing and copies that schedule.

## Non-goals
- It won't talk to the kiln's controller, because she types each schedule in herself and wiring up the kiln is a project of its own.
  > I'll type the schedule in myself, wiring up the kiln controller is a whole other project
- It won't share firings with anyone, because the log is for her own studio.
  > no sharing, the log is for my studio and nobody else

## MVP scope
FIRE-01, FIRE-02, FIRE-03, GLAZE-01 and GLAZE-02.
