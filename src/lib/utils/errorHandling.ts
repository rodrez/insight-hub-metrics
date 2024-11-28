import { toast } from "@/components/ui/use-toast";

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

  toast({
    title: "Database Error",
    description: message,
    variant: "destructive",
  });

  throw error;
};