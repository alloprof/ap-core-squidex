import { getClient } from './global-config';
import {
  SquidexContent,
  SquidexContentList,
  CreateContentOptions,
  UpdateContentOptions,
  DeleteContentOptions,
} from './types/content';
import { SquidexQuery, QueryBuilder } from './types/query';

/**
 * Get content items from a schema
 *
 * @param schema - Schema name
 * @param query - Optional query parameters
 * @returns List of content items
 *
 * @example
 * ```typescript
 * const response = await getContent('questions', {
 *   q: JSON.stringify({ random: 1 })
 * });
 * ```
 */
export async function getContent<T = Record<string, any>>(
  schema: string,
  query?: SquidexQuery
): Promise<SquidexContentList<T>> {
  return getClient().getContent<T>(schema, query);
}

/**
 * Get a single content item by ID
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @returns Content item
 *
 * @example
 * ```typescript
 * const content = await getContentById('questions', 'abc123');
 * ```
 */
export async function getContentById<T = Record<string, any>>(
  schema: string,
  id: string
): Promise<SquidexContent<T>> {
  return getClient().getContentById<T>(schema, id);
}

/**
 * Create a new content item
 *
 * @param schema - Schema name
 * @param data - Content data
 * @param options - Create options
 * @returns Created content item
 *
 * @example
 * ```typescript
 * const newContent = await createContent('questions', {
 *   title: { iv: 'New Question' }
 * }, { publish: true });
 * ```
 */
export async function createContent<T = Record<string, any>>(
  schema: string,
  data: T,
  options?: CreateContentOptions
): Promise<SquidexContent<T>> {
  return getClient().createContent<T>(schema, data, options);
}

/**
 * Update an existing content item
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @param data - Updated content data
 * @param options - Update options
 * @returns Updated content item
 *
 * @example
 * ```typescript
 * const updated = await updateContent('questions', 'abc123', {
 *   title: { iv: 'Updated Title' }
 * });
 * ```
 */
export async function updateContent<T = Record<string, any>>(
  schema: string,
  id: string,
  data: Partial<T>,
  options?: UpdateContentOptions
): Promise<SquidexContent<T>> {
  return getClient().updateContent<T>(schema, id, data, options);
}

/**
 * Delete a content item
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @param options - Delete options
 *
 * @example
 * ```typescript
 * await deleteContent('questions', 'abc123');
 * ```
 */
export async function deleteContent(
  schema: string,
  id: string,
  options?: DeleteContentOptions
): Promise<void> {
  return getClient().deleteContent(schema, id, options);
}

/**
 * Publish a content item
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @returns Updated content item
 *
 * @example
 * ```typescript
 * await publishContent('questions', 'abc123');
 * ```
 */
export async function publishContent<T = Record<string, any>>(
  schema: string,
  id: string
): Promise<SquidexContent<T>> {
  return getClient().publishContent<T>(schema, id);
}

/**
 * Unpublish a content item
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @returns Updated content item
 *
 * @example
 * ```typescript
 * await unpublishContent('questions', 'abc123');
 * ```
 */
export async function unpublishContent<T = Record<string, any>>(
  schema: string,
  id: string
): Promise<SquidexContent<T>> {
  return getClient().unpublishContent<T>(schema, id);
}

/**
 * Archive a content item
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @returns Updated content item
 *
 * @example
 * ```typescript
 * await archiveContent('questions', 'abc123');
 * ```
 */
export async function archiveContent<T = Record<string, any>>(
  schema: string,
  id: string
): Promise<SquidexContent<T>> {
  return getClient().archiveContent<T>(schema, id);
}

/**
 * Restore a content item from archive
 *
 * @param schema - Schema name
 * @param id - Content ID
 * @returns Updated content item
 *
 * @example
 * ```typescript
 * await restoreContent('questions', 'abc123');
 * ```
 */
export async function restoreContent<T = Record<string, any>>(
  schema: string,
  id: string
): Promise<SquidexContent<T>> {
  return getClient().restoreContent<T>(schema, id);
}

/**
 * Create a new query builder
 *
 * @returns QueryBuilder instance
 *
 * @example
 * ```typescript
 * const query = createQuery()
 *   .equals('data/status/iv', 'published')
 *   .greaterThan('data/views/iv', 100)
 *   .build();
 *
 * const content = await getContent('articles', query);
 * ```
 */
export function createQuery(): QueryBuilder {
  return new QueryBuilder();
}
