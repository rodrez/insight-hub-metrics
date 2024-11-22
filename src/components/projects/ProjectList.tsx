import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { db } from '@/lib/db';
import { Project } from '@/lib/types';
import { Link } from 'react-router-dom';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {projects.map((project) => (
        <Link 
          key={project.id} 
          to={`/projects/${project.id}`}
          className="block transition-transform hover:scale-[1.01] duration-200"
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.nabc?.needs || "No description available"}
                  </p>
                </div>
                <Badge 
                  className={`${getStatusColor(project.status)} text-white`}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tech POC:</span>
                    <span className="font-medium">{project.techLead}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Program Manager:</span>
                    <span className="font-medium">{project.poc}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium">
                      {Math.round((project.spent / project.budget) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(project.spent / project.budget) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-1">Collaborators:</div>
                  <div className="flex flex-wrap gap-2">
                    {project.collaborators.map((collab) => (
                      <Badge
                        key={collab.id}
                        variant={collab.type === 'fortune30' ? 'default' : 'secondary'}
                        style={{ backgroundColor: collab.type === 'fortune30' ? collab.color : undefined }}
                        className="text-xs"
                      >
                        {collab.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}