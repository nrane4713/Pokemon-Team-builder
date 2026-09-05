import { PokemonCard } from "./PokemonCard";
import type { PokemonForm } from "@/types/domain";

export interface PokedexGridEntry {
  pokemon: PokemonForm;
  dexNumber: number | null;
}

interface PokedexGridProps {
  entries: PokedexGridEntry[];
  selectedFormIds?: Set<string>;
  isDisabled?: (entry: PokedexGridEntry) => boolean;
  onSelect?: (entry: PokedexGridEntry) => void;
}

export function PokedexGrid({ entries, selectedFormIds, isDisabled, onSelect }: PokedexGridProps) {
  if (entries.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">No Pokémon match these filters.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {entries.map((entry) => (
        <PokemonCard
          key={entry.pokemon.id}
          pokemon={entry.pokemon}
          dexNumber={entry.dexNumber}
          selected={selectedFormIds?.has(entry.pokemon.id)}
          disabled={isDisabled?.(entry)}
          onClick={onSelect ? () => onSelect(entry) : undefined}
        />
      ))}
    </div>
  );
}
