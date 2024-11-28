import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Project } from '@/lib/types';
import { TechDomain } from '@/lib/types/techDomain';

interface ProjectCardHeaderProps {
  project: Project;
  techDomains: TechDomain[];
}

export function ProjectCardHeader({ project, techDomains }: ProjectCardHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <CardHeader className="pb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CardTitle className="text-xl">{project.name}</CardTitle>
            {project.techDomainId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: techDomains.find(d => d.id === project.techDomainId)?.color,
                        color: 'white'
                      }}
                    >
                      {techDomains.find(d => d.id === project.techDomainId)?.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{techDomains.find(d => d.id === project.techDomainId)?.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.nabc?.needs || "No description available"}
          </p>
        </div>
        <Badge 
          className={`${getStatusColor(project.status)} text-white`}
        >
          {project.status}
        </Badge>
      </div>
    </CardHeader>
  );
}