import type { PokemonForm } from "@/types/domain";
import { readGeneratedJson } from "./readGeneratedJson";

let formsByIdCache: Map<string, PokemonForm> | null = null;

export async function loadAllForms(): Promise<PokemonForm[]> {
  return readGeneratedJson<PokemonForm[]>("species.json");
}

export async function loadFormsById(): Promise<Map<string, PokemonForm>> {
  if (formsByIdCache) return formsByIdCache;
  const forms = await loadAllForms();
  formsByIdCache = new Map(forms.map((f) => [f.id, f]));
  return formsByIdCache;
}

export async function loadForm(formId: string): Promise<PokemonForm | undefined> {
  const byId = await loadFormsById();
  return byId.get(formId);
}
