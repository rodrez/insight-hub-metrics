import { Project } from '@/lib/types';

export const validateProject = (project: Project): boolean => {
  if (!project.id || !project.name || !project.departmentId) {
    console.error('Project missing required fields:', { id: project.id, name: project.name, departmentId: project.departmentId });
    return false;
  }

  if (!project.poc || !project.techLead) {
    console.error('Project missing POC or Tech Lead:', { poc: project.poc, techLead: project.techLead });
    return false;
  }

  if (project.budget < 0 || project.spent < 0) {
    console.error('Project has invalid budget values:', { budget: project.budget, spent: project.spent });
    return false;
  }

  return true;
};