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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type SMEPartnersSectionProps = {
  project: Project;
  onUpdate: (project: Project) => void;
};

export function SMEPartnersSection({ project, onUpdate }: SMEPartnersSectionProps) {
  const navigate = useNavigate();
  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const handlePartnerClick = (partnerId: string) => {
    navigate('/collaborations', { state: { scrollToPartner: partnerId } });
  };

  const handleAddSME = async (smeId: string) => {
    try {
      const selectedSME = smePartners.find(partner => partner.id === smeId);
      if (!selectedSME) return;

      const updatedCollaborators = [...project.collaborators];
      
      if (!updatedCollaborators.some(c => c.id === selectedSME.id)) {
        updatedCollaborators.push({
          id: selectedSME.id,
          name: selectedSME.name,
          email: selectedSME.email,
          role: selectedSME.role,
          department: selectedSME.department,
          projects: selectedSME.projects || [],
          lastActive: new Date().toISOString(),
          type: 'sme' as const
        });

        const updatedProject = {
          ...project,
          collaborators: updatedCollaborators
        };

        await db.addProject(updatedProject);
        onUpdate(updatedProject);
        toast({
          title: "Success",
          description: "SME partner added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SME partner",
        variant: "destructive",
      });
    }
  };

  const smeCollaborators = project.collaborators.filter(
    (collab) => collab.type === "sme"
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">SME Partners</CardTitle>
        <Select onValueChange={handleAddSME}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add SME partner" />
          </SelectTrigger>
          <SelectContent>
            {smePartners.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {smeCollaborators.map((partner) => (
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
                        variant="outline"
                        className="hover:opacity-90 transition-opacity"
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
          {smeCollaborators.length === 0 && (
            <p className="text-muted-foreground text-sm">No SME partners added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}