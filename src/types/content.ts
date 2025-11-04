/**
 * Base structure for Squidex content items
 */
export interface SquidexContent<T = Record<string, any>> {
  /**
   * Unique content ID
   */
  id: string;

  /**
   * Timestamp when the content was created
   */
  created: string;

  /**
   * User who created the content
   */
  createdBy: string;

  /**
   * Timestamp when the content was last modified
   */
  lastModified: string;

  /**
   * User who last modified the content
   */
  lastModifiedBy: string;

  /**
   * Content data (schema-specific fields)
   */
  data: T;

  /**
   * Content version number
   */
  version: number;

  /**
   * Optional status of the content (e.g., "Published", "Draft")
   */
  status?: string;

  /**
   * Optional new status for update operations
   */
  newStatus?: string;
}

/**
 * Response for listing content items
 */
export interface SquidexContentList<T = Record<string, any>> {
  /**
   * Total number of items matching the query
   */
  total: number;

  /**
   * Array of content items
   */
  items: SquidexContent<T>[];
}

/**
 * Options for creating content
 */
export interface CreateContentOptions {
  /**
   * Whether to publish the content immediately
   * @default false
   */
  publish?: boolean;

  /**
   * Content ID (optional, Squidex will generate one if not provided)
   */
  id?: string;
}

/**
 * Options for updating content
 */
export interface UpdateContentOptions {
  /**
   * Whether to update as a patch (partial update)
   * @default false
   */
  patch?: boolean;

  /**
   * Expected version for optimistic concurrency control
   */
  expectedVersion?: number;
}

/**
 * Options for deleting content
 */
export interface DeleteContentOptions {
  /**
   * Whether to permanently delete (vs. soft delete)
   * @default false
   */
  permanent?: boolean;
}
