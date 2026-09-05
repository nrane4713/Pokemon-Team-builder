import { describe, expect, it } from "vitest";
import {
  computeOffensiveCoverage,
  computeTeamDefensiveCoverage,
  getIncomingMultiplier,
  POKEMON_TYPES,
  type TypeChart,
} from "./type-chart";

// Minimal but complete 18x18 chart built from the standard Gen 6+ effectiveness table,
// only the rows this test file actually exercises are hand-verified against known matchups.
function buildTestChart(): TypeChart {
  const matrix = {} as TypeChart["matrix"];
  for (const attacking of POKEMON_TYPES) {
    matrix[attacking] = {} as TypeChart["matrix"][typeof attacking];
    for (const defending of POKEMON_TYPES) {
      matrix[attacking][defending] = 1;
    }
  }

  const set = (attacking: (typeof POKEMON_TYPES)[number], defending: (typeof POKEMON_TYPES)[number], value: 0 | 0.5 | 2) => {
    matrix[attacking][defending] = value;
  };

  // Electric
  set("electric", "water", 2);
  set("electric", "ground", 0);
  set("electric", "flying", 2);
  set("electric", "grass", 0.5);
  set("electric", "electric", 0.5);
  set("electric", "dragon", 0.5);

  // Ground
  set("ground", "electric", 2);
  set("ground", "flying", 0);
  set("ground", "grass", 0.5);
  set("ground", "bug", 0.5);

  // Fire
  set("fire", "grass", 2);
  set("fire", "ice", 2);
  set("fire", "bug", 2);
  set("fire", "steel", 2);
  set("fire", "water", 0.5);
  set("fire", "fire", 0.5);
  set("fire", "rock", 0.5);
  set("fire", "dragon", 0.5);

  // Water
  set("water", "fire", 2);
  set("water", "ground", 2);
  set("water", "rock", 2);
  set("water", "water", 0.5);
  set("water", "grass", 0.5);
  set("water", "dragon", 0.5);

  return { types: [...POKEMON_TYPES], matrix };
}

describe("getIncomingMultiplier", () => {
  const chart = buildTestChart();

  it("Water/Ground is immune to Electric (4x-style immunity via ground)", () => {
    expect(getIncomingMultiplier(chart, ["water", "ground"], "electric")).toBe(0);
  });

  it("Normal/Flying is immune to Ground", () => {
    expect(getIncomingMultiplier(chart, ["normal", "flying"], "ground")).toBe(0);
  });

  it("Fire/Water quad-resists Fire (0.5 * 0.5 = 0.25)", () => {
    expect(getIncomingMultiplier(chart, ["fire", "water"], "fire")).toBe(0.25);
  });

  it("single-type Grass takes 2x from Fire", () => {
    expect(getIncomingMultiplier(chart, ["grass"], "fire")).toBe(2);
  });
});

describe("computeTeamDefensiveCoverage", () => {
  const chart = buildTestChart();

  it("counts a shared 4x-equivalent weakness across the team", () => {
    const team = [
      { formId: "a", displayName: "A", types: ["grass"] as const },
      { formId: "b", displayName: "B", types: ["grass"] as const },
      { formId: "c", displayName: "C", types: ["water"] as const },
    ];
    const result = computeTeamDefensiveCoverage(chart, team as never);
    expect(result.perAttackingType.fire.weakCount).toBe(2);
    expect(result.perAttackingType.fire.resistCount).toBe(1);
  });
});

describe("computeOffensiveCoverage", () => {
  const chart = buildTestChart();

  it("finds gaps when the team's STAB types don't hit everything super-effectively", () => {
    const team = [{ formId: "a", displayName: "A", types: ["water"] as const }];
    const result = computeOffensiveCoverage(chart, team as never);
    expect(result.hitSuperEffectively.has("fire")).toBe(true);
    expect(result.hitSuperEffectively.has("ground")).toBe(true);
    expect(result.hitSuperEffectively.has("rock")).toBe(true);
    expect(result.gapTypes).toContain("grass"); // water resists into grass, doesn't hit it super-effectively
  });
});
