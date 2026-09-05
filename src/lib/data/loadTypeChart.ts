import type { TypeChart } from "@/types/domain";
import { readGeneratedJson } from "./readGeneratedJson";

export async function loadTypeChart(): Promise<TypeChart> {
  return readGeneratedJson<TypeChart>("type-chart.json");
}
