# Stowaway quiet mode - architecture spine
Built from: prd.md sha256:7ba1ae60558d5032

## S-01: The setting is read once, when a backup starts
Kind: how state changes
Stowaway reads the progress bar setting from its existing settings file once, when a backup starts. A change to the file takes effect from the next backup, and only the person editing that file ever changes the setting.
> just a setting to switch the bar off, on or off, that's it

## S-02: Only the progress bar reads the setting
Kind: boundaries
The setting is read where Stowaway draws its progress bar and nowhere else, so the backup's work and its end-of-run summary never depend on it.
> the bar is the only problem
