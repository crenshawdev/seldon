# Stowaway quiet mode - PRD
Built from: brief.md sha256:aa56cebf351c3ba6

## Requirements

### Progress bar setting
- **QUIET-01**: One setting in Stowaway's settings file turns the progress bar on or off.
  > just a setting to switch the bar off, on or off, that's it
- **QUIET-02**: With the setting off, Stowaway draws no progress bar and prints only its summary at the end of a backup.
  > switch the bar off
- **QUIET-03**: When the setting isn't given, the bar stays on, so anyone running Stowaway by hand sees it as before. [ASSUMPTION]
- **QUIET-04**: A backup does the same work and gives the same summary with the bar on or off. [ASSUMPTION]

## Non-functional requirements
- **NFR-01**: With the bar off, a night's log fits on one screen.
  > I want the log to fit on one screen again

## User journeys
The office manager turns the progress bar off in Stowaway's settings file once. That night the schedule runs the backup as usual, and the next morning, over coffee, they open the nightly log and find just the backup's summary, on one screen, instead of hundreds of lines of progress bar. When someone later runs Stowaway by hand with the setting left alone, the bar shows as it always did.

## Non-goals
- It won't add other log settings, such as log levels or a separate log file, because the bar is the only thing cluttering the log.
  > I don't want a whole logging overhaul, the bar is the only problem

## MVP scope
QUIET-01, QUIET-02, QUIET-03, QUIET-04 and NFR-01 all come first: the whole body of work is one setting.

This PRD is drafted for a small change with modest stakes, one setting turned on or off. [ASSUMPTION]
