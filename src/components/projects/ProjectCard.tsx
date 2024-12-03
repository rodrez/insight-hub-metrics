import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, AlertCircle } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
import { ProjectCardHeader } from './ProjectCardHeader';
import { ProjectCardProgress } from './ProjectCardProgress';
import { ProjectCardPartners } from './ProjectCardPartners';
import { getAllRatMembers, getRatMemberRole } from '@/lib/services/data/utils/ratMemberUtils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const displayRatMember = project.ratMember || getAllRatMembers()[Math.floor(Math.random() * getAllRatMembers().length)];
  const memberRole = getRatMemberRole(displayRatMember);

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
          <div className="mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700"
                  >
                    {project.ratMember ? (
                      <>
                        <BadgeCheck className="h-3.5 w-3.5" />
                        RAT: {displayRatMember}
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5" />
                        RAT: {displayRatMember}
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{project.ratMember ? `Assigned RAT Member - ${memberRole}` : `Suggested RAT Member - ${memberRole}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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