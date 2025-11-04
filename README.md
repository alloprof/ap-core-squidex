# @alloprof/squidex

TypeScript client library for Squidex CMS via ap-games-api.

## Overview

`@alloprof/squidex` is a TypeScript client SDK that provides a simple, type-safe interface to interact with Squidex CMS through the `ap-games-api` backend. This package is designed to be used by Alloprof frontend and backend applications.

### Architecture

```
@alloprof/squidex → ap-games-api → Squidex CMS
```

- **@alloprof/squidex**: Client SDK (this package)
- **ap-games-api**: Backend proxy that handles authentication and communicates with Squidex
- **Squidex CMS**: Content management system

## Installation

```bash
npm install @alloprof/squidex
```

or

```bash
yarn add @alloprof/squidex
```

## Quick Start

```typescript
import { SquidexClient } from '@alloprof/squidex';

// Initialize the client
const client = new SquidexClient({
  apiBaseUrl: 'https://api-games.alloprof.ca',
});

// Fetch content
const content = await client.getContent('exercises', {
  $top: 10,
  $filter: "data/difficulty/iv eq 'easy'",
});

console.log(content.items);
```

## Configuration

### SquidexClientConfig

```typescript
interface SquidexClientConfig {
  // Base URL of the ap-games-api instance (required)
  apiBaseUrl: string;

  // Optional: Timeout for HTTP requests in milliseconds (default: 30000)
  timeout?: number;

  // Optional: Number of retry attempts (default: 3)
  retries?: number;

  // Optional: Delay between retries in milliseconds (default: 1000)
  retryDelay?: number;

  // Optional: Custom headers
  headers?: Record<string, string>;
}
```

### Environment Examples

**Local Development:**
```typescript
const client = new SquidexClient({
  apiBaseUrl: 'http://localhost:8200',
});
```

**Staging:**
```typescript
const client = new SquidexClient({
  apiBaseUrl: 'https://api-games-staging.alloprof.ca',
});
```

**Production:**
```typescript
const client = new SquidexClient({
  apiBaseUrl: 'https://api-games.alloprof.ca',
});
```

## Usage

### Fetching Content

#### Get all content from a schema

```typescript
const result = await client.getContent('exercises');
console.log(result.total); // Total number of items
console.log(result.items); // Array of content items
```

#### Get content with filtering

```typescript
const result = await client.getContent('exercises', {
  $filter: "data/difficulty/iv eq 'easy'",
  $top: 10,
  $skip: 0,
  $orderby: 'created desc',
});
```

#### Get a single content item by ID

```typescript
const exercise = await client.getContentById('exercises', 'content-id-123');
console.log(exercise.data);
```

### Using QueryBuilder

The `QueryBuilder` provides a fluent API for constructing OData queries:

```typescript
const query = client
  .createQuery()
  .equals('data/difficulty/iv', 'easy')
  .contains('data/title/iv', 'math')
  .orderBy('created', 'desc')
  .top(20)
  .skip(0)
  .build();

const result = await client.getContent('exercises', query);
```

#### QueryBuilder Methods

- `equals(field, value)` - Field equals value
- `notEquals(field, value)` - Field not equals value
- `greaterThan(field, value)` - Field greater than value
- `lessThan(field, value)` - Field less than value
- `contains(field, value)` - String contains value
- `startsWith(field, value)` - String starts with value
- `endsWith(field, value)` - String ends with value
- `in(field, values)` - Field in array of values
- `orderBy(field, direction)` - Sort by field ('asc' or 'desc')
- `top(limit)` - Limit number of results
- `skip(offset)` - Skip number of results (pagination)
- `search(query)` - Full-text search
- `raw(expression)` - Add raw OData expression

### Creating Content

```typescript
interface ExerciseData {
  title: { iv: string };
  difficulty: { iv: string };
  description: { iv: string };
}

const newExercise = await client.createContent<ExerciseData>(
  'exercises',
  {
    title: { iv: 'New Math Exercise' },
    difficulty: { iv: 'medium' },
    description: { iv: 'Practice algebraic equations' },
  },
  {
    publish: true, // Publish immediately
  }
);

console.log(newExercise.id);
```

### Updating Content

#### Full update (PUT)

```typescript
const updated = await client.updateContent(
  'exercises',
  'content-id-123',
  {
    title: { iv: 'Updated Title' },
    difficulty: { iv: 'hard' },
  }
);
```

#### Partial update (PATCH)

```typescript
const updated = await client.updateContent(
  'exercises',
  'content-id-123',
  {
    difficulty: { iv: 'hard' },
  },
  {
    patch: true, // Use PATCH instead of PUT
  }
);
```

#### Update with version control

```typescript
const updated = await client.updateContent(
  'exercises',
  'content-id-123',
  { difficulty: { iv: 'hard' } },
  {
    expectedVersion: 5, // Ensures you're updating the correct version
  }
);
```

### Deleting Content

```typescript
// Soft delete
await client.deleteContent('exercises', 'content-id-123');

// Permanent delete
await client.deleteContent('exercises', 'content-id-123', {
  permanent: true,
});
```

### Content Status Management

```typescript
// Publish content
await client.publishContent('exercises', 'content-id-123');

// Unpublish content
await client.unpublishContent('exercises', 'content-id-123');

// Archive content
await client.archiveContent('exercises', 'content-id-123');

// Restore from archive
await client.restoreContent('exercises', 'content-id-123');
```

## TypeScript Support

All methods support generic types for type-safe content data:

```typescript
interface Exercise {
  title: { iv: string };
  difficulty: { iv: 'easy' | 'medium' | 'hard' };
  description: { iv: string };
  points: { iv: number };
}

// Type-safe fetching
const result = await client.getContent<Exercise>('exercises');
result.items.forEach((item) => {
  console.log(item.data.title.iv); // ✓ Type-safe
  console.log(item.data.difficulty.iv); // ✓ Type-safe, autocomplete works
});

// Type-safe creation
const newExercise = await client.createContent<Exercise>('exercises', {
  title: { iv: 'New Exercise' },
  difficulty: { iv: 'easy' }, // ✓ Only 'easy', 'medium', 'hard' allowed
  description: { iv: 'Description' },
  points: { iv: 10 },
});
```

## Error Handling

The package provides specific error types:

```typescript
import {
  SquidexError,
  SquidexNotFoundError,
  SquidexValidationError,
  SquidexRateLimitError,
  SquidexNetworkError,
} from '@alloprof/squidex';

try {
  const content = await client.getContentById('exercises', 'invalid-id');
} catch (error) {
  if (error instanceof SquidexNotFoundError) {
    console.error('Content not found:', error.message);
  } else if (error instanceof SquidexRateLimitError) {
    console.error('Rate limit exceeded, retry after:', error.details);
  } else if (error instanceof SquidexError) {
    console.error('Squidex error:', error.statusCode, error.message);
  }
}
```

## Advanced Usage

### Custom HTTP Client Configuration

```typescript
const client = new SquidexClient({
  apiBaseUrl: 'https://api-games.alloprof.ca',
  timeout: 60000, // 60 seconds
  retries: 5,
  retryDelay: 2000, // 2 seconds
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### Accessing the HTTP Client

```typescript
const httpClient = client.getHttpClient();
const axiosInstance = httpClient.getAxiosInstance();

// Make custom requests
const response = await httpClient.get('/custom-endpoint');
```

### Pagination Example

```typescript
async function getAllExercises() {
  const pageSize = 50;
  let skip = 0;
  let allItems = [];
  let hasMore = true;

  while (hasMore) {
    const result = await client.getContent('exercises', {
      $top: pageSize,
      $skip: skip,
    });

    allItems = allItems.concat(result.items);
    skip += pageSize;
    hasMore = result.items.length === pageSize;
  }

  return allItems;
}
```

## API Reference

### SquidexClient

Main client class for interacting with Squidex CMS.

#### Methods

- `getContent<T>(schema: string, query?: SquidexQuery): Promise<SquidexContentList<T>>`
- `getContentById<T>(schema: string, id: string): Promise<SquidexContent<T>>`
- `createContent<T>(schema: string, data: T, options?: CreateContentOptions): Promise<SquidexContent<T>>`
- `updateContent<T>(schema: string, id: string, data: Partial<T>, options?: UpdateContentOptions): Promise<SquidexContent<T>>`
- `deleteContent(schema: string, id: string, options?: DeleteContentOptions): Promise<void>`
- `publishContent<T>(schema: string, id: string): Promise<SquidexContent<T>>`
- `unpublishContent<T>(schema: string, id: string): Promise<SquidexContent<T>>`
- `archiveContent<T>(schema: string, id: string): Promise<SquidexContent<T>>`
- `restoreContent<T>(schema: string, id: string): Promise<SquidexContent<T>>`
- `createQuery(): QueryBuilder`
- `getHttpClient(): HttpClient`
- `getConfig(): SquidexClientConfig`

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
npm run format:check
```
