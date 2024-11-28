import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { NABCSection } from "./NABCSection";
import { MilestonesSection } from "./MilestonesSection";
import { Project } from "@/lib/types";
import { TechDomainSelect } from "./TechDomainSelect";
import { ProjectHeader } from "./ProjectHeader";
import { FinancialDetails } from "./FinancialDetails";
import { Edit, Save, FileText, Target } from "lucide-react";
import { Fortune30Section } from "./Fortune30Section";
import { InternalPartnersSection } from "./InternalPartnersSection";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const { data: spis } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

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

  const getStatusColor = (status: 'on-track' | 'delayed' | 'completed' | 'at-risk' | 'cancelled') => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-red-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialDetails 
          project={currentProject}
          isEditing={isEditing}
          onUpdate={updateProject}
        />

        <div className="space-y-6">
          <TechDomainSelect
            value={currentProject.techDomainId}
            onValueChange={(value) => updateProject({ techDomainId: value })}
            disabled={!isEditing}
          />

          <InternalPartnersSection
            partners={currentProject.internalPartners || []}
            onUpdate={(partners) => updateProject({ internalPartners: partners })}
            isEditing={isEditing}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Related SPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TooltipProvider>
            {spis?.filter(spi => spi.projectId === currentProject.id).map(spi => (
              <div key={spi.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(spi.status)}>{spi.status}</Badge>
                  <Tooltip>
                    <TooltipTrigger className="text-left">
                      <span>{spi.name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {spi.status === 'completed' 
                          ? `Completed on ${format(new Date(spi.actualCompletionDate!), 'PPP')}`
                          : `Due by ${format(new Date(spi.expectedCompletionDate), 'PPP')}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-muted-foreground">{spi.deliverable}</p>
              </div>
            ))}
          </TooltipProvider>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Related SitReps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TooltipProvider>
            {sitreps?.filter(sitrep => sitrep.projectId === currentProject.id)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(sitrep => (
                <div key={sitrep.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(sitrep.status)}>{sitrep.status}</Badge>
                    <Tooltip>
                      <TooltipTrigger className="text-left">
                        <span>{sitrep.title}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Created on {format(new Date(sitrep.date), 'PPP')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-muted-foreground">{sitrep.summary}</p>
                </div>
              ))}
          </TooltipProvider>
        </CardContent>
      </Card>

      <Fortune30Section project={currentProject} />

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
    </div>
  );
}

export default ProjectDetailsWrapper;
