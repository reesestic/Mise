# Mise — Next Steps and External Setup

This checklist takes the project from its current state (product/design documents, no app code, no Git repo) to a working development setup with the external accounts chosen for an MVP.

## Recommended choices

- **Mobile:** Expo + React Native + TypeScript.
- **Backend:** Supabase + PostgreSQL + Auth + Edge Functions.
- **Source control:** local Git repository, then a private GitHub remote.
- **In-app AI:** choose one later: OpenAI API or Anthropic Claude API. Keep the provider key on the server.
- **Recipe content:** create a small original Mise catalog; use TheMealDB API for prototyping and evaluate its paid terms before app-store distribution. Optionally import individual Wikibooks recipes under its open license with attribution and share-alike handling.

See [TECH_STACK.md](../Structure/TECH_STACK.md) for architecture and [PROJECT_ROADMAP.md](PROJECT_ROADMAP.md) for product phases.

## Checklist: from this workspace to working on the app

### Step 1 — Save the project in Git

- [x] Initialize a local Git repository in this folder.
- [x] Create the initial commit with the current project documents, diagrams, and visuals.
- [ ] Review the initial commit and confirm that all intended project materials are included.
- [ ] Create a **private** GitHub repository named `mise` (or another available name).
- [ ] Connect it as the `origin` remote and push the local `main` branch.
- [ ] Keep `.env`, API keys, passwords, and generated native signing credentials out of Git.

The local repository can exist without GitHub. GitHub is the online backup/collaboration destination; it requires your GitHub account and a remote setup. Don’t make the repository public while it contains private notes, keys, or user data.

### Step 2 — Install local development tools

- [ ] Install current Node.js LTS (npm is included).
- [ ] Install/use Git and an editor such as VS Code. Codex can work in this same project folder.
- [ ] Install Expo Go on a phone for the first screen prototype.
- [ ] Optional: install Android Studio to run an Android emulator.
- [ ] Windows cannot run Xcode locally. Use Expo cloud builds for iOS when a native development build is needed, or use a Mac. Start with Expo Go before paying for store accounts.

Then scaffold Expo with TypeScript and Expo Router. Keep the product documents outside the application source folders; they are project reference material.

### Step 3 — Create the Expo project

- [ ] Create an Expo account.
- [ ] Create the TypeScript app in this project (or create it in a temporary folder and move its app files into the project after checking names).
- [ ] Start the development server and open the starter app on a physical phone.
- [ ] Add Expo Router and create empty routes for Cook Now, Groceries, Pantry, Explore, Profile, and meal detail.
- [ ] Create a development build only when Expo Go no longer supports a native feature you need.
- [ ] Set up EAS Build when you need iOS cloud builds, shareable preview builds, or store binaries.

### Step 4 — Create Supabase development backend

- [ ] Create a Supabase account and a **development** project.
- [ ] Save the project URL and publishable key into a local `.env` file (never commit the file).
- [ ] Set up Auth and a minimal profile table.
- [ ] Create initial PostgreSQL migrations for users/profile, ingredients, meals, one open grocery list, grocery items, Pantry entries, purchases, and cooking confirmations.
- [ ] Enable and verify Row Level Security before putting user data in the database.
- [ ] Use database functions/transactions for purchase confirmation and cooking completion so each action updates all related rows atomically.
- [ ] Create a separate production Supabase project only when preparing real-user testing or launch.

### Step 5 — Choose recipe content before building a large catalog

- [ ] Create 15–30 original Mise meal records first, with ingredient IDs, serving basis, instructions, and metadata.
- [ ] Import prototype data only from sources whose terms allow the intended use.
- [ ] Store provenance for every record: source URL/provider, record ID, access date, license/terms, attribution, and whether image reuse is allowed.
- [ ] Store text and image rights separately. A recipe page’s photo is often licensed differently from its ingredient facts or text.
- [ ] Do not build a crawler for major recipe blogs/sites unless the site grants permission or provides an API/license for your use.

### Recipe sources to consider

| Source | How to access | Good for | Conditions to account for |
| --- | --- | --- | --- |
| **Mise-authored recipes** | Enter your own tested/created recipes | Best foundation for a product catalog you control | Keep a source/editor record; only include images you own or have permission to use. |
| **TheMealDB** | Use its official API endpoints; do not scrape its website | Prototype catalog and API integration practice | Its current terms say the free API is for development/personal projects and app-store publishing requires a paid subscription. API content may be copied/modified only through official endpoints; preserve notices/attribution. Check the current terms and pricing before production. |
| **Wikibooks Cookbook** | Use the Wikimedia/MediaWiki API or download content according to Wikimedia guidance; don’t crawl pages indiscriminately | Openly licensed text and experimenting with source attribution | Most text is CC BY-SA 4.0 and GFDL unless a page says otherwise. Attribution and share-alike obligations apply; verify each page and each media file’s license. Decide whether those terms fit the app before distributing adapted content. |
| **RecipeDB** | Dataset access described by its maintainers | Academic exploration and nutrition-oriented experiments | Its FAQ identifies CC BY-NC-SA 3.0, which is noncommercial. Don’t use it in a commercial product without separate permission. |

**Recommended decision:** start with Mise-authored recipes plus TheMealDB for development/testing. Before a public app launch, either meet TheMealDB’s paid/attribution terms, replace those records with appropriately licensed content, or obtain a direct license. Use Wikibooks only if you can comply with attribution/share-alike. Do not ingest photos by default.

### Step 6 — Set up one AI provider (after core flows work)

- [ ] Create an OpenAI API developer project **or** an Anthropic API Console workspace.
- [ ] Create a restricted project key and a spend limit.
- [ ] Store the key as a Supabase Edge Function secret; never put it in `EXPO_PUBLIC_*` variables or the mobile bundle.
- [ ] Implement one server-side function that receives a grocery request, loads the user's list/Pantry/profile, and calls the model to return a typed intent/proposal.
- [ ] Validate model output and calculate quantities in Mise code.
- [ ] Require the user to select Add before modifying grocery items.

An OpenAI API account and a ChatGPT subscription are separate. An Anthropic API account and a Claude chat subscription are also separate. You only need one API provider to build the first agentic planning workflow.

### Step 7 — Optional services, only when needed

- **Transactional email provider** (e.g. Resend or Postmark): configure when you need production email verification/reset delivery beyond backend defaults.
- **Error monitoring** (e.g. Sentry): add before wider testing, with prompt/profile data excluded from logs.
- **Apple Developer Program:** create when you need iOS development builds on registered devices, TestFlight, or App Store release.
- **Google Play Console:** create when preparing Android store testing/release.
- **Nutrition or price API:** defer until user testing shows the need and the license/data coverage is clear. Use labeled estimates and provenance in the meantime.
- **Voice input:** defer; text requests are enough to validate grocery planning.
- **Retailer integrations, receipts, barcode scanning:** future scope, not initial setup.

## Suggested order of implementation

1. Confirm the private GitHub remote and make sure the project is safely versioned.
2. Scaffold Expo and build the screen shell with local sample data.
3. Write ingredient/meal data types and deterministic quantity/readiness calculations.
4. Create the Supabase development project, migrations, Auth, and Row Level Security.
5. Build Pantry, Cook Now, then the editable grocery list and meal coverage.
6. Add purchase and cooking confirmation as transactional backend operations.
7. Add recipe imports with recorded provenance and checked permissions.
8. Add the AI planning workflow through one server-side provider.
9. Test the full loop with users; set up app-store accounts and external services only when release needs them.

## External setup tracker

| Item | Status | Needed for |
| --- | --- | --- |
| Local Git repository | Initialized with initial commit `d9e0c06` | Start tracking changes |
| GitHub account/private remote | Not connected yet | Off-device backup and collaboration |
| Node.js LTS / npm | Verify on development machine | Expo app development |
| Expo account | Not set up in this checklist | EAS cloud services/builds |
| Supabase development project | Not set up in this checklist | Auth and persistent shared data |
| Recipe content source | Decision: original content + TheMealDB for prototyping | Meal catalog |
| OpenAI or Anthropic API | Defer until planning feature | In-app AI feature |
| Apple / Google developer accounts | Defer until distribution | Store testing/release |

