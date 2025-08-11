export interface WordPressMCPConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface BusinessInfo {
  success: boolean;
  data?: {
    name: string;
    description: string;
    email?: string;
    phone?: string;
    hours?: {
      [day: string]: {
        open: string;
        close: string;
        closed?: boolean;
      };
    };
    timezone?: string;
    social?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  error?: string;
}

export interface ContactInfo {
  success: boolean;
  data?: {
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    response_time?: string;
  };
  error?: string;
}

export interface SearchResult {
  id: number;
  title: string;
  excerpt: string;
  url: string;
  type: string;
  date: string;
  author?: string;
  featured_image?: string;
}

export interface SearchResponse {
  success: boolean;
  data?: {
    results: SearchResult[];
    total: number;
    pages: number;
  };
  error?: string;
}

export interface SearchOptions {
  per_page?: number;
  page?: number;
  post_type?: string;
  orderby?: 'date' | 'relevance' | 'title';
  order?: 'asc' | 'desc';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  features?: string[];
}

export interface ServicesResponse {
  success: boolean;
  data?: Service[];
  error?: string;
}

export interface DiscoveryEndpoint {
  path: string;
  method: 'GET' | 'POST';
  description: string;
  parameters?: Record<string, any>;
}

export interface DiscoveryResponse {
  success: boolean;
  data?: {
    version: string;
    endpoints: Record<string, DiscoveryEndpoint>;
  };
  error?: string;
}

export interface MCPError extends Error {
  status?: number;
  code?: string;
}