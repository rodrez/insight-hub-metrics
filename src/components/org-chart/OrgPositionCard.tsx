import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { getRatMemberInfo } from "@/lib/services/data/utils/ratMemberUtils";
import { useNavigate } from "react-router-dom";
import { OrgPositionHeader } from "./card/OrgPositionHeader";
import { RelationshipsContainer } from "./card/RelationshipsContainer";
import { useRelationshipUpdates } from "./hooks/useRelationshipUpdates";
import { toast } from "@/components/ui/use-toast";
import { useRATMember } from "@/contexts/RATMemberContext";
import { Skeleton } from "@/components/ui/skeleton";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);
  const navigate = useNavigate();
  const { handleSave } = useRelationshipUpdates();
  const { relationships, isLoading, error, getDepartmentColor } = useRATMember();

  if (isLoading) {
    return (
      <Card className={`${width} p-6 space-y-4`}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${width} p-6`}>
        <p className="text-sm text-muted-foreground">Error loading relationships</p>
      </Card>
    );
  }

  const memberRelationships = relationships[name] || {
    fortune30Partners: [],
    smePartners: [],
    projects: [],
    spis: [],
    sitreps: []
  };

  const position: OrgPosition = {
    id: name,
    title: title,
    projects: memberRelationships.projects?.map((p: any) => p.id) || [],
    fortune30Partners: memberRelationships.fortune30Partners?.map((p: any) => p.id) || [],
    smePartners: memberRelationships.smePartners?.map((p: any) => p.id) || [],
    spis: memberRelationships.spis?.map((s: any) => s.id) || [],
    sitreps: memberRelationships.sitreps?.map((s: any) => s.id) || []
  };

  const handleItemClick = (type: string, id: string) => {
    switch (type) {
      case 'project':
        navigate('/', { state: { scrollToProject: id } });
        break;
      case 'fortune30':
        navigate('/collaborations', { state: { scrollToCollaborator: id } });
        break;
      case 'sme':
        navigate('/sme', { state: { scrollToPartner: id } });
        break;
      case 'spi':
        navigate('/spi', { state: { scrollToSPI: id } });
        break;
      case 'sitrep':
        navigate('/sitreps', { state: { scrollToSitRep: id } });
        break;
    }
  };

  return (
    <Card className={`${width} p-6 space-y-4 bg-background/95 backdrop-blur-sm border-muted`}>
      <OrgPositionHeader 
        title={title}
        name={name}
        memberInfo={memberInfo}
        onEditClick={() => setIsDialogOpen(true)}
      />

      <RelationshipsContainer
        fortune30Partners={memberRelationships.fortune30Partners || []}
        smePartners={memberRelationships.smePartners || []}
        projects={memberRelationships.projects || []}
        spis={memberRelationships.spis || []}
        sitreps={memberRelationships.sitreps || []}
        onItemClick={handleItemClick}
        getDepartmentColor={getDepartmentColor}
      />

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={async (updatedPosition) => {
          await handleSave(name, updatedPosition);
          setIsDialogOpen(false);
        }}
        allProjects={memberRelationships.projects || []}
        allFortune30Partners={memberRelationships.fortune30Partners || []}
        allSMEPartners={memberRelationships.smePartners || []}
        allSPIs={memberRelationships.spis || []}
        allSitReps={memberRelationships.sitreps || []}
      />
    </Card>
  );
}