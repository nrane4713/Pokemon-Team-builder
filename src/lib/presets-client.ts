import type { PresetHydrated } from "@/types/domain";

export interface PresetInputPayload {
  name: string;
  teams: { gameKey: string; label?: string | null; pokemonFormIds: string[] }[];
}

async function unwrap<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Request failed");
  return body;
}

export async function fetchPresetsByIds(ids: string[]): Promise<PresetHydrated[]> {
  if (ids.length === 0) return [];
  const res = await fetch(`/api/presets?ids=${ids.join(",")}`);
  const { presets } = await unwrap<{ presets: PresetHydrated[] }>(res);
  return presets;
}

export async function fetchPreset(id: string): Promise<PresetHydrated> {
  const res = await fetch(`/api/presets/${id}`);
  const { preset } = await unwrap<{ preset: PresetHydrated }>(res);
  return preset;
}

export async function createPreset(input: PresetInputPayload): Promise<PresetHydrated> {
  const res = await fetch("/api/presets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const { preset } = await unwrap<{ preset: PresetHydrated }>(res);
  return preset;
}

export async function updatePreset(id: string, input: PresetInputPayload): Promise<PresetHydrated> {
  const res = await fetch(`/api/presets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const { preset } = await unwrap<{ preset: PresetHydrated }>(res);
  return preset;
}

export async function deletePreset(id: string): Promise<void> {
  const res = await fetch(`/api/presets/${id}`, { method: "DELETE" });
  await unwrap(res);
}
