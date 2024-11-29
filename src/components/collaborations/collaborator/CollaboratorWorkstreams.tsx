import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pen, Trash2 } from "lucide-react";
import { Workstream } from "@/lib/types/collaboration";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";

type CollaboratorWorkstreamsProps = {
  workstreams?: Workstream[];
  collaboratorId: string;
};

export function CollaboratorWorkstreams({ workstreams, collaboratorId }: CollaboratorWorkstreamsProps) {
  const queryClient = useQueryClient();
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = async (workstreamId: string) => {
    try {
      const collaborator = await db.getCollaborator(collaboratorId);
      if (!collaborator) return;

      const updatedWorkstreams = collaborator.workstreams?.filter(w => w.id !== workstreamId) || [];
      await db.addCollaborator({
        ...collaborator,
        workstreams: updatedWorkstreams
      });

      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      
      toast({
        title: "Workstream deleted",
        description: "The workstream has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workstream",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (workstream: Workstream) => {
    // TODO: Implement edit functionality in a separate PR
    toast({
      title: "Coming soon",
      description: "Edit functionality will be implemented soon",
    });
  };

  if (!workstreams?.length) {
    return (
      <div>
        <h4 className="font-medium mb-4">Workstreams</h4>
        <p className="text-sm text-muted-foreground">No workstreams defined</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-4">Workstreams</h4>
      <div className="space-y-4">
        {workstreams.map((workstream) => (
          <Card key={workstream.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-medium">{workstream.title}</h5>
                  <Badge variant={
                    workstream.status === 'active' ? 'default' :
                    workstream.status === 'completed' ? 'secondary' :
                    'outline'
                  }>
                    {workstream.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(workstream)}
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(workstream.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Objectives:</p>
                  <p className="text-muted-foreground">{workstream.objectives}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-medium">Next Steps:</p>
                  <p className="text-muted-foreground">{workstream.nextSteps}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {formatDate(workstream.lastUpdated)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}