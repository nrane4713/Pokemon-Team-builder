import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  gameConfigSchema,
  gameDexEntrySchema,
  nationalDexEntrySchema,
  pokemonFormSchema,
  typeChartSchema,
  type GameConfig,
  type GameDexEntry,
  type NationalDexEntry,
  type PokemonForm,
  type TypeChart,
} from "../types.js";

const OUTPUT_DIR = path.resolve(import.meta.dirname, "../../../data/generated");

async function writeJson(relativePath: string, data: unknown): Promise<void> {
  const file = path.join(OUTPUT_DIR, relativePath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function writeOutput(params: {
  forms: PokemonForm[];
  games: GameConfig[];
  typeChart: TypeChart;
  nationalDex: NationalDexEntry[];
  gameDexes: Map<string, GameDexEntry[]>;
}): Promise<void> {
  const forms = pokemonFormSchema.array().parse(params.forms);
  const games = gameConfigSchema.array().parse(params.games);
  const typeChart = typeChartSchema.parse(params.typeChart);
  const nationalDex = nationalDexEntrySchema.array().parse(params.nationalDex);

  await writeJson("species.json", forms);
  await writeJson("games.json", games);
  await writeJson("type-chart.json", typeChart);
  await writeJson("national-dex.json", nationalDex);

  for (const [gameKey, entries] of params.gameDexes) {
    const validated = gameDexEntrySchema.array().parse(entries);
    await writeJson(`dex/${gameKey}.json`, validated);
  }

  console.log("\n--- Spot-check summary ---");
  console.log(`species.json: ${forms.length} forms`);
  console.log(`national-dex.json: ${nationalDex.length} entries (expect ~898)`);
  for (const game of games) {
    console.log(`dex/${game.key}.json: ${game.pokemonCount} entries`);
  }
}
