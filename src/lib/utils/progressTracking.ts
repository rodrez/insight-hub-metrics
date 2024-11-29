import { toast } from "@/components/ui/use-toast";

export interface ProgressStep {
  name: string;
  total: number;
  current: number;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export class ProgressTracker {
  private steps: Map<string, ProgressStep>;

  constructor() {
    this.steps = new Map();
  }

  addStep(name: string, total: number) {
    this.steps.set(name, { 
      name, 
      total, 
      current: 0, 
      status: 'pending' 
    });
    
    // Show initial toast when starting data generation
    toast({
      title: "Generating Sample Data",
      description: "Please wait while the database is being populated...",
      duration: 5000,
    });
  }

  updateProgress(stepName: string, current: number) {
    const step = this.steps.get(stepName);
    if (step) {
      step.current = current;
      step.status = current === step.total ? 'completed' : 'in-progress';
      
      // Check if all steps are completed
      const allCompleted = Array.from(this.steps.values())
        .every(step => step.status === 'completed' || step.status === 'error');
        
      if (allCompleted) {
        toast({
          title: "Success",
          description: "Sample data generation completed",
          duration: 3000,
        });
      }
    }
  }

  setStepError(stepName: string) {
    const step = this.steps.get(stepName);
    if (step) {
      step.status = 'error';
      toast({
        title: "Error",
        description: `Error generating ${stepName}`,
        variant: "destructive",
      });
    }
  }

  reset() {
    this.steps.clear();
  }
}

export const globalProgressTracker = new ProgressTracker();

export const trackGenerationProgress = (stepName: string, progress: number) => {
  globalProgressTracker.updateProgress(stepName, progress);
};