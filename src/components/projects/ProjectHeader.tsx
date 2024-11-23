import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";

interface ProjectHeaderProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export function ProjectHeader({ project, isEditing, onUpdate }: ProjectHeaderProps) {
  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="mt-2 space-y-1 text-muted-foreground">
            <p>POC: {project.poc}</p>
            <p>Tech Lead: {project.techLead}</p>
          </div>
        </div>
        <Badge variant={
          project.status === 'active' ? 'default' :
          project.status === 'completed' ? 'secondary' : 'destructive'
        }>
          {project.status}
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={project.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="text-3xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={project.poc}
          onChange={(e) => onUpdate({ poc: e.target.value })}
          className="bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary"
          placeholder="POC"
        />
        <input
          type="text"
          value={project.techLead}
          onChange={(e) => onUpdate({ techLead: e.target.value })}
          className="bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary"
          placeholder="Tech Lead"
        />
      </div>
      <select
        value={project.status}
        onChange={(e) => onUpdate({ status: e.target.value as Project['status'] })}
        className="bg-transparent border rounded p-1"
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="on-hold">On Hold</option>
      </select>
    </div>
  );
}