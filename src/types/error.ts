/**
 * Type for error details from API responses
 */
export interface ErrorDetails {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | ErrorDetails
    | ErrorDetails[];
}

/**
 * Custom error class for Squidex-related errors
 */
export class SquidexError extends Error {
  /**
   * HTTP status code (if applicable)
   */
  public readonly statusCode?: number;

  /**
   * Error details from Squidex API
   */
  public readonly details?: ErrorDetails;

  /**
   * Whether the error is retryable
   */
  public readonly retryable: boolean;

  constructor(
    message: string,
    statusCode?: number,
    details?: ErrorDetails,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'SquidexError';
    this.statusCode = statusCode;
    this.details = details;
    this.retryable = retryable;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SquidexError);
    }
  }
}

/**
 * Authentication error
 */
export class SquidexAuthError extends SquidexError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 401, details, false);
    this.name = 'SquidexAuthError';
  }
}

/**
 * Not found error
 */
export class SquidexNotFoundError extends SquidexError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 404, details, false);
    this.name = 'SquidexNotFoundError';
  }
}

/**
 * Validation error
 */
export class SquidexValidationError extends SquidexError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 400, details, false);
    this.name = 'SquidexValidationError';
  }
}

/**
 * Rate limit error
 */
export class SquidexRateLimitError extends SquidexError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 429, details, true);
    this.name = 'SquidexRateLimitError';
  }
}

/**
 * Network error
 */
export class SquidexNetworkError extends SquidexError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, undefined, details, true);
    this.name = 'SquidexNetworkError';
  }
}
