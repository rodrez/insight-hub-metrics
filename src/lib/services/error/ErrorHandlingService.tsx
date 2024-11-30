/** @jsxImportSource react */
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export type ErrorConfig = {
  type: 'database' | 'network' | 'validation';
  title: string;
  retry?: () => void;
};

class ErrorHandler {
  handleError(error: unknown, config: ErrorConfig) {
    console.error(`${config.type} error:`, error);
    
    toast({
      variant: "destructive",
      title: config.title,
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      action: config.retry ? (
        <ToastAction altText="Retry action" onClick={config.retry}>
          Retry
        </ToastAction>
      ) : undefined
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