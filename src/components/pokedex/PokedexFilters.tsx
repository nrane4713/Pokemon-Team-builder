"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getTypeColor } from "@/lib/constants/type-colors";
import { cn } from "@/lib/utils";
import { POKEMON_TYPES, type TypeName } from "@/types/domain";

export type SortOrder = "dex" | "name";

interface PokedexFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeTypes: Set<TypeName>;
  onToggleType: (type: TypeName) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

export function PokedexFilters({
  query,
  onQueryChange,
  activeTypes,
  onToggleType,
  sortOrder,
  onSortOrderChange,
}: PokedexFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name..."
            className="pl-9"
          />
        </div>
        <div className="flex rounded-lg border border-border p-0.5 text-sm">
          {(["dex", "name"] as const).map((order) => (
            <button
              key={order}
              type="button"
              onClick={() => onSortOrderChange(order)}
              className={cn(
                "rounded-md px-3 py-1 capitalize transition-colors",
                sortOrder === order ? "bg-accent font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {order === "dex" ? "#" : "A-Z"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {POKEMON_TYPES.map((type) => {
          const active = activeTypes.has(type);
          const { bg, text } = getTypeColor(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggleType(type)}
              className="rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide transition-opacity"
              style={{
                backgroundColor: active ? bg : `${bg}30`,
                color: active ? text : "var(--muted-foreground)",
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
