/**
 * Utility class for building Squidex API URLs
 */
export class UrlBuilder {
  private baseUrl: string;
  private appName: string;

  constructor(baseUrl: string, appName: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.appName = appName;
  }

  /**
   * Get the identity server URL for OAuth2 authentication
   */
  getIdentityUrl(): string {
    return `${this.baseUrl}/identity-server/connect/token`;
  }

  /**
   * Get the GraphQL endpoint URL
   */
  getGraphQLUrl(): string {
    return `${this.baseUrl}/api/content/${this.appName}/graphql`;
  }

  /**
   * Get the content API base URL for a schema
   */
  getContentApiUrl(schema: string): string {
    return `${this.baseUrl}/api/content/${this.appName}/${schema}`;
  }

  /**
   * Get the URL for a specific content item
   */
  getContentItemUrl(schema: string, id: string): string {
    return `${this.baseUrl}/api/content/${this.appName}/${schema}/${id}`;
  }

  /**
   * Get the URL for assets API
   */
  getAssetsUrl(): string {
    return `${this.baseUrl}/api/apps/${this.appName}/assets`;
  }

  /**
   * Get the URL for a specific asset
   */
  getAssetUrl(id: string): string {
    return `${this.baseUrl}/api/apps/${this.appName}/assets/${id}`;
  }

  /**
   * Get the URL for schemas API
   */
  getSchemasUrl(): string {
    return `${this.baseUrl}/api/apps/${this.appName}/schemas`;
  }

  /**
   * Get the URL for a specific schema
   */
  getSchemaUrl(schema: string): string {
    return `${this.baseUrl}/api/apps/${this.appName}/schemas/${schema}`;
  }

  /**
   * Build URL with query parameters
   */
  buildUrlWithParams(baseUrl: string, params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
}
