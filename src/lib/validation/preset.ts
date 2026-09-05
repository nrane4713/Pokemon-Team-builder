import { z } from "zod";

export const presetTeamInputSchema = z.object({
  gameKey: z.string().min(1),
  label: z.string().trim().max(60).optional().nullable(),
  pokemonFormIds: z.array(z.string().min(1)).min(1).max(6),
});

export const presetInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  teams: z.array(presetTeamInputSchema).min(1),
});

export type PresetInput = z.infer<typeof presetInputSchema>;
