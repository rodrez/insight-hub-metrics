import { Collaborator } from "@/lib/types/collaboration";
import { PartnerCard } from "./shared/PartnerCard";

type SMEListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SMEList({ collaborators, onEdit, onDelete }: SMEListProps) {
  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => (
        <PartnerCard
          key={collaborator.id}
          collaborator={collaborator}
          onEdit={onEdit}
          onDelete={onDelete}
          type="sme"
        />
      ))}
    </div>
  );
}