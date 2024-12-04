import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { getRatMemberInfo, getRatMemberRelationships } from "@/lib/services/data/utils/ratMemberUtils";
import { useNavigate } from "react-router-dom";
import { OrgPositionHeader } from "./card/OrgPositionHeader";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { RelationshipsContainer } from "./card/RelationshipsContainer";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);
  const navigate = useNavigate();

  const { data: relationships, isLoading } = useQuery({
    queryKey: ['rat-member-relationships', name],
    queryFn: async () => getRatMemberRelationships(name, db)
  });

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

  if (isLoading) {
    return <Card className={`${width} p-6 animate-pulse`}>Loading...</Card>;
  }

  const position: OrgPosition = {
    id: name,
    title: title,
    projects: relationships?.projects?.map(p => p.id) || [],
    fortune30Partners: relationships?.fortune30Partners?.map(p => p.id) || [],
    smePartners: relationships?.smePartners?.map(p => p.id) || [],
    spis: relationships?.spis?.map(s => s.id) || [],
    sitreps: relationships?.sitreps?.map(s => s.id) || []
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
        fortune30Partners={relationships?.fortune30Partners || []}
        smePartners={relationships?.smePartners || []}
        projects={relationships?.projects || []}
        spis={relationships?.spis || []}
        sitreps={relationships?.sitreps || []}
        onItemClick={handleItemClick}
      />

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={async (updatedPosition) => {
          // Handle save logic
          setIsDialogOpen(false);
        }}
        allProjects={[]}
        allFortune30Partners={[]}
        allSMEPartners={[]}
        allSPIs={[]}
        allSitReps={[]}
      />
    </Card>
  );
}