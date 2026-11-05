# Mise — Project Description

## Project overview

Mise is a food decision and grocery-planning concept. It helps people discover food they want to eat, understand what they can cook from what they own, and build an affordable, flexible shopping list whose ingredients support useful meals.

**Core promise:** Make grocery shopping and cooking faster, more affordable, and less stressful by connecting flexible meal ideas to what a person owns and what they might buy—without forcing a rigid meal schedule.

**Product hypothesis:** Mise can stand apart from a recipe-to-retailer-cart assistant by connecting a person's own inventory, an editable shared grocery list, and meals supported by both. This distinction is a hypothesis to test with users, not a claim that no competitor offers similar features.

## Problem and opportunity

People can have difficulty answering three connected questions:

1. What sounds good and is realistic to cook?
2. What should I buy to make food I will actually want?
3. What do I already own, and how can I use it before buying more?

When these decisions are made separately, people may spend too long deciding what to buy, repeatedly buy items they already have, buy ingredients without a clear use, struggle to stay within budget or food goals, settle for repetitive meals, or let food go unused. Cooking can also take more time and cleanup than they want, and recipes may fail to account for leftovers or what is already at home. Existing recipe and retailer tools can help with individual parts of the journey, but Mise's product hypothesis is to keep inventory, meal options, and shopping decisions connected in one user-controlled loop.

## Initial users and needs

These are target-user hypotheses, not validated segments:

- **Budget-conscious shoppers**, including students and people managing a limited household food budget, who want to know what variety a shop can support.
- **Goal-oriented eaters** who want meals to reflect preferences such as higher protein, lower calories, or more fiber without following an inflexible menu.
- **Busy people** who want quick meal choices and fewer decisions after getting home.
- **Low-effort cooks** who want fast meals, minimal cleanup, and useful leftovers without having to meal-prep rigidly.
- **Pantry-first cooks** who want to remember what they own, use it well, and avoid duplicate or wasted food.
- **Curious eaters** who want to try new meals while understanding the cost and ingredients before committing.

The product should support both familiar and novel food, simple combinations and snacks, and structured recipes.

## User pains and desired gains

| Pain to validate | Desired gain |
| --- | --- |
| “I don't know what to cook with what's at home.” | Relevant, appealing options grounded in confirmed Pantry inventory. |
| “I buy ingredients but don't know how many meals they will make.” | A visible connection between the shared shopping list and supported meals. |
| “I forget what I already have.” | Pantry-aware shortfalls and fewer duplicate purchases. |
| “Healthy or budget-friendly eating gets repetitive or rigid.” | Flexible options shaped by goals, taste, budget, time, and user choice. |
| “I want to try something new but don't want to waste money.” | Meal ideas with ingredient and estimated-cost implications before adding items. |
| “My plans change after I shop.” | Cook Now suggestions based on what was actually purchased and confirmed. |
| “Shopping takes too long because I don't know what to choose.” | A concise set of goal- and budget-aware options with ingredient reuse and meal variety made visible. |
| “I want to eat toward my goals without getting stuck in a repetitive plan.” | Flexible macro- or nutrition-aware recommendations that leave the user free to choose what they want. |
| “I want cooking to be quick and leave little mess.” | Meal cues and ranking for time, effort, cleanup, and leftovers where the catalog has reliable information. |

## The specific product area Mise tackles

Mise focuses on the connection between **food owned, food considered, and food intended for purchase**. Its central experience is not just a recipe feed or a generic list of ingredients. It is a shared meal-and-ingredient view that helps users understand why an item is useful and what cooking choices it may create.

The most important product behavior is trustworthy state:

- Pantry means food the user actually owns.
- Groceries means items the user intends to buy.
- Meal suggestions explain readiness or the value of a possible addition.
- A planned purchase does not become owned food until the user confirms what was bought and in what quantity.
- Cooking changes inventory only after the user confirms what they made or used.

## Product structure and screen responsibilities

The primary navigation is three tabs—**Cook Now, Groceries, Pantry**—with **Profile** accessible from the top of the primary screens. **Explore** begins as a broader browse view reachable from Cook Now, not a separate bottom tab.

### Cook Now — what can I make from what I own?

- Landing sections: **Ready to Make** and **Almost There**, with a few cards and a See All action for each.
- Ready and Almost There may include simple meals, recipes, and snacks, both familiar and new.
- Search and modest filters help users find options by ingredient, time, goal, and other useful constraints.
- **Explore all meals** opens the broader catalog, including meals that are not currently feasible. Users can browse and save ideas without adding groceries.
- A meal detail shows required and optional ingredients, Pantry availability, missing items, instructions, practical cues, and nutrition estimates when supported.
- Surface prep/cook time, effort, likely cleanup, and leftover potential where known, so users can choose a fast low-mess meal or make extra portions.
- Users can set servings and choose to add all required or only missing ingredients to Groceries.
- Cooking has a simple completion step so the user can confirm what they made, update Pantry, and optionally record leftovers.

Cook Now does not treat unpurchased grocery items as owned and does not build the multi-item shopping basket.

### Groceries — what should I add, and what meals will the list support?

- One open, editable shopping list is the main work area.
- A fresh text/voice input at the top accepts requests. After a request, the input clears, while Mise keeps relevant current-list, Pantry, and preference context.
- Requests return suggested items or meal options. Users explicitly add suggestions. Mise never deletes old items automatically; users remove items themselves.
- Each consolidated ingredient row shows quantity/package, estimated price range where available, and how many currently shown meals use it. Expanding an item shows its details and all associated meals.
- Return a concise choice set to reduce decision time; favor affordable, versatile ingredients that support useful variety when they fit the request, without requiring the user to commit to every suggested meal.
- Use nutrition and macro goals as user-specified ranking or constraints, with supported estimates and visible tradeoffs. Do not force a fixed plan or imply health outcomes.
- An expandable **Meals Supported by This List** section shows each meal's ingredients and whether each is in Pantry, on the list, or still missing. It distinguishes what can be made now from Pantry from what the list could enable after purchase.
- Suggestions such as “Add these ingredients to unlock two more meals” show the associated meals and estimated cost before the user chooses Add.
- Purchase confirmation records which items and quantities/packages were actually bought. It is not payment checkout and does not require price entry.

Groceries does not claim to find live sales, the cheapest cart, or exact totals without reliable retailer data. Price ranges are estimates. The MVP can use the easiest maintained baseline that is accurate enough to compare options; actual spending is not reported unless supplied by the user or a trusted source.

### Pantry — what do I actually own?

- Track food items, quantities, units, and optional freshness estimates.
- Support practical storage locations such as fridge, freezer, and cabinet.
- Receive confirmed purchases from Groceries and confirmed use from cooking.
- Store optional confirmed leftovers/extra portions as prepared food, separate from raw inventory, so they can be used in Cook Now without requiring exact tracking.
- Help avoid duplicate purchases, surface low-stock or soon-to-expire items, and inform Cook Now and grocery suggestions.
- Allow quick manual corrections; detailed gram-level tracking should not be required for every item.

Pantry does not include items merely because they are on the shopping list. Expiration dates are estimates, not food-safety guarantees.

### Explore — what food might I like?

- A full catalog browse/search experience accessible from Cook Now.
- Users can save meals, view their own saved meals, and potentially add personal meals.
- Saving is an expression of interest, not a grocery-list change.
- Explore may be promoted to its own tab later only if user research shows it is a frequent, distinct destination.

### Profile — what should Mise know about me?

- Dietary needs and restrictions, nutrition goals, tastes, dislikes, and favorite cuisines or ingredients.
- Cooking context such as time, effort, skill, and appliances/equipment.
- Practical priorities such as quick preparation, minimal cleanup, and whether the user likes making leftovers.
- Shopping defaults such as budget, household size, and units.
- Separate strict restrictions from flexible goals and preferences.
- Profile access remains secondary to the three main tasks and should not be required before users can get value.

## Core user flows

### 1. Budget-conscious meal variety

The user asks for several affordable chicken meals. Mise considers Pantry and preferences, suggests meal options, consolidates shared ingredient needs, and shows estimated price ranges and meal links. The user chooses items to add, edits the list, shops, and confirms quantities. Pantry updates; Cook Now reflects the meals supported by the confirmed stock.

### 2. Goal-based but flexible eating

The user has a nutrition goal such as higher protein. Groceries and Cook Now use it to rank relevant options, with nutrition values shown as estimates when appropriate. The user can choose foods they like, change direction, or pick a different ready meal rather than follow a fixed menu.

### 3. Pantry-first and waste-conscious cooking

Cook Now surfaces meals using Pantry items, including food the user wants to use soon. An almost-ready meal shows what is missing. The user can add that item to Groceries or choose another meal that uses existing stock.

### 4. Discovery and later shopping

The user explores the broader catalog, saves a new recipe, and later asks Groceries to suggest items for it. The user reviews the cost and shared ingredients before choosing Add. Saving alone never changes the list.

### 5. Plans change after shopping

The user confirms actual purchases and quantities. Later, Cook Now recommends meals using the updated Pantry. If the user changes their mind, they can choose another meal supported by the same ingredients; Mise does not require them to cook the exact meal that first motivated the purchase.

## AI and system behavior

Mise's agentic behavior is a tool-using planning workflow, not just free-form chat. It interprets a request in the context of the current grocery list, Pantry, and profile; retrieves relevant meals; calculates ingredient needs and overlap; checks feasibility and estimates; then presents explainable suggestions. The user decides which additions to make. A calculation/validation layer should check ingredient quantities, serving scaling, and meal readiness rather than relying on a language model for arithmetic.

### Proposed MVP system

- **Mobile client:** Cook Now, Groceries, Pantry, Explore view, and Profile.
- **Application API:** authentication, business rules, transactions, and shared state.
- **Shared database:** users, preferences, food catalog, ingredient mappings, inventory, grocery items, favorites, and purchase/cooking events.
- **Meal catalog and retrieval:** curated simple meals, recipes, snacks, ingredient quantities, and attributes.
- **Planning and feasibility services:** normalize ingredients/units; account for Pantry; calculate servings and shared needs; estimate basket cost ranges; validate readiness.
- **Agent orchestrator:** interpret requests, choose tools, explain results, and stage proposed list additions.
- **External sources:** an LLM provider; curated recipe/catalog content; nutrition data where appropriate; an easy-to-maintain baseline for rough price ranges. Retailer pricing, sales, receipt scanning, and barcode integrations are future options, not MVP assumptions.

The architecture is a proposal to guide discussion, not a locked technology decision. See the [Diagrams folder](../Diagrams/README.md).

## MVP boundary

### Core to validate

- Three primary tabs and a shared profile.
- Useful, curated meal catalog with simple meals, recipes, and snacks.
- Pantry-aware Ready to Make and Almost There discovery.
- Useful meal metadata for time, effort/cleanup, and leftover potential where supported, plus simple serving scaling and optional leftover confirmation after cooking.
- Context-aware grocery input and a single editable, consolidated list.
- Ingredient-to-meal and meal-to-ingredient expansion.
- Transparent price ranges and user approval for additions.
- Purchase confirmation by item and quantity/package; Pantry update.
- Cooking confirmation and Pantry update.

### Defer until the core loop is proven

- Live retailer prices and sales, cheapest-store comparison, and retailer checkout.
- Receipt OCR and barcode scanning.
- Sophisticated personalized recommendation models.
- Exact price/nutrition claims unsupported by the available data.
- Heavyweight pantry logging that requires exact quantities for everything.
- A fourth Explore tab, unless research supports it.

## Success signals and validation

Mise is useful if people can quickly understand and trust what to buy and what they can cook afterward. Early research should test:

- Whether the shopping pain happens often enough and matters enough to change behavior.
- Whether people prefer meal-first shopping or ingredient/budget-first suggestions.
- Whether showing meals linked to a shared list increases confidence in purchases.
- Whether estimated price ranges are useful enough when live store data is unavailable.
- Whether Pantry tracking feels helpful rather than like homework.
- Whether users can correctly distinguish owned food, intended purchases, and future meal possibilities.
- Whether suggestions are accepted, edited, or dismissed—and why.

Potential measures include time to select a meal or build a list, user-reported confidence and budget fit, usefulness of suggested additions, grocery-list correction burden, confirmed cooking after shopping, and self-reported unused food. Do not claim savings or waste reduction without a credible baseline.

## Key risks and guardrails

- **Price uncertainty:** show ranges and avoid claiming exact totals or live deals.
- **Inventory burden:** support quick approximate quantities and easy corrections.
- **False readiness:** validate required quantities and do not count unpurchased items as Pantry stock.
- **Rigid planning:** keep the list editable and meals optional; let users change their mind.
- **Recommendation repetition:** balance Pantry use, goal fit, cost, and variety according to the user's request; make the reason for a suggestion visible.
- **AI overreach:** stage changes and require the user to add them; never silently delete list items.
- **Nutrition uncertainty:** show estimates and avoid unsupported health claims.

## Current specific focus

The project is currently focused on whether **a Pantry-aware, meal-linked grocery list** solves a meaningful pain: users can see which meals their current food and proposed purchases support, and decide what to add without committing to a rigid menu. The 15-minute [Product Discovery Interview](PRODUCT_DISCOVERY_INTERVIEW.md) is designed to test this direction against alternatives such as pantry-first cooking, broad meal discovery, and ingredient/deal-based shopping.
