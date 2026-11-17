# Sowlist

## Problem
A market gardener plans her season's sowings, transplants and harvests in one planting file she keeps herself, but she only opens it a couple of times a week, so sowings go in late and beds sit empty.
> I keep the whole season in one planting file, every sowing, transplant and harvest
> I only open it a couple of times a week, so things go in late and beds sit empty

## Solution
The morning list: a small program that reads her planting file every morning and emails her that day's work, so the plan comes to her.
> a morning list, something that reads my planting file every morning and emails me what's due that day, written in Go

## Who it serves
The gardener herself, the only person who keeps the planting file or reads the morning list.
> it's just me, nobody else touches the file

## What's different
The planting file stays the one place she plans, and the morning list only reads it, so there's nothing new to keep up to date. [ASSUMPTION]

## Success criteria
- Nothing is sown more than a day late.
  > nothing sown more than a day late
- Empty beds drop by half in the first season. [ASSUMPTION]

## Scope
The planting file and the morning list of the day's sowings, transplants and harvests.
> the file and the morning list, and it can live on the raspberry pi in the shed

## What it refuses
- It won't change the planting file, because the file is her plan and only she edits it.
  > it never touches the file, that's my plan and I edit it
- It won't track the weather, because she checks the sky herself.
  > no weather stuff, I can look at the sky

## Vision
Every small grower's plan reaches them on the day it matters. [ASSUMPTION]
