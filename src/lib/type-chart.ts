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
export type Multiplier = 0 | 0.25 | 0.5 | 1 | 2 | 4;

export interface TypeChart {
  types: TypeName[];
  matrix: Record<TypeName, Record<TypeName, 0 | 0.5 | 1 | 2>>;
}

export interface TeamMember {
  formId: string;
  displayName: string;
  types: TypeName[];
}

/** Incoming multiplier a defender of `defendingTypes` takes from a hit of `attackingType`. */
export function getIncomingMultiplier(
  chart: TypeChart,
  defendingTypes: TypeName[],
  attackingType: TypeName,
): Multiplier {
  const product = defendingTypes.reduce((acc, t) => acc * chart.matrix[attackingType][t], 1);
  return product as Multiplier;
}

export interface DefensiveBreakdown {
  perAttackingType: Record<
    TypeName,
    {
      weakCount: number;
      resistCount: number;
      immuneCount: number;
      neutralCount: number;
      membersByMultiplier: Partial<Record<Multiplier, string[]>>; // formId[]
    }
  >;
}

/** Aggregates weaknesses/resistances/immunities across a team, one row per attacking type. */
export function computeTeamDefensiveCoverage(chart: TypeChart, team: TeamMember[]): DefensiveBreakdown {
  const perAttackingType = {} as DefensiveBreakdown["perAttackingType"];

  for (const attackingType of POKEMON_TYPES) {
    const membersByMultiplier: Partial<Record<Multiplier, string[]>> = {};
    let weakCount = 0;
    let resistCount = 0;
    let immuneCount = 0;
    let neutralCount = 0;

    for (const member of team) {
      const multiplier = getIncomingMultiplier(chart, member.types, attackingType);
      (membersByMultiplier[multiplier] ??= []).push(member.formId);
      if (multiplier > 1) weakCount++;
      else if (multiplier === 1) neutralCount++;
      else if (multiplier === 0) immuneCount++;
      else resistCount++;
    }

    perAttackingType[attackingType] = { weakCount, resistCount, immuneCount, neutralCount, membersByMultiplier };
  }

  return { perAttackingType };
}

export interface OffensiveCoverage {
  /** Defending types that at least one teammate's STAB hits super-effectively. */
  hitSuperEffectively: Set<TypeName>;
  /** Defending types nothing on the team's STAB hits super-effectively — coverage gaps. */
  gapTypes: TypeName[];
}

/** STAB-only approximation: which types the team would hit super-effectively using same-type moves. */
export function computeOffensiveCoverage(chart: TypeChart, team: TeamMember[]): OffensiveCoverage {
  const stabTypes = new Set(team.flatMap((m) => m.types));
  const hitSuperEffectively = new Set<TypeName>();

  for (const defendingType of POKEMON_TYPES) {
    for (const attackingType of stabTypes) {
      if (chart.matrix[attackingType][defendingType] === 2) {
        hitSuperEffectively.add(defendingType);
        break;
      }
    }
  }

  const gapTypes = POKEMON_TYPES.filter((t) => !hitSuperEffectively.has(t));
  return { hitSuperEffectively, gapTypes };
}
