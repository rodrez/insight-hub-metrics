import { Collaborator } from "@/lib/types/collaboration";
import { PartnerCard } from "./shared/PartnerCard";

type Fortune30ListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Fortune30List({ collaborators, onEdit, onDelete }: Fortune30ListProps) {
  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => (
        <PartnerCard
          key={collaborator.id}
          collaborator={collaborator}
          onEdit={onEdit}
          onDelete={onDelete}
          type="fortune30"
        />
      ))}
    </div>
  );
}