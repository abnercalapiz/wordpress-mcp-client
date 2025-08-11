# WordPress MCP Client

Official JavaScript/TypeScript client for WordPress sites using the LLM Ready plugin. Connect to your WordPress MCP endpoints with full TypeScript support.

[![npm version](https://img.shields.io/npm/v/@abnerjezweb/wordpress-mcp-client.svg)](https://www.npmjs.com/package/@abnerjezweb/wordpress-mcp-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Simple API** - Clean, promise-based interface
- 📦 **TypeScript Support** - Full type definitions included
- 🌐 **Multi-Site Management** - Manage 100+ WordPress sites
- ⚡ **Lightweight** - Minimal dependencies
- 🛡️ **Error Handling** - Comprehensive error types
- 🔄 **Concurrent Requests** - Optimized for performance

## Installation

```bash
npm install @abnerjezweb/wordpress-mcp-client
```

or

```bash
yarn add @abnerjezweb/wordpress-mcp-client
```

## Quick Start

### Single Site

```typescript
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

const client = new WordPressMCPClient({
  baseUrl: 'https://yoursite.com/wp-json/llmr/mcp/v1'
});

// Search for content
const results = await client.search('wordpress tips');
console.log(results.data.results);

// Get business information
const business = await client.business();
console.log(business.data.name);
```

### Multiple Sites

```typescript
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';

const multiSite = new WordPressMCPMultiSite({
  'site1': {
    name: 'My Blog',
    url: 'https://myblog.com',
    tags: ['blog', 'personal']
  },
  'site2': {
    name: 'Company Site',
    url: 'https://company.com',
    tags: ['business', 'corporate']
  }
});

// Search across all sites
const results = await multiSite.searchAll('product updates');

// Search only blog sites
const blogResults = await multiSite.searchByTag('blog', 'wordpress tips');
```

## API Reference

### WordPressMCPClient

#### Constructor

```typescript
new WordPressMCPClient(config: WordPressMCPConfig)
```

**Config Options:**
- `baseUrl` (required): The base URL for your WordPress MCP endpoints
- `timeout` (optional): Request timeout in milliseconds (default: 30000)
- `headers` (optional): Custom headers for all requests

#### Methods

##### `discovery()`
Get available endpoints and their capabilities.

```typescript
const endpoints = await client.discovery();
```

##### `business()`
Get business information.

```typescript
const business = await client.business();
console.log(business.data.hours);
```

##### `contact()`
Get contact information.

```typescript
const contact = await client.contact();
console.log(contact.data.email);
```

##### `services()`
Get services/products list.

```typescript
const services = await client.services();
```

##### `search(query, options?)`
Search for content.

```typescript
const results = await client.search('keyword', {
  per_page: 10,
  post_type: 'post'
});
```

**Search Options:**
- `per_page`: Number of results per page
- `page`: Page number
- `post_type`: Filter by post type
- `orderby`: Sort by 'date', 'relevance', or 'title'
- `order`: Sort order 'asc' or 'desc'

### WordPressMCPMultiSite

#### Constructor

```typescript
new WordPressMCPMultiSite(sites: Record<string, SiteConfig | string>)
```

#### Methods

##### `addSite(id, config)`
Add a new site dynamically.

```typescript
multiSite.addSite('site3', {
  name: 'New Site',
  url: 'https://newsite.com',
  tags: ['new']
});
```

##### `removeSite(id)`
Remove a site.

```typescript
multiSite.removeSite('site3');
```

##### `searchAll(query, options?)`
Search across all sites with concurrency control.

```typescript
const results = await multiSite.searchAll('query', {
  concurrency: 5, // Process 5 sites at a time
  per_page: 20
});
```

##### `searchByTag(tag, query, options?)`
Search only sites with specific tag.

```typescript
const results = await multiSite.searchByTag('ecommerce', 'products');
```

##### `healthCheck()`
Check health status of all sites.

```typescript
const health = await multiSite.healthCheck();
// Returns: [{ site: 'site1', status: 'healthy' }, ...]
```

## Error Handling

The client provides specific error types:

```typescript
import { WordPressMCPError, NetworkError, TimeoutError } from '@abnerjezweb/wordpress-mcp-client';

try {
  const results = await client.search('test');
} catch (error) {
  if (error instanceof TimeoutError) {
    console.error('Request timed out');
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof WordPressMCPError) {
    console.error(`MCP Error (${error.status}):`, error.message);
  }
}
```

## Examples

### Basic Usage

```typescript
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

async function main() {
  const client = new WordPressMCPClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
  });

  // Get all available endpoints
  const discovery = await client.discovery();
  console.log('Available endpoints:', discovery.data.endpoints);

  // Search with pagination
  const page1 = await client.search('wordpress', { page: 1 });
  const page2 = await client.search('wordpress', { page: 2 });
}
```

### Multi-Site Management

```typescript
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';

async function manageSites() {
  // Initialize with multiple sites
  const sites = new WordPressMCPMultiSite({
    'blog1': 'https://blog1.com',
    'blog2': 'https://blog2.com',
    'shop': {
      name: 'My Shop',
      url: 'https://shop.com',
      tags: ['ecommerce']
    }
  });

  // Add site dynamically
  sites.addSite('newblog', 'https://newblog.com');

  // Search with error handling
  const results = await sites.searchAll('products');
  
  for (const result of results) {
    if (result.error) {
      console.error(`${result.site} failed:`, result.error);
    } else {
      console.log(`${result.site}: ${result.results.data.total} results`);
    }
  }
}
```

### MCP Server Integration

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

const client = new WordPressMCPClient({
  baseUrl: process.env.WORDPRESS_URL + '/wp-json/llmr/mcp/v1'
});

// Use in MCP tool handlers
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'search_wordpress') {
    const results = await client.search(request.params.arguments.query);
    return { toolResult: results };
  }
});
```

## Requirements

- Node.js 14+
- WordPress site with LLM Ready plugin v1.0.0+
- HTTPS enabled on WordPress site

## TypeScript

This package is written in TypeScript and includes full type definitions. All response types are fully typed for excellent IDE support.

```typescript
import { BusinessInfo, SearchResponse } from '@abnerjezweb/wordpress-mcp-client';

const business: BusinessInfo = await client.business();
const search: SearchResponse = await client.search('query');
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Jezweb](https://www.jezweb.com.au)

## Links

- [WordPress Plugin](https://github.com/abnercalapiz/LLMReady)
- [Documentation](https://github.com/abnercalapiz/wordpress-mcp-client)
- [npm Package](https://www.npmjs.com/package/@abnerjezweb/wordpress-mcp-client)