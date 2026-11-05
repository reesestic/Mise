# Pantry

## Purpose

Show what food the user actually owns and keep its usable quantities current enough to support cooking and shopping decisions.

## User value

Help users remember what they have, use food before it goes bad where possible, avoid buying duplicates, and restock things they rely on.

## What it does

- Track ingredients and quantities with units; optionally record an expiration estimate and last-updated time.
- Allow useful storage locations such as fridge, freezer, and cabinet, without requiring every item to be precisely tracked.
- Accept manual corrections, additions, consumption, and disposal.
- Receive confirmed purchased quantities from Groceries.
- Show low-stock and soon-to-expire cues when useful.
- Connect inventory to Cook Now readiness and to Groceries shortfall calculations.
- Offer a restock action that adds an editable item to Groceries.
- Support an optional, lightweight entry for confirmed leftovers or extra portions from the cooking flow. Keep prepared food distinguishable from raw ingredients so Cook Now can recommend using it and shopping logic does not double count it.

## What it does not do

- It does not contain items merely because they are on a shopping list.
- It should not silently change stock when a user browses or saves a meal.
- It should not treat expiration estimates as guaranteed safety determinations.
- It is not a recipe discovery destination; it supports meal discovery by supplying reliable inventory context.
- It should not require precise weights for every leftover; quick portion estimates and user correction are preferable to burdensome tracking.

## Connections to other areas

- **Groceries → Pantry:** Confirmed purchased quantities add to inventory.
- **Cook Now → Pantry:** Confirmed preparation or consumption reduces or transforms inventory.
- **Pantry → Cook Now:** Available stock and freshness inform ready and use-soon meal suggestions.
- **Pantry → Groceries:** Restock actions create editable shopping entries; users decide what to buy.

## AI role

Identify meals that use available or soon-to-expire ingredients, detect likely restock needs, and explain how inventory affects a shopping request. Ask for correction or show uncertainty when units, quantities, or freshness are unclear.

## Aesthetic direction

Practical and trustworthy. Make search, categories, quantity adjustments, and freshness cues easy to scan. Avoid creating a sense that every item needs exact tracking; support quick corrections.

## Open questions

- How much structure should inventory entry require (unit, package, quantity, or a quick approximate amount)?
- Which items need expiration tracking, and how should user-entered estimates be shown?
- Build default: represent confirmed leftovers as prepared Pantry food with an approximate portion count and optional freshness estimate, separate from raw ingredients. Exact controls and labels can be refined during interaction design.
- What level of confirmation is appropriate when cooking changes inventory?
