import { z } from "zod";

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

export const typeNameSchema = z.enum(POKEMON_TYPES);
export type TypeName = z.infer<typeof typeNameSchema>;

export const baseStatsSchema = z.object({
  hp: z.number().int().positive(),
  attack: z.number().int().positive(),
  defense: z.number().int().positive(),
  specialAttack: z.number().int().positive(),
  specialDefense: z.number().int().positive(),
  speed: z.number().int().positive(),
});
export type BaseStats = z.infer<typeof baseStatsSchema>;

export const pokemonFormSchema = z.object({
  id: z.string(),
  speciesId: z.number().int().positive(),
  speciesName: z.string(),
  formName: z.string().nullable(),
  isDefaultForm: z.boolean(),
  displayName: z.string(),
  nationalDexNumber: z.number().int().positive(),
  generationIntroduced: z.number().int().min(1).max(8),
  types: z.array(typeNameSchema).min(1).max(2),
  baseStats: baseStatsSchema,
  spriteUrl: z.string().url(),
  spriteShinyUrl: z.string().url(),
  officialArtworkUrl: z.string().url(),
});
export type PokemonForm = z.infer<typeof pokemonFormSchema>;

export const dexSourceSchema = z.enum(["base", "isle-of-armor", "crown-tundra"]);
export type DexSource = z.infer<typeof dexSourceSchema>;

export const gameDexEntrySchema = z.object({
  regionalDexNumber: z.number().int().min(0).nullable(),
  formId: z.string(),
  source: dexSourceSchema,
});
export type GameDexEntry = z.infer<typeof gameDexEntrySchema>;

export const nationalDexEntrySchema = z.object({
  nationalDexNumber: z.number().int().positive(),
  formId: z.string(),
});
export type NationalDexEntry = z.infer<typeof nationalDexEntrySchema>;

export const gameConfigManualSchema = z.object({
  key: z.string(),
  displayName: z.string(),
  generation: z.number().int().min(1).max(8),
  region: z.string(),
  releaseYear: z.number().int(),
  versionGroupSlugs: z.array(z.string()).min(1),
  pokedexSlugs: z.array(z.string()).min(1),
  accentColor: z.string(),
  accentColorSecondary: z.string(),
});
export type GameConfigManual = z.infer<typeof gameConfigManualSchema>;

export const gameConfigSchema = gameConfigManualSchema.extend({
  pokemonCount: z.number().int().positive(),
});
export type GameConfig = z.infer<typeof gameConfigSchema>;

export const typeChartSchema = z.object({
  types: z.array(typeNameSchema),
  matrix: z.record(
    typeNameSchema,
    z.record(typeNameSchema, z.union([z.literal(0), z.literal(0.5), z.literal(1), z.literal(2)])),
  ),
});
export type TypeChart = z.infer<typeof typeChartSchema>;

export const regionalFormOverrideSchema = z.object({
  speciesName: z.string(),
  gameKey: z.string(),
  formSlug: z.string(),
});
export type RegionalFormOverride = z.infer<typeof regionalFormOverrideSchema>;
