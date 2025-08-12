# WordPress MCP Client API Documentation

## Table of Contents

- [Overview](#overview)
- [Core Classes](#core-classes)
  - [WordPressMCPClient](#wordpressmcpclient)
  - [WordPressMCPMultiSite](#wordpressmcpmultisite)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Advanced Usage](#advanced-usage)
- [Performance Considerations](#performance-considerations)

## Overview

The WordPress MCP Client library provides two main classes for interacting with WordPress sites that have the LLM Ready plugin installed:

1. **WordPressMCPClient** - For single WordPress site connections
2. **WordPressMCPMultiSite** - For managing multiple WordPress sites

Both classes are designed to be easy to use while providing powerful features for advanced use cases.

## Core Classes

### WordPressMCPClient

The primary class for connecting to a single WordPress site's MCP endpoints.

#### Import

```typescript
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';
```

#### Constructor

```typescript
constructor(config: WordPressMCPConfig)
```

##### WordPressMCPConfig

```typescript
interface WordPressMCPConfig {
  baseUrl: string;      // Required: Base URL of the MCP endpoint
  timeout?: number;     // Optional: Request timeout in ms (default: 30000)
  retries?: number;     // Optional: Number of retry attempts (default: 3)
  headers?: Record<string, string>; // Optional: Custom headers
}
```

##### Example

```typescript
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
  timeout: 60000,
  retries: 5,
  headers: {
    'User-Agent': 'My-App/1.0'
  }
});
```

#### Methods

##### discovery()

Retrieves available endpoints and server capabilities.

```typescript
discovery(): Promise<DiscoveryResponse>
```

**Returns:**

```typescript
interface DiscoveryResponse {
  name: string;
  version: string;
  capabilities: {
    search: boolean;
    business: boolean;
    contact: boolean;
    services: boolean;
    booking?: boolean;
  };
  endpoints: {
    [key: string]: {
      path: string;
      method: string;
      description: string;
    };
  };
  rateLimits: {
    perMinute: number;
    perHour: number;
  };
}
```

**Example:**

```typescript
const discovery = await client.discovery();
console.log('Server name:', discovery.name);
console.log('Available endpoints:', Object.keys(discovery.endpoints));
```

##### business()

Retrieves business information from the WordPress site.

```typescript
business(): Promise<BusinessInfo>
```

**Returns:**

```typescript
interface BusinessInfo {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  founded?: string;
  mission?: string;
  values?: string[];
  specialties?: string[];
}
```

**Example:**

```typescript
const business = await client.business();
console.log(`Business: ${business.name}`);
console.log(`Industry: ${business.industry}`);
```

##### contact()

Retrieves contact information.

```typescript
contact(): Promise<ContactInfo>
```

**Returns:**

```typescript
interface ContactInfo {
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  hours?: {
    [day: string]: string;
  };
}
```

**Example:**

```typescript
const contact = await client.contact();
console.log(`Email: ${contact.email}`);
console.log(`Phone: ${contact.phone}`);
```

##### services()

Lists services or products offered.

```typescript
services(): Promise<Service[]>
```

**Returns:**

```typescript
interface Service {
  id: string;
  name: string;
  description?: string;
  price?: string;
  duration?: string;
  category?: string;
  features?: string[];
  image?: string;
}
```

**Example:**

```typescript
const services = await client.services();
services.forEach(service => {
  console.log(`- ${service.name}: ${service.description}`);
});
```

##### search()

Searches WordPress content.

```typescript
search(query: string, options?: SearchOptions): Promise<SearchResult[]>
```

**Parameters:**

```typescript
interface SearchOptions {
  limit?: number;       // Max results (default: 10)
  type?: string;        // Content type filter
  orderBy?: 'relevance' | 'date' | 'title';
  order?: 'asc' | 'desc';
  after?: string;       // ISO date string
  before?: string;      // ISO date string
}
```

**Returns:**

```typescript
interface SearchResult {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  content?: string;
  type: string;
  date: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  score?: number;       // Relevance score
}
```

**Example:**

```typescript
const results = await client.search('wordpress security', {
  limit: 5,
  type: 'post',
  orderBy: 'relevance'
});

results.forEach(result => {
  console.log(`${result.title} (${result.score})`);
  console.log(`  URL: ${result.url}`);
  console.log(`  Excerpt: ${result.excerpt}`);
});
```

### WordPressMCPMultiSite

Manages multiple WordPress sites with MCP endpoints.

#### Import

```typescript
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';
```

#### Constructor

```typescript
constructor(sites: Record<string, SiteConfig>)
```

##### SiteConfig

```typescript
interface SiteConfig {
  name: string;         // Display name
  url: string;          // WordPress site URL
  tags?: string[];      // Tags for categorization
  priority?: number;    // Priority for search results
  enabled?: boolean;    // Enable/disable site
}
```

##### Example

```typescript
const multiSite = new WordPressMCPMultiSite({
  'main': {
    name: 'Main Website',
    url: 'https://example.com',
    tags: ['primary', 'corporate'],
    priority: 10
  },
  'blog': {
    name: 'Tech Blog',
    url: 'https://blog.example.com',
    tags: ['blog', 'technical'],
    priority: 5
  },
  'docs': {
    name: 'Documentation',
    url: 'https://docs.example.com',
    tags: ['docs', 'support'],
    priority: 8
  }
});
```

#### Methods

##### addSite()

Adds a new site to the manager.

```typescript
addSite(id: string, config: SiteConfig): void
```

**Example:**

```typescript
multiSite.addSite('shop', {
  name: 'Online Shop',
  url: 'https://shop.example.com',
  tags: ['ecommerce', 'products']
});
```

##### removeSite()

Removes a site from the manager.

```typescript
removeSite(id: string): void
```

**Example:**

```typescript
multiSite.removeSite('shop');
```

##### getSite()

Gets a specific site's configuration.

```typescript
getSite(id: string): SiteConfig | undefined
```

##### getAllSites()

Gets all configured sites.

```typescript
getAllSites(): Record<string, SiteConfig>
```

##### getSitesByTag()

Gets sites that have a specific tag.

```typescript
getSitesByTag(tag: string): Array<{id: string, config: SiteConfig}>
```

**Example:**

```typescript
const blogSites = multiSite.getSitesByTag('blog');
blogSites.forEach(site => {
  console.log(`${site.config.name}: ${site.config.url}`);
});
```

##### searchAll()

Searches across all enabled sites.

```typescript
searchAll(
  query: string, 
  options?: SearchOptions
): Promise<MultiSiteSearchResults>
```

**Returns:**

```typescript
interface MultiSiteSearchResults {
  [siteId: string]: {
    site: SiteConfig;
    results: SearchResult[];
    error?: Error;
  };
}
```

**Example:**

```typescript
const allResults = await multiSite.searchAll('wordpress tips', {
  limit: 3
});

for (const [siteId, siteData] of Object.entries(allResults)) {
  console.log(`\nResults from ${siteData.site.name}:`);
  if (siteData.error) {
    console.log(`  Error: ${siteData.error.message}`);
  } else {
    siteData.results.forEach(result => {
      console.log(`  - ${result.title}`);
    });
  }
}
```

##### searchByTags()

Searches only sites with specific tags.

```typescript
searchByTags(
  tags: string[], 
  query: string, 
  options?: SearchOptions
): Promise<MultiSiteSearchResults>
```

**Example:**

```typescript
const techResults = await multiSite.searchByTags(
  ['blog', 'technical'], 
  'javascript frameworks',
  { limit: 5 }
);
```

##### businessAll()

Gets business information from all sites.

```typescript
businessAll(): Promise<Record<string, BusinessInfo>>
```

##### servicesAll()

Gets services from all sites.

```typescript
servicesAll(): Promise<Record<string, Service[]>>
```

## Type Definitions

### Core Types

```typescript
// Base configuration
interface WordPressMCPConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

// Site configuration for multi-site
interface SiteConfig {
  name: string;
  url: string;
  tags?: string[];
  priority?: number;
  enabled?: boolean;
}

// Search options
interface SearchOptions {
  limit?: number;
  type?: string;
  orderBy?: 'relevance' | 'date' | 'title';
  order?: 'asc' | 'desc';
  after?: string;
  before?: string;
}

// Search result
interface SearchResult {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  content?: string;
  type: string;
  date: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  score?: number;
}

// Business information
interface BusinessInfo {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  founded?: string;
  mission?: string;
  values?: string[];
  specialties?: string[];
}

// Contact information
interface ContactInfo {
  email?: string;
  phone?: string;
  address?: Address;
  socialMedia?: SocialMedia;
  hours?: Record<string, string>;
}

// Service/Product
interface Service {
  id: string;
  name: string;
  description?: string;
  price?: string;
  duration?: string;
  category?: string;
  features?: string[];
  image?: string;
}
```

## Error Handling

### Error Types

The library provides specific error types for different scenarios:

#### WordPressMCPError

Base error class for all MCP-related errors.

```typescript
class WordPressMCPError extends Error {
  statusCode?: number;
  endpoint?: string;
  details?: any;
}
```

#### NetworkError

Thrown when network requests fail.

```typescript
class NetworkError extends WordPressMCPError {
  cause?: Error;
}
```

#### TimeoutError

Thrown when requests exceed the timeout limit.

```typescript
class TimeoutError extends WordPressMCPError {
  timeout: number;
}
```

#### RateLimitError

Thrown when rate limits are exceeded.

```typescript
class RateLimitError extends WordPressMCPError {
  retryAfter?: number;
  limit?: number;
  remaining?: number;
}
```

### Error Handling Examples

```typescript
import { 
  WordPressMCPClient, 
  WordPressMCPError,
  NetworkError,
  TimeoutError,
  RateLimitError 
} from '@abnerjezweb/wordpress-mcp-client';

try {
  const results = await client.search('query');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limit exceeded. Retry after ${error.retryAfter}s`);
  } else if (error instanceof TimeoutError) {
    console.log('Request timed out');
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  } else if (error instanceof WordPressMCPError) {
    console.log('MCP error:', error.message);
    console.log('Status code:', error.statusCode);
  } else {
    console.log('Unexpected error:', error);
  }
}
```

## Advanced Usage

### Custom Request Configuration

```typescript
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
  timeout: 120000, // 2 minutes
  retries: 5,
  headers: {
    'User-Agent': 'MyBot/1.0',
    'Accept-Language': 'en-US'
  }
});
```

### Retry Logic

The client automatically retries failed requests based on the `retries` configuration:

- Network errors: Retry with exponential backoff
- 5xx server errors: Retry with backoff
- 429 rate limit: Wait for retry-after header
- 4xx client errors: No retry

### Connection Pooling

The client uses connection pooling for better performance:

```typescript
// Reuse the same client instance
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
});

// Make multiple requests efficiently
const [business, services, contact] = await Promise.all([
  client.business(),
  client.services(),
  client.contact()
]);
```

### Batch Operations

```typescript
// Search multiple sites concurrently
const multiSite = new WordPressMCPMultiSite(sites);

// Efficient batch search
const results = await multiSite.searchAll('query', {
  limit: 10
});

// Process results with priority
const sortedResults = Object.entries(results)
  .filter(([_, data]) => !data.error)
  .flatMap(([siteId, data]) => 
    data.results.map(result => ({
      ...result,
      siteId,
      siteName: data.site.name,
      priority: data.site.priority || 0
    }))
  )
  .sort((a, b) => b.priority - a.priority);
```

### Caching Strategy

```typescript
class CachedWordPressMCPClient extends WordPressMCPClient {
  private cache = new Map();
  private cacheTimeout = 300000; // 5 minutes

  async business() {
    const cacheKey = 'business';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await super.business();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }
}
```

## Performance Considerations

### Optimize Search Queries

1. **Use specific queries**: More specific queries return faster
2. **Limit results**: Use the `limit` option appropriately
3. **Filter by type**: Use `type` option to narrow results

```typescript
// Good: Specific query with limits
const results = await client.search('wordpress security plugins', {
  limit: 5,
  type: 'post'
});

// Avoid: Too broad
const results = await client.search('wordpress');
```

### Parallel Requests

```typescript
// Efficient: Parallel requests
const [search1, search2] = await Promise.all([
  client.search('security'),
  client.search('performance')
]);

// Less efficient: Sequential
const search1 = await client.search('security');
const search2 = await client.search('performance');
```

### Multi-Site Optimization

```typescript
// Configure priorities for weighted results
const multiSite = new WordPressMCPMultiSite({
  'main': { 
    name: 'Main', 
    url: 'https://main.com', 
    priority: 10 
  },
  'secondary': { 
    name: 'Secondary', 
    url: 'https://secondary.com', 
    priority: 5 
  }
});

// Use tags for targeted searches
const technicalResults = await multiSite.searchByTags(
  ['technical', 'developer'], 
  'api documentation'
);
```

### Error Recovery

```typescript
// Implement circuit breaker pattern
class ResilientClient {
  private failures = 0;
  private lastFailure = 0;
  private circuitOpen = false;

  async search(query: string) {
    if (this.circuitOpen && Date.now() - this.lastFailure < 60000) {
      throw new Error('Circuit breaker open');
    }

    try {
      const result = await this.client.search(query);
      this.failures = 0;
      this.circuitOpen = false;
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailure = Date.now();
      
      if (this.failures >= 5) {
        this.circuitOpen = true;
      }
      
      throw error;
    }
  }
}
```

---

For more examples and use cases, see the [Examples Documentation](./EXAMPLES.md).