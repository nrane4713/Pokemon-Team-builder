# Pokémon Team Builder

Build type-balanced Pokémon teams for any mainline game from Red & Blue through Sword & Shield — each
game only shows Pokémon actually obtainable in it. Includes a National Dex reference, live type
weakness/resistance/coverage analysis, and named presets that can bundle teams across multiple games.

## Setup

```bash
npm install
npm run build:data      # fetches + generates data/generated/*.json from PokeAPI (cached, resumable)
npx prisma migrate dev  # creates the local SQLite db (skip if dev.db already exists)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`data/generated/*.json` is committed to the repo, so `npm run build:data` only needs to be re-run if you
want to refresh from PokeAPI or edit the hand-curated files in `data/manual/`.

## Project structure

- `scripts/build-data/` — one-time pipeline that fetches PokeAPI data (types, species, regional
  Pokédexes) and writes the static `data/generated/*.json` the app reads at runtime. Raw responses are
  cached in `data/cache/` (gitignored) so reruns are fast.
- `data/manual/games.json` — the 18 supported game tiles (one per version-group pairing) and their
  display metadata.
- `data/manual/regional-form-overrides.json` — hand-curated mapping of which regional form (Alolan,
  Galarian) a species takes in a given game, since PokeAPI's regional Pokédex data doesn't expose this
  directly.
- `src/lib/type-chart.ts` — pure type-effectiveness engine (defensive coverage + STAB-only offensive
  coverage), unit-tested in `src/lib/type-chart.test.ts`.
- `src/app/games/[gameKey]` — the team builder: Pokédex grid + 6-slot team + live type analysis.
- `src/app/national` — browsable reference of every supported Pokémon.
- `src/app/presets` — saved team bundles (Prisma/SQLite-backed via `/api/presets`), tracked per-browser
  via a `localStorage` id index (no accounts).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (type-checks too) |
| `npm test` | Run the Vitest suite |
| `npm run build:data` | Re-run the PokeAPI data pipeline |
| `npm run prisma:migrate` | Create/apply a Prisma migration |

## Notes & known simplifications

- **Sword & Shield** bundles the base Galar dex with the Isle of Armor and Crown Tundra DLC into one
  "complete game" tile.
- **Version-exclusive Pokémon** within a paired game (e.g. a Gold-only vs. Silver-only encounter) aren't
  distinguished — both versions' obtainable Pokémon are merged into one tile.
- **Offensive type coverage** is a same-type-move (STAB) approximation; it doesn't know individual
  movesets.
