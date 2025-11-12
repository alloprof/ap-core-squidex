# @alloprof/squidex

TypeScript client library for Squidex CMS via ap-games-api.

## Overview

`@alloprof/squidex` is a TypeScript client SDK that provides a simple, type-safe interface to interact with Squidex CMS through the `ap-games-api` backend. This package is designed to be used by Alloprof frontend and backend applications.

### Functional Pattern

This package uses a functional approach similar to RxJS:
- ✅ Configure once at application startup
- ✅ Import functions directly where needed
- ✅ Lightweight and simple
- ✅ Easy to test with mocks
- ✅ No dependency injection needed
- ✅ Tree-shakeable

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
import { configure, getContent } from '@alloprof/squidex';

// Configure once at application startup
configure({
  apiBaseUrl: 'https://api-games.alloprof.ca',
  app: 'ap-pronom-ei',
});

// Use functions directly anywhere in your app
const content = await getContent('exercises', {
  $top: 10,
  $filter: "data/difficulty/iv eq 'easy'",
});

console.log(content.items);
```

## Configuration

### Configuration Options

```typescript
import { configure } from '@alloprof/squidex';

configure({
  // Base URL of the ap-games-api instance (required)
  apiBaseUrl: 'https://api-games.alloprof.ca',

  // Squidex app name to use for all requests (required)
  app: 'ap-pronom-ei',

  // Optional: Timeout for HTTP requests in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Number of retry attempts (default: 3)
  retries: 3,

  // Optional: Delay between retries in milliseconds (default: 1000)
  retryDelay: 1000,

  // Optional: Custom headers
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### Configuration Utilities

```typescript
import { configure, isConfigured, resetConfiguration } from '@alloprof/squidex';

// Check if already configured
if (!isConfigured()) {
  configure({
    apiBaseUrl: 'https://api-games.alloprof.ca',
    app: 'ap-pronom-ei'
  });
}

// Reset configuration (useful for tests)
resetConfiguration();
```

### Environment Examples

**Local Development:**
```typescript
configure({
  apiBaseUrl: 'http://localhost:8200',
  app: 'ap-pronom-ei',
});
```

**Staging:**
```typescript
configure({
  apiBaseUrl: 'https://api-games-staging.alloprof.ca',
  app: 'ap-pronom-ei',
});
```

**Production:**
```typescript
configure({
  apiBaseUrl: 'https://api-games.alloprof.ca',
  app: 'ap-pronom-ei',
});
```

### Angular Integration

```typescript
// app.config.ts
import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { configure } from '@alloprof/squidex';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      configure(environment.squidex);
    }),
    // ... other providers
  ],
};
```

## Usage

#### Fetching Content

**Get all content from a schema:**

```typescript
import { getContent } from '@alloprof/squidex';

const result = await getContent('exercises');
console.log(result.total); // Total number of items
console.log(result.items); // Array of content items
```

**Get content with filtering:**

```typescript
import { getContent } from '@alloprof/squidex';

const result = await getContent('exercises', {
  $filter: "data/difficulty/iv eq 'easy'",
  $top: 10,
  $skip: 0,
  $orderby: 'created desc',
});
```

**Get a single content item by ID:**

```typescript
import { getContentById } from '@alloprof/squidex';

const exercise = await getContentById('exercises', 'content-id-123');
console.log(exercise.data);
```

#### Creating Content

```typescript
import { createContent } from '@alloprof/squidex';

interface ExerciseData {
  title: { iv: string };
  difficulty: { iv: string };
  description: { iv: string };
}

const newExercise = await createContent<ExerciseData>(
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

#### Updating Content

```typescript
import { updateContent } from '@alloprof/squidex';

// Full update
const updated = await updateContent(
  'exercises',
  'content-id-123',
  {
    title: { iv: 'Updated Title' },
    difficulty: { iv: 'hard' },
  }
);

// Partial update (PATCH)
const patched = await updateContent(
  'exercises',
  'content-id-123',
  { difficulty: { iv: 'hard' } },
  { patch: true }
);
```

#### Deleting Content

```typescript
import { deleteContent } from '@alloprof/squidex';

// Soft delete
await deleteContent('exercises', 'content-id-123');

// Permanent delete
await deleteContent('exercises', 'content-id-123', { permanent: true });
```

#### Content Status Management

```typescript
import { publishContent, unpublishContent, archiveContent, restoreContent } from '@alloprof/squidex';

// Publish content
await publishContent('exercises', 'content-id-123');

// Unpublish content
await unpublishContent('exercises', 'content-id-123');

// Archive content
await archiveContent('exercises', 'content-id-123');

// Restore from archive
await restoreContent('exercises', 'content-id-123');
```

#### Using QueryBuilder

```typescript
import { createQuery, getContent } from '@alloprof/squidex';

const query = createQuery()
  .equals('data/difficulty/iv', 'easy')
  .contains('data/title/iv', 'math')
  .orderBy('created', 'desc')
  .top(20)
  .skip(0)
  .build();

const result = await getContent('exercises', query);
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

## TypeScript Support

All methods support generic types for type-safe content data:

```typescript
import { getContent, createContent } from '@alloprof/squidex';

interface Exercise {
  title: { iv: string };
  difficulty: { iv: 'easy' | 'medium' | 'hard' };
  description: { iv: string };
  points: { iv: number };
}

// Type-safe fetching
const result = await getContent<Exercise>('exercises');
result.items.forEach((item) => {
  console.log(item.data.title.iv); // ✓ Type-safe
  console.log(item.data.difficulty.iv); // ✓ Type-safe, autocomplete works
});

// Type-safe creation
const newExercise = await createContent<Exercise>('exercises', {
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
  getContentById,
  SquidexError,
  SquidexNotFoundError,
  SquidexValidationError,
  SquidexRateLimitError,
  SquidexNetworkError,
} from '@alloprof/squidex';

try {
  const content = await getContentById('exercises', 'invalid-id');
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

## Testing

When testing code that uses this package, you can mock the functions using your testing framework:

#### Jest Example

```typescript
import * as squidexApi from '@alloprof/squidex';

describe('ExerciseService', () => {
  beforeEach(() => {
    // Reset configuration before each test
    squidexApi.resetConfiguration();
    squidexApi.configure({
      apiBaseUrl: 'http://localhost:8200',
      app: 'ap-pronom-ei'
    });
  });

  it('should fetch exercises', async () => {
    const mockGetContent = jest.fn().mockResolvedValue({
      items: [{ id: '1', data: { title: { iv: 'Test' } } }],
      total: 1,
    });

    jest.spyOn(squidexApi, 'getContent').mockImplementation(mockGetContent);

    const result = await squidexApi.getContent('exercises');

    expect(mockGetContent).toHaveBeenCalledWith('exercises');
    expect(result.items).toHaveLength(1);
  });
});
```

#### Vitest Example

```typescript
import * as squidexApi from '@alloprof/squidex';
import { vi } from 'vitest';

describe('ExerciseService', () => {
  beforeEach(() => {
    squidexApi.resetConfiguration();
    squidexApi.configure({
      apiBaseUrl: 'http://localhost:8200',
      app: 'ap-pronom-ei'
    });
  });

  it('should fetch exercises', async () => {
    const mockData = {
      items: [{ id: '1', data: { title: { iv: 'Test' } } }],
      total: 1,
    };

    vi.spyOn(squidexApi, 'getContent').mockResolvedValue(mockData);

    const result = await squidexApi.getContent('exercises');

    expect(result.items).toHaveLength(1);
  });
});
```

## Advanced Usage

### Pagination Example

```typescript
import { getContent } from '@alloprof/squidex';

async function getAllExercises() {
  const pageSize = 50;
  let skip = 0;
  let allItems = [];
  let hasMore = true;

  while (hasMore) {
    const result = await getContent('exercises', {
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

### Configuration Functions

- `configure(config: SquidexConfig): void` - Configure the global Squidex client
- `isConfigured(): boolean` - Check if the client has been configured
- `resetConfiguration(): void` - Reset the configuration (useful for testing)

### Content Functions

- `getContent<T>(schema: string, query?: SquidexQuery): Promise<SquidexContentList<T>>` - Fetch content from a schema
- `getContentById<T>(schema: string, id: string): Promise<SquidexContent<T>>` - Fetch a single content item by ID
- `createContent<T>(schema: string, data: T, options?: CreateContentOptions): Promise<SquidexContent<T>>` - Create new content
- `updateContent<T>(schema: string, id: string, data: Partial<T>, options?: UpdateContentOptions): Promise<SquidexContent<T>>` - Update existing content
- `deleteContent(schema: string, id: string, options?: DeleteContentOptions): Promise<void>` - Delete content
- `publishContent<T>(schema: string, id: string): Promise<SquidexContent<T>>` - Publish content
- `unpublishContent<T>(schema: string, id: string): Promise<SquidexContent<T>>` - Unpublish content
- `archiveContent<T>(schema: string, id: string): Promise<SquidexContent<T>>` - Archive content
- `restoreContent<T>(schema: string, id: string): Promise<SquidexContent<T>>` - Restore archived content
- `createQuery(): QueryBuilder` - Create a new query builder instance

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
