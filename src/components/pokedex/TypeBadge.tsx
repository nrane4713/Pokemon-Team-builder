import { getTypeColor } from "@/lib/constants/type-colors";
import type { TypeName } from "@/types/domain";
import { cn } from "@/lib/utils";

export function TypeBadge({ type, className }: { type: TypeName; className?: string }) {
  const { bg, text } = getTypeColor(type);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
        className,
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      {type}
    </span>
  );
}
