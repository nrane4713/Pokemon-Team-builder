"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePreset } from "@/lib/presets-client";
import { removeSavedPresetId } from "@/lib/presets-storage";

export function PresetDetailActions({ presetId }: { presetId: string }) {
  const router = useRouter();

  async function handleDelete() {
    removeSavedPresetId(presetId);
    await deletePreset(presetId);
    router.push("/presets");
  }

  return (
    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={handleDelete}>
      <Trash2 className="size-4" />
      Delete preset
    </Button>
  );
}
