import { pokeApiFetch } from "../fetchClient.js";

interface PokedexResponse {
  pokemon_entries: { entry_number: number; pokemon_species: { name: string } }[];
}

export interface PokedexEntry {
  regionalDexNumber: number;
  speciesName: string;
}

export async function fetchPokedexes(pokedexSlugs: string[]): Promise<Map<string, PokedexEntry[]>> {
  const uniqueSlugs = [...new Set(pokedexSlugs)];
  const results = await Promise.all(
    uniqueSlugs.map(async (slug) => {
      const data = await pokeApiFetch<PokedexResponse>(`/pokedex/${slug}`);
      const entries = data.pokemon_entries.map((e) => ({
        regionalDexNumber: e.entry_number,
        speciesName: e.pokemon_species.name,
      }));
      return [slug, entries] as const;
    }),
  );
  return new Map(results);
}
