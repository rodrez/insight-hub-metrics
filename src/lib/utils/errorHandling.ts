import { toast } from "@/components/ui/use-toast";
import { errorHandler } from "@/lib/services/error/ErrorHandlingService";

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export const handleDatabaseError = (error: unknown, operation: string) => {
  console.error(`Database error during ${operation}:`, error);
  
  const message = error instanceof DatabaseError 
    ? error.message 
    : 'An unexpected error occurred';

  errorHandler.handleError(error, {
    type: 'database',
    title: 'Database Error',
    action: () => {
      console.error('Additional error context:', { operation, error });
    }
  });

  throw error;
};