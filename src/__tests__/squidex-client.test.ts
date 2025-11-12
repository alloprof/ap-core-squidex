import { SquidexClient } from '../client/squidex-client';
import { SquidexConfig } from '../types/config';

describe('SquidexClient', () => {
  let client: SquidexClient;
  let config: SquidexConfig;

  beforeEach(() => {
    config = {
      apiBaseUrl: 'http://localhost:8200',
      timeout: 30000,
    };
    client = new SquidexClient(config);
  });

  describe('constructor', () => {
    it('should create a client instance', () => {
      expect(client).toBeInstanceOf(SquidexClient);
    });

    it('should store the configuration', () => {
      const storedConfig = client.getConfig();
      expect(storedConfig.apiBaseUrl).toBe(config.apiBaseUrl);
      expect(storedConfig.timeout).toBe(config.timeout);
    });
  });

  describe('createQuery', () => {
    it('should create a QueryBuilder instance', () => {
      const query = client.createQuery();
      expect(query).toBeDefined();
      expect(typeof query.build).toBe('function');
    });

    it('should build a query with filters', () => {
      const query = client
        .createQuery()
        .equals('data/difficulty/iv', 'easy')
        .top(10)
        .build();

      expect(query.$filter).toBe("data/difficulty/iv eq 'easy'");
      expect(query.$top).toBe(10);
    });
  });

  describe('getHttpClient', () => {
    it('should return the HTTP client', () => {
      const httpClient = client.getHttpClient();
      expect(httpClient).toBeDefined();
    });
  });

  describe('getConfig', () => {
    it('should return a copy of the configuration', () => {
      const storedConfig = client.getConfig();
      expect(storedConfig).toEqual(config);

      // Verify it's a copy, not the original
      storedConfig.timeout = 60000;
      expect(client.getConfig().timeout).toBe(30000);
    });
  });
});
