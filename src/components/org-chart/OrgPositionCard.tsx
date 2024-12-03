import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { OrgPosition } from "./types";
import { useQuery } from "@tanstack/react-query";
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

  const { data: fortune30Partners = [] } = useQuery({
    queryKey: ['fortune30-partners', name],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => 
        c.type === 'fortune30' && 
        c.ratMember === name
      );
    }
  });

  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners', name],
    queryFn: async () => {
      const allSMEPartners = await db.getAllSMEPartners();
      return allSMEPartners.filter(p => p.ratMember === name);
    }
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', name],
    queryFn: async () => {
      const allProjects = await db.getAllProjects();
      return allProjects.filter(p => p.ratMember === name);
    }
  });

  const { data: spis = [] } = useQuery({
    queryKey: ['spis', name],
    queryFn: async () => {
      const allSpis = await db.getAllSPIs();
      return allSpis.filter(spi => spi.ratMember === name);
    }
  });

  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps', name],
    queryFn: async () => {
      const allSitreps = await db.getAllSitReps();
      return allSitreps.filter(sitrep => sitrep.ratMember === name);
    }
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
        allProjects={projects}
        allFortune30Partners={fortune30Partners}
        allSMEPartners={smePartners}
        allSPIs={spis}
        allSitReps={sitreps}
      />
    </Card>
  );
}