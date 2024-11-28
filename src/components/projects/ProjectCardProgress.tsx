import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Project } from '@/lib/types';

interface ProjectCardProgressProps {
  project: Project;
  getDepartmentColor: (departmentId: string) => string;
}

export function ProjectCardProgress({ project, getDepartmentColor }: ProjectCardProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">POC:</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                style={{ backgroundColor: getDepartmentColor(project.pocDepartment) }}
                className="text-white"
              >
                {project.poc}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Point of Contact</p>
              <p>Department: {project.pocDepartment}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Tech Lead:</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                style={{ backgroundColor: getDepartmentColor(project.techLeadDepartment) }}
                className="text-white"
              >
                {project.techLead}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Technical Lead</p>
              <p>Department: {project.techLeadDepartment}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress:</span>
        <span className="font-medium">
          {Math.round((project.spent / project.budget) * 100)}%
        </span>
      </div>
      <Progress 
        value={(project.spent / project.budget) * 100} 
        className="h-2"
      />
    </div>
  );
}