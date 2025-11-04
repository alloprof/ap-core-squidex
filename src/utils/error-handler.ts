import { AxiosError } from 'axios';
import {
  SquidexError,
  SquidexAuthError,
  SquidexNotFoundError,
  SquidexValidationError,
  SquidexRateLimitError,
  SquidexNetworkError,
} from '../types/error';

/**
 * Handle errors from Squidex API calls
 */
export function handleSquidexError(error: unknown): never {
  // Check if it's an Axios error
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const data = error.response?.data;
    const message = extractErrorMessage(data) || error.message;

    // Map status codes to specific error types
    switch (statusCode) {
      case 401:
      case 403:
        throw new SquidexAuthError(
          message || 'Authentication failed',
          data
        );

      case 404:
        throw new SquidexNotFoundError(
          message || 'Resource not found',
          data
        );

      case 400:
        throw new SquidexValidationError(
          message || 'Validation error',
          data
        );

      case 429:
        throw new SquidexRateLimitError(
          message || 'Rate limit exceeded',
          data
        );

      case 500:
      case 502:
      case 503:
      case 504:
        throw new SquidexError(
          message || 'Server error',
          statusCode,
          data,
          true // retryable
        );

      default:
        if (statusCode) {
          throw new SquidexError(
            message || 'Unknown error',
            statusCode,
            data,
            false
          );
        }
    }

    // Network error (no response)
    if (error.request && !error.response) {
      throw new SquidexNetworkError(
        'Network error: No response from server',
        {
          message: error.message,
          code: error.code,
        }
      );
    }
  }

  // If it's already a SquidexError, re-throw it
  if (error instanceof SquidexError) {
    throw error;
  }

  // Unknown error type
  throw new SquidexError(
    error instanceof Error ? error.message : 'Unknown error occurred',
    undefined,
    error
  );
}

/**
 * Extract error message from Squidex API response
 */
function extractErrorMessage(data: any): string | undefined {
  if (!data) return undefined;

  // Squidex typically returns errors in this format
  if (typeof data === 'string') {
    return data;
  }

  if (data.message) {
    return data.message;
  }

  if (data.error) {
    if (typeof data.error === 'string') {
      return data.error;
    }
    if (data.error.message) {
      return data.error.message;
    }
  }

  // Handle validation errors
  if (data.details && Array.isArray(data.details)) {
    return data.details.map((d: any) => d.message || d).join(', ');
  }

  return undefined;
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof SquidexError) {
    return error.retryable;
  }

  // Network errors are generally retryable
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    return (
      !statusCode || // Network error
      statusCode === 429 || // Rate limit
      statusCode >= 500 // Server error
    );
  }

  return false;
}
