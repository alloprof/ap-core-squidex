import { AxiosError } from 'axios';
import {
  ErrorDetails,
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
    const errorDetails = toErrorDetails(data);
    const message = extractErrorMessage(data) || error.message;

    // Map status codes to specific error types
    switch (statusCode) {
      case 401:
      case 403:
        throw new SquidexAuthError(
          message || 'Authentication failed',
          errorDetails
        );

      case 404:
        throw new SquidexNotFoundError(
          message || 'Resource not found',
          errorDetails
        );

      case 400:
        throw new SquidexValidationError(
          message || 'Validation error',
          errorDetails
        );

      case 429:
        throw new SquidexRateLimitError(
          message || 'Rate limit exceeded',
          errorDetails
        );

      case 500:
      case 502:
      case 503:
      case 504:
        throw new SquidexError(
          message || 'Server error',
          statusCode,
          errorDetails,
          true // retryable
        );

      default:
        if (statusCode) {
          throw new SquidexError(
            message || 'Unknown error',
            statusCode,
            errorDetails,
            false
          );
        }
    }

    // Network error (no response)
    if (error.request && !error.response) {
      throw new SquidexNetworkError('Network error: No response from server', {
        message: error.message,
        code: error.code || '',
      });
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
    toErrorDetails(error)
  );
}

/**
 * Type guard to check if value is ErrorDetails
 */
function isErrorDetails(value: unknown): value is ErrorDetails {
  return typeof value === 'object' && value !== null;
}

/**
 * Safely convert unknown data to ErrorDetails
 */
function toErrorDetails(data: unknown): ErrorDetails | undefined {
  if (!data) return undefined;
  if (typeof data === 'string') return { message: data };
  if (isErrorDetails(data)) return data;
  return undefined;
}

/**
 * Extract error message from Squidex API response
 */
function extractErrorMessage(data: unknown): string | undefined {
  if (!data) return undefined;

  // Squidex typically returns errors in this format
  if (typeof data === 'string') {
    return data;
  }

  if (!isErrorDetails(data)) return undefined;

  if ('message' in data && typeof data.message === 'string') {
    return data.message;
  }

  if ('error' in data) {
    const error = data.error;
    if (typeof error === 'string') {
      return error;
    }
    if (
      isErrorDetails(error) &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      return error.message;
    }
  }

  // Handle validation errors
  if ('details' in data && Array.isArray(data.details)) {
    return data.details
      .map((d) => {
        if (typeof d === 'string') return d;
        if (
          isErrorDetails(d) &&
          'message' in d &&
          typeof d.message === 'string'
        )
          return d.message;
        return String(d);
      })
      .join(', ');
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
