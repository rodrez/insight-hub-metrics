import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { RelationshipSelectionDialog } from "./RelationshipSelectionDialog";
import { RelationshipDisplay } from "./RelationshipDisplay";
import { OrgPosition } from "./types";
import { toast } from "@/components/ui/use-toast";

interface OrgPositionCardProps {
  title: string;
  width?: string;
}

export function OrgPositionCard({ title, width = "w-96" }: OrgPositionCardProps) {
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

  const handleSave = (updatedPosition: OrgPosition) => {
    setPosition(updatedPosition);
    toast({
      title: "Success",
      description: "Position relationships updated successfully",
    });
  };

  return (
    <Card className={`${width} p-6 shadow-lg animate-fade-in`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
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
          type="assignedProjects"
          itemIds={position.projects}
          itemType="project"
        />
        <RelationshipDisplay
          title="Fortune 30 Partners"
          type="assignedProjects"
          itemIds={position.fortune30Partners}
          itemType="fortune30"
        />
        <RelationshipDisplay
          title="SME Partners"
          type="assignedProjects"
          itemIds={position.smePartners}
          itemType="sme"
        />
        <RelationshipDisplay
          title="SPIs"
          type="assignedSpis"
          itemIds={position.spis}
          itemType="spi"
        />
        <RelationshipDisplay
          title="SitReps"
          type="assignedSitreps"
          itemIds={position.sitreps}
          itemType="sitrep"
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