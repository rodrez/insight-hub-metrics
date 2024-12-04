export async function withRetry<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  backoff: number = 1.5
): Promise<T> {
  let lastError: Error | null = null;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        break;
      }

      console.info(`Waiting ${currentDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= backoff; // Increase delay for next attempt
    }
  }

  throw lastError || new Error('Operation failed after all retries');
}