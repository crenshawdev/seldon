# Plotwise - architecture spine
Built from: prd.md sha256:303af6f1d0715c87

## S-01: One server-rendered web app
Kind: design approach
Every screen is a page of one app, rendered on the server. There's no separate API. [ASSUMPTION]

## S-02: Django with one SQLite database
Kind: stack
The app runs on Django and keeps the waiting list and the plot records in one SQLite database file. [ASSUMPTION]

## S-03: One small hosted server
Kind: hosting
The app and its database file run on one small hosted virtual server.
> on a cheap hosted server
