import { Badge } from "@/components/ui/badge";
import { Collaborator } from "@/lib/types";

interface ProjectPartnerBadgeProps {
  partner: Collaborator;
  departmentColor?: string;
}

export function ProjectPartnerBadge({ partner, departmentColor }: ProjectPartnerBadgeProps) {
  return (
    <Badge
      style={{ backgroundColor: departmentColor || partner.color || '#333' }}
      className="text-white"
    >
      {partner.name}
    </Badge>
  );
}