import { useState, useCallback, memo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/db";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProjectDetailsComponent = memo(({ project: initialProject }: { project: Project }) => {
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const { data: smePartners = [] } = useQuery({
    queryKey: ['sme-partners'],
    queryFn: () => db.getAllSMEPartners()
  });

  const { data: spis = [] } = useQuery({
    queryKey: ['spis'],
    queryFn: () => db.getAllSPIs()
  });

  const { data: sitreps = [] } = useQuery({
    queryKey: ['sitreps'],
    queryFn: () => db.getAllSitReps()
  });

  const handleAddSME = async (smeId: string) => {
    try {
      const selectedSME = smePartners.find(partner => partner.id === smeId);
      if (!selectedSME) return;

      const updatedCollaborators = [...editedProject.collaborators];
      
      // Check if SME is already added
      if (!updatedCollaborators.some(c => c.id === selectedSME.id)) {
        updatedCollaborators.push({
          id: selectedSME.id,
          name: selectedSME.name,
          email: selectedSME.email,
          role: selectedSME.role,
          department: selectedSME.department,
          projects: selectedSME.projects || [],
          lastActive: new Date().toISOString(),
          type: 'sme' as const
        });

        const updatedProject = {
          ...editedProject,
          collaborators: updatedCollaborators
        };

        await db.addProject(updatedProject);
        setProject(updatedProject);
        toast({
          title: "Success",
          description: "SME partner added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add SME partner",
        variant: "destructive",
      });
    }
  };

  const handleProjectUpdate = (updates: Partial<Project>) => {
    setProject(current => ({ ...current, ...updates }));
  };

  return (
    <div className="container mx-auto px-4 space-y-6 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <ProjectHeader 
          project={editedProject} 
          isEditing={isEditing} 
          onUpdate={handleProjectUpdate}
        />
        <ProjectActions
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onUpdate={async () => {
            // Update logic here
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialDetails 
          project={editedProject}
          isEditing={isEditing}
          onUpdate={handleProjectUpdate}
        />

        <div className="space-y-6">
          {editedProject.collaborators?.some(c => c.type === 'sme') ? (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">SME Partners</h3>
              <div className="space-y-2">
                {editedProject.collaborators
                  .filter(c => c.type === 'sme')
                  .map(collaborator => (
                    <div key={collaborator.id} className="p-2 border rounded">
                      {collaborator.name}
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Add SME Partner</h3>
              <Select onValueChange={handleAddSME}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SME partner" />
                </SelectTrigger>
                <SelectContent>
                  {smePartners.map(partner => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <RelatedSPIs projectId={editedProject.id} spis={spis} />
      <RelatedSitReps projectId={editedProject.id} sitreps={sitreps} />
      <Fortune30Section project={editedProject} />
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