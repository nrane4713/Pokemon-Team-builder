import { pokeApiFetch } from "../fetchClient.js";
import { POKEMON_TYPES, type TypeName } from "../types.js";

interface PokeApiTypeResponse {
  name: string;
  damage_relations: {
    double_damage_to: { name: string }[];
    double_damage_from: { name: string }[];
    half_damage_to: { name: string }[];
    half_damage_from: { name: string }[];
    no_damage_to: { name: string }[];
    no_damage_from: { name: string }[];
  };
}

export type TypeDamageRelations = Record<
  TypeName,
  {
    doubleDamageTo: TypeName[];
    halfDamageTo: TypeName[];
    noDamageTo: TypeName[];
  }
>;

function isPokemonType(name: string): name is TypeName {
  return (POKEMON_TYPES as readonly string[]).includes(name);
}

export async function fetchAllTypes(): Promise<TypeDamageRelations> {
  const entries = await Promise.all(
    POKEMON_TYPES.map(async (typeName) => {
      const data = await pokeApiFetch<PokeApiTypeResponse>(`/type/${typeName}`);
      return [
        typeName,
        {
          doubleDamageTo: data.damage_relations.double_damage_to.map((t) => t.name).filter(isPokemonType),
          halfDamageTo: data.damage_relations.half_damage_to.map((t) => t.name).filter(isPokemonType),
          noDamageTo: data.damage_relations.no_damage_to.map((t) => t.name).filter(isPokemonType),
        },
      ] as const;
    }),
  );
  return Object.fromEntries(entries) as TypeDamageRelations;
}
