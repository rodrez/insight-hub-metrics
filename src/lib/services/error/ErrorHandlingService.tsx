import { toast } from "@/components/ui/use-toast";
import { ToastActionElement } from "@/components/ui/toast";
import { ReactNode } from "react";

export interface ErrorConfig {
  type: string;
  title: string;
  retry?: () => void;
  action?: ReactNode;
}

class ErrorHandlingService {
  handleError(error: unknown, config: ErrorConfig) {
    console.error(`${config.type} error:`, error);
    
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    
    toast({
      title: config.title,
      description: message,
      variant: "destructive",
      action: config.action as ToastActionElement
    });
  }

  async withErrorHandling<T>(
    operation: () => Promise<T>,
    config: ErrorConfig
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, config);
      throw error;
    }
  }
}

export const errorHandler = new ErrorHandlingService();