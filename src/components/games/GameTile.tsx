import Link from "next/link";
import type { GameConfig } from "@/types/domain";

export function GameTile({ game }: { game: GameConfig }) {
  return (
    <Link
      href={`/games/${game.key}`}
      className="group relative flex h-36 flex-col justify-end overflow-hidden rounded-xl border border-border/50 p-4 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundImage: `linear-gradient(135deg, ${game.accentColor} 0%, ${game.accentColor} 45%, ${game.accentColorSecondary} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/25 transition-colors duration-200 group-hover:bg-black/10" />
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-wide text-white/80">
          Gen {game.generation} &middot; {game.region}
        </p>
        <h3 className="font-heading text-lg font-semibold text-white drop-shadow-sm">{game.displayName}</h3>
        <p className="text-xs text-white/70">{game.pokemonCount} Pokémon</p>
      </div>
    </Link>
  );
}
