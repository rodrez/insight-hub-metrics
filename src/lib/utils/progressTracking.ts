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
  }

  updateProgress(stepName: string, current: number) {
    const step = this.steps.get(stepName);
    if (step) {
      step.current = current;
      step.status = current === step.total ? 'completed' : 'in-progress';
      
      // Show progress toast
      toast({
        title: `Generating ${stepName}`,
        description: `Progress: ${Math.round((current / step.total) * 100)}%`,
        duration: 1000,
      });
    }
  }

  getTotalProgress(): number {
    if (this.steps.size === 0) return 0;
    
    let totalProgress = 0;
    let totalSteps = 0;
    
    this.steps.forEach(step => {
      totalProgress += (step.current / step.total) * 100;
      totalSteps++;
    });
    
    return Math.round(totalProgress / totalSteps);
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