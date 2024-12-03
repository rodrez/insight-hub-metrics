import { useState, useCallback, memo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { NABCSection } from "./NABCSection";
import { MilestonesSection } from "./MilestonesSection";
import { Project } from "@/lib/types";
import { ProjectHeader } from "./ProjectHeader";
import { FinancialDetails } from "./FinancialDetails";
import { Fortune30Section } from "./Fortune30Section";
import { useQuery } from "@tanstack/react-query";
import { ProjectActions } from "./details/ProjectActions";
import { RelatedSPIs } from "./details/RelatedSPIs";
import { RelatedSitReps } from "./details/RelatedSitReps";
import { SMEPartnersSection } from "./SMEPartnersSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAllRatMembers } from "@/lib/services/data/utils/ratMemberUtils";

const ProjectDetailsComponent = memo(({ project: initialProject }: { project: Project }) => {
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const navigate = useNavigate();

  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const handleProjectUpdate = (updates: Partial<Project>) => {
    setProject(current => ({ ...current, ...updates }));
  };

  const handleRatMemberChange = async (ratMember: string) => {
    try {
      const updatedProject = { ...project, ratMember };
      await db.updateProject(project.id, updatedProject);
      setProject(updatedProject);
      toast({
        title: "Success",
        description: "RAT member updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update RAT member",
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      await db.updateProject(project.id, project);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Project changes have been saved successfully.",
      });
      navigate('/', { state: { scrollToProject: project.id } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project changes.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-6 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <ProjectHeader 
          project={editedProject} 
          isEditing={isEditing} 
          onUpdate={handleProjectUpdate}
        />
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rat-member">RAT Member</Label>
            <Select 
              value={project.ratMember || ""} 
              onValueChange={handleRatMemberChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select RAT member" />
              </SelectTrigger>
              <SelectContent>
                {getAllRatMembers().map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ProjectActions
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onUpdate={handleSaveChanges}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <FinancialDetails 
          project={editedProject}
          isEditing={isEditing}
          onUpdate={handleProjectUpdate}
        />
      </div>

      <RelatedSPIs projectId={editedProject.id} spis={spis} />
      <RelatedSitReps projectId={editedProject.id} sitreps={sitreps} />
      <Fortune30Section project={editedProject} />
      <SMEPartnersSection project={editedProject} onUpdate={setProject} />
      {editedProject.nabc && (
        <NABCSection 
          projectId={editedProject.id} 
          nabc={editedProject.nabc} 
          onUpdate={(nabc) => setProject({ ...editedProject, nabc })}
          isEditing={isEditing}
        />
      )}
      {editedProject.milestones && (
        <MilestonesSection
          projectId={editedProject.id}
          milestones={editedProject.milestones}
          onUpdate={(milestones) => setProject({ ...editedProject, milestones })}
          isEditing={isEditing}
        />
      )}
    </div>
  );
});

ProjectDetailsComponent.displayName = 'ProjectDetailsComponent';

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

export default ProjectDetailsWrapper;