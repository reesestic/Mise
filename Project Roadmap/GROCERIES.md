# Groceries

## Purpose

Make shopping faster, more affordable, goal-aware, and less mentally effortful. Turn a request such as “three or four chicken meals under $40 and below 600 calories each” into a small set of appealing meal choices and one understandable, editable ingredient pool. The user can see what they are buying, how ingredients are shared across meals, and the variety the shop could support—without being locked into cooking every suggested meal.

## User value

Turn a goal such as “three or four chicken meals under $40 and below 600 calories each” into meal choices and one understandable, editable ingredient pool. The user sees what they are buying, how ingredients are shared, and what food options the shop is intended to support.

## What it does

- Keep an editable shopping list as the central shopping surface.
- Place a natural-language text/voice input at the top of the screen. It is ready for a fresh request after each submission, while Mise still uses the active list, Pantry, and relevant preferences as context.
- Treat each request as a request for suggestions or changes, not permission to modify the list: show suggested items with an explicit **Add** action. Never remove existing items automatically; users remove them with a clear delete control.
- Put the list first in the screen hierarchy. Each line should show the item, quantity/package, estimated price range when available, and the number of currently shown meals it supports. Every item can expand to show its details and the meals it contributes to.
- Accept meal-oriented planning requests using budget, servings, nutrition goals, tastes, time, and other preferences.
- Reduce shopping decision time by returning a concise, relevant set of choices with clear tradeoffs, rather than a long undifferentiated list. The user can add, remove, or change their mind at any point.
- Prefer affordable, versatile ingredients that support multiple appealing meals when appropriate. Show which meals reuse each ingredient and what additional variety an ingredient unlocks; do not optimize overlap so aggressively that the meals become repetitive or unwanted.
- Respect macro-oriented nutrition goals (such as higher protein or a calorie target) as flexible goals unless the user marks them as strict; identify nutrition values as estimates when source data is incomplete.
- Interpret each fresh message in context of the current grocery list and Pantry, so users can ask for related additions without restating everything.
- Let users keep adding, editing, or removing items from one open-ended shopping list. A new prompt should not clear existing items; it should use the current list and Pantry as context and propose relevant additions or edits.
- Use meal candidates to explain and shape the list. When a user chooses a meal idea, propose its missing ingredients as additions to the shared list; do not create a separate meal plan or replace the list.
- Account for Pantry stock when calculating ingredient shortfalls, while keeping confirmed inventory separate from planned purchases.
- Make each grocery item expandable. Its expanded details show quantity/unit or package, estimated price range, any Pantry contribution/shortfall, and the meals that use the ingredient.
- Let users change meals, servings, quantities, or substitutions and see the resulting effect on the basket and meal coverage.
- Support unrelated quick-add items by text or voice, plus restock items sent from Pantry and missing ingredients sent from Cook Now.
- Offer contextual ideas such as an addition that unlocks more useful meals, but always show the relevant meals and estimated cost and require user approval to add it.
- Below the list, show an expandable **Meals Supported by This List** section. Each meal expands to show its ingredients and whether each is in Pantry, on the shopping list, or still missing. These are meal possibilities enabled by the basket; do not imply list items are owned before purchase.
- Below meal coverage, show contextual suggestions such as “Add black beans and avocado for about $X to unlock two more meals.” These are proposed additions, not silent edits.
- Show estimated cost and budget fit as estimates, with source/age or confidence where available.
- Support checking off items and a purchase-confirmation step that records which items were actually bought and the quantity/package acquired, so Pantry can be updated accurately. Do not require users to enter prices at checkout.
- After purchase confirmation, update Pantry with the actual purchased package/quantity. Meals only become Ready to Make in Cook Now once confirmed inventory supports them.

## What it does not do

- It is not a generic generator of ingredient piles with no meal rationale.
- It does not require every grocery item to belong to a recipe; ordinary household shopping remains supported.
- It does not promise the cheapest cart, identify live sales, or guarantee an exact checkout total without reliable retailer price and availability data.
- It does not treat estimated prices as exact or claim a budget is guaranteed when it has only estimates.
- It does not assume a recipe shortfall maps exactly to a purchasable package size.
- It does not automatically commit AI-generated changes or treat planned groceries as Pantry inventory.

## Meal-led planning and the shared basket

The shopping list is the source of truth for intended purchases. Meal suggestions explain which meals the list may support and help the user decide whether to add ingredients. Shared ingredient quantities stay consolidated in one communal list rather than being split into exclusive per-recipe shopping lists.

Keep these quantities distinct:

1. **Meal requirement:** required amount for a suggested meal and its selected servings.
2. **Pantry contribution:** usable quantity already owned.
3. **Shortfall:** amount still required for the meal, after Pantry contribution.
4. **Suggested purchase:** likely package/quantity if known, otherwise a transparent estimate or user-editable amount.
5. **Actual purchase:** item and quantity/package confirmed by the user. Actual price is optional and is not required for purchase confirmation.

For example, if a suggested meal needs 20 oz of chicken and Pantry contributes 10 oz, Mise can suggest adding the remaining amount or a known package size. If two meal suggestions both use chicken, show their combined amount on one list line and let the user inspect which meals use it. If package or price information is missing, Mise should not pretend that a precise package exists or invent an exact cost. Any extra purchased amount remains in Pantry after confirmation.

## Pricing without retailer data

Live store-specific prices and sales are not assumed for the MVP. Use the easiest reliable baseline available for the prototype—such as a small, curated set of common ingredient price ranges, informed by public average-price data where practical. BLS publishes average retail prices for selected food items, and USDA ERS publishes food price datasets including area-level monthly prices. These can inform rough estimates, but do not provide a current exact price for every package at the user's chosen store. [BLS average price data](https://www.bls.gov/cpi/factsheets/average-prices.htm), [USDA ERS Food-at-Home Monthly Area Prices](https://www.ers.usda.gov/data-products/food-at-home-monthly-area-prices).

For the MVP, show estimated price ranges and clearly label them as estimates. Prefer an approach that is easy to maintain and accurate enough to compare options; avoid building store-level price infrastructure before validating the product. Do not require users to enter prices at checkout. Purchase confirmation records what they bought and the quantity/package, so Pantry reflects actual inventory. Mise should not report actual spending unless the user later chooses to provide it or an authorized source supplies it.

Mise can still help users shop affordably by comparing meal combinations, showing ingredient reuse across meals, offering lower-cost substitutions when supported, and making budget tradeoffs visible. It should not claim “best deal” or “cheapest cart” without current, reliable retailer data.

Possible later improvements include opt-in use of confirmed purchase history, approved retailer APIs/partnerships, receipt capture, or licensed product-price data. Each depends on data access, quality, and terms; the core flow must remain useful without them.

## Connections to other areas

- **Cook Now → Groceries:** The user chooses a meal and servings, then adds all or only missing ingredients.
- **Explore → Groceries:** The user can choose a saved/discovered meal and add its ingredients to the shopping list; saving alone never adds it.
- **Pantry → Groceries:** Inventory prevents duplicate suggestions and informs shortfalls; restocking is an editable list action.
- **Groceries → Pantry:** Confirmed purchases update owned quantities; planned or unchecked items do not.
- **Groceries → Cook Now:** Once Pantry reflects confirmed purchases, supported meals can appear as ready. The active list alone does not make a meal cookable.
- **Profile → Groceries:** Goals, restrictions, tastes, household size, and budget defaults shape planning.

## AI role

Interpret each message in the context of the active shopping list, Pantry, and relevant preferences. For example, after adding ingredients for chicken meals, “add a fruit juice that goes with these meals” should use those meals as context and propose an addition, not start a separate plan. Propose meal candidates, calculate shared ingredient needs and servings, compare cost/variety/goal tradeoffs, suggest useful substitutions, and update the proposed list when the user changes constraints. A reliable calculation/validation step checks quantities, serving totals, and estimated cost. Show what would change and why; the user reviews and approves changes.

This can be agentic without relying on a free-form chat interface: the agent can gather constraints, retrieve candidates, calculate a basket, validate it, and revise in response to changes. Filters can help specify constraints; they do not replace that planning behavior.

## Suggested mobile hierarchy

Top to bottom:

1. **Groceries header.** Include a shopping-completion/review action when useful.
2. **Request input.** A fresh text or voice box for asking for items or meal ideas. Each submission clears the box but uses current list, Pantry, and preferences as context. Responses are suggestions; the user explicitly adds items. Nothing is deleted automatically.
3. **Combined grocery list.** Each row shows item, quantity/package, estimated price range, and the number of currently shown meals it supports. Expand any row to see all item details and which meals use it. Let the user edit or delete an item; swipe actions can be a shortcut, with a visible edit/delete control available too.
4. **Meals supported by this list.** Each meal card expands to show its ingredient list and each ingredient's status: in Pantry, on this shopping list, or still missing. The section may distinguish meals makeable now from Pantry and meals enabled after purchasing list items; never present unpurchased items as owned.
5. **Suggestions to unlock more meals.** Show optional additions with their estimated cost and the specific meals they would enable. Tapping opens the meal details or list of meals; the user chooses whether to add the suggested items.
6. **Purchase confirmation.** Provide a clear “Review purchases” / “I bought these” action, ideally available when shopping is complete. Review which items and quantities were actually bought, confirm them, then update Pantry. This is not payment checkout.

The list remains the main working surface. A visible check/selection control can mark items picked up, while edit/delete remains a separate action so users do not confuse purchase status with removal.

## Aesthetic direction

Make the editable basket the operational anchor and meal coverage the visible explanation for it. A user should be able to answer at a glance: what meals did I select, what am I buying, what does it cost approximately, and which meals use each shared ingredient? Keep estimates visibly labeled and show how changes affect both cost and meal options.

## Agreed recommendation priorities

Prioritize using Pantry food and showing useful meals unlocked by additions. Respect the user's budget. Tailor variety and familiar/new choices to the user's request; refine the exact ranking through testing.
