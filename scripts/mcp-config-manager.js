#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
// Import from the package root - this works for both local dev and npm installs
const { WordPressMCPClient } = require('../');

/**
 * MCP Configuration Manager
 * Automatically adds WordPress sites to various MCP client configurations
 */
class MCPConfigManager {
  constructor() {
    this.configPaths = this.getConfigPaths();
    this.supportedClients = ['claude', 'roo', 'custom'];
  }

  /**
   * Get configuration file paths for different MCP clients
   */
  getConfigPaths() {
    const homeDir = os.homedir();
    const platform = os.platform();

    const paths = {
      claude: {
        darwin: path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
        win32: path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json'),
        linux: path.join(homeDir, '.config', 'claude', 'claude_desktop_config.json')
      },
      roo: {
        // Roo Code stores configs in VS Code settings
        darwin: path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'settings.json'),
        win32: path.join(process.env.APPDATA || '', 'Code', 'User', 'settings.json'),
        linux: path.join(homeDir, '.config', 'Code', 'User', 'settings.json')
      }
    };

    return paths;
  }

  /**
   * Get the config path for a specific client
   */
  getClientConfigPath(client) {
    const platform = os.platform();
    const clientPaths = this.configPaths[client];
    
    if (!clientPaths) {
      throw new Error(`Unsupported client: ${client}`);
    }

    return clientPaths[platform] || clientPaths.linux;
  }

  /**
   * Validate WordPress site has MCP endpoints
   */
  async validateSite(url) {
    try {
      console.log(`Validating WordPress site: ${url}`);
      
      const client = new WordPressMCPClient({
        baseUrl: `${url}/wp-json/llmr/mcp/v1`,
        timeout: 10000
      });

      const discovery = await client.discovery();
      const business = await client.business();

      return {
        valid: true,
        name: business.data?.name || discovery.data?.name || 'WordPress Site',
        endpoints: discovery.data?.endpoints || {},
        capabilities: discovery.data?.capabilities || {}
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Read existing configuration
   */
  readConfig(configPath) {
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn(`Could not read config at ${configPath}: ${error.message}`);
    }
    return null;
  }

  /**
   * Write configuration
   */
  writeConfig(configPath, config) {
    try {
      // Ensure directory exists
      const dir = path.dirname(configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write with pretty formatting
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      return true;
    } catch (error) {
      console.error(`Failed to write config: ${error.message}`);
      return false;
    }
  }

  /**
   * Add site to Claude Desktop configuration
   */
  addToClaudeDesktop(siteId, siteUrl, siteName) {
    const configPath = this.getClientConfigPath('claude');
    let config = this.readConfig(configPath) || { mcpServers: {} };

    // Ensure mcpServers exists
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Add the new site
    config.mcpServers[`wordpress-${siteId}`] = {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-fetch@latest"],
      env: {
        FETCH_CONFIG: JSON.stringify({
          [siteId]: {
            baseUrl: `${siteUrl}/wp-json/llmr/mcp/v1`,
            endpoints: {
              discovery: "/discovery",
              business: "/business",
              contact: "/contact",
              services: "/services",
              search: {
                path: "/search",
                method: "POST"
              }
            }
          }
        })
      }
    };

    return this.writeConfig(configPath, config);
  }

  /**
   * Add site to Roo Code configuration
   */
  addToRooCode(siteId, siteUrl, siteName) {
    const configPath = this.getClientConfigPath('roo');
    let config = this.readConfig(configPath) || {};

    // Initialize Roo MCP settings if not exists
    if (!config['roo.mcpServers']) {
      config['roo.mcpServers'] = {};
    }

    // Add the new site
    config['roo.mcpServers'][`wordpress-${siteId}`] = {
      type: "http",
      config: {
        baseUrl: `${siteUrl}/wp-json/llmr/mcp/v1`,
        name: siteName,
        endpoints: {
          discovery: { path: "/discovery", method: "GET" },
          business: { path: "/business", method: "GET" },
          contact: { path: "/contact", method: "GET" },
          services: { path: "/services", method: "GET" },
          search: { 
            path: "/search", 
            method: "POST",
            headers: { "Content-Type": "application/json" }
          }
        }
      }
    };

    return this.writeConfig(configPath, config);
  }

  /**
   * Add site to custom configuration file
   */
  addToCustomConfig(siteId, siteUrl, siteName, customPath) {
    let config = this.readConfig(customPath) || { sites: {} };

    // Add the new site
    config.sites[siteId] = {
      name: siteName,
      url: siteUrl,
      baseUrl: `${siteUrl}/wp-json/llmr/mcp/v1`,
      addedAt: new Date().toISOString()
    };

    return this.writeConfig(customPath, config);
  }

  /**
   * Generate a site ID from URL
   */
  generateSiteId(url) {
    return url
      .replace(/https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase()
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Add site to specified clients
   */
  async addSite(url, options = {}) {
    const {
      clients = ['claude'],
      siteId = null,
      siteName = null,
      skipValidation = false,
      customPath = null
    } = options;

    // Normalize URL
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    // Validate site
    let siteInfo = { valid: true, name: siteName || 'WordPress Site' };
    
    if (!skipValidation) {
      siteInfo = await this.validateSite(url);
      if (!siteInfo.valid) {
        throw new Error(`Site validation failed: ${siteInfo.error}`);
      }
    }

    // Generate site ID if not provided
    const finalSiteId = siteId || this.generateSiteId(url);
    const finalSiteName = siteName || siteInfo.name;

    console.log(`\nAdding site: ${finalSiteName}`);
    console.log(`URL: ${url}`);
    console.log(`ID: ${finalSiteId}`);

    const results = {};

    // Add to each specified client
    for (const client of clients) {
      try {
        let success = false;

        switch (client) {
          case 'claude':
            success = this.addToClaudeDesktop(finalSiteId, url, finalSiteName);
            break;
          case 'roo':
            success = this.addToRooCode(finalSiteId, url, finalSiteName);
            break;
          case 'custom':
            if (!customPath) {
              throw new Error('Custom path required for custom client');
            }
            success = this.addToCustomConfig(finalSiteId, url, finalSiteName, customPath);
            break;
          default:
            throw new Error(`Unsupported client: ${client}`);
        }

        results[client] = { success, path: client === 'custom' ? customPath : this.getClientConfigPath(client) };
        console.log(`✓ Added to ${client}`);
      } catch (error) {
        results[client] = { success: false, error: error.message };
        console.error(`✗ Failed to add to ${client}: ${error.message}`);
      }
    }

    return {
      siteId: finalSiteId,
      siteName: finalSiteName,
      url,
      results
    };
  }

  /**
   * List all configured sites
   */
  listSites(client) {
    try {
      const configPath = this.getClientConfigPath(client);
      const config = this.readConfig(configPath);

      if (!config) {
        return [];
      }

      const sites = [];

      if (client === 'claude' && config.mcpServers) {
        Object.entries(config.mcpServers).forEach(([key, value]) => {
          if (key.startsWith('wordpress-')) {
            const fetchConfig = JSON.parse(value.env.FETCH_CONFIG);
            const siteConfig = Object.values(fetchConfig)[0];
            sites.push({
              id: key.replace('wordpress-', ''),
              url: siteConfig.baseUrl.replace('/wp-json/llmr/mcp/v1', ''),
              key
            });
          }
        });
      } else if (client === 'roo' && config['roo.mcpServers']) {
        Object.entries(config['roo.mcpServers']).forEach(([key, value]) => {
          if (key.startsWith('wordpress-')) {
            sites.push({
              id: key.replace('wordpress-', ''),
              name: value.config.name,
              url: value.config.baseUrl.replace('/wp-json/llmr/mcp/v1', ''),
              key
            });
          }
        });
      }

      return sites;
    } catch (error) {
      console.error(`Failed to list sites: ${error.message}`);
      return [];
    }
  }

  /**
   * Remove site from configuration
   */
  removeSite(siteId, client) {
    try {
      const configPath = this.getClientConfigPath(client);
      const config = this.readConfig(configPath);

      if (!config) {
        return false;
      }

      const key = `wordpress-${siteId}`;
      
      if (client === 'claude' && config.mcpServers && config.mcpServers[key]) {
        delete config.mcpServers[key];
        return this.writeConfig(configPath, config);
      } else if (client === 'roo' && config['roo.mcpServers'] && config['roo.mcpServers'][key]) {
        delete config['roo.mcpServers'][key];
        return this.writeConfig(configPath, config);
      }

      return false;
    } catch (error) {
      console.error(`Failed to remove site: ${error.message}`);
      return false;
    }
  }
}

module.exports = MCPConfigManager;