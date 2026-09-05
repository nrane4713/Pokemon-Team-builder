import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { TypeBadge } from "@/components/pokedex/TypeBadge";
import type { GameConfig, PresetTeamHydrated } from "@/types/domain";

export function PresetTeamSection({
  team,
  game,
  presetId,
}: {
  team: PresetTeamHydrated;
  game: GameConfig | undefined;
  presetId: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold">{game?.displayName ?? team.gameKey}</h3>
          {team.label && <p className="text-xs text-muted-foreground">{team.label}</p>}
        </div>
        <Link
          href={`/games/${team.gameKey}?presetId=${presetId}&teamId=${team.id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3.5" />
          Edit
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {team.slots.map((slot) =>
          slot.pokemon ? (
            <div key={slot.slotIndex} className="flex flex-col items-center gap-1 rounded-md border border-border/60 p-2 text-center">
              <Image
                src={slot.pokemon.spriteUrl}
                alt={slot.pokemon.displayName}
                width={40}
                height={40}
                style={{ imageRendering: "pixelated" }}
                unoptimized
              />
              <span className="line-clamp-1 text-xs font-medium">{slot.pokemon.displayName}</span>
              <div className="flex gap-1">
                {slot.pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} className="px-1.5 py-0 text-[9px]" />
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
