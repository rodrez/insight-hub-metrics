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

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
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

  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  // Get unique collaborators
  const uniqueCollaborators = Array.from(
    new Set(
      project.collaborators
        .filter(collab => collab.type === 'fortune30')
        .map(collab => collab.id)
    )
  ).map(id => {
    const collaborator = project.collaborators.find(collab => collab.id === id)!;
    // Ensure department is set
    if (!collaborator.department) {
      collaborator.department = 'it'; // Default to IT department if none specified
    }
    return collaborator;
  });

  // Create a Set of already displayed people (POC and Tech Lead)
  const displayedPeople = new Set([project.poc, project.techLead]);

  // Filter internal partners to exclude POC and Tech Lead
  const uniqueInternalPartners = Array.from(
    new Set(
      (project.internalPartners || [])
        .filter(partner => !displayedPeople.has(partner.name))
        .map(partner => partner.id)
    )
  ).map(id => {
    const partner = project.internalPartners?.find(partner => partner.id === id)!;
    // Ensure department is set
    if (!partner.department) {
      partner.department = 'it'; // Default to IT department if none specified
    }
    return partner;
  });

  // Show warning toast if there are duplicates
  const duplicatePartners = project.internalPartners?.filter(partner => 
    displayedPeople.has(partner.name)
  ) || [];

  if (duplicatePartners.length > 0) {
    toast({
      title: "Duplicate Team Members Detected",
      description: `${duplicatePartners.map(p => p.name).join(", ")} ${duplicatePartners.length === 1 ? "is" : "are"} already listed as POC or Tech Lead and will not be shown in Internal Partners.`,
      variant: "default"
    });
  }

  return (
    <Link 
      id={`project-${project.id}`}
      to={`/projects/${project.id}`}
      className="block transition-transform hover:scale-[1.01] duration-200"
    >
      <Card className="overflow-hidden">
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
                            backgroundColor: defaultTechDomains.find(d => d.id === project.techDomainId)?.color,
                            color: 'white'
                          }}
                        >
                          {defaultTechDomains.find(d => d.id === project.techDomainId)?.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{defaultTechDomains.find(d => d.id === project.techDomainId)?.description}</p>
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p>Department: {DEPARTMENTS.find(d => d.id === project.pocDepartment)?.name}</p>
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
                      <p>Department: {DEPARTMENTS.find(d => d.id === project.techLeadDepartment)?.name}</p>
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
            <div className="space-y-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Fortune 30 Partners:</div>
                <div className="flex flex-wrap gap-2">
                  {uniqueCollaborators.map((collab) => (
                    <ProjectPartnerBadge 
                      key={`${project.id}-${collab.id}`}
                      partner={collab}
                      departmentColor={getDepartmentColor(collab.department)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Internal Partners:</div>
                <div className="flex flex-wrap gap-2">
                  {uniqueInternalPartners.map((partner) => (
                    <ProjectPartnerBadge 
                      key={`${project.id}-${partner.id}`}
                      partner={partner}
                      departmentColor={getDepartmentColor(partner.department)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}