# WordPress MCP Client - Usage Examples

This document provides comprehensive examples of using the WordPress MCP Client library in various scenarios.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Integration Examples](#integration-examples)
- [Performance Optimization](#performance-optimization)
- [Error Handling Patterns](#error-handling-patterns)

## Basic Examples

### 1. Simple Connection and Query

```javascript
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

async function basicExample() {
  // Create client
  const client = new WordPressMCPClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
  });

  // Get business info
  const business = await client.business();
  console.log(`Connected to: ${business.name}`);

  // Search for content
  const results = await client.search('wordpress tutorials');
  console.log(`Found ${results.length} results`);
}

basicExample().catch(console.error);
```

### 2. Exploring Available Endpoints

```javascript
async function exploreEndpoints() {
  const client = new WordPressMCPClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
  });

  // Discover available endpoints
  const discovery = await client.discovery();
  
  console.log('Server Info:');
  console.log(`- Name: ${discovery.name}`);
  console.log(`- Version: ${discovery.version}`);
  
  console.log('\nCapabilities:');
  Object.entries(discovery.capabilities).forEach(([cap, enabled]) => {
    console.log(`- ${cap}: ${enabled ? '✓' : '✗'}`);
  });
  
  console.log('\nEndpoints:');
  Object.entries(discovery.endpoints).forEach(([name, endpoint]) => {
    console.log(`- ${name}: ${endpoint.method} ${endpoint.path}`);
  });
}
```

### 3. Getting All Business Information

```javascript
async function getCompleteBusinessProfile() {
  const client = new WordPressMCPClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
  });

  // Fetch all business-related data
  const [business, contact, services] = await Promise.all([
    client.business(),
    client.contact(),
    client.services()
  ]);

  console.log('Business Profile:');
  console.log(`Name: ${business.name}`);
  console.log(`Industry: ${business.industry || 'N/A'}`);
  console.log(`Description: ${business.description || 'N/A'}`);
  
  console.log('\nContact Information:');
  console.log(`Email: ${contact.email || 'N/A'}`);
  console.log(`Phone: ${contact.phone || 'N/A'}`);
  
  if (contact.address) {
    console.log('Address:');
    console.log(`  ${contact.address.street || ''}`);
    console.log(`  ${contact.address.city}, ${contact.address.state} ${contact.address.postalCode}`);
  }
  
  console.log(`\nServices (${services.length}):`);
  services.forEach(service => {
    console.log(`- ${service.name}: ${service.description || 'No description'}`);
  });
}
```

## Advanced Examples

### 4. Advanced Search with Filtering

```javascript
async function advancedSearch() {
  const client = new WordPressMCPClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
  });

  // Search with specific options
  const recentPosts = await client.search('wordpress security', {
    limit: 20,
    type: 'post',
    orderBy: 'date',
    order: 'desc',
    after: '2024-01-01'
  });

  console.log('Recent Security Posts:');
  recentPosts.forEach(post => {
    console.log(`\n${post.title}`);
    console.log(`Date: ${new Date(post.date).toLocaleDateString()}`);
    console.log(`URL: ${post.url}`);
    console.log(`Score: ${post.score || 'N/A'}`);
    console.log(`Categories: ${post.categories?.join(', ') || 'None'}`);
  });

  // Search for pages only
  const pages = await client.search('documentation', {
    type: 'page',
    limit: 10
  });

  console.log(`\nFound ${pages.length} documentation pages`);
}
```

### 5. Multi-Site Management

```javascript
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';

async function multiSiteExample() {
  // Configure multiple sites
  const multiSite = new WordPressMCPMultiSite({
    'corporate': {
      name: 'Corporate Website',
      url: 'https://company.com',
      tags: ['official', 'corporate'],
      priority: 10
    },
    'blog': {
      name: 'Company Blog',
      url: 'https://blog.company.com',
      tags: ['blog', 'news', 'updates'],
      priority: 8
    },
    'docs': {
      name: 'Documentation',
      url: 'https://docs.company.com',
      tags: ['docs', 'technical', 'api'],
      priority: 9
    },
    'support': {
      name: 'Support Portal',
      url: 'https://support.company.com',
      tags: ['support', 'help', 'faq'],
      priority: 7
    }
  });

  // Search across all sites
  console.log('Searching all sites for "API integration"...');
  const allResults = await multiSite.searchAll('API integration', {
    limit: 5
  });

  // Display results grouped by site
  for (const [siteId, data] of Object.entries(allResults)) {
    if (data.error) {
      console.log(`\n${data.site.name} - Error: ${data.error.message}`);
      continue;
    }

    console.log(`\n${data.site.name} (${data.results.length} results):`);
    data.results.forEach(result => {
      console.log(`  - ${result.title}`);
      console.log(`    ${result.url}`);
    });
  }

  // Search only technical sites
  console.log('\nSearching technical sites only...');
  const techResults = await multiSite.searchByTags(
    ['technical', 'docs', 'api'], 
    'authentication',
    { limit: 3 }
  );

  // Get combined and sorted results
  const combinedResults = [];
  for (const [siteId, data] of Object.entries(techResults)) {
    if (!data.error) {
      data.results.forEach(result => {
        combinedResults.push({
          ...result,
          siteName: data.site.name,
          sitePriority: data.site.priority || 0
        });
      });
    }
  }

  // Sort by site priority and relevance score
  combinedResults.sort((a, b) => {
    const priorityDiff = b.sitePriority - a.sitePriority;
    if (priorityDiff !== 0) return priorityDiff;
    return (b.score || 0) - (a.score || 0);
  });

  console.log('\nTop Technical Results:');
  combinedResults.slice(0, 10).forEach(result => {
    console.log(`- [${result.siteName}] ${result.title}`);
  });
}
```

### 6. Dynamic Site Management

```javascript
async function dynamicSiteManagement() {
  const multiSite = new WordPressMCPMultiSite({});

  // Function to add sites from a configuration
  async function loadSitesFromConfig(config) {
    for (const [id, site] of Object.entries(config)) {
      multiSite.addSite(id, site);
      console.log(`Added site: ${site.name}`);
    }
  }

  // Load initial sites
  await loadSitesFromConfig({
    'main': {
      name: 'Main Site',
      url: 'https://main.example.com',
      tags: ['primary']
    }
  });

  // Add sites dynamically based on discovery
  async function discoverAndAddSite(url, tags = []) {
    try {
      const tempClient = new WordPressMCPClient({
        baseUrl: `${url}/wp-json/llmr/mcp/v1`
      });
      
      const discovery = await tempClient.discovery();
      const business = await tempClient.business();
      
      const siteId = url.replace(/https?:\/\//, '').replace(/\./g, '_');
      
      multiSite.addSite(siteId, {
        name: business.name || discovery.name,
        url: url,
        tags: tags,
        enabled: true
      });
      
      console.log(`Successfully added: ${business.name}`);
      return true;
    } catch (error) {
      console.error(`Failed to add ${url}: ${error.message}`);
      return false;
    }
  }

  // Discover and add multiple sites
  const sitesToDiscover = [
    { url: 'https://blog.example.com', tags: ['blog'] },
    { url: 'https://shop.example.com', tags: ['ecommerce'] },
    { url: 'https://docs.example.com', tags: ['documentation'] }
  ];

  for (const site of sitesToDiscover) {
    await discoverAndAddSite(site.url, site.tags);
  }

  // Now search across all discovered sites
  const results = await multiSite.searchAll('products');
  console.log(`\nSearch found results from ${Object.keys(results).length} sites`);
}
```

## Real-World Scenarios

### 7. Content Aggregator

```javascript
class ContentAggregator {
  constructor(sites) {
    this.multiSite = new WordPressMCPMultiSite(sites);
    this.cache = new Map();
  }

  async getLatestContent(limit = 50) {
    // Search for recent content across all sites
    const results = await this.multiSite.searchAll('', {
      limit: limit,
      orderBy: 'date',
      order: 'desc'
    });

    // Aggregate and sort by date
    const allContent = [];
    
    for (const [siteId, data] of Object.entries(results)) {
      if (!data.error && data.results) {
        data.results.forEach(item => {
          allContent.push({
            ...item,
            siteId,
            siteName: data.site.name,
            timestamp: new Date(item.date).getTime()
          });
        });
      }
    }

    // Sort by timestamp descending
    allContent.sort((a, b) => b.timestamp - a.timestamp);

    return allContent.slice(0, limit);
  }

  async getTrendingTopics(hours = 24) {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const results = await this.multiSite.searchAll('', {
      after: since.toISOString(),
      limit: 100
    });

    // Extract and count topics from titles and tags
    const topicCounts = new Map();

    for (const [siteId, data] of Object.entries(results)) {
      if (!data.error && data.results) {
        data.results.forEach(item => {
          // Extract words from title
          const words = item.title.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 4);

          words.forEach(word => {
            topicCounts.set(word, (topicCounts.get(word) || 0) + 1);
          });

          // Count tags
          item.tags?.forEach(tag => {
            topicCounts.set(tag.toLowerCase(), (topicCounts.get(tag) || 0) + 2);
          });
        });
      }
    }

    // Sort by count and return top topics
    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }
}

// Usage
async function aggregatorExample() {
  const aggregator = new ContentAggregator({
    'news': {
      name: 'News Site',
      url: 'https://news.example.com',
      tags: ['news']
    },
    'blog': {
      name: 'Tech Blog',
      url: 'https://blog.example.com',
      tags: ['technology']
    }
  });

  // Get latest content
  const latest = await aggregator.getLatestContent(20);
  console.log('Latest Content:');
  latest.forEach(item => {
    console.log(`- [${item.siteName}] ${item.title}`);
    console.log(`  ${new Date(item.timestamp).toLocaleString()}`);
  });

  // Get trending topics
  const trending = await aggregator.getTrendingTopics(48);
  console.log('\nTrending Topics (48h):');
  trending.forEach(({ topic, count }) => {
    console.log(`- ${topic}: ${count} mentions`);
  });
}
```

### 8. AI Assistant Integration

```javascript
class WordPressKnowledgeBase {
  constructor(sites) {
    this.multiSite = new WordPressMCPMultiSite(sites);
  }

  async answerQuestion(question) {
    // Search for relevant content
    const results = await this.multiSite.searchAll(question, {
      limit: 10
    });

    // Collect relevant excerpts
    const context = [];
    
    for (const [siteId, data] of Object.entries(results)) {
      if (!data.error && data.results) {
        data.results.forEach(result => {
          context.push({
            source: data.site.name,
            title: result.title,
            content: result.excerpt || result.content,
            url: result.url,
            relevance: result.score || 0
          });
        });
      }
    }

    // Sort by relevance
    context.sort((a, b) => b.relevance - a.relevance);

    return {
      question,
      context: context.slice(0, 5),
      sources: context.map(c => ({
        title: c.title,
        url: c.url,
        source: c.source
      }))
    };
  }

  async getBusinessContext() {
    // Get business information from all sites
    const businessData = {};
    
    for (const [siteId, config] of Object.entries(this.multiSite.getAllSites())) {
      try {
        const client = new WordPressMCPClient({
          baseUrl: `${config.url}/wp-json/llmr/mcp/v1`
        });
        
        const [business, services] = await Promise.all([
          client.business(),
          client.services()
        ]);
        
        businessData[siteId] = {
          name: config.name,
          business,
          services
        };
      } catch (error) {
        console.error(`Failed to get business data for ${config.name}`);
      }
    }

    return businessData;
  }
}

// Usage for AI Assistant
async function aiAssistantExample() {
  const kb = new WordPressKnowledgeBase({
    'main': {
      name: 'Main Website',
      url: 'https://company.com'
    },
    'support': {
      name: 'Support Docs',
      url: 'https://support.company.com'
    }
  });

  // Answer a customer question
  const answer = await kb.answerQuestion('How do I reset my password?');
  
  console.log(`Question: ${answer.question}`);
  console.log('\nRelevant Information:');
  answer.context.forEach(ctx => {
    console.log(`\nFrom: ${ctx.source}`);
    console.log(`Title: ${ctx.title}`);
    console.log(`Content: ${ctx.content.substring(0, 200)}...`);
  });

  console.log('\nSources:');
  answer.sources.forEach(src => {
    console.log(`- ${src.title}: ${src.url}`);
  });
}
```

## Integration Examples

### 9. Express.js API Integration

```javascript
import express from 'express';
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

const app = express();
const client = new WordPressMCPClient({
  baseUrl: process.env.WORDPRESS_MCP_URL
});

// Middleware for caching
const cache = new Map();
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      return res.json(cached.data);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, { data: body, timestamp: Date.now() });
      res.sendResponse(body);
    };
    
    next();
  };
};

// API Routes
app.get('/api/business', cacheMiddleware(3600), async (req, res) => {
  try {
    const business = await client.business();
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services', cacheMiddleware(1800), async (req, res) => {
  try {
    const services = await client.services();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q, limit = 10, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    const results = await client.search(q, {
      limit: parseInt(limit),
      type
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
```

### 10. Discord Bot Integration

```javascript
import { Client, Intents } from 'discord.js';
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';

const discord = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});

const wpSites = new WordPressMCPMultiSite({
  'main': {
    name: 'Main Site',
    url: 'https://example.com'
  },
  'docs': {
    name: 'Documentation',
    url: 'https://docs.example.com'
  }
});

discord.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Search command
  if (message.content.startsWith('!search ')) {
    const query = message.content.slice(8);
    
    try {
      const results = await wpSites.searchAll(query, { limit: 3 });
      
      let response = `Search results for "${query}":\n`;
      
      for (const [siteId, data] of Object.entries(results)) {
        if (!data.error && data.results.length > 0) {
          response += `\n**${data.site.name}:**\n`;
          data.results.forEach(result => {
            response += `• ${result.title}\n  <${result.url}>\n`;
          });
        }
      }
      
      message.reply(response || 'No results found.');
    } catch (error) {
      message.reply('Sorry, an error occurred while searching.');
    }
  }
  
  // Business info command
  if (message.content === '!business') {
    try {
      const client = new WordPressMCPClient({
        baseUrl: wpSites.getSite('main').url + '/wp-json/llmr/mcp/v1'
      });
      
      const business = await client.business();
      const contact = await client.contact();
      
      const response = `**${business.name}**\n` +
        `${business.description || 'No description'}\n` +
        `📧 ${contact.email || 'N/A'}\n` +
        `📞 ${contact.phone || 'N/A'}`;
      
      message.reply(response);
    } catch (error) {
      message.reply('Sorry, could not fetch business information.');
    }
  }
});

discord.login(process.env.DISCORD_TOKEN);
```

## Performance Optimization

### 11. Request Batching and Caching

```javascript
class OptimizedWordPressClient {
  constructor(config) {
    this.client = new WordPressMCPClient(config);
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.cacheExpiry = 300000; // 5 minutes
  }

  async getCached(key, fetcher) {
    // Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request
    const promise = fetcher().then(data => {
      this.cache.set(key, { data, timestamp: Date.now() });
      this.pendingRequests.delete(key);
      return data;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  async business() {
    return this.getCached('business', () => this.client.business());
  }

  async services() {
    return this.getCached('services', () => this.client.services());
  }

  async search(query, options) {
    const key = `search:${query}:${JSON.stringify(options)}`;
    return this.getCached(key, () => this.client.search(query, options));
  }

  clearCache() {
    this.cache.clear();
  }
}

// Usage
async function optimizedExample() {
  const client = new OptimizedWordPressClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
  });

  // First call fetches from server
  console.time('First call');
  await client.business();
  console.timeEnd('First call');

  // Second call uses cache (instant)
  console.time('Cached call');
  await client.business();
  console.timeEnd('Cached call');

  // Parallel calls for same data use single request
  console.time('Parallel calls');
  const [r1, r2, r3] = await Promise.all([
    client.services(),
    client.services(),
    client.services()
  ]);
  console.timeEnd('Parallel calls');
  console.log('All three calls returned same data:', r1 === r2 && r2 === r3);
}
```

### 12. Connection Pool Management

```javascript
class ConnectionPoolManager {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.activeRequests = 0;
    this.queue = [];
  }

  async execute(fn) {
    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.activeRequests++;
    
    try {
      return await fn();
    } finally {
      this.activeRequests--;
      if (this.queue.length > 0) {
        const resolve = this.queue.shift();
        resolve();
      }
    }
  }
}

// Usage with multi-site search
async function pooledSearch() {
  const pool = new ConnectionPoolManager(3);
  const sites = {
    'site1': { name: 'Site 1', url: 'https://site1.com' },
    'site2': { name: 'Site 2', url: 'https://site2.com' },
    // ... more sites
  };

  const multiSite = new WordPressMCPMultiSite(sites);

  // Custom search with connection pooling
  const searchWithPool = async (query) => {
    const results = {};
    
    await Promise.all(
      Object.entries(sites).map(async ([siteId, config]) => {
        try {
          const result = await pool.execute(async () => {
            const client = new WordPressMCPClient({
              baseUrl: `${config.url}/wp-json/llmr/mcp/v1`
            });
            return client.search(query);
          });
          
          results[siteId] = {
            site: config,
            results: result,
            error: null
          };
        } catch (error) {
          results[siteId] = {
            site: config,
            results: [],
            error
          };
        }
      })
    );

    return results;
  };

  const results = await searchWithPool('wordpress optimization');
  console.log(`Searched ${Object.keys(results).length} sites with connection pooling`);
}
```

## Error Handling Patterns

### 13. Comprehensive Error Handling

```javascript
import { 
  WordPressMCPError, 
  NetworkError, 
  TimeoutError, 
  RateLimitError 
} from '@abnerjezweb/wordpress-mcp-client';

class ResilientWordPressClient {
  constructor(config) {
    this.client = new WordPressMCPClient(config);
    this.retryDelays = [1000, 2000, 5000]; // Exponential backoff
  }

  async withRetry(operation, retries = 3) {
    let lastError;

    for (let i = 0; i <= retries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (error instanceof RateLimitError) {
          // Wait for rate limit to reset
          const waitTime = error.retryAfter || 60;
          console.log(`Rate limited. Waiting ${waitTime}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue;
        }

        if (error instanceof TimeoutError && i < retries) {
          // Retry timeouts with backoff
          const delay = this.retryDelays[i] || 5000;
          console.log(`Timeout. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (error instanceof NetworkError && i < retries) {
          // Retry network errors
          const delay = this.retryDelays[i] || 5000;
          console.log(`Network error. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Don't retry client errors (4xx)
        if (error instanceof WordPressMCPError && 
            error.statusCode >= 400 && 
            error.statusCode < 500) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  async search(query, options) {
    return this.withRetry(() => this.client.search(query, options));
  }

  async business() {
    return this.withRetry(() => this.client.business());
  }
}

// Usage with error handling
async function resilientExample() {
  const client = new ResilientWordPressClient({
    baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
    timeout: 10000
  });

  try {
    const results = await client.search('wordpress');
    console.log(`Found ${results.length} results`);
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error('Rate limit exceeded. Please try again later.');
      console.error(`Limit: ${error.limit}, Remaining: ${error.remaining}`);
    } else if (error instanceof TimeoutError) {
      console.error('Request timed out after multiple retries');
    } else if (error instanceof NetworkError) {
      console.error('Network connection failed:', error.message);
    } else if (error instanceof WordPressMCPError) {
      console.error(`WordPress MCP Error (${error.statusCode}): ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

### 14. Graceful Degradation

```javascript
class FallbackWordPressClient {
  constructor(primaryUrl, fallbackUrls = []) {
    this.urls = [primaryUrl, ...fallbackUrls];
    this.currentIndex = 0;
    this.clients = this.urls.map(url => new WordPressMCPClient({
      baseUrl: `${url}/wp-json/llmr/mcp/v1`
    }));
  }

  async executeWithFallback(operation) {
    const errors = [];

    for (let i = 0; i < this.clients.length; i++) {
      const index = (this.currentIndex + i) % this.clients.length;
      const client = this.clients[index];

      try {
        const result = await operation(client);
        
        // Success - update preferred client
        this.currentIndex = index;
        return result;
      } catch (error) {
        errors.push({
          url: this.urls[index],
          error
        });

        console.warn(`Failed on ${this.urls[index]}: ${error.message}`);
      }
    }

    // All clients failed
    throw new Error(`All WordPress MCP endpoints failed: ${errors.map(e => e.error.message).join(', ')}`);
  }

  async search(query, options) {
    return this.executeWithFallback(client => client.search(query, options));
  }

  async business() {
    return this.executeWithFallback(client => client.business());
  }
}

// Usage
async function fallbackExample() {
  const client = new FallbackWordPressClient(
    'https://primary.example.com',
    [
      'https://secondary.example.com',
      'https://backup.example.com'
    ]
  );

  try {
    // Will try primary first, then fallbacks if needed
    const results = await client.search('content');
    console.log(`Search successful with ${results.length} results`);
  } catch (error) {
    console.error('All endpoints failed:', error.message);
  }
}
```

---

These examples demonstrate various ways to use the WordPress MCP Client library, from basic usage to advanced patterns for production applications. For more details on specific methods and types, refer to the [API Documentation](./API.md).