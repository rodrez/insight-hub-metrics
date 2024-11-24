import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      await db.init();
      const allProjects = await db.getAllProjects();
      setProjects(allProjects);
    };

    loadProjects();
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}