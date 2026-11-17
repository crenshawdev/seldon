# Toolshed - architecture spine

## S-01: Loans are an append-only event log
Checkouts and returns are stored as events and never edited. Who has a tool, and whether it's overdue, is computed from the log.

## S-02: One server-rendered web app
The counter screens and the public catalog are pages of one Node app with one database. There's no separate API.

## S-03: Reminders run from a daily scheduled job
A job runs once a day, reads the loan log and sends that day's reminders. Nothing sends email while a request is being handled.
