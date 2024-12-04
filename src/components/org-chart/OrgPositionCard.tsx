import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { getRatMemberInfo } from "@/lib/services/data/utils/ratMemberUtils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { OrgPositionHeader } from "./card/OrgPositionHeader";
import { RelationshipSection } from "./card/RelationshipSection";
import { useOrgPositionData } from "./hooks/useOrgPositionData";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);
  const navigate = useNavigate();

  // Get assigned items for this RAT member
  const {
    fortune30Partners,
    smePartners,
    projects,
    spis,
    sitreps,
    isLoading
  } = useOrgPositionData(name);

  // Get all available items for selection
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: allFortune30Partners = [] } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const collaborators = await db.getAllCollaborators();
      return collaborators.filter(c => c.type === 'fortune30');
    }
  });

  const { data: allSMEPartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const { data: allSPIs = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: allSitReps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
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

  const position: OrgPosition = {
    id: name,
    title: title,
    projects: projects.map(p => p.id),
    fortune30Partners: fortune30Partners.map(p => p.id),
    smePartners: smePartners.map(p => p.id),
    spis: spis.map(s => s.id),
    sitreps: sitreps.map(s => s.id)
  };

  const handleSave = async (updatedPosition: OrgPosition) => {
    try {
      const promises = [];
      
      // Update projects
      for (const projectId of updatedPosition.projects) {
        promises.push(db.updateProject(projectId, { ratMember: name }));
      }

      // Update Fortune 30 partners
      for (const partnerId of updatedPosition.fortune30Partners) {
        promises.push(db.updateCollaborator(partnerId, { ratMember: name }));
      }

      // Update SME partners
      for (const partnerId of updatedPosition.smePartners) {
        promises.push(db.updateSMEPartner(partnerId, { ratMember: name }));
      }

      // Update SPIs
      for (const spiId of updatedPosition.spis) {
        promises.push(db.updateSPI(spiId, { ratMember: name }));
      }

      // Update SitReps
      for (const sitrepId of updatedPosition.sitreps) {
        promises.push(db.updateSitRep(sitrepId, { ratMember: name }));
      }

      await Promise.all(promises);

      toast({
        title: "Success",
        description: "Relationships updated successfully",
      });
    } catch (error) {
      console.error('Error updating relationships:', error);
      toast({
        title: "Error",
        description: "Failed to update relationships",
        variant: "destructive"
      });
    }
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

      <div className="space-y-4">
        <RelationshipSection
          title="Fortune 30 Partners"
          items={fortune30Partners}
          onItemClick={(id) => handleItemClick('fortune30', id)}
          color="#8B5CF6"
        />

        <RelationshipSection
          title="SME Partners"
          items={smePartners}
          onItemClick={(id) => handleItemClick('sme', id)}
          color="#6E59A5"
        />

        <RelationshipSection
          title="Projects"
          items={projects}
          onItemClick={(id) => handleItemClick('project', id)}
          color="#4B5563"
        />

        <RelationshipSection
          title="SPIs"
          items={spis}
          onItemClick={(id) => handleItemClick('spi', id)}
          badgeClassName="bg-emerald-500 hover:bg-emerald-600"
        />

        <RelationshipSection
          title="SitReps"
          items={sitreps}
          onItemClick={(id) => handleItemClick('sitrep', id)}
          badgeClassName="bg-blue-500 hover:bg-blue-600"
        />
      </div>

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={handleSave}
        allProjects={allProjects}
        allFortune30Partners={allFortune30Partners}
        allSMEPartners={allSMEPartners}
        allSPIs={allSPIs}
        allSitReps={allSitReps}
      />
    </Card>
  );
}