import type { GameConfig } from "@/types/domain";
import { readGeneratedJson } from "./readGeneratedJson";

export async function loadGames(): Promise<GameConfig[]> {
  return readGeneratedJson<GameConfig[]>("games.json");
}

export async function loadGame(gameKey: string): Promise<GameConfig | undefined> {
  const games = await loadGames();
  return games.find((g) => g.key === gameKey);
}
