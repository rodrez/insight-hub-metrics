import { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDown, 
  ArrowRight, 
  ArrowUp, 
  Calendar, 
  DollarSign, 
  Users,
  Info,
  Milestone,
  TrendingUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { NABCSection } from "./NABCSection";
import { MilestonesSection } from "./MilestonesSection";

interface ProjectDetailsProps {
  project: Project;
}

function ProjectDetailsWrapper() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      try {
        await db.init();
        const loadedProject = await db.getProject(id);
        if (loadedProject) {
          setProject(loadedProject);
        }
      } catch (error) {
        toast({
          title: "Error loading project",
          description: "Could not load project details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return <ProjectDetailsComponent project={project} />;
}

function ProjectDetailsComponent({ project: initialProject }: ProjectDetailsProps) {
  const navigate = useNavigate();
  const [project, setProject] = useState(initialProject);

  const handleCollaboratorClick = (collaboratorId: string) => {
    navigate(`/collaborations?company=${collaboratorId}`);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowRight className="h-4 w-4 text-yellow-500" />;
    }
  };

  const remaining = project.budget - (project.spent || 0);
  const remainingPercentage = (remaining / project.budget) * 100;

  const handleNabcUpdate = (newNabc: typeof project.nabc) => {
    setProject(prev => ({
      ...prev,
      nabc: newNabc
    }));
  };

  const handleMilestonesUpdate = (newMilestones: typeof project.milestones) => {
    setProject(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  return (
    <div className="container mx-auto px-4 space-y-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="mt-2 space-y-1 text-muted-foreground">
            <p>POC: {project.poc}</p>
            <p>Tech Lead: {project.techLead}</p>
          </div>
        </div>
        <Badge variant={
          project.status === 'active' ? 'default' :
          project.status === 'completed' ? 'secondary' : 'destructive'
        }>
          {project.status}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  Total Budget
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total allocated budget for the project</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  Spent
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Amount spent to date</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-2xl font-bold">${project.spent?.toLocaleString() || 0}</p>
            </div>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-2">
                  Remaining
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remaining budget</p>
                </TooltipContent>
              </Tooltip>
              <p className="text-2xl font-bold">${remaining.toLocaleString()}</p>
              <Progress value={remainingPercentage} className="h-2" />
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaborations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.collaborators?.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                style={{ borderLeft: `4px solid ${collaborator.color}` }}
                onClick={() => handleCollaboratorClick(collaborator.id)}
              >
                <div>
                  <p className="font-medium">{collaborator.name}</p>
                  <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                </div>
                <Badge variant={collaborator.type === 'fortune30' ? 'default' : 'secondary'}>
                  {collaborator.type === 'fortune30' ? 'Fortune 30' : 'Partner'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* NABC Framework */}
      {project.nabc && (
        <NABCSection 
          projectId={project.id} 
          nabc={project.nabc} 
          onUpdate={handleNabcUpdate}
        />
      )}

      {/* Milestones Section */}
      {project.milestones && (
        <MilestonesSection
          projectId={project.id}
          milestones={project.milestones}
          onUpdate={handleMilestonesUpdate}
        />
      )}

      {project.metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.metrics.map((metric) => (
                <div key={metric.id} className="p-4 border rounded-lg">
                  <TooltipProvider>
                    <div className="flex items-center justify-between mb-2">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          <span className="font-medium">{metric.name}</span>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{metric.description}</p>
                        </TooltipContent>
                      </Tooltip>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </TooltipProvider>
                  <div className="text-2xl font-bold mb-2">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Target: {metric.target} {metric.unit}
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProjectDetailsWrapper;
