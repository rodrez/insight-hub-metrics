import { toast } from "@/components/ui/use-toast";

export interface ProgressStep {
  name: string;
  total: number;
  current: number;
}

export class ProgressTracker {
  private steps: Map<string, ProgressStep>;
  private toastId: string | null = null;

  constructor() {
    this.steps = new Map();
  }

  addStep(name: string, total: number) {
    this.steps.set(name, { name, total, current: 0 });
  }

  updateProgress(stepName: string, current: number) {
    const step = this.steps.get(stepName);
    if (step) {
      step.current = current;
      this.showProgress();
    }
  }

  private showProgress() {
    const progressLines = Array.from(this.steps.values())
      .map(step => {
        const percentage = Math.round((step.current / step.total) * 100);
        return `${step.name}: ${percentage}%`;
      })
      .join('\n');

    toast({
      title: "Generating Data",
      description: progressLines,
      duration: 3000,
    });
  }

  reset() {
    this.steps.clear();
    this.toastId = null;
  }
}

export const globalProgressTracker = new ProgressTracker();

export const trackGenerationProgress = (stepName: string, progress: number) => {
  globalProgressTracker.updateProgress(stepName, progress);
};