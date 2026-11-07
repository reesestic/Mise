# Groceries

## Purpose

Keep shopping understandable and flexible. Groceries is the user's working list: a place to make freeform requests, track intended purchases, and see how Pantry stock and selected meals affect ingredient quantities. It can support meal choices without becoming a rigid weekly meal planner.

## User value

Help users buy what they need, avoid duplicating food they own, and understand what their groceries can support. Keep **Pantry stock**, **items intended for purchase**, and **items physically picked up in the store** visibly distinct.

## What it does

- Keep one editable grocery list as the main working surface.
- Provide a freeform text/voice request input at the top. Users can ask for ingredients, meal ideas, or changes in ordinary language (for example, “four chicken meals for around $40”). Do not require a set of filters or force the user into a structured meal-planning flow.
- Respond to meal requests with a concise set of candidate meals and an estimated basket impact. Do not show an unsolicited meal-recommendation feed. A single compact, contextual Olly insight may show below meal coverage when specific pantry/list items could unlock additional meals; it must identify the ingredients and meals, and require the user's choice before adding anything.
- Let users add a meal from Cook Now or an explicit request to the current grocery context. Adding a meal creates ingredient demand; it does not mean the user has committed to cooking it on a schedule.
- Consolidate ingredients across the meals the user has chosen for this shop. For each ingredient, calculate combined demand across those meals and servings, then compare it with confirmed Pantry stock and quantities already on the grocery list. Do not count the same Pantry quantity once for every meal.
- Show the combined quantity, Pantry contribution, amount intended for purchase, amount physically in the cart, and any remaining shortfall. Use labels as well as color or icons.
- Keep grocery item quantities editable. Allow unrelated quick-add items, restock items from Pantry, and missing ingredients sent from Cook Now.
- Show which selected meals use each shared grocery item. A compact, expandable **Meals for this shop** / **Meals this list supports** area gives the list context without becoming a recipe-browsing carousel.
- Let a user inspect a selected meal's ingredients and see the status of each ingredient: in Pantry, on the grocery list, physically in the cart, or still short.
- If the combined requirements for selected meals exceed available Pantry plus list quantities, show the shared ingredient and shortage. Keep the individual meal options visible, while making clear when the whole selected set is not covered.
- When a user removes a meal, recalculate meal-derived ingredient needs and show the quantity changes before applying them. Keep manually added groceries intact unless the user explicitly chooses to remove or reduce them.
- Show estimated costs and budget fit as estimates. A request such as “four meals for $40” refers to a target for the additional shopping basket unless the user specifies otherwise; do not assume a per-meal budget or promise an exact checkout total.
- Let users edit meal servings, quantities, or supported substitutions and review the resulting effect on combined ingredient demand and the list.
- Keep the request input fresh after submission while retaining the active list, Pantry, selected meal context, and relevant Profile preferences.
- Support a visible picked-up/in-cart state for items the user has physically placed in their cart. Picked-up items remain intended purchases, not confirmed Pantry stock.
- Provide a later purchase-review step that records what was actually bought and in what quantity/package. On confirmation, update Pantry; do not require price entry.

## What it does not do

- It is not a rigid weekly meal planner. Users may choose several meals for one shopping context, but the app does not require dates, schedules, or commitments to cook them.
- It does not show an unsolicited meal-recommendation feed or a required “unlock more meals” section. One compact contextual unlock insight may appear when supported by the current Pantry/list state; meal candidates and ingredient additions still require user choice.
- It does not require filters to express grocery or meal requests.
- It does not treat a meal idea as a commitment or reserve Pantry quantities merely because the meal was viewed or saved.
- It does not treat items on the grocery list or physically in the cart as owned Pantry stock. Cook Now readiness based on owned food changes only after purchase confirmation updates Pantry.
- It does not silently delete or reduce existing list items when meals are removed or changed.
- It does not promise live sales, the cheapest cart, exact checkout totals, or exact meal costs without reliable current data.
- It does not require every grocery item to support a recipe; ordinary household shopping remains supported.

## Shared ingredient calculation

Treat meal quantities as shared demand rather than assigning a Pantry item permanently to one recipe. For each ingredient, normalize units where possible and calculate:

```text
combined meal demand = sum of the ingredient quantities for selected meals and servings
usable Pantry stock = confirmed Pantry quantity (less any user-set-aside amount, if supported)
list coverage = quantity already intended for purchase on the open grocery list
remaining shortfall = max(0, combined meal demand - usable Pantry stock - list coverage)
```

The grocery line is consolidated, with a breakdown of what selected meals need and what Pantry already contributes. For example, if two selected meals need 18 oz of chicken in total, Pantry has 10 oz, and the list already has 4 oz, show that 4 oz more is needed. Do not calculate each meal against the full Pantry independently and then accidentally double-count the same stock.

The user may have food they intend to save for another use. An explicit **Set aside** quantity could reduce usable Pantry stock, but this is an optional future refinement, not a requirement to plan meals or the initial Grocery screen. Do not infer reservations from a saved or viewed recipe.

### Ingredient status language

- **Pantry:** confirmed owned quantity.
- **On list:** intended quantity to buy; not owned yet.
- **In cart:** the user says they physically picked up that item while shopping; still not confirmed Pantry stock.
- **Short:** the selected meal set still needs this quantity after Pantry and list coverage.
- **Ready now:** a meal is supported by confirmed Pantry stock alone.
- **Covered by this shop:** the selected meal set is covered by Pantry plus intended grocery purchases, subject to purchase confirmation.

Use text labels in addition to palette colors/icons. Do not describe a meal as cookable from owned inventory just because its ingredients are on the list or in the physical cart.

## Removing or changing a selected meal

Meal-derived needs should recalculate from the current selected-meal set. Before reducing quantities already on the list, present a concise change review, for example: “Removing Chicken Fajitas lowers meal-related chicken need from 18 oz to 8 oz. Keep the extra 10 oz on your list, or reduce the list quantity?”

Track the source of quantities where possible:

- Meal-derived quantity for selected meals.
- User-added quantity or extra amount.
- Current picked-up status.

Removing a meal may reduce the meal-derived portion, but it must not silently remove a user-added amount. If the user confirms an adjustment, update the grocery line and all meal-coverage totals together. If an ingredient was manually deleted or reduced and the selected meal set no longer has enough, show the resulting shortfall on the relevant meal and shared ingredient summary.

## Meal choices without a rigid meal plan

Cook Now remains the main place to browse meals grounded in confirmed Pantry stock. Groceries can show the meals the user explicitly brought into the current shopping context, plus their ingredient coverage. This is a compact source/coverage view, not a second recipe feed.

An explicit request can return a draft set of meal options, such as four chicken meals around a requested basket budget. The user can keep or replace options, then choose which meals to include in the shopping calculation. Replacing or removing a meal recalculates shared needs. A saved/interested meal alone does not create grocery items or reserve stock. A single contextual insight below meal coverage may say, for example, “Add spinach and chickpeas to open up 3 more meals,” and show those meals before the user chooses Add.

A visual weekly meal collage or calendar, and the ability to reserve food for future meals outside the current shopping context, are possible separate future features. They are not required for the Grocery page and should not make its core list rigid.

## Pricing without retailer data

Live store-specific prices and sales are not assumed for the MVP. Use a maintained baseline for rough ingredient price ranges where feasible. Clearly label estimates and show their source, age, or confidence when available. A total such as “about $32–$40 for the additional items” is a planning estimate, not a checkout promise. Do not imply exact package sizes or prices when data is unavailable. Actual spending is not reported unless the user supplies it or an authorized source provides it.

Mise can still help users shop affordably by showing shared ingredient use, Pantry contributions, and supported lower-cost substitutions when reliable data exists. It should not claim “best deal” or “cheapest cart” without current, reliable retailer data.

## Connections to other areas

- **Cook Now → Groceries:** The user explicitly adds all or only missing ingredients for a meal and selected servings to the open list. Meal needs join the shared ingredient calculation.
- **Explore / saved meals → Groceries:** The user can explicitly choose to add a meal's requirements. Saving alone never changes the grocery list.
- **Pantry → Groceries:** Confirmed inventory prevents duplicate purchases and informs the combined shortfall; restocking is an editable grocery action.
- **Groceries → Pantry:** Only confirmed purchased quantities update owned inventory. Planned and physically picked-up items remain distinct until purchase confirmation.
- **Groceries → Cook Now:** Meals become Ready to Make from confirmed Pantry inventory after the purchase is recorded.
- **Profile → Groceries:** Dietary restrictions, preferences, household size, and optional budget defaults may inform explicit requests. Groceries does not add a separate filter system.

## AI role

Interpret a user's explicit request in the context of the open grocery list, confirmed Pantry quantities, selected meals, and relevant Profile preferences. Retrieve or propose meal candidates only when asked; calculate ingredient quantities and shared shortfalls with deterministic validation; estimate basket cost only to the level supported by data; explain the proposed changes; and wait for the user's choice before changing the list. AI must not invent exact costs or quantities, count unpurchased groceries as owned, or silently remove existing items.

This can be agentic without a free-form chat-only interface: the agent can parse a request, retrieve candidates, calculate a combined basket, validate units and quantities, present a draft, and recalculate when the user swaps or removes a meal. Filters do not replace this request-and-review flow.

## Suggested mobile hierarchy

1. **Groceries header.** Include a shopping-state or purchase-review action when useful. “Review purchases” is clearer than “Checkout” if no payment is being processed.
2. **Freeform request input.** Text and/or voice for quick items, ingredient requests, or meal requests. No required filters or recipe feed. A single contextual Olly insight may appear below meal coverage when the current data supports one. Clear the text after submission while retaining relevant list/Pantry/meal context.
3. **Combined grocery list.** Keep this as the primary working surface. Each row shows item, intended quantity/package, estimated price where available, and a clear status such as on list or in cart. Expand a row for Pantry contribution, combined meal demand, shortfall, and which selected meals use it. Editing and deleting remain visible; swipe can only be an optional shortcut.
4. **Meals for this shop / meal coverage.** A compact, expandable area for meals the user explicitly added to this shopping context. Each meal shows ingredient-level Pantry/list/cart/short status. Removing a meal opens a review of quantity changes before list quantities are reduced.
5. **Contextual unlock insight.** When reliable meal data identifies a useful specific addition, show one compact Olly card with the item(s), the additional meals they could support, and an explicit Add action. Do not turn this into a scrollable recommendation feed.
6. **Purchase review.** Confirm what was actually bought and the package/quantity, then update Pantry. This is not payment checkout.

The meal-coverage area can be collapsed so users who only want a grocery checklist can focus on shopping. A list/grid toggle may change the grocery items' internal presentation only; it must not alter the surrounding page layout.

## Aesthetic direction

Keep the grocery list visually primary and make ownership state legible at a glance. Use compact meal context to explain why quantities exist, and use expanded ingredient detail or a change-review prompt to explain shared needs. Make the differences among Pantry, list, in-cart, and shortfall unmistakable with words, icons, and color. Beneath meal coverage, one small Olly insight may point out a concrete ingredient addition and the extra meal options it enables; keep it optional and distinct from a recipe feed.

## Agreed priorities

1. Keep Pantry stock and intended purchases separate.
2. Consolidate meal ingredient needs across meals explicitly selected for the current shopping context.
3. Show Pantry contribution, list coverage, physical cart status, and remaining shortfall.
4. Keep meal choices optional; do not turn this screen into a rigid weekly planner.
5. Make list changes user-controlled, especially when a meal is removed or a quantity would decrease.
6. Treat freeform requests as the main way to ask for meal ideas or grocery help; do not require filters or show a standing feed. Allow one compact, evidence-based unlock insight when it is useful.
