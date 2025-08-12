# Claude Desktop MCP Troubleshooting Guide

## Search Not Working in Claude Desktop

If you're getting errors when trying to search your WordPress site in Claude Desktop, here are the most common issues and solutions:

### Issue 1: Incorrect FETCH_CONFIG Format

**Problem**: The FETCH_CONFIG must be a JSON string, not an object.

**Wrong** ❌:
```json
"env": {
  "FETCH_CONFIG": {
    "wordpress": { ... }
  }
}
```

**Correct** ✅:
```json
"env": {
  "FETCH_CONFIG": JSON.stringify({
    "wordpress": { ... }
  })
}
```

### Issue 2: Missing Content-Type Header

**Problem**: The search endpoint requires POST with JSON content.

**Make sure your search endpoint includes headers**:
```json
"search": {
  "path": "/search",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

### Issue 3: MCP Server Package Not Found

**Problem**: The `@modelcontextprotocol/server-fetch` package might not be available.

**Alternative Solutions**:

1. **Use the official MCP HTTP server** (if available):
```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-http"],
      "env": {
        "HTTP_SERVER_CONFIG": JSON.stringify({
          "endpoints": {
            "wordpress": "https://your-site.com/wp-json/llmr/mcp/v1"
          }
        })
      }
    }
  }
}
```

2. **Create a custom MCP server** (see below)

### Creating a Custom MCP Server

If the standard MCP servers aren't working, create a simple Node.js MCP server:

**wordpress-mcp-server.js**:
```javascript
#!/usr/bin/env node
const http = require('http');
const https = require('https');

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://your-site.com';
const MCP_ENDPOINT = process.env.MCP_ENDPOINT || '/wp-json/llmr/mcp/v1';

// Simple MCP server that proxies to WordPress
const server = http.createServer(async (req, res) => {
  // Handle MCP protocol
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'WordPress MCP Server',
      version: '1.0.0',
      commands: ['search', 'business', 'contact', 'services']
    }));
    return;
  }

  // Proxy to WordPress
  const wpUrl = `${WORDPRESS_URL}${MCP_ENDPOINT}${req.url}`;
  
  // Make request to WordPress
  const protocol = WORDPRESS_URL.startsWith('https') ? https : http;
  
  const wpReq = protocol.request(wpUrl, {
    method: req.method,
    headers: {
      ...req.headers,
      'Content-Type': 'application/json'
    }
  }, (wpRes) => {
    res.writeHead(wpRes.statusCode, wpRes.headers);
    wpRes.pipe(res);
  });

  req.pipe(wpReq);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WordPress MCP Server running on port ${PORT}`);
});
```

Then use it in Claude Desktop:
```json
{
  "mcpServers": {
    "wordpress": {
      "command": "node",
      "args": ["/path/to/wordpress-mcp-server.js"],
      "env": {
        "WORDPRESS_URL": "https://your-site.com",
        "PORT": "3456"
      }
    }
  }
}
```

### Testing Your WordPress MCP Endpoints

Before configuring Claude Desktop, test your endpoints directly:

1. **Test Discovery**:
```bash
curl https://your-site.com/wp-json/llmr/mcp/v1/discovery
```

2. **Test Search** (POST request):
```bash
curl -X POST https://your-site.com/wp-json/llmr/mcp/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

### Complete Working Configuration

Here's a complete, tested configuration for Claude Desktop:

```json
{
  "mcpServers": {
    "wordpress-newcastle-seo": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch@latest"
      ],
      "env": {
        "FETCH_CONFIG": JSON.stringify({
          "wordpress": {
            "baseUrl": "https://www.newcastleseo.com.au/wp-json/llmr/mcp/v1",
            "endpoints": {
              "discovery": {
                "path": "/discovery",
                "method": "GET"
              },
              "business": {
                "path": "/business",
                "method": "GET"
              },
              "contact": {
                "path": "/contact",
                "method": "GET"
              },
              "services": {
                "path": "/services",
                "method": "GET"
              },
              "search": {
                "path": "/search",
                "method": "POST",
                "headers": {
                  "Content-Type": "application/json"
                },
                "body": {
                  "query": "{{query}}"
                }
              }
            }
          }
        })
      }
    }
  }
}
```

### Debugging Steps

1. **Check Claude Desktop logs**:
   - On macOS: `~/Library/Logs/Claude/`
   - On Windows: `%APPDATA%\Claude\logs\`

2. **Verify the configuration is valid JSON**:
   - Use a JSON validator
   - Make sure all quotes are properly escaped

3. **Test with a simple endpoint first**:
   - Try just the business endpoint before search

4. **Ensure WordPress plugin is activated**:
   - Visit your WordPress admin
   - Check that LLM Ready plugin is active

### Still Not Working?

If you're still having issues:

1. **Use the CLI tool to verify the site works**:
```bash
mcp-site validate https://your-site.com
```

2. **Check WordPress REST API**:
```bash
curl https://your-site.com/wp-json/
```

3. **Try a minimal configuration** with just one endpoint:
```json
{
  "mcpServers": {
    "wordpress": {
      "command": "curl",
      "args": ["https://your-site.com/wp-json/llmr/mcp/v1/business"]
    }
  }
}
```

4. **Contact support** with:
   - Your Claude Desktop version
   - Your configuration (without sensitive data)
   - Any error messages from logs