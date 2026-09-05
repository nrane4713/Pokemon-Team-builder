"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PresetHydrated } from "@/types/domain";

export function PresetCard({ preset, onDelete }: { preset: PresetHydrated; onDelete: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/presets/${preset.id}`} className="font-heading text-lg font-semibold hover:underline">
            {preset.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {preset.teams.length} game{preset.teams.length === 1 ? "" : "s"} &middot; updated{" "}
            {new Date(preset.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(preset.id)}
          aria-label={`Delete ${preset.name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {preset.teams.map((team) => (
          <div key={team.id} className="flex items-center gap-1 rounded-md border border-border/60 px-2 py-1">
            {team.slots.slice(0, 6).map((slot) =>
              slot.pokemon ? (
                <Image
                  key={slot.slotIndex}
                  src={slot.pokemon.spriteUrl}
                  alt={slot.pokemon.displayName}
                  width={24}
                  height={24}
                  style={{ imageRendering: "pixelated" }}
                  unoptimized
                />
              ) : null,
            )}
            <span className="ml-1 text-xs text-muted-foreground">{team.gameKey}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
