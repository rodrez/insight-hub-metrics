import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { NABCSection } from "./NABCSection";
import { MilestonesSection } from "./MilestonesSection";
import { CollaboratorCard } from "@/components/projects/CollaboratorCard";
import { Project } from "@/lib/types";
import { TechDomainSelect } from "./TechDomainSelect";
import { ProjectHeader } from "./ProjectHeader";
import { FinancialDetails } from "./FinancialDetails";
import { Edit, Save } from "lucide-react";

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

function ProjectDetailsComponent({ project: initialProject }: { project: Project }) {
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleUpdate = async () => {
    try {
      await db.addProject(editedProject);
      setProject(editedProject);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditedProject(project);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProject(project);
    setIsEditing(false);
  };

  const updateProject = (updates: Partial<Project>) => {
    setEditedProject(prev => ({
      ...prev,
      ...updates
    }));
  };

  const currentProject = isEditing ? editedProject : project;

  return (
    <div className="container mx-auto px-4 space-y-6 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <ProjectHeader 
          project={currentProject} 
          isEditing={isEditing} 
          onUpdate={updateProject}
        />
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <FinancialDetails 
        project={currentProject}
        isEditing={isEditing}
        onUpdate={updateProject}
      />

      <TechDomainSelect
        value={currentProject.techDomainId}
        onValueChange={(value) => updateProject({ techDomainId: value })}
        disabled={!isEditing}
      />

      {currentProject.nabc && (
        <NABCSection 
          projectId={currentProject.id} 
          nabc={currentProject.nabc} 
          onUpdate={(nabc) => updateProject({ nabc })}
          isEditing={isEditing}
        />
      )}

      {currentProject.milestones && (
        <MilestonesSection
          projectId={currentProject.id}
          milestones={currentProject.milestones}
          onUpdate={(milestones) => updateProject({ milestones })}
          isEditing={isEditing}
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
