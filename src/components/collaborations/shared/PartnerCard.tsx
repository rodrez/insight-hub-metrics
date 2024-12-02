import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collaborator } from "@/lib/types/collaboration";
import { PartnerHeader } from "./PartnerHeader";
import { PartnerContact } from "./PartnerContact";
import { PartnerProjects } from "./PartnerProjects";
import { PartnerWorkstreams } from "./PartnerWorkstreams";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type PartnerCardProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
};

export function PartnerCard({ collaborator, onEdit, onDelete, type }: PartnerCardProps) {
  const navigate = useNavigate();
  
  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps(),
  });

  // Filter sitreps related to this partner
  const partnerSitreps = sitreps
    .filter(sitrep => 
      (type === 'fortune30' && sitrep.fortune30PartnerId === collaborator.id) ||
      (type === 'sme' && sitrep.smePartnerId === collaborator.id)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Get only the 3 most recent

  const handleSitRepClick = (sitrepId: string) => {
    navigate('/sitreps');
    setTimeout(() => {
      const element = document.getElementById(`sitrep-${sitrepId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-lg",
      "animate-fade-in group",
      type === 'fortune30' ? 'hover:border-blue-500/50' : 'hover:border-purple-500/50'
    )}>
      <CardHeader className="p-6">
        <PartnerHeader
          collaborator={collaborator}
          onEdit={onEdit}
          onDelete={onDelete}
          type={type}
        />
        <div className="mt-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
            RAT Member: {collaborator.ratMember}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PartnerContact contact={collaborator.primaryContact} />
            <PartnerProjects collaborator={collaborator} type={type} />
          </div>
          <PartnerWorkstreams 
            workstreams={collaborator.workstreams} 
            agreements={collaborator.agreements}
          />
        </div>

        {partnerSitreps.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Recent SitReps</h4>
            <div className="space-y-2">
              {partnerSitreps.map((sitrep) => (
                <div 
                  key={sitrep.id}
                  onClick={() => handleSitRepClick(sitrep.id)}
                  className="p-3 rounded-md bg-accent/50 hover:bg-accent transition-colors cursor-pointer"
                  style={{ 
                    borderLeft: `4px solid ${collaborator.color || '#333'}`,
                    borderColor: collaborator.color || '#333'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{sitrep.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(sitrep.date), 'MMM d, yyyy')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {sitrep.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}