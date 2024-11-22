import { useParams, useNavigate } from "react-router-dom";
import { Project } from "@/lib/types";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectSummary } from "./sections/ProjectSummary";
import { ProjectNABC } from "./sections/ProjectNABC";
import { ProjectMilestones } from "./sections/ProjectMilestones";

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

function ProjectDetailsComponent({ project }: { project: Project }) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 space-y-8 py-6 animate-fade-in">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <ProjectSummary project={project} />

      {project.nabc && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">NABC Framework</h2>
          <ProjectNABC nabc={project.nabc} />
        </div>
      )}

      {project.milestones && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Project Timeline</h2>
          <ProjectMilestones milestones={project.milestones} />
        </div>
      )}
    </div>
  );
}

export default ProjectDetailsWrapper;