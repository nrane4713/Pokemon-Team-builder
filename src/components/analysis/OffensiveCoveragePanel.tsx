"use client";

import { TypeBadge } from "@/components/pokedex/TypeBadge";
import { computeOffensiveCoverage, type TeamMember, type TypeChart } from "@/lib/type-chart";

export function OffensiveCoveragePanel({ chart, team }: { chart: TypeChart; team: TeamMember[] }) {
  if (team.length === 0) return null;

  const { gapTypes } = computeOffensiveCoverage(chart, team);

  return (
    <div>
      <h3 className="mb-2 font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Team Type Coverage (STAB-only)
      </h3>
      <p className="mb-2 text-xs text-muted-foreground">
        Types your team can&apos;t hit super-effectively using same-type moves alone.
      </p>
      {gapTypes.length === 0 ? (
        <p className="text-sm">Full offensive coverage &mdash; every type is hit super-effectively. 🎯</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {gapTypes.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>
      )}
    </div>
  );
}
