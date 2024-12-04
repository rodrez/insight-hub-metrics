import { toast } from "@/components/ui/use-toast";

export type ErrorType = 'database' | 'validation' | 'network' | 'general';

interface ErrorOptions {
  type?: ErrorType;
  title?: string;
  action?: () => void;
  context?: Record<string, any>;
}

class ErrorHandlingService {
  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  private logErrorDetails(error: unknown, options: ErrorOptions) {
    const errorDetails = {
      type: options.type || 'general',
      message: this.formatErrorMessage(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: options.context || {},
      timestamp: new Date().toISOString()
    };

    console.error('Detailed error information:', errorDetails);
    
    // Log to browser console in a formatted way
    console.groupCollapsed(`Error: ${errorDetails.message}`);
    console.log('Type:', errorDetails.type);
    console.log('Context:', errorDetails.context);
    console.log('Timestamp:', errorDetails.timestamp);
    if (errorDetails.stack) {
      console.log('Stack trace:', errorDetails.stack);
    }
    console.groupEnd();
  }

  handleError(error: unknown, options: ErrorOptions = {}) {
    const message = this.formatErrorMessage(error);
    const title = options.title || this.getDefaultTitle(options.type);

    this.logErrorDetails(error, options);

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