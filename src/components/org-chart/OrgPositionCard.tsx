import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { getRatMemberInfo } from "@/lib/services/data/utils/ratMemberUtils";
import { useNavigate } from "react-router-dom";
import { OrgPositionHeader } from "./card/OrgPositionHeader";
import { useOrgPositionData } from "./hooks/useOrgPositionData";
import { useAvailableItems } from "./hooks/useAvailableItems";
import { useRelationshipUpdates } from "./hooks/useRelationshipUpdates";
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

  const {
    fortune30Partners,
    smePartners,
    projects,
    spis,
    sitreps,
    isLoading
  } = useOrgPositionData(name);

  const {
    allProjects,
    allFortune30Partners,
    allSMEPartners,
    allSPIs,
    allSitReps
  } = useAvailableItems();

  const { handleSave } = useRelationshipUpdates();

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

  const position: OrgPosition = {
    id: name,
    title: title,
    projects: projects.map(p => p.id),
    fortune30Partners: fortune30Partners.map(p => p.id),
    smePartners: smePartners.map(p => p.id),
    spis: spis.map(s => s.id),
    sitreps: sitreps.map(s => s.id)
  };

  if (isLoading) {
    return <Card className={`${width} p-6 animate-pulse`}>Loading...</Card>;
  }

  return (
    <Card className={`${width} p-6 space-y-4 bg-background/95 backdrop-blur-sm border-muted`}>
      <OrgPositionHeader 
        title={title}
        name={name}
        memberInfo={memberInfo}
        onEditClick={() => setIsDialogOpen(true)}
      />

      <RelationshipsContainer
        fortune30Partners={fortune30Partners}
        smePartners={smePartners}
        projects={projects}
        spis={spis}
        sitreps={sitreps}
        onItemClick={handleItemClick}
      />

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={(updatedPosition) => handleSave(name, updatedPosition)}
        allProjects={allProjects}
        allFortune30Partners={allFortune30Partners}
        allSMEPartners={allSMEPartners}
        allSPIs={allSPIs}
        allSitReps={allSitReps}
      />
    </Card>
  );
}