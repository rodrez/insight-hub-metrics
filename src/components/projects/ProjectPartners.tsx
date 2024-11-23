import { Collaborator } from "@/lib/types";
import { PartnerBadge } from "./PartnerBadge";

interface ProjectPartnersProps {
  collaborators: Collaborator[];
  onPartnerClick: (id: string) => void;
}

export function ProjectPartners({ collaborators, onPartnerClick }: ProjectPartnersProps) {
  const fortune30Partners = collaborators.filter(c => c.type === 'fortune30');
  const internalPartners = collaborators.filter(c => c.type !== 'fortune30');

  return (
    <div className="space-y-2">
      {fortune30Partners.length > 0 && (
        <div>
          <div className="text-sm text-muted-foreground mb-1">Fortune 30 Partners:</div>
          <div className="flex flex-wrap gap-2">
            {fortune30Partners.map((partner) => (
              <PartnerBadge
                key={partner.id}
                partner={partner}
                onClick={onPartnerClick}
              />
            ))}
          </div>
        </div>
      )}
      {internalPartners.length > 0 && (
        <div>
          <div className="text-sm text-muted-foreground mb-1">Internal Partners:</div>
          <div className="flex flex-wrap gap-2">
            {internalPartners.map((partner) => (
              <PartnerBadge
                key={partner.id}
                partner={partner}
                onClick={onPartnerClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}