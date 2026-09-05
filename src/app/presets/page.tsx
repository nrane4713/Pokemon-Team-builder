"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PresetCard } from "@/components/presets/PresetCard";
import { deletePreset, fetchPresetsByIds } from "@/lib/presets-client";
import { getSavedPresetIds, removeSavedPresetId } from "@/lib/presets-storage";
import type { PresetHydrated } from "@/types/domain";

export default function PresetsPage() {
  const [presets, setPresets] = useState<PresetHydrated[] | null>(null);

  useEffect(() => {
    fetchPresetsByIds(getSavedPresetIds())
      .then(setPresets)
      .catch(() => setPresets([]));
  }, []);

  async function handleDelete(id: string) {
    removeSavedPresetId(id);
    setPresets((prev) => prev?.filter((p) => p.id !== id) ?? null);
    try {
      await deletePreset(id);
    } catch {
      // preset id already dropped from the local index; a stray DB row isn't user-visible
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back home
      </Link>
      <h1 className="font-heading text-3xl font-bold">My Presets</h1>
      <p className="mt-2 mb-6 text-muted-foreground">
        Saved team bundles, remembered in this browser. Each preset can hold teams for multiple games at once.
      </p>

      {presets === null ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : presets.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No presets saved yet. Build a team on any game&apos;s page and hit &ldquo;Save to preset&rdquo;.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {presets.map((p) => (
            <PresetCard key={p.id} preset={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
