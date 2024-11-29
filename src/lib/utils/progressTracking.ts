import { toast } from "@/components/ui/use-toast";

export interface ProgressStep {
  name: string;
  total: number;
  current: number;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export class ProgressTracker {
  private steps: Map<string, ProgressStep>;
  private updateInterval: number | null = null;
  private lastToastTime: number = 0;
  private readonly TOAST_THROTTLE = 1000; // Minimum time between toasts in ms

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
    this.startProgressUpdates();
  }

  updateProgress(stepName: string, current: number) {
    const step = this.steps.get(stepName);
    if (step) {
      step.current = current;
      step.status = current === step.total ? 'completed' : 'in-progress';
      this.showProgress();
    }
  }

  setStepError(stepName: string) {
    const step = this.steps.get(stepName);
    if (step) {
      step.status = 'error';
      this.showProgress();
    }
  }

  private startProgressUpdates() {
    if (this.updateInterval === null) {
      this.updateInterval = window.setInterval(() => {
        this.showProgress();
      }, 2000) as unknown as number; // Increased interval to 2 seconds
    }
  }

  private stopProgressUpdates() {
    if (this.updateInterval !== null) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private shouldShowToast(): boolean {
    const now = Date.now();
    if (now - this.lastToastTime >= this.TOAST_THROTTLE) {
      this.lastToastTime = now;
      return true;
    }
    return false;
  }

  private showProgress() {
    if (!this.shouldShowToast()) {
      return;
    }

    const progressLines = Array.from(this.steps.values())
      .map(step => {
        const percentage = Math.round((step.current / step.total) * 100);
        const status = step.status === 'error' ? '❌' : 
                      step.status === 'completed' ? '✅' : 
                      step.status === 'in-progress' ? '⏳' : '⏳';
        return `${status} ${step.name}: ${percentage}%`;
      })
      .join('\n');

    const allCompleted = Array.from(this.steps.values())
      .every(step => step.status === 'completed' || step.status === 'error');

    toast({
      title: "Generating Sample Data",
      description: progressLines,
      duration: allCompleted ? 3000 : 5000,
    });

    if (allCompleted) {
      this.stopProgressUpdates();
    }
  }

  reset() {
    this.steps.clear();
    this.stopProgressUpdates();
    this.lastToastTime = 0;
  }
}

export const globalProgressTracker = new ProgressTracker();

export const trackGenerationProgress = (stepName: string, progress: number) => {
  globalProgressTracker.updateProgress(stepName, progress);
};