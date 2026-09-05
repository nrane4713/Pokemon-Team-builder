import type { GameDexEntry } from "@/types/domain";
import { readGeneratedJson } from "./readGeneratedJson";

export async function loadGameDex(gameKey: string): Promise<GameDexEntry[]> {
  return readGeneratedJson<GameDexEntry[]>(`dex/${gameKey}.json`);
}
