# Quaylost

## Problem
Lost property at a small ferry terminal goes into a binder at the ticket desk, and anyone who lost something has to ring up or come back in person to ask whether it turned up.
> lost stuff goes in a binder at the ticket desk
> people have to ring up or come back to ask if we found their bag

## Solution
A page where passengers report what they lost, and a screen where the desk staff match each report to what's been found.
> a page where passengers tell us what they lost, and a screen where we match it to what's turned up, built with Django and Postgres

## Who it serves
Passengers who lost something on a crossing, and the four desk staff who handle lost property.
> passengers who lost something, and the four of us on the desk

## What's different
A passenger's report and the found item sit side by side, so a match doesn't depend on someone remembering a phone call. [ASSUMPTION]

## Success criteria
- Most lost items are matched to their owner within a day of turning up.
  > I want most things matched to their owner within a day of turning up
- Phone calls to the desk about lost property drop by half. [ASSUMPTION]

## Scope
The passengers' report page, the staff matching screen and the found log.
> the report page, our matching screen and the found log

## What it refuses
- It won't show reports to the public, because a report holds a passenger's phone number and what they lost.
  > nobody but us sees the reports, they've got people's phone numbers in them
- It won't charge for a return, because getting a lost bag back is free.
  > no charging people, getting your bag back is free

## Vision
Every small terminal gets lost things home without a binder. [ASSUMPTION]
