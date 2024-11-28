import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { ProjectCard } from './ProjectCard';
import { useDataInitialization } from '@/components/data/hooks/useDataInitialization';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function ProjectList() {
  const { isInitialized } = useDataInitialization();

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
    enabled: isInitialized
  });

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load projects. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}