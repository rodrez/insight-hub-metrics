import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { RelationshipDisplay } from "./RelationshipDisplay";
import { OrgPosition } from "./types";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { getRatMemberInfo } from "@/lib/services/data/utils/ratMemberUtils";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);
  const navigate = useNavigate();

  // Fetch Fortune 30 partners where this person is the RAT member
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

  // Fetch SME partners where this person is the RAT member
  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners', name],
    queryFn: async () => {
      const allSMEPartners = await db.getAllSMEPartners();
      return allSMEPartners.filter(p => p.ratMember === name);
    }
  });

  // Fetch projects where this person is the RAT member
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', name],
    queryFn: async () => {
      const allProjects = await db.getAllProjects();
      return allProjects.filter(p => p.ratMember === name);
    }
  });

  // Fetch SPIs where this person is the RAT member
  const { data: spis = [] } = useQuery({
    queryKey: ['spis', name],
    queryFn: async () => {
      const allSpis = await db.getAllSPIs();
      return allSpis.filter(spi => spi.ratMember === name);
    }
  });

  // Fetch SitReps where this person is the RAT member
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
      // Here you would typically save the changes to your database
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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{name}</p>
          {memberInfo?.expertise && (
            <Badge variant="secondary" className="mt-2">
              {memberInfo.expertise}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
        >
          <Pen className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Fortune 30 Partners */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Fortune 30 Partners</h3>
          <div className="flex flex-wrap gap-2">
            {fortune30Partners.map(partner => (
              <Badge
                key={partner.id}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => handleItemClick('fortune30', partner.id)}
              >
                {partner.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* SME Partners */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">SME Partners</h3>
          <div className="flex flex-wrap gap-2">
            {smePartners.map(partner => (
              <Badge
                key={partner.id}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => handleItemClick('sme', partner.id)}
              >
                {partner.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Projects</h3>
          <div className="flex flex-wrap gap-2">
            {projects.map(project => (
              <Badge
                key={project.id}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => handleItemClick('project', project.id)}
              >
                {project.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* SPIs */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">SPIs</h3>
          <div className="flex flex-wrap gap-2">
            {spis.map(spi => (
              <Badge
                key={spi.id}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => handleItemClick('spi', spi.id)}
              >
                {spi.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* SitReps */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">SitReps</h3>
          <div className="flex flex-wrap gap-2">
            {sitreps.map(sitrep => (
              <Badge
                key={sitrep.id}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => handleItemClick('sitrep', sitrep.id)}
              >
                {sitrep.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <RelationshipSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        position={position}
        onSave={handleSave}
      />
    </Card>
  );
}