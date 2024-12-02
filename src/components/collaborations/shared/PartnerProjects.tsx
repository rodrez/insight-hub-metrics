import { Info } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PartnerProjectsProps = {
  collaborator: Collaborator;
  type: 'fortune30' | 'sme';
};

export function PartnerProjects({ collaborator, type }: PartnerProjectsProps) {
  const navigate = useNavigate();
  
  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects()
  });

  const getAssociatedProjects = () => {
    if (type === 'sme') {
      return allProjects.filter(project => 
        project.collaborators?.some(c => c.id === collaborator.id && c.type === 'sme')
      );
    }
    return collaborator.projects || [];
  };

  const handleProjectClick = (projectId: string) => {
    navigate('/', { state: { scrollToProject: projectId } });
  };

  const projects = getAssociatedProjects();

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-medium">Associated Projects</h4>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Projects currently in collaboration with this partner</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="space-y-2">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="p-2 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            onClick={() => handleProjectClick(project.id)}
            style={{ 
              borderColor: collaborator.color || '#333'
            }}
          >
            <p className="font-medium">{project.name}</p>
            <p className="text-sm text-muted-foreground">
              {project.nabc?.needs || "No description available"}
            </p>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">No associated projects</p>
        )}
      </div>
    </div>
  );
}