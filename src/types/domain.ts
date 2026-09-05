export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type TypeName = (typeof POKEMON_TYPES)[number];

export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface PokemonForm {
  id: string;
  speciesId: number;
  speciesName: string;
  formName: string | null;
  isDefaultForm: boolean;
  displayName: string;
  nationalDexNumber: number;
  generationIntroduced: number;
  types: TypeName[];
  baseStats: BaseStats;
  spriteUrl: string;
  spriteShinyUrl: string;
  officialArtworkUrl: string;
}

export type DexSource = "base" | "isle-of-armor" | "crown-tundra";

export interface GameDexEntry {
  regionalDexNumber: number | null;
  formId: string;
  source: DexSource;
}

export interface NationalDexEntry {
  nationalDexNumber: number;
  formId: string;
}

export interface GameConfig {
  key: string;
  displayName: string;
  generation: number;
  region: string;
  releaseYear: number;
  versionGroupSlugs: string[];
  pokedexSlugs: string[];
  accentColor: string;
  accentColorSecondary: string;
  pokemonCount: number;
}

export interface TypeChart {
  types: TypeName[];
  matrix: Record<TypeName, Record<TypeName, 0 | 0.5 | 1 | 2>>;
}

export interface Preset {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  teams: PresetTeam[];
}

export interface PresetTeam {
  id: string;
  gameKey: string;
  label: string | null;
  orderIndex: number;
  slots: PresetSlot[];
}

export interface PresetSlot {
  slotIndex: number;
  pokemonFormId: string;
}

/** A preset team's slots hydrated with display data, as returned by the API. */
export interface PresetTeamHydrated extends Omit<PresetTeam, "slots"> {
  slots: (PresetSlot & { pokemon: PokemonForm | null })[];
}

export interface PresetHydrated extends Omit<Preset, "teams"> {
  teams: PresetTeamHydrated[];
}
