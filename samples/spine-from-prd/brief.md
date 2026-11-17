# Kilnlog

## Problem
A potter keeps every kiln firing in a spiral notebook: the schedule she ran, what went in and how each glaze came out. When a glaze goes wrong she can't find the last firing where it came out right.
> every firing goes in a spiral notebook, the schedule, what went in, how the glazes came out
> when a glaze goes wrong I can never find the firing where it last came out right

## Solution
A small web app where she records each firing and its results, and looks up every past firing a glaze was in.
> a little app where I log each firing and can look up every firing a glaze was in, built with Rails and SQLite

## Who it serves
The potter herself, the only person who records a firing or reads the log.
> it's just me, nobody else touches the kiln or the log

## What's different
Each glaze result is tied to the firing it came from, so a glaze's history comes from the record and not from memory. [ASSUMPTION]

## Success criteria
- She finds the last good firing of any glaze in under a minute.
  > I want to find the last good firing of a glaze in under a minute
- Failed glaze firings drop by a third in the first season. [ASSUMPTION]

## Scope
Firings, the pieces in each, and how each glaze came out.
> firings, the pieces in each one and how the glazes came out, and it can run on the old laptop in the studio

## What it refuses
- It won't talk to the kiln's controller, because she types each schedule in herself and wiring up the kiln is a project of its own.
  > I'll type the schedule in myself, wiring up the kiln controller is a whole other project
- It won't share firings with anyone, because the log is for her own studio.
  > no sharing, the log is for my studio and nobody else

## Vision
Any one-person studio keeps its firing history somewhere it can search. [ASSUMPTION]
