import { POKEMON_TYPES, type TypeChart, type TypeName } from "../types.js";
import type { TypeDamageRelations } from "./01-fetch-types.js";

export function buildTypeChart(relations: TypeDamageRelations): TypeChart {
  const matrix: TypeChart["matrix"] = {} as TypeChart["matrix"];

  for (const attacking of POKEMON_TYPES) {
    const row: Record<TypeName, 0 | 0.5 | 1 | 2> = {} as Record<TypeName, 0 | 0.5 | 1 | 2>;
    for (const defending of POKEMON_TYPES) {
      row[defending] = 1;
    }
    for (const defending of relations[attacking].doubleDamageTo) {
      row[defending] = 2;
    }
    for (const defending of relations[attacking].halfDamageTo) {
      row[defending] = 0.5;
    }
    for (const defending of relations[attacking].noDamageTo) {
      row[defending] = 0;
    }
    matrix[attacking] = row;
  }

  return { types: [...POKEMON_TYPES], matrix };
}
