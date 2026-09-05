import { readFile } from "node:fs/promises";
import path from "node:path";
import { gameConfigManualSchema, regionalFormOverrideSchema, type GameConfig } from "./types.js";
import { fetchAllTypes } from "./steps/01-fetch-types.js";
import {
  collectRequiredFormSlugs,
  fetchForms,
  fetchNationalSpeciesNames,
  fetchSpeciesRecords,
} from "./steps/02-fetch-species-and-forms.js";
import { fetchPokedexes } from "./steps/03-fetch-pokedexes.js";
import { buildOverrideIndex } from "./steps/04-apply-manual-overrides.js";
import { buildTypeChart } from "./steps/05-build-type-chart.js";
import { buildNationalDex } from "./steps/06-build-national-dex.js";
import { buildGameDex } from "./steps/07-build-game-dexes.js";
import { writeOutput } from "./steps/08-write-output.js";
import { getFetchStats } from "./fetchClient.js";

const MANUAL_DIR = path.resolve(import.meta.dirname, "../../data/manual");

async function loadManualData() {
  const gamesRaw = JSON.parse(await readFile(path.join(MANUAL_DIR, "games.json"), "utf-8"));
  const overridesRaw = JSON.parse(
    await readFile(path.join(MANUAL_DIR, "regional-form-overrides.json"), "utf-8"),
  );
  const games = gameConfigManualSchema.array().parse(gamesRaw);
  const overrides = regionalFormOverrideSchema.array().parse(overridesRaw);
  return { games, overrides };
}

async function main() {
  console.log("Loading manual config...");
  const { games, overrides } = await loadManualData();

  console.log("Step 1/8: fetching type damage relations...");
  const typeRelations = await fetchAllTypes();

  console.log("Step 2/8: fetching national dex species list...");
  const nationalList = await fetchNationalSpeciesNames();
  console.log(`  found ${nationalList.length} species (national dex #1-898)`);

  console.log("Step 2/8: fetching per-species metadata...");
  const speciesRecords = await fetchSpeciesRecords(nationalList.map((e) => e.speciesName));

  console.log("Step 2/8: resolving required form slugs and fetching them...");
  const requiredFormSlugs = collectRequiredFormSlugs(speciesRecords, overrides);
  console.log(`  ${requiredFormSlugs.length} forms to fetch`);
  const forms = await fetchForms(requiredFormSlugs, speciesRecords);

  console.log("Step 3/8: fetching regional pokedexes...");
  const allPokedexSlugs = games.flatMap((g) => g.pokedexSlugs);
  const pokedexData = await fetchPokedexes(allPokedexSlugs);

  console.log("Step 4/8: building override index...");
  const overrideIndex = buildOverrideIndex(overrides);

  console.log("Step 5/8: building type chart...");
  const typeChart = buildTypeChart(typeRelations);

  console.log("Step 6/8: building national dex...");
  const nationalDex = buildNationalDex(speciesRecords);

  console.log("Step 7/8: building per-game dexes...");
  const gameDexes = new Map<string, ReturnType<typeof buildGameDex>>();
  for (const game of games) {
    gameDexes.set(game.key, buildGameDex(game, pokedexData, speciesRecords, overrideIndex));
  }

  const gamesWithCounts: GameConfig[] = games.map((g) => ({
    ...g,
    pokemonCount: gameDexes.get(g.key)?.length ?? 0,
  }));

  console.log("Step 8/8: validating and writing output...");
  await writeOutput({
    forms: [...forms.values()],
    games: gamesWithCounts,
    typeChart,
    nationalDex,
    gameDexes,
  });

  const stats = getFetchStats();
  console.log(`\nDone. ${stats.requestCount} live requests, ${stats.cacheHitCount} cache hits.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
