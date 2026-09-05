"use client";

import { useEffect, useState } from "react";
import { PokedexBrowser } from "@/components/pokedex/PokedexBrowser";
import type { PokedexGridEntry } from "@/components/pokedex/PokedexGrid";
import { TeamSlotPanel } from "@/components/team/TeamSlotPanel";
import { DefensiveCoveragePanel } from "@/components/analysis/DefensiveCoveragePanel";
import { OffensiveCoveragePanel } from "@/components/analysis/OffensiveCoveragePanel";
import { SavePresetDialog } from "@/components/presets/SavePresetDialog";
import { Button } from "@/components/ui/button";
import { useTeamBuilderStore, type TeamSlotMember } from "@/store/useTeamBuilderStore";
import type { GameConfig, TypeChart } from "@/types/domain";

interface GameBuilderProps {
  game: GameConfig;
  entries: PokedexGridEntry[];
  typeChart: TypeChart;
  initialSlots?: TeamSlotMember[];
  initialPresetId: string | null;
  initialPresetTeamId: string | null;
}

export function GameBuilder({ game, entries, typeChart, initialSlots, initialPresetId, initialPresetTeamId }: GameBuilderProps) {
  const gameKey = useTeamBuilderStore((s) => s.gameKey);
  const slots = useTeamBuilderStore((s) => s.slots);
  const presetId = useTeamBuilderStore((s) => s.presetId);
  const setGame = useTeamBuilderStore((s) => s.setGame);
  const loadTeam = useTeamBuilderStore((s) => s.loadTeam);
  const addPokemon = useTeamBuilderStore((s) => s.addPokemon);
  const removePokemon = useTeamBuilderStore((s) => s.removePokemon);
  const clearTeam = useTeamBuilderStore((s) => s.clearTeam);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (initialSlots) {
      loadTeam({ gameKey: game.key, slots: initialSlots, presetId: initialPresetId, presetTeamId: initialPresetTeamId });
    } else if (initialPresetId) {
      loadTeam({ gameKey: game.key, slots: [], presetId: initialPresetId, presetTeamId: null });
    } else {
      setGame(game.key);
    }
    // Only run once per game/preset-team combination.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.key, initialPresetTeamId, initialPresetId]);

  const activeSlots = gameKey === game.key ? slots : [];

  function handleSelect(entry: PokedexGridEntry) {
    const result = addPokemon({
      formId: entry.pokemon.id,
      speciesId: entry.pokemon.speciesId,
      displayName: entry.pokemon.displayName,
      types: entry.pokemon.types,
      spriteUrl: entry.pokemon.spriteUrl,
    });
    if (!result.ok) {
      setFeedback(result.reason ?? "Couldn't add that Pokémon.");
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  const selectedFormIds = new Set(activeSlots.map((s) => s.formId));
  const selectedSpeciesIds = new Set(activeSlots.map((s) => s.speciesId));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="order-2 lg:order-1">
        <PokedexBrowser
          entries={entries}
          selectedFormIds={selectedFormIds}
          isDisabled={(e) => activeSlots.length >= 6 && !selectedSpeciesIds.has(e.pokemon.speciesId)}
          onSelect={handleSelect}
        />
      </div>

      <div className="order-1 flex flex-col gap-6 lg:order-2 lg:sticky lg:top-8 lg:self-start">
        <TeamSlotPanel
          slots={activeSlots}
          onRemove={removePokemon}
          headerActions={
            <div className="flex gap-2">
              <SavePresetDialog gameKey={game.key} slots={activeSlots} preselectedPresetId={gameKey === game.key ? presetId : null} />
              {activeSlots.length > 0 && (
                <Button size="sm" variant="ghost" onClick={clearTeam}>
                  Clear
                </Button>
              )}
            </div>
          }
        />
        {feedback && <p className="text-xs text-destructive">{feedback}</p>}

        <div className="rounded-lg border border-border bg-card p-4">
          <DefensiveCoveragePanel chart={typeChart} team={activeSlots} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <OffensiveCoveragePanel chart={typeChart} team={activeSlots} />
        </div>
      </div>
    </div>
  );
}
