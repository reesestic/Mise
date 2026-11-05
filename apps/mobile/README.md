# Mise Mobile App

Expo + React Native + TypeScript app for Mise.

## Run it

1. Open this repository folder in VS Code.
2. In the integrated terminal, run:

   ```powershell
   cd apps/mobile
   npx expo start
   ```

3. Install **Expo Go** on your phone and scan the QR code shown by Expo. Keep the phone and computer on the same network. Press `a` to launch an Android emulator if Android Studio is installed.

## Supabase connection

The local `.env.local` already contains the URL for the Supabase project you supplied. Add its **publishable** key from Supabase Dashboard → Project Settings → API Keys to `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. `.env.local` is ignored by Git. Never put a `service_role` or secret key in an `EXPO_PUBLIC_` variable. Restart Expo after changing it.

Supabase is configured as an optional client until the key is added; meal discovery works without Supabase credentials.

## TheMealDB

Recipe search and detail use the official TheMealDB V1 API with its development key. The client is in `src/data/themealdb.ts`. This calls API endpoints, not website pages. TheMealDB's terms restrict free access to development/personal use and require paid access for app-store publication. Review the current terms before shipping. See [`docs/THEMEALDB_API.md`](docs/THEMEALDB_API.md) for endpoints, adapter methods, and attribution.

