import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { defaultTechDomains } from "@/lib/types/techDomain";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { DEPARTMENTS } from "@/lib/constants";

export default function RadarPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Radar...</h2>
        </div>
      </div>
    );
  }

  const techDomainProjects = defaultTechDomains.map(domain => ({
    ...domain,
    projects: projects.filter(p => p.techDomainId === domain.id)
  }));

  const maxProjects = Math.max(...techDomainProjects.map(d => d.projects.length));
  const getCirclePosition = (index: number, total: number, radius: number) => {
    const angle = (index * 2 * Math.PI) / total;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    };
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Technology Radar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 relative aspect-square radar-background">
          <div className="absolute inset-0">
            {techDomainProjects.map((domain, index) => {
              const position = getCirclePosition(
                index,
                techDomainProjects.length,
                35
              );
              return (
                <div
                  key={domain.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="rounded-full flex items-center justify-center text-white font-bold transition-transform hover:scale-110"
                          style={{
                            backgroundColor: domain.color,
                            width: `${Math.max(30, (domain.projects.length / maxProjects) * 80)}px`,
                            height: `${Math.max(30, (domain.projects.length / maxProjects) * 80)}px`,
                          }}
                        >
                          {domain.projects.length}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{domain.name}</p>
                        <p>{domain.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          {techDomainProjects.map(domain => (
            <Card key={domain.id} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold">{domain.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{domain.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="grid gap-2">
                {domain.projects.map(project => (
                  <TooltipProvider key={project.id}>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div 
                          className="p-2 rounded text-white text-left w-full hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: DEPARTMENTS.find(d => d.id === project.departmentId)?.color }}
                        >
                          {project.name}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p><strong>Department:</strong> {DEPARTMENTS.find(d => d.id === project.departmentId)?.name}</p>
                          <p><strong>POC:</strong> {project.poc}</p>
                          <p><strong>Tech Lead:</strong> {project.techLead}</p>
                          <p><strong>Status:</strong> {project.status}</p>
                          {project.nabc?.needs && (
                            <p><strong>Description:</strong> {project.nabc.needs}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}