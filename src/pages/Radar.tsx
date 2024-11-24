import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DEPARTMENTS } from "@/lib/constants";
import { defaultTechDomains } from "@/lib/types/techDomain";
import { Card } from "@/components/ui/card";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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

  // Transform projects data for the radar chart
  const techDomainData = defaultTechDomains.map(domain => {
    const domainProjects = projects.filter(p => p.techDomainId === domain.id);
    return {
      subject: domain.name,
      value: domainProjects.length,
      projects: domainProjects,
    };
  });

  const getDepartmentColor = (departmentId: string) => {
    return DEPARTMENTS.find(d => d.id === departmentId)?.color || '#333';
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold mb-8">Technology Radar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={techDomainData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Tooltip />
                <Radar
                  name="Projects"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-6">
          {defaultTechDomains.map(domain => {
            const domainProjects = projects.filter(p => p.techDomainId === domain.id);
            
            return (
              <Card key={domain.id} className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold">{domain.name}</h3>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{domain.description}</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
                
                <div className="grid gap-2">
                  {domainProjects.map(project => (
                    <TooltipProvider key={project.id}>
                      <UITooltip>
                        <TooltipTrigger className="w-full">
                          <div 
                            className="p-2 rounded text-white text-left w-full hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: getDepartmentColor(project.departmentId) }}
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
                      </UITooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}