import type { NationalDexEntry } from "../types.js";
import type { SpeciesRecord } from "./02-fetch-species-and-forms.js";

export function buildNationalDex(speciesRecords: Map<string, SpeciesRecord>): NationalDexEntry[] {
  return [...speciesRecords.values()]
    .map((record) => ({
      nationalDexNumber: record.nationalDexNumber,
      formId: record.defaultFormSlug,
    }))
    .sort((a, b) => a.nationalDexNumber - b.nationalDexNumber);
}
