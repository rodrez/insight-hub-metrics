import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collaborator } from "@/lib/types/collaboration";
import { PartnerHeader } from "./PartnerHeader";
import { PartnerContact } from "./PartnerContact";
import { PartnerProjects } from "./PartnerProjects";
import { PartnerWorkstreams } from "./PartnerWorkstreams";
import { cn } from "@/lib/utils";

type PartnerCardProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
};

export function PartnerCard({ collaborator, onEdit, onDelete, type }: PartnerCardProps) {
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
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <PartnerContact contact={collaborator.primaryContact} />
            <PartnerProjects collaborator={collaborator} type={type} />
          </div>
          <PartnerWorkstreams workstreams={collaborator.workstreams} />
        </div>
      </CardContent>
    </Card>
  );
}