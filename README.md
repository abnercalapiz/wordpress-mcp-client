# WordPress MCP Client

A powerful TypeScript/JavaScript client library for connecting to WordPress sites equipped with the LLM Ready plugin's Model Context Protocol (MCP) server. This library enables AI applications and tools to interact with WordPress content through a standardized protocol.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Manual Configuration](#manual-configuration-for-mcp-clients)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

The WordPress MCP Client provides a seamless way to connect AI tools, language models, and other applications to WordPress sites. It implements the Model Context Protocol (MCP) to enable structured data exchange between AI systems and WordPress content.

### What is MCP?

Model Context Protocol (MCP) is a standardized protocol that allows AI models and tools to interact with external systems in a structured way. The WordPress implementation provides endpoints for:

- Business information retrieval
- Contact details access
- Service/product listings
- Content search functionality
- Site discovery and capabilities

## Features

- 🚀 **Easy Integration** - Simple API for connecting to WordPress MCP endpoints
- 📦 **TypeScript Support** - Full type definitions included
- 🔄 **Multi-Site Management** - Handle multiple WordPress sites efficiently
- ⚡ **Performance Optimized** - Connection pooling and request optimization
- 🛡️ **Error Handling** - Comprehensive error types and handling
- 🔍 **Smart Search** - Advanced content search capabilities
- 📊 **Batch Operations** - Process multiple sites simultaneously
- 🔒 **Rate Limiting** - Built-in rate limit handling
- 🛠️ **Configuration Helper** - CLI tool to generate manual configurations for MCP clients

## Installation

### NPM Package (Library Usage)

```bash
npm install @abnerjezweb/wordpress-mcp-client
```

### Global Installation (CLI Tool)

```bash
# Install globally to use the mcp-site CLI tool
npm install -g @abnerjezweb/wordpress-mcp-client

# Verify installation
mcp-site --version
```

### Development Setup

```bash
# Clone the repository
git clone [repository-url]
cd wordpress-mcp-client

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Quick Start

### Basic Usage

```javascript
import { WordPressMCPClient } from '@abnerjezweb/wordpress-mcp-client';

// Initialize client
const client = new WordPressMCPClient({
  baseUrl: 'https://your-wordpress-site.com/wp-json/llmr/mcp/v1'
});

// Get business information
const business = await client.business();
console.log(business);

// Search content
const results = await client.search('wordpress tips', { limit: 5 });
console.log(results);
```

### Multi-Site Usage

```javascript
import { WordPressMCPMultiSite } from '@abnerjezweb/wordpress-mcp-client';

// Configure multiple sites
const multiSite = new WordPressMCPMultiSite({
  'main': {
    name: 'Main Website',
    url: 'https://mainsite.com',
    tags: ['primary', 'business']
  },
  'blog': {
    name: 'Company Blog',
    url: 'https://blog.company.com',
    tags: ['blog', 'content']
  }
});

// Search across all sites
const allResults = await multiSite.searchAll('product updates');

// Search specific sites by tag
const blogResults = await multiSite.searchByTags(['blog'], 'latest posts');
```

## Manual Configuration for MCP Clients

### 🔧 Built-in MCP Server

The npm package includes a built-in MCP server that both Claude Desktop and Roo Code can use. You'll need to manually configure your MCP client to use this server.

**Supported MCP Clients:**
- ✅ Claude Desktop (Anthropic's desktop app)
- ✅ Roo Code (VS Code extension)
- ✅ Custom MCP clients

### Installation

```bash
npm install -g @abnerjezweb/wordpress-mcp-client
```

### Manual Configuration Steps

#### 1. Generate Configuration

Use the CLI helper to generate the correct configuration:

```bash
# Generate config for Claude Desktop
mcp-site generate https://yoursite.com --name "My Site" --client claude

# Generate config for Roo Code
mcp-site generate https://yoursite.com --name "My Site" --client roo

# Test if the server works
mcp-site test https://yoursite.com
```

#### 2. Add to Your MCP Client

**For Claude Desktop:**

Edit `~/.config/claude/claude_desktop_config.json` (Linux/Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "wordpress-mysite": {
      "command": "node",
      "args": [
        "/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server",
        "https://your-wordpress-site.com"
      ]
    }
  }
}
```

**For Roo Code:**

Add to your VS Code settings.json:

```json
{
  "roo.mcpServers": {
    "wordpress-mysite": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/usr/lib/node_modules/@abnerjezweb/wordpress-mcp-client/bin/wordpress-mcp-server",
        "https://your-wordpress-site.com"
      ],
      "name": "My WordPress Site"
    }
  }
}
```

#### 3. Show Configuration Examples

```bash
# Show all configuration examples
mcp-site show-config

# Show specific client configuration
mcp-site show-config claude
mcp-site show-config roo
```

See [Manual Setup Guide](./docs/MANUAL_SETUP.md) for detailed instructions.

### 🤖 Using Your WordPress Site in AI Assistants

Once you've added your WordPress site, restart your AI assistant (Claude Desktop or VS Code). Then you can use natural language to interact with your site:

#### Natural Language Examples

**Ask about your business:**
- "What services does my WordPress site offer?"
- "Show me the contact information from my website"
- "What's the business description on my site?"

**Search your content:**
- "Search my WordPress site for articles about SEO"
- "Find all blog posts about WordPress security"
- "What content do I have about web design?"

**Get specific information:**
- "What are the business hours listed on my site?"
- "Show me all the services with their prices"
- "What's the main phone number on my website?"

#### How the MCP Endpoints Work

Your WordPress site provides these information endpoints:

1. **Discovery** (`/discovery`) - Shows what information is available
   - Ask: "What information can I get from my WordPress site?"

2. **Business** (`/business`) - Your business details
   - Ask: "Tell me about the business on my website"
   - Returns: Company name, description, mission, values

3. **Contact** (`/contact`) - Contact information
   - Ask: "What's the contact info on my site?"
   - Returns: Email, phone, address, social media, hours

4. **Services** (`/services`) - Products or services you offer
   - Ask: "What services are listed on my website?"
   - Returns: Service names, descriptions, prices

5. **Search** (`/search`) - Search your content
   - Ask: "Search for [topic] on my website"
   - Returns: Matching pages, posts, and content


## Documentation

### Setup Guides

- [Manual Setup Guide](./docs/MANUAL_SETUP.md) - **NEW!** Detailed manual configuration instructions
- [MCP Client Setup Guide](./MCP_CLIENT_SETUP_GUIDE.md) - Setup instructions for various MCP clients
- [Roo Code Setup Guide](./docs/ROO_CODE_SETUP.md) - Specific guide for VS Code Roo Code extension
- [MCP Server Documentation](./docs/MCP_SERVER.md) - Built-in MCP server details
- [API Documentation](./docs/API.md) - Complete API reference
- [Examples](./docs/EXAMPLES.md) - Code examples and use cases
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

### WordPress Plugin Requirements

This client requires the WordPress site to have the **LLM Ready** plugin installed and activated. The plugin provides:

1. MCP server endpoints at `/wp-json/llmr/mcp/v1/`
2. Automatic content indexing
3. SEO plugin integration
4. Rate limiting and security features

## API Reference

### WordPressMCPClient

The main client class for single WordPress site connections.

#### Constructor

```typescript
new WordPressMCPClient(config: WordPressMCPConfig)
```

**Parameters:**
- `config.baseUrl` (string) - The base URL of the WordPress MCP endpoint
- `config.timeout` (number, optional) - Request timeout in milliseconds (default: 30000)
- `config.retries` (number, optional) - Number of retry attempts (default: 3)

#### Methods

##### `discovery(): Promise<DiscoveryResponse>`
Get available endpoints and capabilities.

##### `business(): Promise<BusinessInfo>`
Retrieve business information including name, description, and details.

##### `contact(): Promise<ContactInfo>`
Get contact information including address, phone, email, and social media.

##### `services(): Promise<Service[]>`
List all services or products offered.

##### `search(query: string, options?: SearchOptions): Promise<SearchResult[]>`
Search WordPress content.

**Parameters:**
- `query` (string) - The search query
- `options.limit` (number, optional) - Maximum results to return
- `options.type` (string, optional) - Content type filter

### WordPressMCPMultiSite

Manages multiple WordPress sites with MCP endpoints.

#### Constructor

```typescript
new WordPressMCPMultiSite(sites: Record<string, SiteConfig>)
```

#### Methods

##### `addSite(id: string, config: SiteConfig): void`
Add a new site to the manager.

##### `removeSite(id: string): void`
Remove a site from the manager.

##### `searchAll(query: string, options?: SearchOptions): Promise<MultiSiteResults>`
Search across all configured sites.

##### `searchByTags(tags: string[], query: string, options?: SearchOptions): Promise<MultiSiteResults>`
Search only sites with specific tags.

##### `getSitesByTag(tag: string): Site[]`
Get all sites that have a specific tag.

## Examples

### Error Handling

```javascript
import { WordPressMCPClient, WordPressMCPError } from '@abnerjezweb/wordpress-mcp-client';

const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1'
});

try {
  const results = await client.search('content');
} catch (error) {
  if (error instanceof WordPressMCPError) {
    console.error('MCP Error:', error.message);
    console.error('Status:', error.statusCode);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Custom Configuration

```javascript
const client = new WordPressMCPClient({
  baseUrl: 'https://example.com/wp-json/llmr/mcp/v1',
  timeout: 60000, // 60 seconds
  retries: 5
});
```

### Batch Processing

```javascript
const multiSite = new WordPressMCPMultiSite(sites);

// Process results from multiple sites
const results = await multiSite.searchAll('wordpress security');

for (const [siteId, siteResults] of Object.entries(results)) {
  console.log(`Results from ${siteId}:`);
  siteResults.forEach(result => {
    console.log(`- ${result.title}: ${result.url}`);
  });
}
```

## Development

### Project Structure

```
wordpress-mcp-client/
├── src/               # TypeScript source files
│   ├── client.ts      # Main client implementation
│   ├── multi-site.ts  # Multi-site manager
│   ├── types.ts       # TypeScript type definitions
│   └── errors.ts      # Error classes
├── lib/               # Compiled JavaScript
├── docs/              # Documentation
├── examples/          # Example implementations
└── tests/             # Test files
```

### Building

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Watch mode
npm run watch
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- **Documentation**: See the `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/abnercalapiz/wordpress-mcp-client/issues)

## Acknowledgments

- Built for the WordPress LLM Ready plugin
- Implements the Model Context Protocol (MCP) standard
- Inspired by the need for AI-WordPress integration

---

**Version**: 1.0.10  
**Author**: Jezweb  
**Website**: [https://www.jezweb.com.au/](https://www.jezweb.com.au/)

## What's New in v1.0.10

- 🔧 **Manual Configuration Only** - Removed auto-add functionality for better reliability and user control
- 📝 **Improved Documentation** - Cleaner examples using only working configurations
- 🗑️ **Removed Outdated Code** - Cleaned up references to non-existent packages
- ✨ **CLI Helper Tools** - Generate, test, and show configuration examples

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed list of changes.