import { Badge } from "@/components/ui/badge";
import { Collaborator } from "@/lib/types/collaboration";

interface ProjectCardPartnersProps {
  partners: Collaborator[];
}

export function ProjectCardPartners({ partners }: ProjectCardPartnersProps) {
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
