/**
 * Query parameters for filtering and sorting content
 */
export interface SquidexQuery {
  /**
   * Maximum number of items to return
   */
  $top?: number;

  /**
   * Number of items to skip (for pagination)
   */
  $skip?: number;

  /**
   * OData filter expression
   * @example "data/title/iv eq 'Hello World'"
   */
  $filter?: string;

  /**
   * Field to sort by
   * @example "data/title/iv desc"
   */
  $orderby?: string;

  /**
   * Full-text search query
   */
  $search?: string;
}

/**
 * Builder for constructing OData filter expressions
 */
export class QueryBuilder {
  private filters: string[] = [];
  private orderByClause?: string;
  private topLimit?: number;
  private skipOffset?: number;
  private searchQuery?: string;

  /**
   * Add an equals filter
   * @param field - Field path (e.g., "data/title/iv")
   * @param value - Value to compare
   */
  equals(field: string, value: string | number | boolean): this {
    const formattedValue = typeof value === 'string' ? `'${value}'` : value;
    this.filters.push(`${field} eq ${formattedValue}`);
    return this;
  }

  /**
   * Add a not equals filter
   */
  notEquals(field: string, value: string | number | boolean): this {
    const formattedValue = typeof value === 'string' ? `'${value}'` : value;
    this.filters.push(`${field} ne ${formattedValue}`);
    return this;
  }

  /**
   * Add a greater than filter
   */
  greaterThan(field: string, value: number): this {
    this.filters.push(`${field} gt ${value}`);
    return this;
  }

  /**
   * Add a greater than or equal filter
   */
  greaterThanOrEqual(field: string, value: number): this {
    this.filters.push(`${field} ge ${value}`);
    return this;
  }

  /**
   * Add a less than filter
   */
  lessThan(field: string, value: number): this {
    this.filters.push(`${field} lt ${value}`);
    return this;
  }

  /**
   * Add a less than or equal filter
   */
  lessThanOrEqual(field: string, value: number): this {
    this.filters.push(`${field} le ${value}`);
    return this;
  }

  /**
   * Add a contains filter (for strings)
   */
  contains(field: string, value: string): this {
    this.filters.push(`contains(${field}, '${value}')`);
    return this;
  }

  /**
   * Add a starts with filter (for strings)
   */
  startsWith(field: string, value: string): this {
    this.filters.push(`startswith(${field}, '${value}')`);
    return this;
  }

  /**
   * Add an ends with filter (for strings)
   */
  endsWith(field: string, value: string): this {
    this.filters.push(`endswith(${field}, '${value}')`);
    return this;
  }

  /**
   * Add an in filter (value in array)
   */
  in(field: string, values: (string | number)[]): this {
    const formattedValues = values
      .map((v) => (typeof v === 'string' ? `'${v}'` : v))
      .join(',');
    this.filters.push(`${field} in (${formattedValues})`);
    return this;
  }

  /**
   * Add a custom filter expression
   */
  raw(expression: string): this {
    this.filters.push(expression);
    return this;
  }

  /**
   * Set the order by clause
   * @param field - Field to sort by
   * @param direction - Sort direction (default: "asc")
   */
  orderBy(field: string, direction: 'asc' | 'desc' = 'asc'): this {
    this.orderByClause = `${field} ${direction}`;
    return this;
  }

  /**
   * Set the maximum number of results
   */
  top(limit: number): this {
    this.topLimit = limit;
    return this;
  }

  /**
   * Set the number of results to skip
   */
  skip(offset: number): this {
    this.skipOffset = offset;
    return this;
  }

  /**
   * Set a full-text search query
   */
  search(query: string): this {
    this.searchQuery = query;
    return this;
  }

  /**
   * Build the final query object
   */
  build(): SquidexQuery {
    const query: SquidexQuery = {};

    if (this.filters.length > 0) {
      query.$filter = this.filters.join(' and ');
    }

    if (this.orderByClause) {
      query.$orderby = this.orderByClause;
    }

    if (this.topLimit !== undefined) {
      query.$top = this.topLimit;
    }

    if (this.skipOffset !== undefined) {
      query.$skip = this.skipOffset;
    }

    if (this.searchQuery) {
      query.$search = this.searchQuery;
    }

    return query;
  }
}
