import { useParams } from "react-router-dom";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { NABCSection } from "./NABCSection";
import { MilestonesSection } from "./MilestonesSection";
import { Project } from "@/lib/types";
import { TechDomainSelect } from "./TechDomainSelect";
import { ProjectHeader } from "./ProjectHeader";
import { FinancialDetails } from "./FinancialDetails";
import { Fortune30Section } from "./Fortune30Section";
import { InternalPartnersSection } from "./InternalPartnersSection";
import { useQuery } from "@tanstack/react-query";
import { ProjectActions } from "./details/ProjectActions";
import { RelatedSPIs } from "./details/RelatedSPIs";
import { RelatedSitReps } from "./details/RelatedSitReps";

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

  return (
    <div className="container mx-auto px-4 space-y-6 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <ProjectHeader 
          project={currentProject} 
          isEditing={isEditing} 
          onUpdate={updateProject}
        />
        <ProjectActions
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
        />
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

      <RelatedSPIs spis={spis || []} projectId={currentProject.id} />
      <RelatedSitReps sitreps={sitreps || []} projectId={currentProject.id} />
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