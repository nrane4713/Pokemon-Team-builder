import Image from "next/image";
import { X } from "lucide-react";
import { TypeBadge } from "@/components/pokedex/TypeBadge";
import type { TeamSlotMember } from "@/store/useTeamBuilderStore";

export function TeamSlot({ member, onRemove }: { member: TeamSlotMember | null; onRemove?: () => void }) {
  if (!member) {
    return (
      <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
        Empty slot
      </div>
    );
  }

  return (
    <div className="group relative flex h-24 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card p-2 text-center">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${member.displayName}`}
          className="absolute right-1 top-1 rounded-full p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      )}
      <Image
        src={member.spriteUrl}
        alt={member.displayName}
        width={40}
        height={40}
        style={{ imageRendering: "pixelated" }}
        unoptimized
      />
      <span className="line-clamp-1 text-xs font-medium">{member.displayName}</span>
      <div className="flex gap-1">
        {member.types.map((t) => (
          <TypeBadge key={t} type={t} className="px-1.5 py-0 text-[9px]" />
        ))}
      </div>
    </div>
  );
}
