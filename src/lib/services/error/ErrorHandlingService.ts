import { toast } from "@/components/ui/use-toast";

export type ErrorType = 'database' | 'validation' | 'network' | 'general';

interface ErrorOptions {
  type?: ErrorType;
  title?: string;
  action?: () => void;
}

class ErrorHandlingService {
  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  handleError(error: unknown, options: ErrorOptions = {}) {
    const message = this.formatErrorMessage(error);
    const title = options.title || this.getDefaultTitle(options.type);

    console.error(`[${options.type || 'general'}] Error:`, error);

    toast({
      title,
      description: message,
      variant: "destructive",
    });

    if (options.action) {
      options.action();
    }
  }

  private getDefaultTitle(type?: ErrorType): string {
    switch (type) {
      case 'database':
        return 'Database Error';
      case 'validation':
        return 'Validation Error';
      case 'network':
        return 'Network Error';
      default:
        return 'Error';
    }
  }
}

export const errorHandler = new ErrorHandlingService();