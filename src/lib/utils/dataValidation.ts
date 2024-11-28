import { Project, Collaborator } from '@/lib/types';
import { toast } from "@/components/ui/use-toast";

export const validateProjectData = (project: Project): boolean => {
  if (!project.id || !project.name || !project.departmentId) {
    toast({
      title: "Validation Error",
      description: "Project missing required fields",
      variant: "destructive",
    });
    return false;
  }

  if (!project.poc || !project.techLead) {
    toast({
      title: "Validation Error",
      description: "Project missing POC or Tech Lead",
      variant: "destructive",
    });
    return false;
  }

  if (project.budget < 0 || project.spent < 0) {
    toast({
      title: "Validation Error",
      description: "Project has invalid budget values",
      variant: "destructive",
    });
    return false;
  }

  return true;
};

export const validateCollaborator = (collaborator: Collaborator): boolean => {
  if (!collaborator.id || !collaborator.name || !collaborator.department) {
    toast({
      title: "Validation Error",
      description: "Collaborator missing required fields",
      variant: "destructive",
    });
    return false;
  }

  if (!collaborator.email || !collaborator.role) {
    toast({
      title: "Validation Error",
      description: "Collaborator missing contact information",
      variant: "destructive",
    });
    return false;
  }

  return true;
};