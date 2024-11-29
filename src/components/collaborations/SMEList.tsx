import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import { WorkstreamCard } from "./shared/WorkstreamCard";
import { ContactInfo } from "./shared/ContactInfo";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";

type SMEListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SMEList({ collaborators, onEdit, onDelete }: SMEListProps) {
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
  });

  const handleProjectAssociation = async (smeId: string, projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const sme = collaborators.find(c => c.id === smeId);
      if (!sme) return;

      const updatedProject = {
        ...project,
        collaborators: [...(project.collaborators || []), { ...sme, type: 'sme' }]
      };

      await db.addProject(updatedProject);
      toast({
        title: "Success",
        description: "SME associated with project successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to associate SME with project",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6">
      {collaborators.map((collaborator) => (
        <Card key={collaborator.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {collaborator.name}
                </h1>
                <CardDescription className="text-lg">{collaborator.role}</CardDescription>
              </div>
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(collaborator.id)}
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit collaborator</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(collaborator.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete collaborator</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Primary Contact</h4>
                {collaborator.primaryContact ? (
                  <ContactInfo contact={collaborator.primaryContact} />
                ) : (
                  <p className="text-sm text-muted-foreground">No primary contact set</p>
                )}

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Associate with Project</h4>
                  <Select
                    onValueChange={(value) => handleProjectAssociation(collaborator.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Associated Projects</h4>
                {collaborator.projects && collaborator.projects.length > 0 ? (
                  <div className="space-y-2">
                    {collaborator.projects.map((project) => (
                      <div key={project.id} className="p-3 border rounded-lg">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No projects associated</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}