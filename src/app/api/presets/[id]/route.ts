import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hydratePreset } from "@/lib/presets-hydrate";
import { presetInputSchema } from "@/lib/validation/preset";
import { assertValidPresetInput, InvalidReferenceError } from "@/lib/validation/staticDataRefs";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const preset = await prisma.preset.findUnique({
    where: { id },
    include: { teams: { include: { slots: true } } },
  });
  if (!preset) {
    return NextResponse.json({ error: "Preset not found" }, { status: 404 });
  }
  return NextResponse.json({ preset: await hydratePreset(preset) });
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
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

  const exists = await prisma.preset.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ error: "Preset not found" }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.presetTeam.deleteMany({ where: { presetId: id } });
    return tx.preset.update({
      where: { id },
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
  });

  return NextResponse.json({ preset: await hydratePreset(updated) });
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  await prisma.preset.deleteMany({ where: { id } });
  return NextResponse.json({ ok: true });
}
