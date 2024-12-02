import { Badge } from "@/components/ui/badge";
import { Collaborator } from "@/lib/types/collaboration";
import { Project } from "@/lib/types";

interface ProjectCardPartnersProps {
  partners: Collaborator[];
  getDepartmentColor: (departmentId: string) => string;
}

export function ProjectCardPartners({ partners, getDepartmentColor }: ProjectCardPartnersProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Partners</h3>
      <div className="flex flex-wrap gap-2">
        {partners.map((partner) => (
          <Badge
            key={partner.id}
            style={{ backgroundColor: partner.color }}
            className="text-white"
          >
            {partner.name} (RAT: {partner.ratMember})
          </Badge>
        ))}
      </div>
    </div>
  );
}