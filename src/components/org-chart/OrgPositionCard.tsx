import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { RelationshipDisplay } from "./RelationshipDisplay";
import { OrgPosition } from "./types";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";

interface OrgPositionCardProps {
  title: string;
  name: string;
  width?: string;
}

export function OrgPositionCard({ title, name, width = "w-96" }: OrgPositionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState<OrgPosition>({
    id: crypto.randomUUID(),
    title,
    projects: [],
    fortune30Partners: [],
    smePartners: [],
    spis: [],
    sitreps: []
  });

  // Fetch projects where this person is the RAT member
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', name],
    queryFn: async () => {
      const allProjects = await db.getAllProjects();
      return allProjects.filter(p => p.ratMember === name);
    }
  });

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
      const allPartners = await db.getAllSMEPartners();
      return allPartners.filter(p => p.ratMember === name);
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

  // Update position when data changes
  useEffect(() => {
    setPosition(prev => ({
      ...prev,
      projects: projects.map(p => p.id),
      fortune30Partners: fortune30Partners.map(p => p.id),
      smePartners: smePartners.map(p => p.id),
      spis: spis.map(spi => spi.id),
      sitreps: sitreps.map(sitrep => sitrep.id)
    }));
  }, [projects, fortune30Partners, smePartners, spis, sitreps]);

  const handleSave = (updatedPosition: OrgPosition) => {
    setPosition(updatedPosition);
    toast({
      title: "Success",
      description: "Position relationships updated successfully",
    });
  };

  return (
    <Card className={`${width} p-6 shadow-lg animate-fade-in`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-green-500 transition-colors"
        >
          <Pen className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-3">
        <RelationshipDisplay
          title="Projects"
          type="projects"
          itemIds={position.projects}
          items={projects}
        />
        <RelationshipDisplay
          title="Fortune 30 Partners"
          type="fortune30Partners"
          itemIds={position.fortune30Partners}
          items={fortune30Partners}
        />
        <RelationshipDisplay
          title="SME Partners"
          type="smePartners"
          itemIds={position.smePartners}
          items={smePartners}
        />
        <RelationshipDisplay
          title="SPIs"
          type="spis"
          itemIds={position.spis}
          items={spis}
        />
        <RelationshipDisplay
          title="SitReps"
          type="sitreps"
          itemIds={position.sitreps}
          items={sitreps}
        />
      </div>

      <RelationshipSelectionDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        position={position}
        onSave={handleSave}
      />
    </Card>
  );
}