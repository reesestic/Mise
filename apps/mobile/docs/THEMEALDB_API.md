# TheMealDB API connection

Mise's mobile app calls TheMealDB's official JSON API through `src/data/themealdb.ts`. It does not scrape recipe website pages.

## Current development integration

The client uses the public development key `1` and these V1 endpoints:

```text
Search meals:       https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
Meal details by ID: https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
```

The code exposes:

- `searchMeals(query)` — returns matching meals for the Explore recipe search.
- `getMealById(id)` — loads ingredients and instructions for a selected recipe.
- `MealDbMeal` — normalized recipe shape used by screens, including ingredient measures and TheMealDB attribution.

The API response uses numbered fields such as `strIngredient1` / `strMeasure1`; the adapter converts those fields into an ingredient array and omits empty values.

## Try the API directly

Paste this in a browser to confirm the development endpoint returns JSON:

```text
https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
```

In the app, run `npx expo start`, open Expo Go on your phone, and search for a dish or ingredient. Tap a result to load its full recipe.

## Terms and launch boundary

TheMealDB's terms say to use its official API endpoints and not scrape its website. Its free API access is for development/personal projects; the terms say app-store publication requires a paid subscription. The paid service asks apps using its custom artwork to mention TheMealDB as the source. Check the provider's current terms and plan before distributing an app.

Do not move a paid API key into `EXPO_PUBLIC_*` configuration. Expo public environment variables are bundled into the client app and are visible to users. Before using paid access, proxy TheMealDB requests through a Supabase Edge Function and store the key as a server-side secret. Keep attribution and source URLs with imported recipe records. Verify image reuse rights separately from recipe data.

Official sources: [TheMealDB API guide](https://www.themealdb.com/docs_api_guide.php) · [TheMealDB terms](https://www.themealdb.com/terms_of_use.php)
