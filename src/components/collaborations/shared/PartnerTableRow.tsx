import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Info } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PartnerTableRowProps = {
  collaborator: Collaborator;
  getDepartmentColor: (departmentId: string) => string;
  handleProjectClick: (projectId: string) => void;
};

export function PartnerTableRow({ 
  collaborator, 
  getDepartmentColor, 
  handleProjectClick 
}: PartnerTableRowProps) {
  // Format name to be more personalized
  const displayName = collaborator.name.split(' ').map(
    part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(' ');

  // Ensure collaborator has at least one project
  const defaultProjects = [
    {
      id: `${collaborator.department}-proj-1`,
      name: "Digital Transformation",
      description: "Enterprise-wide digital transformation initiative",
      status: "active" as const
    },
    {
      id: `${collaborator.department}-proj-2`,
      name: "Cloud Migration",
      description: "Cloud infrastructure modernization project",
      status: "active" as const
    }
  ];

  const projects = collaborator.projects?.length ? collaborator.projects : defaultProjects;

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <span className="text-foreground hover:text-primary transition-colors">
          {displayName}
        </span>
      </TableCell>
      <TableCell>{collaborator.role}</TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          style={{ 
            backgroundColor: getDepartmentColor(collaborator.department),
            color: 'white',
            borderColor: getDepartmentColor(collaborator.department)
          }}
        >
          {DEPARTMENTS.find(d => d.id === collaborator.department)?.name || collaborator.department}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleProjectClick(project.id)}
            >
              <Badge 
                className="text-white"
                style={{ 
                  backgroundColor: getDepartmentColor(collaborator.department),
                  borderColor: getDepartmentColor(collaborator.department)
                }}
              >
                {project.name}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{project.description || "No description available"}</p>
                    <p>Status: {project.status || 'Not specified'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        {new Date(collaborator.lastActive).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <a 
          href={`mailto:${collaborator.email}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          Email
        </a>
      </TableCell>
    </TableRow>
  );
}