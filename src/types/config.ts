/**
 * Configuration options for the Squidex client SDK
 * This client communicates with ap-games-api, not directly with Squidex
 */
export interface SquidexClientConfig {
  /**
   * Base URL of the ap-games-api instance
   * @example "https://api-games.alloprof.ca"
   * @example "http://localhost:8200"
   */
  apiBaseUrl: string;

  /**
   * Optional timeout for HTTP requests in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Optional number of retry attempts for failed requests
   * @default 3
   */
  retries?: number;

  /**
   * Optional delay between retries in milliseconds
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Optional custom headers to include in requests
   */
  headers?: Record<string, string>;
}

/**
 * Environment type for configuration
 */
export type ApiEnvironment = 'local' | 'staging' | 'production';
