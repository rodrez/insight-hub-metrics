import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CollaborationDialog } from "../collaborations/CollaborationDialog";
import { useState } from "react";

type Fortune30SectionProps = {
  project: Project;
};

export function Fortune30Section({ project }: Fortune30SectionProps) {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const fortune30Partners = project.collaborators.filter(
    (collab) => collab.type === "fortune30"
  );

  const handlePartnerClick = (partnerId: string) => {
    navigate('/collaborations', { state: { scrollToPartner: partnerId } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Fortune 30 Partners</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Partner
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fortune30Partners.map((partner) => (
            <div 
              key={partner.id} 
              className="border rounded-lg p-4 space-y-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handlePartnerClick(partner.id)}
            >
              <div className="flex justify-between items-start">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge
                        style={{ backgroundColor: partner.color }}
                        className="text-white hover:opacity-90 transition-opacity"
                      >
                        {partner.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click to view partner details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Scope Summary:</p>
                <p>{partner.projects?.[0]?.description || "No scope defined"}</p>
              </div>
            </div>
          ))}
          {fortune30Partners.length === 0 && (
            <p className="text-muted-foreground text-sm">No Fortune 30 partners added yet.</p>
          )}
        </div>

        <CollaborationDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          departmentId={project.departmentId}
        />
      </CardContent>
    </Card>
  );
}