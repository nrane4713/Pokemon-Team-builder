import type { DexSource, GameConfigManual, GameDexEntry } from "../types.js";
import type { PokedexEntry } from "./03-fetch-pokedexes.js";
import type { SpeciesRecord } from "./02-fetch-species-and-forms.js";
import { resolveFormSlug, type OverrideIndex } from "./04-apply-manual-overrides.js";

const SOURCE_ORDER: Record<DexSource, number> = { base: 0, "isle-of-armor": 1, "crown-tundra": 2 };

function deriveSource(pokedexSlug: string): DexSource {
  if (pokedexSlug === "isle-of-armor") return "isle-of-armor";
  if (pokedexSlug === "crown-tundra") return "crown-tundra";
  return "base";
}

export function buildGameDex(
  game: GameConfigManual,
  pokedexData: Map<string, PokedexEntry[]>,
  speciesRecords: Map<string, SpeciesRecord>,
  overrideIndex: OverrideIndex,
): GameDexEntry[] {
  const bySpecies = new Map<string, GameDexEntry>();

  for (const pokedexSlug of game.pokedexSlugs) {
    const entries = pokedexData.get(pokedexSlug);
    if (!entries) {
      throw new Error(`Missing fetched pokedex data for slug "${pokedexSlug}" (game "${game.key}")`);
    }
    const source = deriveSource(pokedexSlug);

    for (const entry of entries) {
      if (bySpecies.has(entry.speciesName)) continue; // first-seen wins across merged sub-dexes

      const speciesRecord = speciesRecords.get(entry.speciesName);
      if (!speciesRecord) {
        console.warn(`Skipping "${entry.speciesName}" in ${pokedexSlug}: no species record (outside gen 1-8 scope)`);
        continue;
      }

      const formId = resolveFormSlug(entry.speciesName, game.key, speciesRecord.defaultFormSlug, overrideIndex);

      bySpecies.set(entry.speciesName, {
        regionalDexNumber: entry.regionalDexNumber,
        formId,
        source,
      });
    }
  }

  return [...bySpecies.values()].sort((a, b) => {
    const sourceDiff = SOURCE_ORDER[a.source] - SOURCE_ORDER[b.source];
    if (sourceDiff !== 0) return sourceDiff;
    return (a.regionalDexNumber ?? 0) - (b.regionalDexNumber ?? 0);
  });
}
