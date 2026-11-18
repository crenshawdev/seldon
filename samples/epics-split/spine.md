# Plotwise - architecture spine
Built from: prd.md sha256:303af6f1d0715c87

## S-01: One server-rendered web app
Kind: design approach
Every screen is a page of one app, rendered on the server. There's no separate API. [ASSUMPTION]

## S-02: The waiting list is public and the plots sit behind the committee login
Kind: boundaries
The app has two parts. The waiting list is the public part: anyone joins it, sees their own place on it and takes themselves off it, with no login. The plots are the committee's part: each plot's record, who rents it, the yearly rent, the inspections and ending a tenancy all sit behind the committee login, and no public page shows any of it.
> the committee runs everything, the people waiting just need to see the list

## S-03: Django with one SQLite database
Kind: stack
The app runs on Django and keeps the waiting list and the plot records in one SQLite database file. [ASSUMPTION]

## S-04: One small hosted server
Kind: hosting
The app and its database file run on one small hosted virtual server.
> on a cheap hosted server
