import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
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
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>
      
      <div className="grid gap-3">
        <RelationshipDisplay
          title="Projects"
          type="projects"
          itemIds={position.projects}
        />
        <RelationshipDisplay
          title="Fortune 30 Partners"
          type="fortune30Partners"
          itemIds={position.fortune30Partners}
        />
        <RelationshipDisplay
          title="SME Partners"
          type="smePartners"
          itemIds={position.smePartners}
        />
        <RelationshipDisplay
          title="SPIs"
          type="spis"
          itemIds={position.spis}
        />
        <RelationshipDisplay
          title="SitReps"
          type="sitreps"
          itemIds={position.sitreps}
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