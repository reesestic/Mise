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

## Pantry page layout — working direction

The Pantry page is titled **Your Pantry**. Its visual entry point is a small set of friendly, low-poly clay storage characters for **Fridge**, **Freezer**, and **Pantry**. Each illustration is a tappable location shortcut with its name underneath and may show an item count. The objects vary in scale and position. Artwork represents a place to browse; it is not a fixed set of slots and does not limit the number or kinds of items the inventory can contain. Use the Olly-like simple eyes and smile, the agreed Oat/Herb/Apricot/Butter/Sage palette, and slightly irregular handmade forms. Avoid glossy plastic, glass bubbles, decorative plants around the appliances, or extra faces/details that make the food hard to read.

Current color study: Fridge body Apricot `#F2A16F`, Porcelain base/feet `#FFFEFA`, Tomato handles `#D9634D`; Freezer body soft blue `#A9CFE0`, Porcelain lid `#FFFEFA`, Butter button `#F2D779`; Pantry body Celadon `#6E9A7E` (lighter than Herb), Tomato shelves/roof/knobs/legs `#D9634D`. The irregular backing blobs are Oat Milk `#FFF8E9`; the screen and storage-stage area sit on a slightly warmer backdrop `#F1E7D9` so the blobs stand out. Name labels use Tomato for Fridge, blue for Freezer, and Celadon for Pantry. Practice Screens keeps Herb `#3E7160` and adds Celadon as a separate palette color.

Show a **Use soon** group at the top of the inventory list, with a small clay clock accent rather than a floating bubble. It is a cross-location collection, not another storage place. Group its items once, rather than duplicating them in the rest of the list. Only include items when the app has a user-provided or otherwise supported freshness estimate. Phrase it as a gentle prompt to check or use an item, not a food-safety claim.

The main working surface is a searchable, scrollable, text-first inventory with a switch between row/list view and a compact three-column grid. The **Your Pantry** title and view switch stay together in the sticky header. Both **Use soon** and **Everything else** have their own containing panels; switching to grid changes the item layout only inside those panels. Grid tiles contain only the item name, a circular days-until-expiration/expired cue, amount, and storage location. Use the Cook Now cleanup scale’s green-to-tomato color progression for expiration proximity, without presenting estimates as safety determinations. Do not require a picture for each food. Tapping a storage illustration filters the inventory; tapping the selected location again returns to All. Do not add a second location-filter row underneath Search. Keep Search and the same storage controls together in a sticky area: as the user scrolls, the large illustrations shrink/fade into compact labeled location controls.

Adding an item does not require a custom illustration. Use text and a simple generic food symbol for inventory entries; reserve the custom clay artwork for the storage locations. Storage location is optional and can be corrected later. Support **Other / not sure** so unfamiliar or unassigned items remain visible in All inventory. Custom storage locations can use a generic symbol unless a later design justifies custom art.

Visual reference: [Pantry page HTML draft](../Visual/Prototypes/PANTRY_NO_CRUMBS_DRAFT.html). A previous color study is saved as [PANTRY_NO_CRUMBS_DRAFT (colorway 1)](../Visual/Prototypes/PANTRY_NO_CRUMBS_DRAFT%20%28colorway%201%29.html), and the earlier mock as [PANTRY_NO_CRUMBS_DRAFT (old)](../Visual/Prototypes/PANTRY_NO_CRUMBS_DRAFT%20%28old%29.html). The current draft uses irregular clay backdrops. Its foods, quantities, and freshness cues are sample content; it demonstrates layout and interactions, not real inventory or expiration estimates.

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
