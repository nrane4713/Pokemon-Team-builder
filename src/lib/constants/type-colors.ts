import type { TypeName } from "@/types/domain";

/** Canonical per-type accent color + a text color chosen for contrast on it. Reused everywhere a type renders. */
export const TYPE_COLORS: Record<TypeName, { bg: string; text: string }> = {
  normal: { bg: "#A8A77A", text: "#1c1c17" },
  fire: { bg: "#EE8130", text: "#2b1200" },
  water: { bg: "#6390F0", text: "#04123f" },
  electric: { bg: "#F7D02C", text: "#2b2200" },
  grass: { bg: "#7AC74C", text: "#0e2405" },
  ice: { bg: "#96D9D6", text: "#062120" },
  fighting: { bg: "#C22E28", text: "#ffe6e4" },
  poison: { bg: "#A33EA1", text: "#fce9fc" },
  ground: { bg: "#E2BF65", text: "#2b2000" },
  flying: { bg: "#A98FF3", text: "#150a3d" },
  psychic: { bg: "#F95587", text: "#390014" },
  bug: { bg: "#A6B91A", text: "#1c2300" },
  rock: { bg: "#B6A136", text: "#241f00" },
  ghost: { bg: "#735797", text: "#eee6fb" },
  dragon: { bg: "#6F35FC", text: "#ede4ff" },
  dark: { bg: "#705746", text: "#f2e9e2" },
  steel: { bg: "#B7B7CE", text: "#17172a" },
  fairy: { bg: "#D685AD", text: "#3a0821" },
};

export function getTypeColor(type: TypeName) {
  return TYPE_COLORS[type];
}
