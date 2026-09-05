import { TeamSlot } from "./TeamSlot";
import { MAX_TEAM_SIZE, type TeamSlotMember } from "@/store/useTeamBuilderStore";

interface TeamSlotPanelProps {
  slots: TeamSlotMember[];
  onRemove: (formId: string) => void;
  headerActions?: React.ReactNode;
}

export function TeamSlotPanel({ slots, onRemove, headerActions }: TeamSlotPanelProps) {
  const padded: (TeamSlotMember | null)[] = [...slots];
  while (padded.length < MAX_TEAM_SIZE) padded.push(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Your Team ({slots.length}/{MAX_TEAM_SIZE})
        </h2>
        {headerActions}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-2">
        {padded.map((member, i) => (
          <TeamSlot key={member?.formId ?? `empty-${i}`} member={member} onRemove={member ? () => onRemove(member.formId) : undefined} />
        ))}
      </div>
    </div>
  );
}
