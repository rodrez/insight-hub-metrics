import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep } from "../loadingRetry";

export const checkCollaborators = async (): Promise<{
  fortune30: boolean;
  internal: boolean;
}> => {
  const collaborators = await db.getAllCollaborators();
  const fortune30 = collaborators.filter(c => c.type === 'fortune30');
  const internal = collaborators.filter(c => c.type === 'other');
  return {
    fortune30: fortune30.length > 0,
    internal: internal.length > 0
  };
};

export const collaboratorChecksStep: LoadingStep = {
  name: "Collaborators Check",
  action: async () => {
    const { fortune30, internal } = await checkCollaborators();
    if (!fortune30 || !internal) {
      toast({
        title: "Collaborators Check Failed",
        description: "Please contact an administrator to resolve this issue.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }
};