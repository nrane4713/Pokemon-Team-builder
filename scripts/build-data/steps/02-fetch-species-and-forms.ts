import { pokeApiFetch } from "../fetchClient.js";
import { humanizeFormName } from "../displayNames.js";
import type { BaseStats, PokemonForm, RegionalFormOverride, TypeName } from "../types.js";

const NATIONAL_DEX_CAP = 898; // last national dex number introduced by gen 8 (Sword & Shield era)

interface PokedexResponse {
  pokemon_entries: { entry_number: number; pokemon_species: { name: string; url: string } }[];
}

interface SpeciesResponse {
  name: string;
  generation: { name: string };
  pokedex_numbers: { entry_number: number; pokedex: { name: string } }[];
  varieties: { is_default: boolean; pokemon: { name: string } }[];
}

interface PokemonResponse {
  name: string;
  species: { name: string };
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
}

export interface SpeciesRecord {
  speciesName: string;
  nationalDexNumber: number;
  generation: number;
  defaultFormSlug: string;
}

const GENERATION_NAME_TO_NUMBER: Record<string, number> = {
  "generation-i": 1,
  "generation-ii": 2,
  "generation-iii": 3,
  "generation-iv": 4,
  "generation-v": 5,
  "generation-vi": 6,
  "generation-vii": 7,
  "generation-viii": 8,
};

const STAT_NAME_TO_FIELD: Record<string, keyof BaseStats> = {
  hp: "hp",
  attack: "attack",
  defense: "defense",
  "special-attack": "specialAttack",
  "special-defense": "specialDefense",
  speed: "speed",
};

export async function fetchNationalSpeciesNames(): Promise<{ entryNumber: number; speciesName: string }[]> {
  const dex = await pokeApiFetch<PokedexResponse>("/pokedex/national");
  return dex.pokemon_entries
    .filter((e) => e.entry_number <= NATIONAL_DEX_CAP)
    .map((e) => ({ entryNumber: e.entry_number, speciesName: e.pokemon_species.name }))
    .sort((a, b) => a.entryNumber - b.entryNumber);
}

export async function fetchSpeciesRecords(
  speciesNames: string[],
): Promise<Map<string, SpeciesRecord>> {
  const results = await Promise.all(
    speciesNames.map(async (name) => {
      const data = await pokeApiFetch<SpeciesResponse>(`/pokemon-species/${name}`);
      const nationalEntry = data.pokedex_numbers.find((p) => p.pokedex.name === "national");
      const defaultVariety = data.varieties.find((v) => v.is_default) ?? data.varieties[0];
      const record: SpeciesRecord = {
        speciesName: data.name,
        nationalDexNumber: nationalEntry?.entry_number ?? 0,
        generation: GENERATION_NAME_TO_NUMBER[data.generation.name] ?? 0,
        defaultFormSlug: defaultVariety.pokemon.name,
      };
      return [name, record] as const;
    }),
  );
  return new Map(results);
}

function isTypeName(name: string): name is TypeName {
  return [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
  ].includes(name);
}

export async function fetchForms(
  formSlugs: string[],
  speciesRecords: Map<string, SpeciesRecord>,
): Promise<Map<string, PokemonForm>> {
  const results = await Promise.all(
    formSlugs.map(async (formSlug) => {
      const data = await pokeApiFetch<PokemonResponse>(`/pokemon/${formSlug}`);
      const speciesRecord = speciesRecords.get(data.species.name);
      if (!speciesRecord) {
        throw new Error(`Form "${formSlug}" references unknown species "${data.species.name}"`);
      }

      const types = data.types
        .sort((a, b) => a.slot - b.slot)
        .map((t) => t.type.name)
        .filter(isTypeName);
      if (types.length === 0 || types.length > 2) {
        throw new Error(`Form "${formSlug}" resolved to invalid type count: ${JSON.stringify(types)}`);
      }

      const baseStats = {} as BaseStats;
      for (const s of data.stats) {
        const field = STAT_NAME_TO_FIELD[s.stat.name];
        if (field) baseStats[field] = s.base_stat;
      }

      const officialArtwork =
        data.sprites.other["official-artwork"].front_default ?? data.sprites.front_default;
      if (!data.sprites.front_default || !officialArtwork) {
        throw new Error(`Form "${formSlug}" is missing sprite URLs`);
      }

      const form: PokemonForm = {
        id: formSlug,
        speciesId: speciesRecord.nationalDexNumber,
        speciesName: speciesRecord.speciesName,
        formName: formSlug === speciesRecord.speciesName ? null : formSlug,
        isDefaultForm: formSlug === speciesRecord.defaultFormSlug,
        displayName: humanizeFormName(formSlug, speciesRecord.speciesName),
        nationalDexNumber: speciesRecord.nationalDexNumber,
        generationIntroduced: speciesRecord.generation,
        types: types as PokemonForm["types"],
        baseStats,
        spriteUrl: data.sprites.front_default,
        spriteShinyUrl: data.sprites.front_shiny ?? data.sprites.front_default,
        officialArtworkUrl: officialArtwork,
      };
      return [formSlug, form] as const;
    }),
  );
  return new Map(results);
}

/** Every form slug we need to fetch: each species' default variety, plus every regional-form override target. */
export function collectRequiredFormSlugs(
  speciesRecords: Map<string, SpeciesRecord>,
  overrides: RegionalFormOverride[],
): string[] {
  const slugs = new Set<string>();
  for (const record of speciesRecords.values()) {
    slugs.add(record.defaultFormSlug);
  }
  for (const override of overrides) {
    slugs.add(override.formSlug);
  }
  return [...slugs];
}
