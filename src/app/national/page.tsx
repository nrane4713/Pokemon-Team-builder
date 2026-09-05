import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { loadNationalDex } from "@/lib/data/loadNationalDex";
import { loadFormsById } from "@/lib/data/loadSpecies";
import { PokedexBrowser } from "@/components/pokedex/PokedexBrowser";

export default async function NationalDexPage() {
  const [nationalDex, formsById] = await Promise.all([loadNationalDex(), loadFormsById()]);
  const entries = nationalDex
    .map((e) => ({ pokemon: formsById.get(e.formId), dexNumber: e.nationalDexNumber }))
    .filter((e): e is { pokemon: NonNullable<typeof e.pokemon>; dexNumber: number } => e.pokemon != null);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back home
      </Link>
      <h1 className="font-heading text-3xl font-bold">National Pokédex</h1>
      <p className="mt-2 mb-6 max-w-2xl text-muted-foreground">
        Every Pokémon across all supported games (Gen 1&ndash;8), for reference. Build a team from a specific
        game&apos;s page to only see what&apos;s actually obtainable there.
      </p>
      <PokedexBrowser entries={entries} />
    </div>
  );
}
