# Mise — Recommended Technology Stack

**Decision status:** Installed starter in `apps/mobile` (Expo SDK 58, React Native, TypeScript); Supabase client and TheMealDB development adapter are wired.  
**Product:** iOS and Android mobile app for meal discovery, grocery planning, Pantry inventory, and user-approved AI suggestions.

## 1. Recommended stack at a glance

| Layer | Recommendation | Why it fits Mise |
| --- | --- | --- |
| Mobile app | **React Native + Expo** | One TypeScript app for iOS and Android, with tooling for device preview and native builds. |
| Language | **TypeScript** | Typed screen data and business operations; usable across mobile and server functions. |
| Navigation | **Expo Router** | File-based routes for Cook Now, Groceries, Pantry, Explore, Profile, and meal details. |
| Backend/database | **Supabase + PostgreSQL** | Relational data suits meals ↔ ingredients ↔ grocery items ↔ Pantry. Includes Auth and storage. |
| Server-side operations | **Supabase Edge Functions** | TypeScript endpoints for planning requests and private third-party API keys. |
| Critical multi-row changes | **PostgreSQL function/transaction** | Confirms purchases and cooking changes atomically, preventing partial Pantry updates. |
| Data validation | **Zod or equivalent schema validation** | Validates requests and AI structured output before Mise uses it. |
| AI provider | **Choose one later: OpenAI API or Anthropic Claude API** | Natural language interpretation and explanation. Keep provider behind an adapter. |
| Source control | **Git + private GitHub repository** | Version history, backup, issue tracking, and later collaboration. |
| App builds | **Expo development builds; EAS Build when useful** | Install previews on phones; build iOS and Android binaries. |
| Design | **Figma, optional** | Screen layouts and interaction prototyping before implementation. |

Keep the first implementation as one Expo app with Supabase services. Do not begin with microservices or a large monorepo. Keep clear feature folders and server-side rules so the project can grow without a rewrite.

## 2. What to install or create

### Local development tools

1. **Node.js LTS and npm** — run Expo and TypeScript tooling.
2. **Git** — local version control.
3. **VS Code or another editor** — edit and inspect the project; Codex can work in the same repo.
4. **Expo Go** — quick early device preview. For ongoing app development, move to a development build when native modules or production-like behavior are needed.
5. **Android Studio** — optional Android emulator and Android SDK. A physical Android phone also works.
6. **Apple Xcode** — needed for local iOS builds and iOS Simulator, and only available on macOS. Since this project is currently on Windows, use Expo cloud builds for iOS when you reach that stage, or use a Mac.

### Accounts and services

| Service | Needed when | Notes |
| --- | --- | --- |
| GitHub | At project start | Create a private repo and push the current design materials before implementation. |
| Expo | During app setup / cloud builds | Useful for device previews and EAS. Cloud build usage and limits depend on current Expo plans. |
| Supabase | When moving from prototype data to saved accounts/data | Create development and production projects separately before launch. Set up Auth, PostgreSQL, Row Level Security, migrations, and Edge Function secrets. |
| OpenAI API **or** Anthropic API | When building the AI grocery-request feature | These developer API accounts are separate from ChatGPT or Claude subscriptions. API use may be billed separately. Do not expose API keys in the phone app. |
| Apple Developer Program | Before iOS store distribution | Not needed to start building screens. |
| Google Play Console | Before Android store distribution | Not needed to start building screens. |
| Figma | Optional, before detailed screen implementation | Helpful if sketches or design mockups need shared review. |

Do not sign up for retailer, receipt-scanning, barcode, or paid nutrition services at the start. They are outside the MVP boundary. Build a small curated catalog and represent unknown price/nutrition values honestly.

### Recipe content starting point

Start with a small set of Mise-authored recipes and use TheMealDB's official API for development if helpful. Its current terms disallow scraping its website, limit free use to development/personal projects, and require paid access for app-store publication. Wikibooks Cookbook text is generally CC BY-SA 4.0/GFDL; use it only with attribution and a plan for share-alike obligations, and inspect image licenses separately. See [NEXT_STEPS_EXTERNAL_SETUP.md](../Project%20Roadmap/NEXT_STEPS_EXTERNAL_SETUP.md) for the source comparison and record-level provenance checklist.

## 3. Main architecture

```text
Expo phone app (TypeScript)
  ├─ screens and navigation
  ├─ reusable interface components
  └─ Supabase client (public project URL + publishable key only)
        ↓ authenticated requests, protected by Row Level Security
Supabase PostgreSQL + Auth + Storage
  ├─ user profile and preferences
  ├─ meal and ingredient catalog
  ├─ one open grocery list per user
  ├─ confirmed Pantry stock
  └─ purchase and cooking events

Supabase Edge Functions (server-side TypeScript)
  ├─ interpret request using an AI provider adapter
  ├─ gather current list, Pantry, and profile context
  ├─ call deterministic planning/calculation code
  ├─ validate and return proposal; do not silently commit it
  └─ use server-only AI secrets

PostgreSQL transaction / function
  ├─ commit approved additions
  ├─ confirm actual purchases and update Pantry atomically
  └─ confirm cooking use and adjust Pantry atomically
```

The database is the source of truth. An AI provider interprets and explains; normal Mise code calculates amounts, applies domain rules, and controls state transitions.

## 4. AI integration and agent behavior

Build one **planning orchestrator**. It should coordinate explicit tools rather than hand all product behavior to a chat prompt:

1. Read the current user’s profile, Pantry, and open grocery list.
2. Parse the new message into a typed intent (meals, ingredients, budget, servings, strict restrictions, flexible goals).
3. Search the curated meal catalog.
4. Use Mise’s calculation functions to scale ingredients, match Pantry quantities, find shortfalls, consolidate shared needs, and attach sourced estimates.
5. Validate restrictions and the output shape.
6. Return a small set of proposal cards, a rationale, and the possible list changes.
7. Wait for the user to explicitly select **Add**. Only then execute the add command.

The AI adapter should expose a small contract such as `interpretRequest(context, text) -> PlanningIntent` and `explainProposal(context, proposal) -> Explanation`. It should not expose database credentials or arbitrary database writes to the model. Start with one provider; add another only if there is a real need to compare or switch.

## 5. Repository structure to start with

```text
Mise/
├── Visual/                       # art direction, mood board, sketches/prototypes
├── Diagrams/                     # system, domain, class, state, repo diagrams
├── Project Roadmap/              # product thesis, screens, discovery, roadmap
├── Structure/                    # repo design, stack, domain model
├── Misc/                         # unclassified references and temporary artifacts
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Cook Now, Groceries, Pantry
│   ├── explore/
│   ├── meals/
│   └── profile/
├── src/
│   ├── features/                 # feature UI and feature-specific state
│   ├── components/               # shared interface components
│   ├── domain/                   # food quantities, readiness, lifecycle rules
│   ├── data/                     # sample catalog, database access, adapters
│   ├── services/                 # client calls to backend functions
│   └── theme/                    # colors, type, spacing, design tokens
├── assets/                       # app-ready imagery, fonts, icons
├── supabase/
│   ├── migrations/               # versioned database schema changes
│   └── functions/                # request planning, confirmations, protected APIs
├── .env.example                  # variable names only; no real secrets
├── .gitignore
├── app.json
├── package.json
└── README.md
```

This is the **future app structure**, not a claim that these code folders already exist. Keep `domain/` independent from screens and provider SDKs. Keep AI keys and privileged database keys server-side. Put Supabase migrations in Git so the schema is reproducible.

## 6. Architecture alternatives

| Choice | When to choose it instead |
| --- | --- |
| **Convex** | Prefer a TypeScript-first backend with reactive queries and want to avoid SQL at the beginning. Its database and actions can support the planning workflow. |
| **Firebase** | You have Firebase experience or a key requirement for its ecosystem/offline features; design Firestore collections and queries carefully for Mise’s linked data. |
| **Appwrite** | Open-source/self-hosting is a strong requirement and you are comfortable operating that platform or using its hosted service. |
| **Custom API + PostgreSQL** | You need control that a managed backend does not provide and are ready to maintain deployment, authentication, and operations. |

For the first implementation, avoid evaluating all backends in parallel. Pick Supabase unless a concrete requirement (existing team expertise, self-hosting, realtime-first behavior, or data policy) points to one of the alternatives.

## 7. Setup sequence

1. Create a private GitHub repository and commit the organized product/design documents.
2. Install Node.js LTS, Git, and an editor. Confirm Android device/emulator access.
3. Scaffold Expo with the TypeScript template and Expo Router; run it on a phone before adding backend complexity.
4. Recreate the three core screen skeletons with sample data and Mise’s visual direction.
5. Define the domain types and deterministic ingredient math; connect a Supabase development project.
6. Add schema migrations, Auth, and Row Level Security before storing real personal data.
7. Implement the lifecycle commands (add/edit list, purchase confirmation, cooking confirmation) and ensure multi-record state changes are atomic.
8. Add one AI provider through an Edge Function after planning request/response contracts are already defined.
9. Add build profiles and store accounts only when preparing external testing or launch.

## 8. Security and operational rules

- Never commit `.env` or API secrets; keep `.env.example` values blank or illustrative.
- Only expose Supabase publishable configuration to the app; use Row Level Security for user data.
- Store AI provider keys in server-side function secrets.
- Validate all AI output against a schema; treat output as untrusted input.
- Enforce strict dietary restrictions and quantity/state invariants in code/database rules, not just prompts.
- Use idempotency keys and database transactions for purchase and cooking confirmations.
- Keep development and production Supabase projects, API keys, and data separate.
- Keep price and nutrition provenance; an unknown estimate remains unknown.

## 9. Useful official references

- [React Native setup](https://reactnative.dev/docs/environment-setup)
- [Expo getting started](https://docs.expo.dev/get-started/introduction/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Supabase Expo / React Native quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [OpenAI API quickstart](https://developers.openai.com/api/docs/quickstart)
- [Claude API overview](https://platform.claude.com/docs/en/api/overview)


