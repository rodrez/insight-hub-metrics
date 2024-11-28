import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep } from "../loadingRetry";

export const checkProjects = async (): Promise<boolean> => {
  const projects = await db.getAllProjects();
  return projects.length > 0;
};

export const validateProjectCollaborators = async (): Promise<boolean> => {
  const projects = await db.getAllProjects();
  return !projects.some(p => !p.collaborators || p.collaborators.length === 0);
};

export const projectChecksStep: LoadingStep = {
  name: "Projects Check",
  action: async () => {
    const projectsValid = await checkProjects();
    const collaboratorsValid = await validateProjectCollaborators();
    
    if (!projectsValid || !collaboratorsValid) {
      toast({
        title: "Projects Check Failed",
        description: "Please contact an administrator to resolve this issue.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }
};