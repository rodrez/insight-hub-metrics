import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { getRatMemberInfo } from "@/lib/services/data/utils/ratMemberUtils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { OrgPositionHeader } from "./card/OrgPositionHeader";
import { RelationshipSection } from "./card/RelationshipSection";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all required data
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const { data: allCollaborators = [] } = useQuery({
    queryKey: ['collaborators'],
    queryFn: () => db.getAllCollaborators()
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

  // Filter data for this RAT member
  const fortune30Partners = allCollaborators.filter(c => 
    c.type === 'fortune30' && c.ratMember === name
  );

  const smePartners = allSMEPartners.filter(p => 
    p.ratMember === name
  );

  const projects = allProjects.filter(p => 
    p.ratMember === name
  );

  const spis = allSPIs.filter(spi => 
    spi.ratMember === name
  );

  const sitreps = allSitReps.filter(sitrep => 
    sitrep.ratMember === name
  );

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
      // Update projects
      for (const projectId of updatedPosition.projects) {
        const project = allProjects.find(p => p.id === projectId);
        if (project && !project.ratMember) {
          await db.updateProject({ ...project, ratMember: name });
        }
      }

      // Update Fortune 30 partners
      for (const partnerId of updatedPosition.fortune30Partners) {
        const partner = allCollaborators.find(c => c.id === partnerId);
        if (partner && !partner.ratMember) {
          await db.updateCollaborator({ ...partner, ratMember: name });
        }
      }

      // Update SME partners
      for (const partnerId of updatedPosition.smePartners) {
        const partner = allSMEPartners.find(p => p.id === partnerId);
        if (partner && !partner.ratMember) {
          await db.updateSMEPartner({ ...partner, ratMember: name });
        }
      }

      // Update SPIs
      for (const spiId of updatedPosition.spis) {
        const spi = allSPIs.find(s => s.id === spiId);
        if (spi && !spi.ratMember) {
          await db.updateSPI({ ...spi, ratMember: name });
        }
      }

      // Update SitReps
      for (const sitrepId of updatedPosition.sitreps) {
        const sitrep = allSitReps.find(s => s.id === sitrepId);
        if (sitrep && !sitrep.ratMember) {
          await db.updateSitRep({ ...sitrep, ratMember: name });
        }
      }

      // Invalidate queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      await queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      await queryClient.invalidateQueries({ queryKey: ['sme-partners'] });
      await queryClient.invalidateQueries({ queryKey: ['spis'] });
      await queryClient.invalidateQueries({ queryKey: ['sitreps'] });

      toast({
        title: "Changes saved",
        description: "The relationships have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`${width} p-6 space-y-4 bg-card/50 backdrop-blur-sm border-muted`}>
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
        />

        <RelationshipSection
          title="SME Partners"
          items={smePartners}
          onItemClick={(id) => handleItemClick('sme', id)}
        />

        <RelationshipSection
          title="Projects"
          items={projects}
          onItemClick={(id) => handleItemClick('project', id)}
        />

        <RelationshipSection
          title="SPIs"
          items={spis}
          onItemClick={(id) => handleItemClick('spi', id)}
        />

        <RelationshipSection
          title="SitReps"
          items={sitreps}
          onItemClick={(id) => handleItemClick('sitrep', id)}
        />
      </div>

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={handleSave}
        allProjects={allProjects}
        allFortune30Partners={allCollaborators.filter(c => c.type === 'fortune30')}
        allSMEPartners={allSMEPartners}
        allSPIs={allSPIs}
        allSitReps={allSitReps}
      />
    </Card>
  );
}