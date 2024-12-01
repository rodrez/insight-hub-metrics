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
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";

type Fortune30SectionProps = {
  project: Project;
};

export function Fortune30Section({ project }: Fortune30SectionProps) {
  const navigate = useNavigate();
  const { data: fortune30Partners = [] } = useQuery({
    queryKey: ['collaborators-fortune30'],
    queryFn: async () => {
      const allCollaborators = await db.getAllCollaborators();
      return allCollaborators.filter(c => c.type === 'fortune30');
    },
  });

  const handlePartnerClick = (partnerId: string) => {
    navigate('/collaborations', { state: { scrollToPartner: partnerId } });
  };

  const handleAddPartner = async (partnerId: string) => {
    try {
      const selectedPartner = fortune30Partners.find(partner => partner.id === partnerId);
      if (!selectedPartner) return;

      const updatedCollaborators = [...project.collaborators];
      
      if (!updatedCollaborators.some(c => c.id === selectedPartner.id)) {
        updatedCollaborators.push({
          id: selectedPartner.id,
          name: selectedPartner.name,
          email: selectedPartner.email,
          role: selectedPartner.role,
          department: selectedPartner.department,
          projects: selectedPartner.projects || [],
          lastActive: new Date().toISOString(),
          type: 'fortune30' as const
        });

        const updatedProject = {
          ...project,
          collaborators: updatedCollaborators
        };

        await db.addProject(updatedProject);
        toast({
          title: "Success",
          description: "Fortune 30 partner added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add Fortune 30 partner",
        variant: "destructive",
      });
    }
  };

  const fortune30Partners = project.collaborators.filter(
    (collab) => collab.type === "fortune30"
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Fortune 30 Partners</CardTitle>
        <Select onValueChange={handleAddPartner}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Add partner" />
          </SelectTrigger>
          <SelectContent>
            {fortune30Partners.map(partner => (
              <SelectItem key={partner.id} value={partner.id}>
                {partner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      </CardContent>
    </Card>
  );
}