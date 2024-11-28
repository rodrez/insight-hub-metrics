import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { ProjectCard } from './ProjectCard';
import { useDataInitialization } from '@/components/data/hooks/useDataInitialization';

export default function ProjectList() {
  const { isInitialized } = useDataInitialization();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => db.getAllProjects(),
    enabled: isInitialized
  });

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}