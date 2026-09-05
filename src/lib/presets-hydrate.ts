import { loadFormsById } from "@/lib/data/loadSpecies";
import type { PresetHydrated } from "@/types/domain";

interface RawSlot {
  slotIndex: number;
  pokemonFormId: string;
}
interface RawTeam {
  id: string;
  gameKey: string;
  label: string | null;
  orderIndex: number;
  slots: RawSlot[];
}
interface RawPreset {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  teams: RawTeam[];
}

export async function hydratePreset(preset: RawPreset): Promise<PresetHydrated> {
  const formsById = await loadFormsById();
  return {
    id: preset.id,
    name: preset.name,
    createdAt: preset.createdAt.toISOString(),
    updatedAt: preset.updatedAt.toISOString(),
    teams: preset.teams
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((team) => ({
        id: team.id,
        gameKey: team.gameKey,
        label: team.label,
        orderIndex: team.orderIndex,
        slots: team.slots
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .map((slot) => ({
            slotIndex: slot.slotIndex,
            pokemonFormId: slot.pokemonFormId,
            pokemon: formsById.get(slot.pokemonFormId) ?? null,
          })),
      })),
  };
}
