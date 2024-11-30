import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collaborator } from "@/lib/types/collaboration";
import { PartnerHeader } from "./PartnerHeader";
import { PartnerContact } from "./PartnerContact";
import { PartnerProjects } from "./PartnerProjects";
import { PartnerWorkstreams } from "./PartnerWorkstreams";

type PartnerCardProps = {
  collaborator: Collaborator;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: 'fortune30' | 'sme';
};

export function PartnerCard({ collaborator, onEdit, onDelete, type }: PartnerCardProps) {
  return (
    <Card>
      <CardHeader>
        <PartnerHeader
          collaborator={collaborator}
          onEdit={onEdit}
          onDelete={onDelete}
          type={type}
        />
      </CardHeader>
      <CardContent>
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