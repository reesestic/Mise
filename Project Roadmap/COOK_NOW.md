# Cook Now

## Design status

The core Cook Now idea and landing-page structure are designed well enough to begin implementation. The page mock is a visual/interaction prototype, not a complete implementation: recipes, Pantry matching, recommendation logic, nutrition, prices, and several later flows are placeholders.

Current mock: [No Crumbs Cook Now HTML draft](../Visual/Prototypes/COOK_NOW_NO_CRUMBS_DRAFT.html).

This document records the product decisions and the follow-up work that belongs in later screen and implementation designs. Where the mock uses placeholder content or simplified behavior, this specification states the intended product behavior.

## Purpose and product boundary

Help the user choose and cook something appealing from food they actually own. Cook Now uses confirmed Pantry inventory. Items on an active grocery list are not owned and must not make a meal appear ready until purchase is confirmed and Pantry is updated.

Cook Now helps users find a fitting meal without forcing a plan. Include quick meals, simple food combinations, snacks, desserts, and structured recipes. Give users useful control over time, effort, cleanup, cuisine, dietary needs, nutrition, and budget while keeping those preferences flexible unless the user marks a restriction as strict.

Cook Now is not the place to plan or optimize a multi-meal shopping basket. It can prepare a user-approved handoff to Groceries; the full editable grocery-list experience is specified in [GROCERIES.md](GROCERIES.md).

## Landing screen layout

The Cook Now landing screen follows this order:

1. **Header:** No Crumbs at top left; “Your Kitchen” centered, with “Click it, make it, love it!” underneath; a circular profile button at top right.
2. **Meal request field:** A prominent, spoon-like text/voice input with Olly the pot mascot at its left. Prompt: “What are you in the mood for?” Do not add a separate “Tell Olly what sounds good” line or an extra inspiration caption.
3. **Filter row:** The heading “How about something like...” followed by one horizontally scrollable row containing seven filter labels. The row remains pinned while scrolling. The header and profile scroll away; the input compacts, and Olly shrinks/fades away while the filter row stays visible.
4. **Ready to Make!** carousel.
5. **Almost There!** carousel.
6. **Olly’s ingredient-unlock insight:** A tappable suggestion that previews meals that could become possible from a small set of ingredients.
7. **Explore These Meals** carousel for meals farther from current Pantry inventory.

Each carousel scrolls horizontally and previews meal cards. A “See all”/“Explore all” action should open a fuller browse view in a later screen design; the prototype’s scroll-to-section behavior is only a stand-in.

## Meal readiness sections

The sections are mutually exclusive readiness buckets, based on required ingredients and confirmed Pantry stock:

- **Ready to Make:** No required ingredients are missing.
- **Almost There!:** One to three required ingredients are missing. Show the missing items and a route to add them to Groceries.
- **Explore These Meals:** Four or more required ingredients are missing. Exclude meals already shown in Ready or Almost There.

The home-feed Explore section is inventory-aware. The separate **Explore all meals** browse view is broad catalog discovery and can include meals regardless of Pantry readiness. Do not make “new to the user” a separate feed: mix familiar and new meals into the readiness sections.

Only confirmed Pantry stock counts toward readiness. Respect quantities; if the user has some but not enough of an ingredient, show the shortfall rather than treating it as fully available. Do not count intended grocery purchases as Pantry stock.

## Filter design and behavior

Show seven labels in one horizontally scrollable row, in this order. Tapping a label opens its dropdown directly below the row. Each dropdown option is a full-width row. The dropdown’s options scroll internally when needed; while it is open, interaction/scrolling is contained so the page behind it does not move. Keep the same row available before and after the page collapses.

Within one filter group, selected choices use **OR**. Across different groups, selected groups use **AND**. For example, Italian OR Greek, combined with Under 30 min. Budget is a single selected ceiling because its thresholds are nested.

1. **Meal type:** Quick meal, Snack, Dessert
2. **Time:** Fastest, Under 15 min, Under 30 min
3. **Effort:** Low cleanup, One pot/pan, Few appliances, No-cook
4. **Cuisine:** Italian, Greek, German, Spanish, Japanese, Indian
5. **Diet:** Vegetarian, Vegan, Keto, Low carb
6. **Nutrition:** High protein, Low protein, High calorie, Low calorie, High fiber
7. **Budget:** Under $5/serving, Under $10/serving, Under $15/serving, Under $20/serving

Budget thresholds are estimates, not guaranteed prices. The app needs recipe quantities, serving counts, usable price data, and a clear estimate method before these choices can produce reliable results. Never imply an exact meal cost or the cheapest option without evidence.

Filters on Cook Now are temporary browsing controls. Profile can store defaults such as dietary restrictions, preferred cuisines, nutrition goals, budget preference, cooking time, cleanup tolerance, and available equipment. A strict allergy or dietary restriction is an exclusion; ordinary goals and preferences should personalize ranking without silently excluding meals. The user removed a separate Personal filter group; favorites and cooking history may still inform ranking and meal status.

## Meal cards and detail view

### Compact card

Show the meal name, food image, time, and up to two concise tags. Almost There cards also identify the missing ingredient count/items. Cards can show one status emblem: crown for a strong recommendation, green dot for never cooked, or return arrow for cooked before. Multiple meals can receive a crown; a card should not stack unrelated emblems.

The prototype includes a control to compare one, two, or three cards across. Two is the current starting point, not a settled choice. Choose the final card density after checking readability on the target phone size.

### Expanded meal

Tapping a card animates it into a centered detail view with a dimmed background, approximately 5% side margins and 15% top/bottom margins. The detail view scrolls internally. Its front contains:

- Meal name and photo at the top.
- Ingredients on the left, including amounts and clear Pantry status when data is available.
- Time, cleanup score, appliances, and supported nutrition estimates on the right.
- Missing Almost There ingredients highlighted in tomato with a plus/add affordance.
- A relevant substitution suggestion for Almost There meals when one is known and suitable.
- **See Instructions**, which flips the same detail card to show cooking steps; flip back to return to details.
- Fixed Back and primary action buttons: **Cook Now** for ready meals; **Add missing items** for Almost There meals.

Cleanup can use a 1–5 scale, from green/easier to tomato/harder. Show it only when an estimate is available. Nutrition and other recipe facts must also be identified as estimates when appropriate.

## Olly’s unlock insight

Place this below Almost There. It suggests a useful ingredient addition and explains that it could make more meals possible. Tapping it reveals a compact preview grid with meal name, image, and missing ingredients. A user can open an individual meal and choose what to add. AI suggestions never modify Groceries without the user’s explicit Add action.

The unlock idea is separate from normal meal readiness: it must not make meals ready before groceries are purchased and Pantry is updated.

## Meal discovery and saved meals

The home-feed Explore section shows meals missing four or more ingredients, with Almost There meals removed from those results. A separate **Explore all meals** experience can browse the wider catalog without requiring a Pantry match and can be designed later.

Users should eventually be able to save/unsave meals and open a Saved Meals collection. Saving a meal does not add ingredients to Groceries. Saved meals can still show their current Pantry readiness. “Family favorite” is not a Cook Now filter; if useful, treat it as a personal saved collection or a ranking signal later.

## Grocery handoff — later screen and interaction design

The current prototype has a small checklist preview, not the complete grocery flow. Design the full handoff and any supporting screens later, including:

- For an Almost There meal, choose the serving count and whether to add only missing ingredients or all required ingredients.
- Let the user review/edit quantities and select optional extras before adding.
- Account for current Pantry quantities and consolidate shared grocery needs in the open Groceries list.
- Clearly distinguish recipe requirement, Pantry contribution, shortfall, suggested package size, intended purchase, and confirmed purchase.
- Keep the final Add action explicit. Never delete existing list items or update Pantry from an unconfirmed suggestion.

Follow [GROCERIES.md](GROCERIES.md) for the shared-list surface, meal support, and grocery request behavior.

## Cooking flow and Pantry update — later screen design

The current mock’s **Cook Now** action is a placeholder. Design the cooking flow after the landing view, including:

- Step-by-step instructions with helpful controls such as timers.
- Serving scaling and clear required/optional ingredient amounts.
- A quick completion confirmation with “as written” or “changed,” servings/quantities used, and optional leftover portions.
- A user-confirmed Pantry update after cooking. Deduct or transform stock only after confirmation; record leftovers as prepared food distinct from raw ingredients.

Do not reduce Pantry quantities merely because a meal was opened or cooking was started.

## Connections and product rules

- **Pantry → Cook Now:** Confirmed quantities and optional freshness context determine readiness and can help rank meals to use soon.
- **Cook Now → Groceries:** The user explicitly sends selected ingredients, at selected quantities/servings, to the editable list.
- **Groceries → Cook Now:** Only confirmed purchases that update Pantry can make a meal ready.
- **Explore → Cook Now:** A saved or selected meal can later be checked against Pantry and appear in the correct readiness section.
- **Profile → Cook Now:** Strict restrictions, preferences, goals, and equipment inform eligibility, ranking, and filter defaults.
- **Cooking → Pantry:** Update inventory only after the user confirms what they prepared/used; leftovers are optional confirmed stock.

## AI and recommendation role

The intended system can interpret a flexible request such as “What can I make with chicken and tomatoes?”, retrieve suitable meals, compare requirements with Pantry quantities, explain why results fit, and surface useful gaps or substitutions. It should consider time, effort, cleanup, nutrition goals, budget, cuisine, and Pantry use when supported. Keep alternatives visible and explain tradeoffs instead of forcing one “best” meal. The AI may prepare a proposed grocery handoff, but only the user approves additions.

These are product behaviors, not claims about the current HTML. The prototype’s search, filter metadata, food facts, prices, meal readiness, and Olly insight are sample/local behavior and need real data sources and implementation later.

## Visual direction

Follow [ART_DIRECTION.md](../Visual/ART_DIRECTION.md): warm, food-forward, tactile, and playful without feeling childish. Use the agreed palette: Oat Milk `#FFF8E9`, Herb `#3E7160`, Apricot `#F2A16F`, Butter `#F2D779`, Sage Mist `#DCE9D9`, Ink `#283638`, Porcelain `#FFFEFA`, Tomato `#D9634D`, Line `#E7E0D3`, and Muted `#71807B`.

Use soft rounded surfaces, gentle depth, and restrained low-poly/voxel facets around Olly and supporting illustrations. Keep meal imagery and clear ingredient/status information primary. Do not add extra explanatory slogans to the top area beyond the agreed header, tagline, and meal request placeholder.

## What Cook Now does not do

- It does not plan or optimize a multi-meal grocery basket.
- It does not count unpurchased groceries as Pantry inventory.
- It does not add recommendations or saved meal ingredients to Groceries without an explicit user action.
- It does not claim exact nutrition, cost, stock feasibility, or a cheapest option when the data is incomplete.
- It does not require a fixed meal schedule or force users to follow a recommendation.

## Remaining design decisions

- Final card density after readability review (prototype compares one, two, or three across).
- Exact serving/quantity controls and grocery checklist behavior.
- Saved Meals entry point and collection layout.
- Cooking-step/timer layout and completion/Pantry confirmation flow.
- How “Fastest” ranks, what data defines cleanup/appliance counts, and how budget estimates are calculated.
- Which freshness and nutrition cues are reliable enough to show on cards.

## Readiness summary

**Designed at the idea and landing-layout level:** page hierarchy, sticky request/filter area, seven filter groups and their combination rules, three readiness sections, meal card and expanded-detail concept, instruction flip, Olly unlock idea, substitution placement, visual direction, and the Pantry/Groceries boundaries.

**Needs later screen/flow design:** full Explore catalog, Saved Meals, grocery handoff details, cooking mode, timers, post-cook confirmation, serving/quantity scaling, and leftover entry.

**Needs data and implementation design:** recipe/catalog source, ingredient normalization and quantities, Pantry matching, recommendation/ranking behavior, substitutions, nutrition and cost estimates, AI request interpretation, persistence, and integration with Groceries and Pantry.
