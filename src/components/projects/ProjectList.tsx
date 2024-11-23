import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { db } from '@/lib/db';
import { Project } from '@/lib/types';
import { Link, useNavigate } from 'react-router-dom';
import { defaultTechDomains } from "@/lib/types/techDomain";
import { DEPARTMENTS } from "@/lib/constants";
import { ProjectPartners } from './ProjectPartners';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      await db.init();
      const allProjects = await db.getAllProjects();
      setProjects(allProjects);
    };

    loadProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-yellow-500';
      case 'action-needed':
        return 'bg-red-700';
      default:
        return 'bg-gray-500';
    }
  };

  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const handleCollaboratorClick = (collaboratorId: string) => {
    navigate(`/collaborations/${collaboratorId}`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {projects.map((project) => (
        <Link 
          key={project.id} 
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
                <ProjectPartners
                  collaborators={[...(project.collaborators || []), ...(project.internalPartners || [])]}
                  onPartnerClick={handleCollaboratorClick}
                />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}