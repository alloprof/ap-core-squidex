import { HttpClient } from '../client/http-client';
import {
  SquidexContent,
  SquidexContentList,
  SquidexData,
  CreateContentOptions,
  UpdateContentOptions,
  DeleteContentOptions,
} from '../types/content';
import { SquidexQuery } from '../types/query';

/**
 * Service for managing Squidex content via ap-games-api
 */
export class ContentService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get content items from a schema
   * @param schema - Schema name
   * @param query - Optional query parameters
   * @returns List of content items
   */
  async getContent<T = SquidexData>(
    schema: string,
    query?: SquidexQuery
  ): Promise<SquidexContentList<T>> {
    const url = `/squidex/content/${schema}`;
    return this.httpClient.get<SquidexContentList<T>>(url, {
      params: query,
    });
  }

  /**
   * Get a single content item by ID
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Content item
   */
  async getContentById<T = SquidexData>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}/${id}`;
    return this.httpClient.get<SquidexContent<T>>(url);
  }

  /**
   * Create a new content item
   * @param schema - Schema name
   * @param data - Content data
   * @param options - Create options
   * @returns Created content item
   */
  async createContent<T = SquidexData>(
    schema: string,
    data: T,
    options?: CreateContentOptions
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}`;
    return this.httpClient.post<SquidexContent<T>>(url, data, {
      params: {
        publish: options?.publish,
        id: options?.id,
      },
    });
  }

  /**
   * Update an existing content item
   * @param schema - Schema name
   * @param id - Content ID
   * @param data - Updated content data
   * @param options - Update options
   * @returns Updated content item
   */
  async updateContent<T = SquidexData>(
    schema: string,
    id: string,
    data: Partial<T>,
    options?: UpdateContentOptions
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}/${id}`;

    const method = options?.patch ? 'patch' : 'put';
    const headers: Record<string, string> = {};

    if (options?.expectedVersion !== undefined) {
      headers['If-Match'] = String(options.expectedVersion);
    }

    return this.httpClient[method]<SquidexContent<T>>(url, data, {
      headers,
    });
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
    const url = `/squidex/content/${schema}/${id}`;
    await this.httpClient.delete<void>(url, {
      params: {
        permanent: options?.permanent,
      },
    });
  }

  /**
   * Publish a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async publishContent<T = SquidexData>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}/${id}/publish`;
    return this.httpClient.put<SquidexContent<T>>(url);
  }

  /**
   * Unpublish a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async unpublishContent<T = SquidexData>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}/${id}/unpublish`;
    return this.httpClient.put<SquidexContent<T>>(url);
  }

  /**
   * Archive a content item
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async archiveContent<T = SquidexData>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}/${id}/archive`;
    return this.httpClient.put<SquidexContent<T>>(url);
  }

  /**
   * Restore a content item from archive
   * @param schema - Schema name
   * @param id - Content ID
   * @returns Updated content item
   */
  async restoreContent<T = SquidexData>(
    schema: string,
    id: string
  ): Promise<SquidexContent<T>> {
    const url = `/squidex/content/${schema}/${id}/restore`;
    return this.httpClient.put<SquidexContent<T>>(url);
  }
}
