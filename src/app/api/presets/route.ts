import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hydratePreset } from "@/lib/presets-hydrate";
import { presetInputSchema } from "@/lib/validation/preset";
import { assertValidPresetInput, InvalidReferenceError } from "@/lib/validation/staticDataRefs";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json({ error: "Missing ?ids= query param" }, { status: 400 });
  }
  const ids = idsParam.split(",").filter(Boolean);
  const presets = await prisma.preset.findMany({
    where: { id: { in: ids } },
    include: { teams: { include: { slots: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const hydrated = await Promise.all(presets.map(hydratePreset));
  return NextResponse.json({ presets: hydrated });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = presetInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await assertValidPresetInput(parsed.data);
  } catch (err) {
    if (err instanceof InvalidReferenceError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const created = await prisma.preset.create({
    data: {
      name: parsed.data.name,
      teams: {
        create: parsed.data.teams.map((team, orderIndex) => ({
          gameKey: team.gameKey,
          label: team.label ?? null,
          orderIndex,
          slots: {
            create: team.pokemonFormIds.map((formId, slotIndex) => ({
              slotIndex,
              pokemonFormId: formId,
            })),
          },
        })),
      },
    },
    include: { teams: { include: { slots: true } } },
  });

  const hydrated = await hydratePreset(created);
  return NextResponse.json({ preset: hydrated }, { status: 201 });
}
