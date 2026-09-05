import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TypeName } from "@/types/domain";

export const MAX_TEAM_SIZE = 6;

export interface TeamSlotMember {
  formId: string;
  speciesId: number;
  displayName: string;
  types: TypeName[];
  spriteUrl: string;
}

interface TeamBuilderState {
  gameKey: string | null;
  presetId: string | null;
  presetTeamId: string | null;
  slots: TeamSlotMember[];
  setGame: (gameKey: string) => void;
  addPokemon: (member: TeamSlotMember) => { ok: boolean; reason?: string };
  removePokemon: (formId: string) => void;
  clearTeam: () => void;
  loadTeam: (params: {
    gameKey: string;
    slots: TeamSlotMember[];
    presetId?: string | null;
    presetTeamId?: string | null;
  }) => void;
}

export const useTeamBuilderStore = create<TeamBuilderState>()(
  persist(
    (set, get) => ({
      gameKey: null,
      presetId: null,
      presetTeamId: null,
      slots: [],

      setGame: (gameKey) => {
        if (get().gameKey === gameKey) return;
        set({ gameKey, slots: [], presetId: null, presetTeamId: null });
      },

      addPokemon: (member) => {
        const { slots } = get();
        if (slots.length >= MAX_TEAM_SIZE) {
          return { ok: false, reason: "Team is full (max 6)." };
        }
        if (slots.some((s) => s.speciesId === member.speciesId)) {
          return { ok: false, reason: "That Pokémon is already on the team." };
        }
        set({ slots: [...slots, member] });
        return { ok: true };
      },

      removePokemon: (formId) => {
        set({ slots: get().slots.filter((s) => s.formId !== formId) });
      },

      clearTeam: () => set({ slots: [], presetId: null, presetTeamId: null }),

      loadTeam: ({ gameKey, slots, presetId = null, presetTeamId = null }) => {
        set({ gameKey, slots, presetId, presetTeamId });
      },
    }),
    { name: "pokemon-team-builder:draft" },
  ),
);
