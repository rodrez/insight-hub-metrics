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

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const memberInfo = getRatMemberInfo(name);

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

  const position: OrgPosition = {
    id: name,
    title: title,
    projects: projects.map(p => p.id),
    fortune30Partners: fortune30Partners.map(p => p.id),
    smePartners: [],
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
        <RelationshipDisplay
          title="Fortune 30 Partners"
          type="fortune30Partners"
          itemIds={position.fortune30Partners}
          items={fortune30Partners}
        />

        {/* Projects */}
        <RelationshipDisplay
          title="Projects"
          type="projects"
          itemIds={position.projects}
          items={projects}
        />

        {/* SPIs */}
        <RelationshipDisplay
          title="SPIs"
          type="spis"
          itemIds={position.spis}
          items={spis}
        />

        {/* SitReps */}
        <RelationshipDisplay
          title="SitReps"
          type="sitreps"
          itemIds={position.sitreps}
          items={sitreps}
        />
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