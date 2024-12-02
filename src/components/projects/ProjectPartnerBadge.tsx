import { Badge } from "@/components/ui/badge";
import { CollaborationType } from "@/lib/types/collaboration";
import { Collaborator } from "@/lib/types/collaboration";

interface ProjectPartnerBadgeProps {
  collaborator: Collaborator;
}

export function ProjectPartnerBadge({ collaborator }: ProjectPartnerBadgeProps) {
  return (
    <Badge
      style={{ backgroundColor: collaborator.color || "#333" }}
      className="text-white"
      title={collaborator.role}
    >
      {collaborator.name}
    </Badge>
  );
}
