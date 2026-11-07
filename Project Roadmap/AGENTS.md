# Mise — Project Guide

## Product in one sentence

Mise helps people discover food they want, build an affordable and flexible shopping list informed by meals, and cook from what they actually own.

## The problem

People often have trouble deciding what to eat, remembering what they already own, and buying groceries that are affordable, interesting, and useful across multiple meals. Meal planning can feel rigid; unplanned shopping can leave people with ingredients that do not come together into meals.

## Product principles

- Make choosing food and shopping take less thought while keeping the user in control.
- Support a range from simple food combinations and snacks to structured recipes.
- Personalize around the user's goals, tastes, time, cooking comfort, and budget. Treat goals as preferences unless the user makes them strict constraints.
- Optimize for low-friction food decisions: faster shopping and cooking, low cleanup, and useful leftovers where desired.
- Help users eat toward nutrition goals (including macro-oriented goals) without making food choices rigid or prescribing a fixed meal schedule.
- Make meal rationale and ingredient value visible: show which meals the shopping list supports and how ingredients are shared.
- Favor affordable, versatile ingredients that support more than one appealing meal when this fits the request; make the reuse and variety visible without requiring users to commit to every suggested meal.
- Keep meal ideas, intended purchases, confirmed purchases, and owned inventory distinct and connected.
- Be transparent about estimates, missing information, and tradeoffs. Do not imply exact prices, nutrition, or feasibility without evidence.
- AI proposes and explains changes; users choose which suggested items to add. It never removes existing grocery items automatically.

## Core product model

The app has three primary destinations and a shared profile:

| Area | Main question | Responsibility |
| --- | --- | --- |
| Cook Now | What can I make from what I own? | Browse ready and almost-ready meals, search, and cook from confirmed Pantry inventory. |
| Explore | What food might I like? | Browse the wider meal catalog and save or add personal meal ideas. Initially a browse view from Cook Now, not a required fourth tab. |
| Groceries | What should I add to my shopping list, and how do my selected meals affect it? | Maintain one open, editable list; calculate shared ingredient needs across meals the user explicitly adds, and show Pantry/list/cart coverage and shortfalls. |
| Pantry | What food do I actually own? | Track quantities and optional freshness information; support cooking and restocking. |
| Profile | What should Mise know about me? | Store goals, dietary needs, tastes, cooking preferences, and shopping defaults. |

These areas can use the same meal catalog and feasibility logic while serving different user intents. Cook Now is grounded only in confirmed inventory. Explore is broad discovery independent of current inventory. Groceries keeps the list primary and connects it to meals the user explicitly adds from Cook Now or requests through its freeform input. Do not require filters or show a standing meal-recommendation feed on Groceries. One compact, evidence-based Olly insight may identify specific pantry/list additions that unlock more meals, with explicit user approval before adding anything. Do not count active-list or physically picked-up items as owned inventory until purchase is confirmed and Pantry is updated.

The Grocery input is a fresh text/voice request box at the top. Users can ask for grocery help or meal ideas in ordinary language; filters are not required. After submission, clear the input while retaining relevant grocery-list, Pantry, and selected-meal context. Any requested meal or ingredient changes are reviewed by the user before being added. Existing grocery items are never silently deleted or reduced.

## Shared food and shopping lifecycle

1. A meal may be discovered, saved, or opened as a grocery suggestion.
2. When the user chooses to add its ingredients, Mise accounts for Pantry stock and consolidates shared needs into the open grocery list.
3. The user reviews the shared list and estimated price ranges. Recipe requirements, Pantry contribution, shortfall, suggested package sizes, and actual purchases are separate values.
4. On purchase confirmation, the user confirms what items and quantities/packages they bought; Pantry updates from those quantities. Price entry is not required. Do not report actual spending unless it is supplied by the user or an authorized source.
5. Meals supported by confirmed inventory appear as ready options in Cook Now.
6. Cooking is only recorded and inventory deducted when the user confirms preparation or consumption.

## Screen specifications

- [Cook Now](COOK_NOW.md)
- [Groceries](GROCERIES.md)
- [Pantry](PANTRY.md)
- [Profile](PROFILE.md)
- [Product discovery interview](PRODUCT_DISCOVERY_INTERVIEW.md)
- [Project description](PROJECT_DESCRIPTION.md)
- [Art direction](../Visual/ART_DIRECTION.md)
- [System design and domain diagrams](../Diagrams/README.md)

Use [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md) for the product thesis, MVP boundary, and validation goals; use each screen specification for its responsibilities, required behavior, and boundaries. These documents are ready to guide product and UX implementation. Items labeled **Open questions** are refinements, not blockers to the core user flows; use the stated defaults and guardrails while they are unresolved. The data model, visual details, and technology choices still need implementation design.

## Current scope boundaries

- Grocery store integrations, live sales, receipt scanning, and barcode lookup are future possibilities, not assumed MVP capabilities. Do not promise the cheapest cart or exact checkout cost without reliable current data.
- Prices should be shown as estimated ranges when retailer-specific data is unavailable. Do not require price entry at checkout or imply exact totals.
- Grocery planning should make the editable shared list the main working surface; show compact coverage for meals the user explicitly brought into the current shopping context.
- When the user asks for meal choices, return a concise, editable set and calculate its combined basket needs. Do not show an unsolicited recipe feed; one compact contextual unlock insight is allowed when backed by current inventory/list and meal data. Never claim the cheapest shop without current reliable store data.
- Cook Now should make time, effort, cleanup, and leftover potential discoverable where recipe data supports them. Prefer Pantry ingredients, but keep broad exploration and user choice available.
- Grocery screen order: header, fresh freeform request input, combined ingredient list, compact expandable coverage for selected meals, one optional contextual Olly unlock insight, and later purchase review. Grocery item rows expand to show details, Pantry contribution, combined meal demand, shortfall, and which meals use the item; meal cards show Pantry/list/in-cart/missing status. Recalculate meal-derived quantities when meals change, but review changes with the user and never silently delete or reduce existing items. Keep Pantry stock, intended purchases, and physically picked-up items distinct until purchase confirmation.
- Recipe discovery and meal suggestions are part of the product. Explore can begin as a broad browse view from Cook Now rather than a separate top-level tab.
- The product should not silently synchronize a shopping list with Pantry. Intended purchases and confirmed owned food are different states.
