/** @jsxImportSource react */
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ReactNode } from "react";

export type ErrorConfig = {
  type: 'database' | 'network' | 'validation';
  title: string;
  retry?: () => void;
  action?: ReactNode;
};

class ErrorHandler {
  handleError(error: unknown, config: ErrorConfig) {
    console.error(`${config.type} error:`, error);
    
    toast({
      variant: "destructive",
      title: config.title,
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      action: config.retry ? (
        <ToastAction altText="Try again" onClick={config.retry}>
          Retry
        </ToastAction>
      ) : config.action
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

export const errorHandler = new ErrorHandler();