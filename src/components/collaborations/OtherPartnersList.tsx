import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PartnerTableRow } from "./shared/PartnerTableRow";
import { useState } from "react";

type OtherPartnersListProps = {
  collaborators: Collaborator[];
};

type SortField = 'name' | 'role' | 'department' | 'projects' | 'lastActive';
type SortDirection = 'asc' | 'desc';

const REALISTIC_ROLES = [
  "Technical Program Manager",
  "Senior Software Engineer",
  "Product Manager",
  "Systems Architect",
  "Research Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "UX Research Lead",
  "Innovation Strategist",
  "Cloud Solutions Architect"
];

export function OtherPartnersList({ collaborators }: OtherPartnersListProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: allProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
  });

  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const handleProjectClick = (projectId: string) => {
    navigate('/', { state: { scrollToProject: projectId } });
  };

  // Enhance collaborator data with realistic roles
  const enhancedCollaborators = collaborators.map(collab => ({
    ...collab,
    role: REALISTIC_ROLES[Math.floor(Math.random() * REALISTIC_ROLES.length)]
  }));

  const uniqueCollaborators = enhancedCollaborators.reduce((acc, current) => {
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
        return multiplier * (a.role || '').localeCompare(b.role || '');
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
          {sortedCollaborators.map((collaborator) => (
            <PartnerTableRow
              key={collaborator.id}
              collaborator={collaborator}
              getDepartmentColor={getDepartmentColor}
              handleProjectClick={handleProjectClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}