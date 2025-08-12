# WordPress MCP Client - Troubleshooting Guide

This guide helps you diagnose and fix common issues when using the WordPress MCP Client.

## Table of Contents

- [Common Issues](#common-issues)
- [Connection Problems](#connection-problems)
- [Authentication & Permissions](#authentication--permissions)
- [Search Issues](#search-issues)
- [Performance Problems](#performance-problems)
- [Error Messages](#error-messages)
- [Debugging Techniques](#debugging-techniques)
- [FAQ](#faq)

## Common Issues

### 1. Cannot Connect to WordPress MCP Server

**Symptoms:**
- Connection refused errors
- 404 Not Found responses
- Network timeout errors

**Solutions:**

```javascript
// Check if the URL is correct
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1' // Ensure this is correct
});

// Test the connection
try {
  const discovery = await client.discovery();
  console.log('Connection successful:', discovery.name);
} catch (error) {
  console.error('Connection failed:', error.message);
}
```

**Checklist:**
1. ✓ Verify the WordPress site URL is correct
2. ✓ Check if LLM Ready plugin is installed and activated
3. ✓ Ensure WordPress REST API is enabled
4. ✓ Verify permalinks are enabled in WordPress
5. ✓ Check if the site is publicly accessible

### 2. Plugin Not Activated Error

**Error Message:**
```
404 Not Found - /wp-json/llmr/mcp/v1/discovery
```

**Solution:**
1. Log into WordPress admin
2. Navigate to Plugins
3. Activate "LLM Ready" plugin
4. Check plugin settings are configured

### 3. REST API Disabled

**Symptoms:**
- All API endpoints return 404
- `/wp-json/` returns error

**Test:**
```bash
# Test if REST API is enabled
curl https://your-site.com/wp-json/
```

**Solution:**
Add to WordPress `functions.php` if REST API is disabled:
```php
// Enable REST API
add_filter('rest_enabled', '__return_true');
add_filter('rest_jsonp_enabled', '__return_true');
```

## Connection Problems

### 4. SSL Certificate Issues

**Error:**
```
Error: self signed certificate in certificate chain
```

**Solutions:**

```javascript
// For development only - skip certificate validation
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false
});

const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
  headers: {
    'User-Agent': 'WordPress-MCP-Client'
  }
});

// Note: Never use in production!
```

### 5. Timeout Errors

**Error:**
```
TimeoutError: Request timed out after 30000ms
```

**Solutions:**

```javascript
// Increase timeout
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
  timeout: 60000 // 60 seconds
});

// Implement retry logic
async function searchWithRetry(query, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.search(query);
    } catch (error) {
      if (error instanceof TimeoutError && i < retries - 1) {
        console.log(`Retry ${i + 1} after timeout...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      throw error;
    }
  }
}
```

### 6. CORS Issues (Browser)

**Error:**
```
Access to fetch at 'https://example.com/wp-json/llmr/mcp/v1' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**

1. **WordPress Side** - Add CORS headers:
```php
// Add to WordPress functions.php or plugin
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
});
```

2. **Client Side** - Use proxy in development:
```javascript
// In your development server config
proxy: {
  '/wp-json': {
    target: 'https://example.com',
    changeOrigin: true
  }
}
```

## Authentication & Permissions

### 7. Rate Limiting

**Error:**
```
RateLimitError: Rate limit exceeded
Status: 429
Retry-After: 60
```

**Solutions:**

```javascript
// Implement rate limit handling
class RateLimitedClient {
  constructor(config) {
    this.client = new WordPressMCPClient(config);
    this.requestQueue = [];
    this.processing = false;
  }

  async request(method, ...args) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ method, args, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;
    
    this.processing = true;
    const { method, args, resolve, reject } = this.requestQueue.shift();

    try {
      const result = await this.client[method](...args);
      resolve(result);
    } catch (error) {
      if (error instanceof RateLimitError) {
        const delay = (error.retryAfter || 60) * 1000;
        console.log(`Rate limited. Waiting ${delay}ms`);
        
        // Re-queue the request
        this.requestQueue.unshift({ method, args, resolve, reject });
        
        setTimeout(() => {
          this.processing = false;
          this.processQueue();
        }, delay);
        return;
      }
      reject(error);
    }

    // Process next request after delay
    setTimeout(() => {
      this.processing = false;
      this.processQueue();
    }, 1000); // 1 second between requests
  }

  async search(query, options) {
    return this.request('search', query, options);
  }
}
```

### 8. Blocked by Security Plugins

**Symptoms:**
- 403 Forbidden errors
- Requests blocked by Wordfence, Sucuri, etc.

**Solutions:**

1. **Whitelist User Agent:**
```javascript
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
  headers: {
    'User-Agent': 'WordPress-MCP-Client/1.0 (https://yourapp.com)'
  }
});
```

2. **WordPress Security Plugin Settings:**
- Whitelist `/wp-json/llmr/mcp/v1/*` endpoints
- Allow REST API access
- Whitelist your IP address for development

## Search Issues

### 9. No Search Results

**Problem:** Search returns empty results despite content existing

**Debugging Steps:**

```javascript
// 1. Test with simple query
const results = await client.search('test');
console.log('Results:', results.length);

// 2. Check discovery for search capability
const discovery = await client.discovery();
console.log('Search enabled:', discovery.capabilities.search);

// 3. Try without filters
const allResults = await client.search('', { limit: 10 });
console.log('Total indexed items:', allResults.length);

// 4. Test specific content type
const posts = await client.search('', { type: 'post', limit: 5 });
const pages = await client.search('', { type: 'page', limit: 5 });
console.log(`Posts: ${posts.length}, Pages: ${pages.length}`);
```

**Common Causes:**
- Content not indexed by LLM Ready plugin
- Search functionality disabled
- No published content
- Search query too specific

### 10. Incorrect Search Results

**Problem:** Search returns irrelevant results

**Solutions:**

```javascript
// Use more specific queries
const specific = await client.search('"exact phrase match"');

// Filter by content type
const blogPosts = await client.search('wordpress', {
  type: 'post',
  orderBy: 'relevance'
});

// Use date filters
const recent = await client.search('updates', {
  after: '2024-01-01',
  orderBy: 'date',
  order: 'desc'
});
```

## Performance Problems

### 11. Slow Response Times

**Diagnosis:**

```javascript
// Measure response times
async function measurePerformance() {
  const operations = [
    { name: 'Discovery', fn: () => client.discovery() },
    { name: 'Business', fn: () => client.business() },
    { name: 'Search', fn: () => client.search('test', { limit: 5 }) }
  ];

  for (const op of operations) {
    const start = Date.now();
    try {
      await op.fn();
      const duration = Date.now() - start;
      console.log(`${op.name}: ${duration}ms`);
    } catch (error) {
      console.log(`${op.name}: Failed - ${error.message}`);
    }
  }
}
```

**Optimization Strategies:**

```javascript
// 1. Implement caching
class CachedClient {
  constructor(config) {
    this.client = new WordPressMCPClient(config);
    this.cache = new Map();
  }

  async cachedRequest(key, request, ttl = 300000) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < ttl) {
      return cached.data;
    }

    const data = await request();
    this.cache.set(key, { data, time: Date.now() });
    return data;
  }

  async business() {
    return this.cachedRequest('business', () => this.client.business());
  }
}

// 2. Parallel requests
async function parallelRequests() {
  const [business, services, contact] = await Promise.all([
    client.business(),
    client.services(),
    client.contact()
  ]);
  return { business, services, contact };
}

// 3. Reduce payload size
const minimalSearch = await client.search('query', {
  limit: 5,  // Reduce number of results
  fields: ['title', 'url', 'excerpt'] // Request only needed fields
});
```

### 12. Memory Leaks

**Detection:**

```javascript
// Monitor memory usage
function logMemoryUsage(label) {
  const used = process.memoryUsage();
  console.log(`${label}:`);
  for (let key in used) {
    console.log(`  ${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

// Test for leaks
async function memoryLeakTest() {
  logMemoryUsage('Start');
  
  for (let i = 0; i < 1000; i++) {
    await client.search(`test ${i}`, { limit: 1 });
    
    if (i % 100 === 0) {
      logMemoryUsage(`After ${i} requests`);
      global.gc && global.gc(); // Force garbage collection if available
    }
  }
  
  logMemoryUsage('End');
}

// Run with: node --expose-gc script.js
```

**Prevention:**

```javascript
// Clear references and caches
class MemoryEfficientClient {
  constructor(config) {
    this.client = new WordPressMCPClient(config);
    this.cache = new Map();
    this.maxCacheSize = 100;
  }

  addToCache(key, value) {
    // Limit cache size
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clearCache() {
    this.cache.clear();
  }

  destroy() {
    this.clearCache();
    this.client = null;
  }
}
```

## Error Messages

### 13. Common Error Reference

```javascript
// Error handling reference
const errorHandlers = {
  'ECONNREFUSED': {
    message: 'Connection refused - Server may be down',
    solution: 'Check if WordPress site is accessible'
  },
  'ENOTFOUND': {
    message: 'Domain not found',
    solution: 'Verify the domain name is correct'
  },
  'ETIMEDOUT': {
    message: 'Connection timeout',
    solution: 'Increase timeout or check network connection'
  },
  '404': {
    message: 'Endpoint not found',
    solution: 'Check if LLM Ready plugin is activated'
  },
  '429': {
    message: 'Rate limit exceeded',
    solution: 'Implement rate limiting or wait before retrying'
  },
  '500': {
    message: 'Internal server error',
    solution: 'Check WordPress error logs'
  },
  '503': {
    message: 'Service unavailable',
    solution: 'Server may be overloaded, try again later'
  }
};

// Error handler implementation
async function handleRequest(operation) {
  try {
    return await operation();
  } catch (error) {
    const code = error.code || error.statusCode?.toString();
    const handler = errorHandlers[code];
    
    if (handler) {
      console.error(`Error: ${handler.message}`);
      console.log(`Solution: ${handler.solution}`);
    } else {
      console.error('Unexpected error:', error.message);
    }
    
    throw error;
  }
}
```

## Debugging Techniques

### 14. Enable Debug Logging

```javascript
// Debug wrapper for client
class DebugClient {
  constructor(config) {
    this.client = new WordPressMCPClient(config);
    this.debug = true;
  }

  log(...args) {
    if (this.debug) {
      console.log('[MCP Debug]', ...args);
    }
  }

  async request(method, ...args) {
    const start = Date.now();
    this.log(`${method} request started`, args);

    try {
      const result = await this.client[method](...args);
      const duration = Date.now() - start;
      this.log(`${method} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.log(`${method} failed after ${duration}ms:`, error.message);
      throw error;
    }
  }

  async search(query, options) {
    return this.request('search', query, options);
  }

  async business() {
    return this.request('business');
  }
}

// Usage
const debug = new DebugClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
});

await debug.search('test');
```

### 15. Network Request Inspection

```javascript
// Intercept and log HTTP requests
import fetch from 'node-fetch';

class InspectableClient extends WordPressMCPClient {
  async fetch(url, options = {}) {
    console.log('Request:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body
    });

    const response = await fetch(url, options);
    
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers.raw()
    });

    if (!response.ok) {
      const text = await response.text();
      console.log('Error body:', text);
    }

    return response;
  }
}
```

### 16. Testing Connectivity

```javascript
// Comprehensive connectivity test
async function testConnectivity(baseUrl) {
  const tests = [
    {
      name: 'Base URL accessible',
      test: async () => {
        const response = await fetch(baseUrl.replace('/wp-json/llmr/mcp/v1', ''));
        return response.ok;
      }
    },
    {
      name: 'REST API enabled',
      test: async () => {
        const response = await fetch(baseUrl.replace('/llmr/mcp/v1', ''));
        return response.ok;
      }
    },
    {
      name: 'MCP endpoints available',
      test: async () => {
        const response = await fetch(`${baseUrl}/discovery`);
        return response.ok;
      }
    },
    {
      name: 'Search capability',
      test: async () => {
        const response = await fetch(`${baseUrl}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: 'test' })
        });
        return response.ok;
      }
    }
  ];

  console.log(`Testing connectivity to ${baseUrl}\n`);

  for (const { name, test } of tests) {
    try {
      const passed = await test();
      console.log(`✓ ${name}: ${passed ? 'PASS' : 'FAIL'}`);
    } catch (error) {
      console.log(`✗ ${name}: ERROR - ${error.message}`);
    }
  }
}

// Run test
testConnectivity('https://example.com/wp-json/llmr/mcp/v1');
```

## FAQ

### Q: Why am I getting CORS errors in the browser?

**A:** CORS (Cross-Origin Resource Sharing) errors occur when making requests from a browser to a different domain. Solutions:
1. Configure WordPress to send proper CORS headers
2. Use a proxy server in development
3. Use the client from a Node.js environment instead

### Q: How can I test if the MCP server is working?

**A:** Visit these URLs in your browser:
- `https://your-site.com/wp-json/llmr/mcp/v1/discovery`
- `https://your-site.com/wp-json/llmr/mcp/v1/business`

You should see JSON responses if the server is working correctly.

### Q: What's the difference between 'connection refused' and '404 not found'?

**A:** 
- **Connection refused**: The server/domain is not reachable at all
- **404 not found**: The server is reachable but the MCP endpoints don't exist (plugin not activated)

### Q: How do I know if my requests are being rate limited?

**A:** Rate limited requests return:
- Status code: 429
- Error message mentioning rate limit
- May include `Retry-After` header indicating wait time

### Q: Can I use this client in a React/Vue/Angular app?

**A:** Yes, but be aware of:
1. CORS restrictions (need proper server configuration)
2. Exposing API endpoints publicly
3. Consider using a backend proxy for production

### Q: Why are my search results empty even though I have content?

**A:** Common causes:
1. Content not indexed by LLM Ready plugin
2. WordPress search disabled
3. No published content matching query
4. Plugin needs to reindex content

### Q: How can I improve search performance?

**A:** 
1. Use specific queries instead of broad terms
2. Limit the number of results requested
3. Implement caching for repeated queries
4. Use the multi-site client's parallel search capabilities

### Q: Is there a way to authenticate requests?

**A:** The current MCP implementation uses public endpoints without authentication. For protected content:
1. Implement custom authentication in WordPress
2. Use WordPress application passwords
3. Add API key validation to the plugin

---

For more help, consult the [API Documentation](./API.md) or [Examples](./EXAMPLES.md).