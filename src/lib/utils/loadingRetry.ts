import { toast } from "@/components/ui/use-toast";

export type LoadingStep = {
  name: string;
  action: () => Promise<boolean>;
  retryDelay?: number;
};

export const executeWithRetry = async (
  step: LoadingStep,
  maxRetries: number = 3
): Promise<boolean> => {
  let attempts = 0;
  const delay = step.retryDelay || 1000;
  
  const loadingToast = toast({
    title: `Executing ${step.name}`,
    description: "Please wait...",
  });
  
  while (attempts < maxRetries) {
    try {
      console.log(`Attempting ${step.name} (attempt ${attempts + 1}/${maxRetries})`);
      const success = await step.action();
      
      if (success) {
        console.log(`${step.name} completed successfully`);
        toast({
          title: `${step.name} Complete`,
          description: "Operation completed successfully ✓",
        });
        return true;
      }
      
      attempts++;
      if (attempts < maxRetries) {
        console.log(`${step.name} failed, retrying in ${delay}ms...`);
        toast({
          title: `Retrying ${step.name}`,
          description: `Attempt ${attempts + 1} of ${maxRetries}...`,
          variant: "default",
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Error in ${step.name}:`, error);
      attempts++;
      
      if (attempts < maxRetries) {
        console.log(`Error in ${step.name}, retrying in ${delay}ms...`);
        toast({
          title: `Error in ${step.name}`,
          description: `Retrying... (Attempt ${attempts + 1} of ${maxRetries})`,
          variant: "destructive",
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`${step.name} failed after ${maxRetries} attempts`);
  toast({
    title: `${step.name} Failed`,
    description: "Please contact an administrator for assistance.",
    variant: "destructive",
  });
  
  return false;
};