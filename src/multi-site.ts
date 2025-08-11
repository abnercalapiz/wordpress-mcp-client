import { WordPressMCPClient } from './client';
import { WordPressMCPConfig, SearchOptions, SearchResponse } from './types';

export interface SiteConfig {
  name: string;
  url: string;
  tags?: string[];
  config?: Partial<WordPressMCPConfig>;
}

export interface MultiSiteSearchResult {
  site: string;
  name: string;
  results?: SearchResponse;
  error?: string;
}

export class WordPressMCPMultiSite {
  private clients: Map<string, { client: WordPressMCPClient; config: SiteConfig }>;

  constructor(sites: Record<string, SiteConfig | string>) {
    this.clients = new Map();

    for (const [id, siteConfig] of Object.entries(sites)) {
      const config: SiteConfig = 
        typeof siteConfig === 'string' 
          ? { name: id, url: siteConfig }
          : siteConfig;

      const client = new WordPressMCPClient({
        baseUrl: `${config.url}/wp-json/llmr/mcp/v1`,
        ...config.config,
      });

      this.clients.set(id, { client, config });
    }
  }

  /**
   * Add a new site
   */
  addSite(id: string, config: SiteConfig | string): void {
    const siteConfig: SiteConfig = 
      typeof config === 'string' 
        ? { name: id, url: config }
        : config;

    const client = new WordPressMCPClient({
      baseUrl: `${siteConfig.url}/wp-json/llmr/mcp/v1`,
      ...siteConfig.config,
    });

    this.clients.set(id, { client, config: siteConfig });
  }

  /**
   * Remove a site
   */
  removeSite(id: string): boolean {
    return this.clients.delete(id);
  }

  /**
   * Get a specific site client
   */
  getSite(id: string): WordPressMCPClient | undefined {
    return this.clients.get(id)?.client;
  }

  /**
   * List all sites
   */
  listSites(): Array<{ id: string; name: string; url: string; tags?: string[] }> {
    return Array.from(this.clients.entries()).map(([id, { config }]) => ({
      id,
      name: config.name,
      url: config.url,
      tags: config.tags,
    }));
  }

  /**
   * Get sites by tag
   */
  getSitesByTag(tag: string): string[] {
    return Array.from(this.clients.entries())
      .filter(([_, { config }]) => config.tags?.includes(tag))
      .map(([id]) => id);
  }

  /**
   * Search across all sites
   */
  async searchAll(
    query: string,
    options?: SearchOptions & { concurrency?: number }
  ): Promise<MultiSiteSearchResult[]> {
    const { concurrency = 5, ...searchOptions } = options || {};
    const sites = Array.from(this.clients.entries());
    const results: MultiSiteSearchResult[] = [];

    // Process in batches for better performance
    for (let i = 0; i < sites.length; i += concurrency) {
      const batch = sites.slice(i, i + concurrency);
      const batchResults = await Promise.allSettled(
        batch.map(async ([id, { client, config }]) => {
          try {
            const searchResult = await client.search(query, searchOptions);
            return {
              site: id,
              name: config.name,
              results: searchResult,
            };
          } catch (error: any) {
            return {
              site: id,
              name: config.name,
              error: error.message,
            };
          }
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      }
    }

    return results;
  }

  /**
   * Search sites by tag
   */
  async searchByTag(
    tag: string,
    query: string,
    options?: SearchOptions
  ): Promise<MultiSiteSearchResult[]> {
    const taggedSites = this.getSitesByTag(tag);
    const results: MultiSiteSearchResult[] = [];

    for (const siteId of taggedSites) {
      const { client, config } = this.clients.get(siteId)!;
      try {
        const searchResult = await client.search(query, options);
        results.push({
          site: siteId,
          name: config.name,
          results: searchResult,
        });
      } catch (error: any) {
        results.push({
          site: siteId,
          name: config.name,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Execute a function on all sites
   */
  async executeOnAll<T>(
    fn: (client: WordPressMCPClient, siteId: string) => Promise<T>
  ): Promise<Array<{ site: string; result?: T; error?: string }>> {
    const results = await Promise.allSettled(
      Array.from(this.clients.entries()).map(async ([id, { client }]) => ({
        site: id,
        result: await fn(client, id),
      }))
    );

    return results.map((result, index) => {
      const siteId = Array.from(this.clients.keys())[index];
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        site: siteId,
        error: result.reason.message,
      };
    });
  }

  /**
   * Check health of all sites
   */
  async healthCheck(): Promise<Array<{ site: string; status: 'healthy' | 'error' | 'timeout'; message?: string }>> {
    return this.executeOnAll(async (client, siteId) => {
      try {
        const discovery = await client.discovery();
        return {
          site: siteId,
          status: 'healthy' as const,
        };
      } catch (error: any) {
        return {
          site: siteId,
          status: error.code === 'TIMEOUT' ? 'timeout' : 'error' as const,
          message: error.message,
        };
      }
    });
  }
}