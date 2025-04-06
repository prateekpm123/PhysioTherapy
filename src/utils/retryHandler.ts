// import { FailedResponseDto } from "../dtos/FailedResponseDto";

export class RetryError extends Error {
  constructor(message: string, public attempts: number) {
    super(message);
    this.name = 'RetryError';
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 8,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw new RetryError(`Operation failed after ${attempt} attempts`, attempt);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  throw lastError || new Error('Operation failed');
} 