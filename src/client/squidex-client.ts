import { ContentService } from '../services/content.service';
import { SquidexConfig } from '../types/config';
import {
  SquidexContent,
  SquidexContentList,
  CreateContentOptions,
  UpdateContentOptions,
  DeleteContentOptions,
} from '../types/content';
import { SquidexQuery, QueryBuilder } from '../types/query';
import { HttpClient } from './http-client';

/**
 * Main client class for interacting with Squidex CMS via ap-games-api
 */
export class SquidexClient {
  private httpClient: HttpClient;
  private contentService: ContentService;
  private config: SquidexConfig;

  /**
   * Create a new Squidex client instance
   * @param config - Client configuration
   */
  constructor(config: SquidexConfig) {
    this.config = config;
    this.httpClient = new HttpClient(config);
    this.contentService = new ContentService(this.httpClient);
  }

  // ==================== Content Operations ====================

  /**
   * Get content items from a schema
   * @param schema - Schema name
   * @param query - Optional query parameters
   * @returns List of content items
   */
  async getContent<T = Record<string, any>>(
    schema: string,
    query?: SquidexQuery
  ): Promise<SquidexContentList<T>> {
    return this.contentService.getContent<T>(schema, query);
  }

  /**
   * Get a single content item by ID
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Content item
   */
  async getContentById<T = Record<string, any>>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    return this.contentService.getContentById<T>(schema, id);
  }

  /**
   * Create a new content item
   * @param schema - Schema name
   * @param data - Content data
   * @param options - Create options
   * @returns Created content item
   */
  async createContent<T = Record<string, any>>(
    schema: string,
    data: T,
    options?: CreateContentOptions
  ): Promise<SquidexContent<T>> {
    return this.contentService.createContent<T>(schema, data, options);
  }

  /**
   * Update an existing content item
   * @param schema - Schema name
   * @param id - Content ID
   * @param data - Updated content data
   * @param options - Update options
   * @returns Updated content item
   */
  async updateContent<T = Record<string, any>>(
    schema: string,
    id: string,
    data: Partial<T>,
    options?: UpdateContentOptions
  ): Promise<SquidexContent<T>> {
    return this.contentService.updateContent<T>(schema, id, data, options);
  }

  /**
   * Delete a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @param options - Delete options
   */
  async deleteContent(
    schema: string,
    id: string,
    options?: DeleteContentOptions
  ): Promise<void> {
    return this.contentService.deleteContent(schema, id, options);
  }

  /**
   * Publish a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async publishContent<T = Record<string, any>>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    return this.contentService.publishContent<T>(schema, id);
  }

  /**
   * Unpublish a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async unpublishContent<T = Record<string, any>>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    return this.contentService.unpublishContent<T>(schema, id);
  }

  /**
   * Archive a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async archiveContent<T = Record<string, any>>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    return this.contentService.archiveContent<T>(schema, id);
  }

  /**
   * Restore a content item from archive
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async restoreContent<T = Record<string, any>>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    return this.contentService.restoreContent<T>(schema, id);
  }

  // ==================== Query Builder ====================

  /**
   * Create a new query builder
   * @returns QueryBuilder instance
   */
  createQuery(): QueryBuilder {
    return new QueryBuilder();
  }

  // ==================== Utilities ====================

  /**
   * Get the underlying HTTP client (for advanced usage)
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Get the current configuration
   */
  getConfig(): SquidexConfig {
    return { ...this.config };
  }
}
