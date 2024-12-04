const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY = 1000; // 1 second

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  const initialDelay = options.initialDelay ?? DEFAULT_INITIAL_DELAY;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = initialDelay * Math.pow(2, attempt);
      options.onRetry?.(attempt + 1, lastError);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}