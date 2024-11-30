import { ErrorConfig } from "../services/error/ErrorHandlingService";

export function handleError(error: unknown, config: Omit<ErrorConfig, 'action'>) {
  console.error(`${config.type} error:`, error);
  
  return {
    type: config.type,
    title: config.title,
    retry: config.retry,
    message: error instanceof Error ? error.message : "An unexpected error occurred"
  };
}