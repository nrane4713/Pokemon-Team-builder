import type { RegionalFormOverride } from "../types.js";

export type OverrideIndex = Map<string, string>; // `${speciesName}::${gameKey}` -> formSlug

export function buildOverrideIndex(overrides: RegionalFormOverride[]): OverrideIndex {
  const index: OverrideIndex = new Map();
  for (const o of overrides) {
    index.set(`${o.speciesName}::${o.gameKey}`, o.formSlug);
  }
  return index;
}

export function resolveFormSlug(
  speciesName: string,
  gameKey: string,
  defaultFormSlug: string,
  overrideIndex: OverrideIndex,
): string {
  return overrideIndex.get(`${speciesName}::${gameKey}`) ?? defaultFormSlug;
}
