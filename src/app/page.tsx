import Link from "next/link";
import { BookMarked, FolderHeart } from "lucide-react";
import { loadGames } from "@/lib/data/loadGames";
import { GameTile } from "@/components/games/GameTile";

export default async function HomePage() {
  const games = await loadGames();
  const byGeneration = new Map<number, typeof games>();
  for (const game of games) {
    const list = byGeneration.get(game.generation) ?? [];
    list.push(game);
    byGeneration.set(game.generation, list);
  }
  const generations = [...byGeneration.keys()].sort((a, b) => a - b);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">Pokémon Team Builder</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Pick a game to build a team from exactly what&apos;s obtainable in it, then check your team&apos;s type
            matchups.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/national"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <BookMarked className="size-4" />
            National Dex
          </Link>
          <Link
            href="/presets"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <FolderHeart className="size-4" />
            My Presets
          </Link>
        </div>
      </header>

      {generations.map((gen) => (
        <section key={gen} className="mb-10">
          <h2 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Generation {gen}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byGeneration.get(gen)!.map((game) => (
              <GameTile key={game.key} game={game} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
