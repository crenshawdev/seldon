# Stowaway quiet mode

## Problem
Stowaway, the backup tool the office runs every night, draws a progress bar, and when the nightly schedule runs it the bar fills the log with hundreds of lines nobody reads.
> the progress bar ends up in the nightly log as hundreds of lines of junk

## Solution
One setting in Stowaway's settings file that turns the progress bar on or off. With it off, Stowaway prints only its summary at the end of a backup.
> just a setting to switch the bar off, on or off, that's it

## Who it serves
The office manager, who reads the nightly log each morning.
> I read that log every morning with my coffee

## What's different
Nothing else about Stowaway changes: a backup runs the same way with the bar on or off. [ASSUMPTION]

## Success criteria
- With the bar off, a night's log fits on one screen.
  > I want the log to fit on one screen again
- The bar stays on unless the setting turns it off, so anyone running Stowaway by hand sees it as before. [ASSUMPTION]

## Scope
The one setting that turns the progress bar on or off, and nothing else in Stowaway.
> just a setting to switch the bar off, on or off, that's it

## What it refuses
- It won't add other log settings, such as log levels or a separate log file, because the bar is the only thing cluttering the log.
  > I don't want a whole logging overhaul, the bar is the only problem

## Vision
Stowaway's nightly log holds only what someone needs to read. [ASSUMPTION]
