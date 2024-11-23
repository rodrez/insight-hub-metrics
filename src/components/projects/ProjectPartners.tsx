import { Collaborator } from "@/lib/types";
import { PartnerBadge } from "./PartnerBadge";
import { fortune30Partners } from "@/components/data/fortune30Partners";

interface ProjectPartnersProps {
  collaborators: Collaborator[];
  onPartnerClick: (id: string) => void;
}

export function ProjectPartners({ collaborators, onPartnerClick }: ProjectPartnersProps) {
  // Get Fortune 30 partners with their colors
  const fortune30Collaborators = collaborators.filter(c => c.type === 'fortune30').map(partner => {
    const fortune30Data = fortune30Partners.find(f => f.id === partner.id);
    return {
      ...partner,
      color: fortune30Data?.color || '#333'
    };
  });
  
  const internalPartners = collaborators.filter(c => c.type !== 'fortune30');

  return (
    <div className="space-y-2">
      {fortune30Collaborators.length > 0 && (
        <div>
          <div className="text-sm text-muted-foreground mb-1">Fortune 30 Partners:</div>
          <div className="flex flex-wrap gap-2">
            {fortune30Collaborators.map((partner) => (
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