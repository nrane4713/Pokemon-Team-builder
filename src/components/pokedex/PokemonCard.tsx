import Image from "next/image";
import { getTypeColor } from "@/lib/constants/type-colors";
import { cn } from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";
import type { PokemonForm } from "@/types/domain";

interface PokemonCardProps {
  pokemon: PokemonForm;
  dexNumber?: number | null;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function PokemonCard({ pokemon, dexNumber, selected, disabled, onClick }: PokemonCardProps) {
  const primaryColor = getTypeColor(pokemon.types[0]).bg;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        "group relative flex flex-col items-center rounded-lg border p-3 text-center transition-all duration-150",
        selected
          ? "border-primary ring-2 ring-primary"
          : "border-border/60 hover:-translate-y-0.5 hover:border-border hover:shadow-md",
        disabled && !selected && "cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none",
      )}
    >
      <div
        className="relative mb-1 flex size-20 items-center justify-center rounded-full"
        style={{
          backgroundImage: `radial-gradient(circle, ${primaryColor}55 0%, transparent 75%)`,
        }}
      >
        <Image
          src={pokemon.spriteUrl}
          alt={pokemon.displayName}
          width={72}
          height={72}
          className="relative"
          style={{ imageRendering: "pixelated" }}
          unoptimized
        />
      </div>
      {dexNumber != null && (
        <span className="text-[11px] tabular-nums text-muted-foreground">#{String(dexNumber).padStart(3, "0")}</span>
      )}
      <span className="text-sm font-medium leading-tight">{pokemon.displayName}</span>
      <div className="mt-1 flex gap-1">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </button>
  );
}
