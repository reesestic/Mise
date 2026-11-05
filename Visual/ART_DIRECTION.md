# Mise — Art Direction & Naming Exploration

*Working design direction · November 2026*

## The feeling

**A cozy kitchen toybox, where a thoughtful shop turns into a week of good possibilities.** Mise should feel warm, tactile, curious, and quietly capable: a place to see what is already in the pantry, discover something appealing, and understand what a few smart additions could unlock. It can feel lightly game-like through its illustrations and small moments of motion, without scores, streaks, or pressure.

The visual cue is a playful, toy-like cooking world: chunky shapes, friendly ingredient emblems, simple dimensional illustrations, and the charm of a small kitchen adventure. A little cooking pot is Mise's recurring motif: a visual shorthand for ingredients coming together and a meal taking shape. It can gently wobble or simmer in illustrations and confirmations. The Pantry can feel like a friendly kitchen shelf with clear Freezer, Fridge, and Cabinet sections and simple food emblems. Keep the inspiration broad and original. Borrow the approachable, toy-like energy of *Pokémon Quest* and the playful learning-product warmth of the LearnWyWrm reference, without recreating their characters, logos, exact shapes, or layouts.

## Art direction principles

- **Food is the hero.** Give meals and ingredients the largest, most appetizing space. Use simple illustrations for system moments; use real food photography only if it shares warm, soft light and uncluttered framing.
- **Playful, not childish.** Rounded corners, little expressive details, and gentle motion can add charm. Keep quantities, prices, ownership, and actions crisp and adult-readable.
- **Useful before decorative.** Every badge, character, and flourish should help explain readiness, shared ingredients, freshness, or a next step.
- **Warm, with clear state.** Cream backgrounds and earthy colors create comfort. Blue-green accents identify actions and navigation; status colors always include a word or icon, not color alone.
- **Flexible, never bossy.** Show options and tradeoffs. A suggested meal or item is an invitation, not a prescribed plan.

## Palette

| Token | Hex | Role |
| --- | --- | --- |
| Oat Milk | `#FFF8E9` | Main canvas; softens long lists |
| Porcelain | `#FFFEFA` | Cards and raised surfaces |
| Ink | `#283638` | Primary text |
| Herb | `#3E7160` | Primary action, navigation, ready state |
| Deep Herb | `#285447` | Pressed / high-contrast action |
| Apricot | `#F2A16F` | Warm highlight, new discovery |
| Tomato | `#D9634D` | Occasional emphasis, use sparingly |
| Butter | `#F2D779` | Gentle attention, almost-there state |
| Sage Mist | `#DCE9D9` | Supporting panel, pantry category |
| Line | `#E7E0D3` | Dividers, outlines |
| Muted | `#71807B` | Secondary copy |

Use Oat Milk as the broad field and Porcelain for readable cards. Herb should be the action color, not a full-screen wash. Reserve Tomato for a small accent or explicit warning; it should not suggest that normal grocery choices are errors. Keep text contrast strong on Butter and Apricot.

## Shape, type, and imagery

- **Shapes:** Friendly rounded rectangles, soft pill tags, a few scalloped or irregular illustration edges. UI controls should stay consistent and easy to tap; save the quirky shapes for art and small section markers.
- **Typography:** A rounded humanist sans for headings and body (for example, Nunito Sans or a similar available family); use a sturdy weight for prices, quantities, and section labels. Avoid novelty display fonts for operational information.
- **Illustration:** Build original, simple “kitchen object” scenes from chunky forms—especially the cooking pot, plus ladle, beans, herbs, market bag, and pantry shelf. Favor soft shadows, gentle dimensionality, and limited highlights over glossy 3D. Tiny faces may appear on occasional decorative ingredients, never on every food item. Use food emblems as friendly category cues, with item names and quantities remaining explicit.
- **Food imagery:** Close crop, natural warm light, a little texture, restrained props. Avoid sterile white plates, heavy filters, or inconsistent image styles mixed in one feed.
- **Motion:** Small simmer/bob on an empty state or confirmation; a short, calm transition when an item is added. No constant bouncing or gamified reward noise.

## UI fragments

### Cook Now — “use what’s here”

**Header:** “What sounds good?” with a small Pantry status such as “12 ingredients on hand.” Make quick choices easy to spot without making every meal feel like a time-optimization task.

**Ready card:** A large meal image or friendly illustration, title (“Crispy chickpea bowls”), concise cues (“20 min · one pan · makes leftovers”), then a clear “Cook this” action. Add a tiny Herb “Ready” badge. Show cleanup and leftover cues only when supported by recipe data. The card should feel delicious first and computable second.

**Almost there card:** Keep the same meal-card language, but show “Almost there” in Butter and a concrete gap (“You have 4 of 5 · add lemons”). “See what’s missing” opens details; an explicit “Add missing items” action sends items to Groceries.

### Groceries — “a useful shop, made visible”

**Request panel:** A compact rounded input on Oat Milk/Porcelain: “What would you like this shop to help with?” with microphone and submit icons. After submit, clear the field and show the response as a suggestion card with an explicit Add button.

**Shared list:** The central surface, not a chat transcript. Rows show item, amount, estimated range where available, and a small “in 2 meals” link. Expanded rows show Pantry contribution, shortfall, and meals using it. A concise choice set and a clear estimate reduce shopping decisions; a top summary can say “This list supports 4 meals” and “Estimated range” without implying exact checkout cost.

**Unlock idea:** An Apricot or Sage Mist card beneath the list: “Add spinach + feta to open up 2 more meals” with the specific meals and estimated addition range. Primary action: “Add these items.” Secondary action: “See meals.”

### Pantry — “what I actually own”

**Friendly shelf:** Present Freezer, Fridge, and Cabinet as simple illustrated shelf spaces or doors, each with a clear label and item count. Simple food emblems can make each area feel lively and help browsing; selecting a space reveals practical item rows. Rows favor names and approximate quantities (“Greek yogurt · about 1 cup”) over fussy precision. Use Sage Mist for category cues and Butter only for a gentle “use soon” label.

**Quick action:** “Restock” creates an editable Groceries item. Keep the Pantry quantity visible and independent from the intended purchase. After shopping, a clear confirmation updates owned stock.

### Recurring motif — the Mise pot

Use an original, chunky cooking pot as a small brand illustration across the experience. It can sit beside meal discovery, appear in a warm empty state, or give a subtle simmer/shake when ingredients come together. Motion should be brief and optional; the pot is a friendly cue, not a game mechanic. Do not make it imply that a meal is ready if Pantry requirements are not actually met.

## Naming exploration

The name should leave room for the full loop—discover, shop thoughtfully, keep track, and cook—rather than promising only cheaper groceries.

| Name | What it suggests | Watch-out |
| --- | --- | --- |
| **Mise** | Preparedness, cooking craft, a short memorable kitchen word | Some people may not know how to say or spell it at first; pair with a plain-language tagline |
| **Good Basket** | A considered shop that supports good meals | Could sound like a grocery delivery service |
| **Pantry Pot** | Home ingredients becoming meals; friendly and visual | May understate the shopping/list-planning part |
| **Next Meal** | Clear bridge from today’s food to what comes next | More functional, less ownable; availability needs checking |
| **Gather & Cook** | Shared ingredients, discovery, cooking | Longer and a little more lifestyle-oriented |
| **Meal Garden** | Ideas growing from what you have and what you buy | Can imply gardening or meal planning |
| **Grocerease** | Convenience and grocery help | Reads narrowly as grocery utility, and the pun may feel less warm/premium |
| **Mise Kitchen** | Keeps the distinctive short name while clarifying the category | Slightly more generic; useful as a descriptor or store listing name |

### Working recommendation

Keep **Mise** as the lead for now. It is broad enough for Pantry, Cook Now, and Groceries, while **Grocerease** puts too much weight on the shopping task. Test it with a plain-language line that explains the value:

> **Mise — shop for meals, make the most of what you have.**

Other tagline explorations: “A little more thought in every shop.” · “Shop with your next meal in mind.” · “Make good things from what you have.”

Names here are creative directions only; do trademark, domain, and app-store checks before committing.

## Keep / avoid

**Keep:** visible ingredient sharing; explicit Pantry/list/missing status; inviting meal-first illustrations; warm quiet surfaces; small moments of character.

**Avoid:** copying the reference product’s logo, mascot, UI composition, or Pokémon’s recognizable characters; overusing childish faces; making a rigid weekly plan the main metaphor; presenting estimates as exact prices; treating planned groceries as owned Pantry stock.

## Open questions

- Should the final palette lean more leafy (Herb/Sage) or more sunny (Apricot/Butter)?
- Does the audience understand “Mise” after seeing the tagline, or is a more immediately descriptive name preferable?
- Should the visual system use original ingredient mascots at all, or reserve personality for occasional empty states and onboarding?

