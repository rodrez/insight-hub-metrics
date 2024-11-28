import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Project } from '@/lib/types';
import { Link } from 'react-router-dom';
import { defaultTechDomains } from "@/lib/types/techDomain";
import { DEPARTMENTS } from "@/lib/constants";
import { ProjectPartnerBadge } from './ProjectPartnerBadge';
import { toast } from "@/components/ui/use-toast";
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardProgress } from './ProjectCardProgress';
import { ProjectCardPartners } from './ProjectCardPartners';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  return (
    <Link 
      id={`project-${project.id}`}
      to={`/projects/${project.id}`}
      className="block transition-transform hover:scale-[1.01] duration-200"
    >
      <Card className="overflow-hidden">
        <ProjectCardHeader 
          project={project} 
          techDomains={defaultTechDomains} 
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCardProgress 
              project={project}
              getDepartmentColor={getDepartmentColor}
            />
            <ProjectCardPartners 
              project={project}
              getDepartmentColor={getDepartmentColor}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}