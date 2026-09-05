"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getTypeColor } from "@/lib/constants/type-colors";
import { computeTeamDefensiveCoverage, type TeamMember, type TypeChart } from "@/lib/type-chart";
import { POKEMON_TYPES } from "@/types/domain";

function cellAppearance(weakCount: number, resistCount: number, immuneCount: number) {
  if (weakCount > 0) return { backgroundColor: "#dc262699", label: `${weakCount} weak` };
  if (immuneCount > 0) return { backgroundColor: "#16a34a55", label: "Immune" };
  if (resistCount > 0) return { backgroundColor: "#2563eb40", label: "Resisted" };
  return { backgroundColor: "transparent", label: "Neutral" };
}

export function DefensiveCoveragePanel({ chart, team }: { chart: TypeChart; team: TeamMember[] }) {
  if (team.length === 0) {
    return <p className="text-sm text-muted-foreground">Add Pokémon to your team to see type coverage.</p>;
  }

  const coverage = computeTeamDefensiveCoverage(chart, team);

  return (
    <div>
      <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Team Weaknesses &amp; Resistances
      </h3>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
        {POKEMON_TYPES.map((type) => {
          const row = coverage.perAttackingType[type];
          const { backgroundColor, label } = cellAppearance(row.weakCount, row.resistCount, row.immuneCount);
          const { bg: typeColor } = getTypeColor(type);

          const weakMembers = team.filter(
            (m) => (row.membersByMultiplier[2]?.includes(m.formId) || row.membersByMultiplier[4]?.includes(m.formId)) ?? false,
          );
          const immuneMembers = team.filter((m) => row.membersByMultiplier[0]?.includes(m.formId) ?? false);
          const resistMembers = team.filter(
            (m) => (row.membersByMultiplier[0.5]?.includes(m.formId) || row.membersByMultiplier[0.25]?.includes(m.formId)) ?? false,
          );

          return (
            <Tooltip key={type}>
              <TooltipTrigger
                render={
                  <div className="flex flex-col items-center gap-1 rounded-md p-1.5" style={{ backgroundColor }}>
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: typeColor }} aria-hidden />
                    <span className="text-[10px] font-medium capitalize">{type}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{label}</span>
                  </div>
                }
              />
              <TooltipContent>
                <div className="flex flex-col gap-0.5 text-xs">
                  {weakMembers.length > 0 && <p>Weak: {weakMembers.map((m) => m.displayName).join(", ")}</p>}
                  {immuneMembers.length > 0 && <p>Immune: {immuneMembers.map((m) => m.displayName).join(", ")}</p>}
                  {resistMembers.length > 0 && <p>Resists: {resistMembers.map((m) => m.displayName).join(", ")}</p>}
                  {weakMembers.length === 0 && immuneMembers.length === 0 && resistMembers.length === 0 && (
                    <p>No major weakness to {type}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
