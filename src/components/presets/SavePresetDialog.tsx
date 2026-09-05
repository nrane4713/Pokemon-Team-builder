"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPreset, fetchPresetsByIds, updatePreset } from "@/lib/presets-client";
import { addSavedPresetId, getSavedPresetIds } from "@/lib/presets-storage";
import { useTeamBuilderStore, type TeamSlotMember } from "@/store/useTeamBuilderStore";
import type { PresetHydrated } from "@/types/domain";

interface SavePresetDialogProps {
  gameKey: string;
  slots: TeamSlotMember[];
  preselectedPresetId?: string | null;
}

export function SavePresetDialog({ gameKey, slots, preselectedPresetId }: SavePresetDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [newName, setNewName] = useState("");
  const [existingPresets, setExistingPresets] = useState<PresetHydrated[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadTeam = useTeamBuilderStore((s) => s.loadTeam);

  useEffect(() => {
    if (!open) return;
    fetchPresetsByIds(getSavedPresetIds())
      .then((presets) => {
        setExistingPresets(presets);
        if (preselectedPresetId && presets.some((p) => p.id === preselectedPresetId)) {
          setMode("existing");
          setSelectedPresetId(preselectedPresetId);
        }
      })
      .catch(() => setExistingPresets([]));
  }, [open, preselectedPresetId]);

  const canSave = slots.length > 0 && (mode === "new" ? newName.trim().length > 0 : selectedPresetId != null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const pokemonFormIds = slots.map((s) => s.formId);

      if (mode === "new") {
        const preset = await createPreset({ name: newName.trim(), teams: [{ gameKey, pokemonFormIds }] });
        addSavedPresetId(preset.id);
        loadTeam({ gameKey, slots, presetId: preset.id, presetTeamId: preset.teams[0]?.id ?? null });
      } else if (selectedPresetId) {
        const existing = existingPresets.find((p) => p.id === selectedPresetId);
        if (!existing) throw new Error("Preset not found");
        const otherTeams = existing.teams.filter((t) => t.gameKey !== gameKey);
        const updated = await updatePreset(selectedPresetId, {
          name: existing.name,
          teams: [
            ...otherTeams.map((t) => ({ gameKey: t.gameKey, label: t.label, pokemonFormIds: t.slots.map((s) => s.pokemonFormId) })),
            { gameKey, pokemonFormIds },
          ],
        });
        const savedTeam = updated.teams.find((t) => t.gameKey === gameKey);
        loadTeam({ gameKey, slots, presetId: updated.id, presetTeamId: savedTeam?.id ?? null });
      }
      setOpen(false);
      setNewName("");
      setSelectedPresetId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preset");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" disabled={slots.length === 0} />}>Save to preset</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save this team</DialogTitle>
          <DialogDescription>
            Save as a new preset, or add this team to a preset that already has teams for other games.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Button variant={mode === "new" ? "default" : "outline"} size="sm" onClick={() => setMode("new")}>
              New preset
            </Button>
            <Button
              variant={mode === "existing" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("existing")}
              disabled={existingPresets.length === 0}
            >
              Add to existing
            </Button>
          </div>

          {mode === "new" ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Preset name, e.g. My Playthrough Set"
              autoFocus
            />
          ) : (
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
              {existingPresets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved presets yet.</p>
              ) : (
                existingPresets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      selectedPresetId === p.id ? "border-primary bg-accent" : "border-border hover:bg-accent/50"
                    }`}
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{p.teams.length} team(s)</span>
                  </button>
                ))
              )}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={!canSave || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
