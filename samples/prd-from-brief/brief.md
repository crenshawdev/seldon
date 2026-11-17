# Plotwise

## Problem
The Eastgate community garden keeps its plot waitlist and watering rota on a whiteboard in the shed. Members miss their watering turns, and nobody on the waitlist hears when a plot frees up.
> the waitlist and the watering rota are on a whiteboard in the shed
> people miss their watering turn and nobody on the waitlist hears when a plot frees up

## Solution
A small web app where members see which plots are free, join the waitlist and check the watering rota.
> a little site where members can see which plots are free, join the waitlist and check the watering rota, built in Django on a Postgres database

## Who it serves
The garden's committee of five, who assign the plots, and its sixty plot holders.
> it's for the committee, five of us, and the sixty plot holders

## What's different
It offers a freed plot to the next person on the waitlist as soon as the committee marks it free, so nobody has to remember the order. [ASSUMPTION]

## Success criteria
- No watering turn is missed all summer.
  > nobody misses a watering turn all summer
- A freed plot is offered to the next person within a day. [ASSUMPTION]

## Scope
The waitlist, who holds which plot, and the watering rota.
> the waitlist, who has which plot, and the watering rota, hosted on Heroku like the garden's other site

## What it refuses
- It won't take plot fees, because the garden collects fees in cash at the spring meeting.
  > fees get paid in cash at the spring meeting, keep money out of it
- It won't let members swap plots between themselves, because the committee assigns every plot.
  > no swapping plots behind our backs, the committee assigns every plot

## Vision
Every community garden in the borough runs its waitlist and rota without a whiteboard. [ASSUMPTION]
