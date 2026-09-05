"use client";

import { useMemo, useState } from "react";
import { PokedexFilters, type SortOrder } from "./PokedexFilters";
import { PokedexGrid, type PokedexGridEntry } from "./PokedexGrid";
import type { TypeName } from "@/types/domain";

interface PokedexBrowserProps {
  entries: PokedexGridEntry[];
  selectedFormIds?: Set<string>;
  isDisabled?: (entry: PokedexGridEntry) => boolean;
  onSelect?: (entry: PokedexGridEntry) => void;
}

export function PokedexBrowser({ entries, selectedFormIds, isDisabled, onSelect }: PokedexBrowserProps) {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<TypeName>>(new Set());
  const [sortOrder, setSortOrder] = useState<SortOrder>("dex");

  const toggleType = (type: TypeName) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = entries.filter((e) => {
      if (q && !e.pokemon.displayName.toLowerCase().includes(q)) return false;
      if (activeTypes.size > 0 && !e.pokemon.types.some((t) => activeTypes.has(t))) return false;
      return true;
    });
    result = [...result].sort((a, b) =>
      sortOrder === "name"
        ? a.pokemon.displayName.localeCompare(b.pokemon.displayName)
        : (a.dexNumber ?? 0) - (b.dexNumber ?? 0),
    );
    return result;
  }, [entries, query, activeTypes, sortOrder]);

  return (
    <div className="flex flex-col gap-4">
      <PokedexFilters
        query={query}
        onQueryChange={setQuery}
        activeTypes={activeTypes}
        onToggleType={toggleType}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />
      <PokedexGrid entries={filtered} selectedFormIds={selectedFormIds} isDisabled={isDisabled} onSelect={onSelect} />
    </div>
  );
}
