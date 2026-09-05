const STORAGE_KEY = "pokemon-team-builder:preset-ids";

export function getSavedPresetIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function addSavedPresetId(id: string): void {
  if (typeof window === "undefined") return;
  const current = getSavedPresetIds();
  if (current.includes(id)) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
}

export function removeSavedPresetId(id: string): void {
  if (typeof window === "undefined") return;
  const current = getSavedPresetIds();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current.filter((x) => x !== id)));
}
