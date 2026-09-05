const SPECIES_NAME_OVERRIDES: Record<string, string> = {
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "mr-mime": "Mr. Mime",
  "mr-rime": "Mr. Rime",
  "mime-jr": "Mime Jr.",
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "tapu-koko": "Tapu Koko",
  "tapu-lele": "Tapu Lele",
  "tapu-bulu": "Tapu Bulu",
  "tapu-fini": "Tapu Fini",
  flabebe: "Flabébé",
};

const REGION_PREFIXES: { suffix: string; prefix: string }[] = [
  { suffix: "-alola", prefix: "Alolan" },
  { suffix: "-galar", prefix: "Galarian" },
  { suffix: "-galar-standard", prefix: "Galarian" },
  { suffix: "-galar-zen", prefix: "Galarian" },
];

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function humanizeSpeciesName(speciesName: string): string {
  return SPECIES_NAME_OVERRIDES[speciesName] ?? titleCaseSlug(speciesName);
}

/** Builds a display name for a specific form, e.g. "meowth-galar" + species "meowth" -> "Galarian Meowth". */
export function humanizeFormName(formSlug: string, speciesName: string): string {
  const baseDisplay = humanizeSpeciesName(speciesName);
  const region = REGION_PREFIXES.find((r) => formSlug.endsWith(r.suffix));
  if (region) {
    return `${region.prefix} ${baseDisplay}`;
  }
  if (formSlug === speciesName) {
    return baseDisplay;
  }
  return titleCaseSlug(formSlug);
}
