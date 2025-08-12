# WordPress MCP Client Setup Guide

This guide provides step-by-step instructions for connecting to a WordPress MCP server from various MCP clients including Claude Desktop, Roo Code, and other MCP-compatible tools.

## Prerequisites

1. A WordPress site with the LLM Ready plugin installed and activated
2. The MCP endpoints should be accessible at: `https://your-site.com/wp-json/llmr/mcp/v1/`
3. An MCP client (Claude Desktop, Roo Code, etc.)

## Available Endpoints

Your WordPress MCP server provides these endpoints:
- `/discovery` - Lists all available endpoints and capabilities
- `/business` - Returns business information
- `/contact` - Provides contact details  
- `/services` - Lists services/products
- `/search` - Allows content search (requires POST method)

## Setup Instructions by Client

### 1. Claude Desktop Setup

#### Step 1: Locate Claude Desktop Config
Find your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

#### Step 2: Add WordPress MCP Configuration
Edit the config file and add your WordPress site:

```json
{
  "mcpServers": {
    "wordpress-site": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch@latest"],
      "env": {
        "FETCH_CONFIG": JSON.stringify({
          "wordpress": {
            "baseUrl": "https://your-domain.com/wp-json/llmr/mcp/v1",
            "endpoints": {
              "discovery": "/discovery",
              "business": "/business",
              "contact": "/contact",
              "services": "/services",
              "search": {
                "path": "/search",
                "method": "POST"
              }
            }
          }
        })
      }
    }
  }
}
```

#### Step 3: Restart Claude Desktop
Close and reopen Claude Desktop for the changes to take effect.

### 2. Roo Code Setup

#### Step 1: Open Roo Code Settings
1. Open VS Code with Roo Code extension
2. Press `Ctrl/Cmd + Shift + P` to open command palette
3. Search for "Roo Code: Configure MCP Servers"

#### Step 2: Add WordPress MCP Configuration
Add this configuration to your Roo Code MCP settings:

```json
{
  "wordpress-mcp": {
    "type": "http",
    "config": {
      "baseUrl": "https://your-domain.com/wp-json/llmr/mcp/v1",
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
          }
        }
      }
    }
  }
}
```

### 3. Generic MCP Client Setup

For other MCP clients, use this generic configuration format:

```json
{
  "name": "WordPress LLM Ready MCP Server",
  "version": "1.0.2",
  "type": "http",
  "config": {
    "baseUrl": "https://your-domain.com/wp-json/llmr/mcp/v1",
    "endpoints": {
      "discovery": {
        "path": "/discovery",
        "method": "GET",
        "description": "Get available endpoints and capabilities"
      },
      "business": {
        "path": "/business",
        "method": "GET",
        "description": "Get business information"
      },
      "contact": {
        "path": "/contact",
        "method": "GET",
        "description": "Get contact details"
      },
      "services": {
        "path": "/services",
        "method": "GET",
        "description": "Get services/products list"
      },
      "search": {
        "path": "/search",
        "method": "POST",
        "description": "Search content",
        "schema": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "Search query"
            },
            "limit": {
              "type": "number",
              "description": "Number of results",
              "default": 10
            }
          },
          "required": ["query"]
        }
      }
    },
    "authentication": {
      "type": "none",
      "description": "No authentication required - public endpoints"
    },
    "rateLimits": {
      "perMinute": 60,
      "perHour": 1000
    }
  }
}
```

### 4. Using the NPM Client Package

If you want to use the WordPress MCP client programmatically:

#### Step 1: Install the Package
```bash
npm install @abnerjezweb/wordpress-mcp-client
```

#### Step 2: Use in Your Code
```javascript
// For single site
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

const client = new WordPressMCPClient({
  baseUrl: 'https://your-domain.com/wp-json/llmr/mcp/v1'
});

// Example usage
async function getBusinessInfo() {
  try {
    const business = await client.business();
    console.log(business);
    
    const searchResults = await client.search('your search query');
    console.log(searchResults);
  } catch (error) {
    console.error('Error:', error);
  }
}

// For multiple sites
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';

const multiSite = new WordPressMCPMultiSite({
  'site1': {
    name: 'Main Site',
    url: 'https://mainsite.com',
    tags: ['main']
  },
  'site2': {
    name: 'Blog',
    url: 'https://blog.com',
    tags: ['blog']
  }
});

const allResults = await multiSite.searchAll('wordpress tips');
```

## Testing Your Connection

### 1. Test Endpoints Manually
You can test the endpoints directly in your browser:
- `https://your-domain.com/wp-json/llmr/mcp/v1/discovery`
- `https://your-domain.com/wp-json/llmr/mcp/v1/business`

### 2. Test Search Endpoint
Use curl or a REST client to test the search endpoint:
```bash
curl -X POST https://your-domain.com/wp-json/llmr/mcp/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test search"}'
```

### 3. Verify in Your MCP Client
After configuration:
- **Claude Desktop**: Ask Claude about your WordPress site
- **Roo Code**: Use the MCP tools panel to query your site
- **Other clients**: Follow their specific testing procedures

## Common Issues and Solutions

### Issue 1: Connection Refused
- Check if the WordPress site is accessible
- Verify the LLM Ready plugin is activated
- Ensure the URL includes `/wp-json/llmr/mcp/v1`

### Issue 2: 404 Not Found
- Make sure WordPress permalinks are enabled
- Check if REST API is not disabled
- Verify the plugin version supports MCP endpoints

### Issue 3: Rate Limiting
- Default limits: 60 requests/minute, 1000/hour
- Implement request throttling in your client
- Consider caching responses when appropriate

### Issue 4: No Results from Search
- Ensure WordPress has indexed content
- Check if search functionality is enabled in WordPress
- Try simpler search queries

## Advanced Configuration

### Multiple WordPress Sites
For managing multiple WordPress sites, create separate configurations for each:

```json
{
  "mcpServers": {
    "wordpress-site-1": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch@latest"],
      "env": {
        "FETCH_CONFIG": JSON.stringify({
          "site1": {
            "baseUrl": "https://site1.com/wp-json/llmr/mcp/v1",
            "endpoints": { /* ... */ }
          }
        })
      }
    },
    "wordpress-site-2": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch@latest"],
      "env": {
        "FETCH_CONFIG": JSON.stringify({
          "site2": {
            "baseUrl": "https://site2.com/wp-json/llmr/mcp/v1",
            "endpoints": { /* ... */ }
          }
        })
      }
    }
  }
}
```

## Support and Resources

- **Plugin Documentation**: Check the LLM Ready plugin documentation
- **MCP Protocol Spec**: https://modelcontextprotocol.io/
- **NPM Package**: https://www.npmjs.com/package/@abnerjezweb/wordpress-mcp-client
- **Issues**: Report issues in the respective GitHub repositories

## Security Notes

1. The MCP endpoints are public by default - no authentication required
2. Rate limiting is enforced to prevent abuse
3. Only read operations are supported - no write/modify operations
4. Consider using HTTPS for all connections
5. Monitor your WordPress access logs for unusual activity

---

Last updated: December 2024