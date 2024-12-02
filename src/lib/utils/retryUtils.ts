import { toast } from "@/components/ui/use-toast";
import { DatabaseError } from "./errorHandling";

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffFactor?: number;
  operation: string;
}

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> => {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffFactor = 2,
    operation: operationName
  } = options;

  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        console.error(`Operation ${operationName} failed after ${maxAttempts} attempts:`, error);
        toast({
          title: "Operation Failed",
          description: `${operationName} failed after ${maxAttempts} attempts. Please try again.`,
          variant: "destructive",
        });
        throw new DatabaseError(`${operationName} failed after ${maxAttempts} attempts: ${lastError.message}`);
      }

      console.warn(`Attempt ${attempt} failed for ${operationName}, retrying in ${currentDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoffFactor;
    }
  }

  throw lastError;
};