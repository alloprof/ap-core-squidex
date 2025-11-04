import { UrlBuilder } from '../url-builder';

describe('UrlBuilder', () => {
  let builder: UrlBuilder;
  const baseUrl = 'https://squidex.example.com';
  const appName = 'my-app';

  beforeEach(() => {
    builder = new UrlBuilder(baseUrl, appName);
  });

  describe('constructor', () => {
    it('should remove trailing slash from baseUrl', () => {
      const builderWithSlash = new UrlBuilder(
        'https://squidex.example.com/',
        appName
      );
      expect(builderWithSlash.getIdentityUrl()).toBe(
        'https://squidex.example.com/identity-server/connect/token'
      );
    });
  });

  describe('getIdentityUrl', () => {
    it('should return the identity server URL', () => {
      expect(builder.getIdentityUrl()).toBe(
        `${baseUrl}/identity-server/connect/token`
      );
    });
  });

  describe('getGraphQLUrl', () => {
    it('should return the GraphQL endpoint URL', () => {
      expect(builder.getGraphQLUrl()).toBe(
        `${baseUrl}/api/content/${appName}/graphql`
      );
    });
  });

  describe('getContentApiUrl', () => {
    it('should return the content API URL for a schema', () => {
      expect(builder.getContentApiUrl('exercises')).toBe(
        `${baseUrl}/api/content/${appName}/exercises`
      );
    });
  });

  describe('getContentItemUrl', () => {
    it('should return the URL for a specific content item', () => {
      expect(builder.getContentItemUrl('exercises', 'content-123')).toBe(
        `${baseUrl}/api/content/${appName}/exercises/content-123`
      );
    });
  });

  describe('getAssetsUrl', () => {
    it('should return the assets API URL', () => {
      expect(builder.getAssetsUrl()).toBe(
        `${baseUrl}/api/apps/${appName}/assets`
      );
    });
  });

  describe('getAssetUrl', () => {
    it('should return the URL for a specific asset', () => {
      expect(builder.getAssetUrl('asset-123')).toBe(
        `${baseUrl}/api/apps/${appName}/assets/asset-123`
      );
    });
  });

  describe('getSchemasUrl', () => {
    it('should return the schemas API URL', () => {
      expect(builder.getSchemasUrl()).toBe(
        `${baseUrl}/api/apps/${appName}/schemas`
      );
    });
  });

  describe('getSchemaUrl', () => {
    it('should return the URL for a specific schema', () => {
      expect(builder.getSchemaUrl('exercises')).toBe(
        `${baseUrl}/api/apps/${appName}/schemas/exercises`
      );
    });
  });

  describe('buildUrlWithParams', () => {
    it('should build URL without params when none provided', () => {
      const url = builder.buildUrlWithParams('/api/test', {});
      expect(url).toBe('/api/test');
    });

    it('should build URL with single param', () => {
      const url = builder.buildUrlWithParams('/api/test', { key: 'value' });
      expect(url).toBe('/api/test?key=value');
    });

    it('should build URL with multiple params', () => {
      const url = builder.buildUrlWithParams('/api/test', {
        key1: 'value1',
        key2: 'value2',
      });
      expect(url).toBe('/api/test?key1=value1&key2=value2');
    });

    it('should skip undefined params', () => {
      const url = builder.buildUrlWithParams('/api/test', {
        key1: 'value1',
        key2: undefined,
        key3: 'value3',
      });
      expect(url).toBe('/api/test?key1=value1&key3=value3');
    });

    it('should skip null params', () => {
      const url = builder.buildUrlWithParams('/api/test', {
        key1: 'value1',
        key2: null,
        key3: 'value3',
      });
      expect(url).toBe('/api/test?key1=value1&key3=value3');
    });

    it('should convert number params to strings', () => {
      const url = builder.buildUrlWithParams('/api/test', { limit: 10 });
      expect(url).toBe('/api/test?limit=10');
    });

    it('should convert boolean params to strings', () => {
      const url = builder.buildUrlWithParams('/api/test', { active: true });
      expect(url).toBe('/api/test?active=true');
    });
  });
});
