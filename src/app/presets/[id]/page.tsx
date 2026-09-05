import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hydratePreset } from "@/lib/presets-hydrate";
import { loadGames } from "@/lib/data/loadGames";
import { PresetTeamSection } from "@/components/presets/PresetTeamSection";
import { PresetDetailActions } from "@/components/presets/PresetDetailActions";

export default async function PresetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [raw, games] = await Promise.all([
    prisma.preset.findUnique({ where: { id }, include: { teams: { include: { slots: true } } } }),
    loadGames(),
  ]);
  if (!raw) notFound();

  const preset = await hydratePreset(raw);
  const gamesByKey = new Map(games.map((g) => [g.key, g]));

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/presets" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to presets
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold">{preset.name}</h1>
        <PresetDetailActions presetId={preset.id} />
      </div>

      <div className="flex flex-col gap-4">
        {preset.teams.map((team) => (
          <PresetTeamSection key={team.id} team={team} game={gamesByKey.get(team.gameKey)} presetId={preset.id} />
        ))}
      </div>

      {(() => {
        const includedKeys = new Set(preset.teams.map((t) => t.gameKey));
        const remainingGames = games.filter((g) => !includedKeys.has(g.key));
        if (remainingGames.length === 0) return null;
        return (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">Add a team for another game</h2>
            <div className="flex flex-wrap gap-2">
              {remainingGames.map((g) => (
                <Link
                  key={g.key}
                  href={`/games/${g.key}?presetId=${preset.id}`}
                  className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  {g.displayName}
                </Link>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
