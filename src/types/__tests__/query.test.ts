import { QueryBuilder } from '../query';

describe('QueryBuilder', () => {
  let builder: QueryBuilder;

  beforeEach(() => {
    builder = new QueryBuilder();
  });

  describe('equals', () => {
    it('should add an equals filter with string value', () => {
      const query = builder.equals('data/title/iv', 'test').build();
      expect(query.$filter).toBe("data/title/iv eq 'test'");
    });

    it('should add an equals filter with number value', () => {
      const query = builder.equals('data/points/iv', 100).build();
      expect(query.$filter).toBe('data/points/iv eq 100');
    });

    it('should add an equals filter with boolean value', () => {
      const query = builder.equals('data/active/iv', true).build();
      expect(query.$filter).toBe('data/active/iv eq true');
    });
  });

  describe('notEquals', () => {
    it('should add a not equals filter', () => {
      const query = builder.notEquals('data/status/iv', 'archived').build();
      expect(query.$filter).toBe("data/status/iv ne 'archived'");
    });
  });

  describe('greaterThan', () => {
    it('should add a greater than filter', () => {
      const query = builder.greaterThan('data/points/iv', 50).build();
      expect(query.$filter).toBe('data/points/iv gt 50');
    });
  });

  describe('lessThan', () => {
    it('should add a less than filter', () => {
      const query = builder.lessThan('data/points/iv', 100).build();
      expect(query.$filter).toBe('data/points/iv lt 100');
    });
  });

  describe('contains', () => {
    it('should add a contains filter', () => {
      const query = builder.contains('data/title/iv', 'math').build();
      expect(query.$filter).toBe("contains(data/title/iv, 'math')");
    });
  });

  describe('startsWith', () => {
    it('should add a startsWith filter', () => {
      const query = builder.startsWith('data/title/iv', 'Exercise').build();
      expect(query.$filter).toBe("startswith(data/title/iv, 'Exercise')");
    });
  });

  describe('endsWith', () => {
    it('should add an endsWith filter', () => {
      const query = builder.endsWith('data/title/iv', 'Practice').build();
      expect(query.$filter).toBe("endswith(data/title/iv, 'Practice')");
    });
  });

  describe('in', () => {
    it('should add an in filter with strings', () => {
      const query = builder
        .in('data/difficulty/iv', ['easy', 'medium'])
        .build();
      expect(query.$filter).toBe("data/difficulty/iv in ('easy','medium')");
    });

    it('should add an in filter with numbers', () => {
      const query = builder.in('data/level/iv', [1, 2, 3]).build();
      expect(query.$filter).toBe('data/level/iv in (1,2,3)');
    });
  });

  describe('raw', () => {
    it('should add a raw filter expression', () => {
      const query = builder.raw('custom expression').build();
      expect(query.$filter).toBe('custom expression');
    });
  });

  describe('multiple filters', () => {
    it('should combine filters with AND', () => {
      const query = builder
        .equals('data/difficulty/iv', 'easy')
        .greaterThan('data/points/iv', 10)
        .contains('data/title/iv', 'math')
        .build();

      expect(query.$filter).toBe(
        "data/difficulty/iv eq 'easy' and data/points/iv gt 10 and contains(data/title/iv, 'math')"
      );
    });
  });

  describe('orderBy', () => {
    it('should add orderBy ascending', () => {
      const query = builder.orderBy('data/title/iv', 'asc').build();
      expect(query.$orderby).toBe('data/title/iv asc');
    });

    it('should add orderBy descending', () => {
      const query = builder.orderBy('created', 'desc').build();
      expect(query.$orderby).toBe('created desc');
    });

    it('should default to ascending', () => {
      const query = builder.orderBy('data/title/iv').build();
      expect(query.$orderby).toBe('data/title/iv asc');
    });
  });

  describe('top', () => {
    it('should set the top limit', () => {
      const query = builder.top(20).build();
      expect(query.$top).toBe(20);
    });
  });

  describe('skip', () => {
    it('should set the skip offset', () => {
      const query = builder.skip(10).build();
      expect(query.$skip).toBe(10);
    });
  });

  describe('search', () => {
    it('should set the search query', () => {
      const query = builder.search('mathematics').build();
      expect(query.$search).toBe('mathematics');
    });
  });

  describe('complex query', () => {
    it('should build a complex query with all options', () => {
      const query = builder
        .equals('data/difficulty/iv', 'easy')
        .contains('data/title/iv', 'math')
        .greaterThan('data/points/iv', 10)
        .orderBy('created', 'desc')
        .top(20)
        .skip(5)
        .search('algebra')
        .build();

      expect(query.$filter).toBe(
        "data/difficulty/iv eq 'easy' and contains(data/title/iv, 'math') and data/points/iv gt 10"
      );
      expect(query.$orderby).toBe('created desc');
      expect(query.$top).toBe(20);
      expect(query.$skip).toBe(5);
      expect(query.$search).toBe('algebra');
    });
  });

  describe('empty query', () => {
    it('should build an empty query object', () => {
      const query = builder.build();
      expect(query).toEqual({});
    });
  });

  describe('chaining', () => {
    it('should support method chaining', () => {
      const result = builder
        .equals('field1', 'value1')
        .notEquals('field2', 'value2')
        .top(10);

      expect(result).toBe(builder);
    });
  });
});
