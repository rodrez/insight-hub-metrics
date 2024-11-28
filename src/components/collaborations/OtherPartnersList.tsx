import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Info, ArrowUpDown } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

type OtherPartnersListProps = {
  collaborators: Collaborator[];
};

type SortField = 'name' | 'role' | 'department' | 'projects' | 'lastActive';
type SortDirection = 'asc' | 'desc';

export function OtherPartnersList({ collaborators }: OtherPartnersListProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const handleProjectClick = (projectId: string) => {
    navigate('/', { state: { scrollToProject: projectId } });
  };

  const uniqueCollaborators = collaborators.reduce((acc, current) => {
    const existingCollaborator = acc.find(item => item.id === current.id);
    if (!existingCollaborator) {
      acc.push(current);
    } else {
      if (new Date(current.lastActive) > new Date(existingCollaborator.lastActive)) {
        existingCollaborator.lastActive = current.lastActive;
      }
      if (current.projects) {
        existingCollaborator.projects = [
          ...existingCollaborator.projects,
          ...current.projects.filter(project => 
            !existingCollaborator.projects.some(p => p.id === project.id)
          )
        ];
      }
    }
    return acc;
  }, [] as Collaborator[]);

  const getCollaboratorProjects = (collaborator: Collaborator) => {
    const collaboratorProjects = allProjects.filter(project => 
      (project.internalPartners || []).some(partner => 
        partner.id === collaborator.id || 
        partner.name === collaborator.name
      ) ||
      project.poc === collaborator.name ||
      project.techLead === collaborator.name
    );

    const uniqueProjects = Array.from(new Set(collaboratorProjects.map(p => p.id)))
      .map(id => collaboratorProjects.find(p => p.id === id))
      .filter((project): project is NonNullable<typeof project> => project !== undefined)
      .map(project => ({
        id: project.id,
        name: project.name,
        nabc: project.nabc,
        status: project.status,
        pocDepartment: project.pocDepartment
      }));

    return uniqueProjects;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCollaborators = [...uniqueCollaborators].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'role':
        return multiplier * a.role.localeCompare(b.role);
      case 'department':
        return multiplier * a.department.localeCompare(b.department);
      case 'projects':
        return multiplier * ((a.projects?.length || 0) - (b.projects?.length || 0));
      case 'lastActive':
        return multiplier * (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime());
      default:
        return 0;
    }
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('name')}
                className="flex items-center gap-1"
              >
                Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('role')}
                className="flex items-center gap-1"
              >
                Role
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('department')}
                className="flex items-center gap-1"
              >
                Department
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('projects')}
                className="flex items-center gap-1"
              >
                Projects
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort('lastActive')}
                className="flex items-center gap-1"
              >
                Last Active
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCollaborators.map((collaborator) => {
            const collaboratorProjects = getCollaboratorProjects(collaborator);

            return (
              <TableRow key={collaborator.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{collaborator.name}</TableCell>
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
                    {collaboratorProjects.length > 0 ? (
                      collaboratorProjects.map((project) => (
                        <div 
                          key={project.id} 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          <Badge 
                            className="text-white"
                            style={{ 
                              backgroundColor: getDepartmentColor(project.pocDepartment),
                              borderColor: getDepartmentColor(project.pocDepartment)
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
                                <p>{project.nabc?.needs || "No description available"}</p>
                                <p>Status: {project.status || 'Not specified'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No active projects</span>
                    )}
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
          })}
        </TableBody>
      </Table>
    </div>
  );
}
