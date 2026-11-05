# Mise — Project Roadmap

This is the working index and build sequence for the project. The detailed product responsibilities and guardrails remain in the screen specifications listed below.

## Product in one sentence

Mise helps people discover food they want, build an affordable and flexible shopping list informed by meals, and cook from what they actually own.

## Product loop

**Discover meals → propose shared grocery needs → user chooses additions → confirm what was bought → update Pantry → recommend meals from confirmed stock → user confirms cooking.**

Mise keeps three states distinct:

- **Meal ideas:** discovered or saved, with no automatic shopping change.
- **Groceries:** intended purchases on one editable open list.
- **Pantry:** food the user confirms they own.

## Build roadmap

### Phase 0 — Set up the project

- Settle on Expo + React Native + TypeScript and a backend choice (recommended: Supabase/PostgreSQL).
- Organize design/spec files and create a private GitHub repository.
- Install local tooling and scaffold an Expo app.
- Record architecture choices and unresolved product/data decisions.

### Phase 1 — Explore and Cook Now prototype

- Build navigation for Cook Now, Groceries, Pantry, with Explore inside Cook Now and Profile accessible from primary screens.
- Use a small local meal/ingredient catalog first.
- Create meal cards, search, detail, Ready to Make and Almost There views.
- Establish a first visual system from the Visual folder.

### Phase 2 — Domain data and Pantry

- Define canonical ingredients, aliases, quantities, units, meals, and serving bases.
- Build Pantry manual add/edit/remove and approximate quantities.
- Separate prepared leftovers from raw inventory.
- Add profile restrictions, flexible goals, tastes, cooking preferences, household size, and units.

### Phase 3 — Grocery list and meal coverage

- Implement one open editable grocery list per user.
- Build quick add/edit/delete and explicit meal-to-list handoff.
- Show each meal ingredient as Pantry, list, or missing.
- Consolidate shared ingredient requirements with Pantry contribution and shortfall.
- Show estimates only with a source and confidence/age where available.

### Phase 4 — Purchase and cooking lifecycle

- Review actual items and package/quantities purchased; price entry optional.
- Confirm purchases and update Pantry in one atomic transaction.
- Handle partial purchases explicitly.
- Do not deduct inventory when a recipe is merely opened or started.
- Confirm cooking and quantities used; optionally record prepared leftovers.

### Phase 5 — Agentic planning

- Add an authenticated server-side planning function and one AI provider.
- Load the current grocery list, Pantry, and profile for each request.
- Parse request into validated constraints, retrieve catalog candidates, calculate needs, check estimates, and explain tradeoffs.
- Return a proposal; wait for explicit Add before changing the list.
- Add request logs, budget limits, failure handling, and example-based quality checks.

### Phase 6 — Test with users and prepare launch

- Use the product discovery interview to validate real recent behavior.
- Check whether users understand owned vs intended food and trust estimates.
- Measure time to choose/build list, proposal accept/edit/dismiss, corrections, and cooking follow-through.
- Refine onboarding, ranking, almost-there threshold, and Pantry burden based on evidence.
- Create internal iOS/Android builds; set up app-store accounts only when ready to distribute.

## Definition of a complete first product loop

A user can browse a meal, see whether confirmed Pantry supports it, send missing ingredients to the editable grocery list, inspect list meal coverage, approve or edit suggested additions, confirm actual purchases, see Pantry update, and confirm cooking before stock is deducted.

## Product guardrails

- No grocery suggestion silently edits or deletes existing items.
- Shopping list stock never counts as Pantry inventory.
- Purchase confirmation records actual quantities; actual prices are optional.
- Cooking confirmation is required before inventory deduction.
- Price and nutrition remain estimates where source data is incomplete.
- Goals are preferences unless the user makes them strict; dietary restrictions are enforced.
- AI interprets and proposes; deterministic code validates arithmetic and state changes.
- Broad meal discovery stays available even when the user cannot currently cook the meal.

## Product/design reference files

- [Project description](PROJECT_DESCRIPTION.md) — product thesis, MVP boundary, validation goals.
- [Cook Now](COOK_NOW.md) — owned-food meal discovery and cooking behavior.
- [Groceries](GROCERIES.md) — request, shared list, meal coverage, estimate, and purchase behavior.
- [Pantry](PANTRY.md) — inventory and freshness behavior.
- [Profile](PROFILE.md) — goals, restrictions, tastes, cooking, and shopping defaults.
- [Product discovery interview](PRODUCT_DISCOVERY_INTERVIEW.md) — interview script and evidence guide.
- [Agent and architecture plan](../Structure/DOMAIN_AND_REPOSITORY_DESIGN.md) — domain, classes, flows, data, and repository design.
- [Recommended tech stack](../Structure/TECH_STACK.md) — tools, backend options, setup and AI integration.
- [Next steps and external setup](NEXT_STEPS_EXTERNAL_SETUP.md) — accounts, local tools, recipe sources, and setup checklist.
- [Visual direction](../Visual/ART_DIRECTION.md) and [diagram gallery](../Diagrams/README.md).

## User interview practice

The interview guide asks about recent actions and outcomes before introducing Mise. Record observations, frequency, consequences, and current workaround separately from opinions or feature requests. One interview gives a hypothesis; repeated concrete behavior is stronger evidence.

