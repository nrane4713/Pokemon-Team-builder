import type { NationalDexEntry } from "@/types/domain";
import { readGeneratedJson } from "./readGeneratedJson";

export async function loadNationalDex(): Promise<NationalDexEntry[]> {
  return readGeneratedJson<NationalDexEntry[]>("national-dex.json");
}
