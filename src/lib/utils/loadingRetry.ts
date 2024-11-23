import { toast } from "@/components/ui/use-toast";

export type LoadingStep = {
  name: string;
  action: () => Promise<boolean>;
};

export const executeWithRetry = async (
  step: LoadingStep,
  maxRetries: number = 3
): Promise<boolean> => {
  let attempts = 0;
  
  while (attempts < maxRetries) {
    try {
      const success = await step.action();
      if (success) return true;
      
      attempts++;
      if (attempts < maxRetries) {
        toast({
          title: `Retrying ${step.name}`,
          description: `Attempt ${attempts + 1} of ${maxRetries}...`,
          variant: "default",
        });
        // Wait briefly before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error in ${step.name}:`, error);
      attempts++;
    }
  }
  
  return false;
};