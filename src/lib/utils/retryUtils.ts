interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoff?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

export async function withRetry<T>(
  action: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = 1.5,
    onRetry,
    shouldRetry = () => true
  } = options;

  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries || !shouldRetry(lastError)) {
        break;
      }

      if (onRetry) {
        onRetry(attempt, lastError);
      }

      console.info(`Waiting ${currentDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoff;
    }
  }

  throw lastError || new Error('Operation failed after all retries');
}