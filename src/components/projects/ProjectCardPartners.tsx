import { Badge } from "@/components/ui/badge";
import { Collaborator } from "@/lib/types/collaboration";

interface ProjectCardPartnersProps {
  partners?: Collaborator[];
  getDepartmentColor: (departmentId: string) => string;
}

export function ProjectCardPartners({ partners = [], getDepartmentColor }: ProjectCardPartnersProps) {
  if (!partners || partners.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Partners</h3>
        <p className="text-muted-foreground">No partners assigned</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Partners</h3>
      <div className="flex flex-wrap gap-2">
        {partners.map((partner) => (
          <Badge
            key={partner.id}
            style={{ backgroundColor: partner.color || getDepartmentColor(partner.department) }}
            className="text-white"
            title={partner.role}
          >
            {partner.name} (RAT: {partner.ratMember})
          </Badge>
        ))}
      </div>
    </div>
  );
}