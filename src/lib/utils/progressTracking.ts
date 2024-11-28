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
    const progress = Array.from(this.steps.values())
      .map(step => `${step.name}: ${Math.round((step.current / step.total) * 100)}%`)
      .join('\n');

    toast({
      id: this.toastId || undefined,
      title: "Generating Data",
      description: progress,
    });
  }

  reset() {
    this.steps.clear();
    this.toastId = null;
  }
}

export const globalProgressTracker = new ProgressTracker();