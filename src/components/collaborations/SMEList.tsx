import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Pen, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collaborator } from "@/lib/types/collaboration";
import { WorkstreamCard } from "./shared/WorkstreamCard";
import { ContactInfo } from "./shared/ContactInfo";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SMEListProps = {
  collaborators: Collaborator[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SMEList({ collaborators, onEdit, onDelete }: SMEListProps) {
  const navigate = useNavigate();
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const getAssociatedProjects = (collaborator: Collaborator) => {
    return allProjects.filter(project => 
      project.collaborators?.some(c => c.id === collaborator.id && c.type === 'sme')
    );
  };

  const handleProjectClick = (projectId: string) => {
    navigate('/', { state: { scrollToProject: projectId } });
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
                <CardDescription className="text-lg">
                  <span className="flex items-center gap-2">
                    Small Medium Enterprise Partner
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Partnership details and collaboration status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </CardDescription>
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
                      <p>Edit partnership details</p>
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
                      <p>Delete partnership</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">Business Contact</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Primary contact information for this SME partnership</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {collaborator.primaryContact ? (
                    <ContactInfo contact={collaborator.primaryContact} />
                  ) : (
                    <p className="text-sm text-muted-foreground">No business contact set</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">Associated Projects</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Projects currently in collaboration with this SME</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="space-y-2">
                    {getAssociatedProjects(collaborator).map(project => (
                      <div 
                        key={project.id} 
                        className="p-2 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.nabc?.needs || "No description available"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-medium">Partnership Activities</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Current activities and workstreams with this SME partner</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {collaborator.workstreams && collaborator.workstreams.length > 0 ? (
                  <div className="space-y-4">
                    {collaborator.workstreams.map((workstream) => (
                      <WorkstreamCard
                        key={workstream.id}
                        workstream={workstream}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No active partnership activities</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}