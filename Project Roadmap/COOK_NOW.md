# Cook Now

## Purpose

Help the user choose and cook something appealing from food they actually own. Cook Now is grounded in confirmed Pantry inventory; items merely on the active grocery list do not count as available.

## User value

Reduce the friction of deciding what to eat and make. Help users quickly find something appealing that fits their time, effort, cleanup tolerance, Pantry, and nutrition goals. Include simple combinations and snacks as well as structured recipes; preserve the freedom to browse and choose outside current Pantry constraints.

## Landing view

Keep the screen concise, with a visible search/request field and two short carousels:

1. **Ready to Make** — meals feasible from current Pantry inventory.
2. **Almost There** — meals with a small ingredient gap, showing what is missing and a path to Groceries.

Each carousel previews about three or four meals and has a **See all** action. Do not add a third “New Meals” carousel by default: new-to-the-user meals can appear in Ready to Make or Almost There, and users can enter the broader catalog through **Explore all meals**.

## What it does

- Show Ready to Make and Almost There recommendations, including simple meals, recipes, and snacks.
- Include both familiar and new options in readiness results. Familiarity can be a sort/filter preference (for example, “Prefer favorites” or “Show me something new”), not a separate feed.
- Provide a clear **Explore all meals** browse view for the full catalog, including meals that are not currently feasible. Users can browse when they are not shopping or ready to cook.
- Provide search or natural-language input, such as “What can I make with chicken and tomatoes?”
- Start with a small set of useful filters, especially ingredient and prep time. Nutrition goals and meal type can be refinements; equipment filtering can follow once its usefulness is validated.
- Let users save/unsave meals and access a Saved Meals collection. Saved meals can show readiness status, but saving does not add ingredients to Groceries.
- Open meal details showing required and optional ingredients, quantities, what is available, what is missing, instructions, practical cues, and nutrition estimates where supported.
- Make practical effort visible before cooking: prep/cook time, likely cleanup or number of dishes, equipment, and whether the meal scales well for leftovers when known. Offer quick/low-cleanup choices without treating them as mandatory filters.
- Support making extra servings and, after cooking, optionally recording leftover portions in Pantry. Leftovers are confirmed prepared food, distinct from raw ingredients; do not assume leftovers exist just because a recipe makes multiple servings.
- For an Almost There meal, let the user set servings and choose to add all required ingredients or only the missing ingredients to Groceries.
- Offer a cooking flow with steps and helpful tools such as timers.
- After cooking, provide a quick confirmation to record the meal as prepared, allow a simple “as written / changed” adjustment and servings or quantity used, then update Pantry. Do not deduct inventory merely from opening or starting a recipe.

## What it does not do

- It is not the place to plan and optimize a multi-meal shopping basket.
- It does not use unpurchased shopping-list items as owned inventory or mark meals ready based on them.
- It does not automatically add saved meals or recommendations to Groceries.
- It does not claim exact nutrition or feasibility when the underlying data is incomplete.
- It does not require users to follow planned meals, eat the same thing repeatedly, or choose only meals that optimize a goal.

## Connections to other areas

- **Pantry → Cook Now:** Confirmed quantities and storage/freshness context determine meal readiness and ranking.
- **Cook Now → Groceries:** The user explicitly sends all or missing ingredients for a chosen meal, with servings, to the editable list.
- **Groceries → Cook Now:** Only after purchase confirmation updates Pantry can the supported meal become Ready to Make. Groceries may show meals supported by the list, but those items do not count as owned beforehand.
- **Explore → Cook Now:** A saved or selected meal can later be checked against Pantry and appear as ready or almost ready.
- **Profile → Cook Now:** Goals, restrictions, tastes, time, effort, and equipment shape ranking and filters.

## AI role

Interpret flexible meal requests, retrieve and rank suitable catalog items, personalize variety, account for Pantry quantities, explain why a meal fits, and identify ingredient gaps. Use available time, effort, cleanup, leftover preference, nutrition goals, and Pantry use as ranking signals when the user expresses them. Preserve alternatives and explain tradeoffs rather than forcing a single “optimal” choice. The AI may recommend and prepare a proposed grocery handoff, but the user chooses whether to add it. Validate ingredient quantities and serving scaling before declaring a meal feasible.

## Aesthetic direction

Inviting, food-forward, and concise. Prioritize meal imagery and a few helpful cues such as prep time, cuisine, readiness, cleanup/effort, leftover potential, and supported nutrition attributes (for example, high protein or high fiber). Show only known or well-supported cues; keep tags scannable and avoid overstating nutrition certainty.

## Current information architecture direction

Readiness is the main home-feed organization. Meal type (simple meal, recipe, snack), familiarity, time, cuisine, goals, and equipment are dimensions of a meal and ways to refine results, not separate competing feed hierarchies. Discovery is an available activity through Explore all meals, search, and filters; it does not need a third carousel or a separate bottom tab for the MVP.

Use the same catalog across areas but preserve distinct intent:

- Cook Now: what can I make from confirmed Pantry inventory?
- Explore: what might I like, regardless of current inventory?
- Groceries: what can I add to this list, and what meals would the list support?

## Open questions

- Which filters stay visible at the top versus inside a filter panel? Initial candidates: ingredient, prep time, goal, meal type, familiarity.
- Should Saved Meals be a compact landing preview, a collection link, or both?
- How should “new versus familiar” ranking work and how much control should users get?
- Which steps and cooking-confirmation fields are essential for a fast post-cook update?
- Which freshness and nutrition cues are useful without cluttering cards?
