import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { loadGame } from "@/lib/data/loadGames";
import { loadGameDex } from "@/lib/data/loadDex";
import { loadFormsById } from "@/lib/data/loadSpecies";
import { loadTypeChart } from "@/lib/data/loadTypeChart";
import { prisma } from "@/lib/prisma";
import { GameBuilder } from "@/components/games/GameBuilder";
import type { TeamSlotMember } from "@/store/useTeamBuilderStore";

interface PageProps {
  params: Promise<{ gameKey: string }>;
  searchParams: Promise<{ presetId?: string; teamId?: string }>;
}

export default async function GamePage({ params, searchParams }: PageProps) {
  const { gameKey } = await params;
  const { presetId, teamId } = await searchParams;

  const [game, dex, formsById, typeChart] = await Promise.all([
    loadGame(gameKey),
    loadGameDex(gameKey).catch(() => null),
    loadFormsById(),
    loadTypeChart(),
  ]);

  if (!game || !dex) notFound();

  const entries = dex
    .map((e) => ({ pokemon: formsById.get(e.formId), dexNumber: e.regionalDexNumber }))
    .filter((e): e is { pokemon: NonNullable<typeof e.pokemon>; dexNumber: number | null } => e.pokemon != null);

  let initialSlots: TeamSlotMember[] | undefined;
  if (presetId && teamId) {
    const team = await prisma.presetTeam.findUnique({ where: { id: teamId }, include: { slots: true } });
    if (team && team.presetId === presetId && team.gameKey === gameKey) {
      initialSlots = team.slots
        .sort((a, b) => a.slotIndex - b.slotIndex)
        .map((s) => formsById.get(s.pokemonFormId))
        .filter((p): p is NonNullable<typeof p> => p != null)
        .map((p) => ({ formId: p.id, speciesId: p.speciesId, displayName: p.displayName, types: p.types, spriteUrl: p.spriteUrl }));
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
      <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back home
      </Link>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Gen {game.generation} &middot; {game.region}
        </p>
        <h1 className="font-heading text-3xl font-bold">{game.displayName}</h1>
      </div>

      <GameBuilder
        game={game}
        entries={entries}
        typeChart={typeChart}
        initialSlots={initialSlots}
        initialPresetId={presetId ?? null}
        initialPresetTeamId={teamId ?? null}
      />
    </div>
  );
}
