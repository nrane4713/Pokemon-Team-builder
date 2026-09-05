import { loadGames } from "@/lib/data/loadGames";
import { loadFormsById } from "@/lib/data/loadSpecies";
import type { PresetInput } from "./preset";

export class InvalidReferenceError extends Error {}

/** Validates that every gameKey/pokemonFormId in a preset payload refers to real static data. */
export async function assertValidPresetInput(input: PresetInput): Promise<void> {
  const [games, formsById] = await Promise.all([loadGames(), loadFormsById()]);
  const gameKeys = new Set(games.map((g) => g.key));

  for (const team of input.teams) {
    if (!gameKeys.has(team.gameKey)) {
      throw new InvalidReferenceError(`Unknown game: ${team.gameKey}`);
    }
    for (const formId of team.pokemonFormIds) {
      if (!formsById.has(formId)) {
        throw new InvalidReferenceError(`Unknown Pokémon form: ${formId}`);
      }
    }
  }
}
