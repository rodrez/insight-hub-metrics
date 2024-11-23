import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/constants";

interface ProjectHeaderProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export function ProjectHeader({ project, isEditing, onUpdate }: ProjectHeaderProps) {
  const getDepartmentName = (id: string) => {
    return DEPARTMENTS.find(d => d.id === id)?.name || id;
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="mt-2 space-y-1 text-muted-foreground">
            <p className="flex items-center gap-2">
              POC: {project.poc}
              <Badge variant="outline" className="text-xs">
                {getDepartmentName(project.pocDepartment)}
              </Badge>
            </p>
            <p className="flex items-center gap-2">
              Tech Lead: {project.techLead}
              <Badge variant="outline" className="text-xs">
                {getDepartmentName(project.techLeadDepartment)}
              </Badge>
            </p>
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
        <div className="space-y-2">
          <input
            type="text"
            value={project.poc}
            onChange={(e) => onUpdate({ poc: e.target.value })}
            className="bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary w-full"
            placeholder="POC"
          />
          <select
            value={project.pocDepartment}
            onChange={(e) => onUpdate({ pocDepartment: e.target.value })}
            className="bg-transparent border rounded p-1 w-full"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={project.techLead}
            onChange={(e) => onUpdate({ techLead: e.target.value })}
            className="bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary w-full"
            placeholder="Tech Lead"
          />
          <select
            value={project.techLeadDepartment}
            onChange={(e) => onUpdate({ techLeadDepartment: e.target.value })}
            className="bg-transparent border rounded p-1 w-full"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
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