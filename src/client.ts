import {
  WordPressMCPConfig,
  BusinessInfo,
  ContactInfo,
  SearchResponse,
  SearchOptions,
  ServicesResponse,
  DiscoveryResponse,
} from './types';
import { makeRequest } from './utils/request';
import { ValidationError } from './utils/errors';

export class WordPressMCPClient {
  private config: WordPressMCPConfig;

  constructor(config: WordPressMCPConfig) {
    if (!config.baseUrl) {
      throw new ValidationError('baseUrl is required');
    }

    // Ensure baseUrl ends properly
    const baseUrl = config.baseUrl.endsWith('/')
      ? config.baseUrl.slice(0, -1)
      : config.baseUrl;

    this.config = {
      timeout: 30000,
      ...config,
      baseUrl,
    };
  }

  /**
   * Discover available endpoints
   */
  async discovery(): Promise<DiscoveryResponse> {
    return this.request<DiscoveryResponse>('/discovery');
  }

  /**
   * Get business information
   */
  async business(): Promise<BusinessInfo> {
    return this.request<BusinessInfo>('/business');
  }

  /**
   * Get contact information
   */
  async contact(): Promise<ContactInfo> {
    return this.request<ContactInfo>('/contact');
  }

  /**
   * Get services/products
   */
  async services(): Promise<ServicesResponse> {
    return this.request<ServicesResponse>('/services');
  }

  /**
   * Search content
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResponse> {
    if (!query || typeof query !== 'string') {
      throw new ValidationError('Search query is required');
    }

    return this.request<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        ...options,
      }),
    });
  }

  /**
   * Get all pages
   */
  async pages(): Promise<any> {
    return this.request('/pages');
  }

  /**
   * Make a custom request to any endpoint
   */
  async customRequest<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  /**
   * Internal request method
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    return makeRequest<T>(url, {
      ...options,
      timeout: this.config.timeout,
      headers: {
        ...this.config.headers,
        ...options?.headers,
      },
    });
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<WordPressMCPConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<WordPressMCPConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }
}