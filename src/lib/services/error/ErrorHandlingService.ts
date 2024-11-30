import { toast } from "@/components/ui/use-toast";

type ErrorType = 'database' | 'validation' | 'network' | 'general' | 'form' | 'auth';

interface ErrorOptions {
  type?: ErrorType;
  title?: string;
  action?: () => void;
  retry?: () => Promise<void>;
}

class ErrorHandlingService {
  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  private getDefaultTitle(type?: ErrorType): string {
    switch (type) {
      case 'database':
        return 'Database Error';
      case 'validation':
        return 'Validation Error';
      case 'network':
        return 'Network Error';
      case 'form':
        return 'Form Error';
      case 'auth':
        return 'Authentication Error';
      default:
        return 'Error';
    }
  }

  handleError(error: unknown, options: ErrorOptions = {}) {
    const message = this.formatErrorMessage(error);
    const title = options.title || this.getDefaultTitle(options.type);

    console.error(`[${options.type || 'general'}] Error:`, error);

    toast({
      title,
      description: message,
      variant: "destructive",
      action: options.retry ? {
        label: "Retry",
        onClick: () => options.retry?.()
      } : undefined
    });

    if (options.action) {
      options.action();
    }
  }

  async withErrorHandling<T>(
    operation: () => Promise<T>,
    options: ErrorOptions = {}
  ): Promise<T | undefined> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, options);
      return undefined;
    }
  }
}

export const errorHandler = new ErrorHandlingService();