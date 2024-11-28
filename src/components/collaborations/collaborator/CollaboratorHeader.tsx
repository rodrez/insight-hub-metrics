import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";

type CollaboratorHeaderProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function CollaboratorHeader({ collaborator, onEdit, onDelete }: CollaboratorHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: collaborator.color || '#333' }}>
          {collaborator.name}
        </h1>
        <p className="text-lg text-muted-foreground">{collaborator.role}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onEdit(collaborator.id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(collaborator.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}