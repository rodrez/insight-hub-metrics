import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/lib/types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectSummaryProps {
  project: Project;
}

export function ProjectSummary({ project }: ProjectSummaryProps) {
  const remaining = project.budget - (project.spent || 0);
  const remainingPercentage = (remaining / project.budget) * 100;

  return (
    <div className="space-y-4 sticky top-0 z-10 bg-background pt-4 pb-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="mt-2 space-y-1 text-muted-foreground">
            <p>POC: {project.poc}</p>
            <p>Tech Lead: {project.techLead}</p>
          </div>
        </div>
        <Badge 
          variant={
            project.status === 'active' ? 'default' :
            project.status === 'completed' ? 'secondary' : 'destructive'
          }
          className="h-6"
        >
          {project.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Financial Overview
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current financial status of the project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Spent</p>
              <p className="text-2xl font-bold">${project.spent?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${remainingPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}