import { SquidexClient } from './client/squidex-client';
import { SquidexConfig } from './types/config';

/**
 * Global Squidex client instance
 */
let globalClient: SquidexClient | null = null;

/**
 * Configure the global Squidex client
 * This must be called before using any Squidex functions
 *
 * @param config - Client configuration
 *
 * @example
 * ```typescript
 * import { configure } from '@alloprof/squidex';
 *
 * configure({
 *   apiBaseUrl: 'http://localhost:8200/games',
 *   app: 'ap-pronom-ei'
 * });
 * ```
 */
export function configure(config: SquidexConfig): void {
  globalClient = new SquidexClient(config);
}

/**
 * Get the global Squidex client instance
 * Throws an error if configure() hasn't been called yet
 */
export function getClient(): SquidexClient {
  if (!globalClient) {
    throw new Error(
      'Squidex client not configured. Call configure() with your configuration before using Squidex functions.'
    );
  }
  return globalClient;
}

/**
 * Reset the global configuration (useful for testing)
 */
export function resetConfiguration(): void {
  globalClient = null;
}

/**
 * Check if the client is configured
 */
export function isConfigured(): boolean {
  return globalClient !== null;
}
