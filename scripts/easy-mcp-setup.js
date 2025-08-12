#!/usr/bin/env node
/**
 * Easy MCP Setup for Claude Desktop
 * Simple script to add WordPress sites to Claude Desktop
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const SITE_URL = process.argv[2];
const SITE_NAME = process.argv[3] || 'WordPress Site';

if (!SITE_URL) {
  console.log('Usage: node easy-mcp-setup.js <site-url> [site-name]');
  console.log('Example: node easy-mcp-setup.js https://mysite.com "My Site"');
  process.exit(1);
}

// Claude Desktop config path
const configPath = path.join(os.homedir(), '.config', 'claude', 'claude_desktop_config.json');

// Read existing config
let config = {};
try {
  const content = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(content);
} catch (error) {
  console.log('Creating new Claude Desktop configuration...');
}

// Initialize mcpServers if not exists
if (!config.mcpServers) {
  config.mcpServers = {};
}

// Generate site ID from URL
const siteId = SITE_URL
  .replace(/https?:\/\//, '')
  .replace(/[^a-zA-Z0-9]/g, '-')
  .toLowerCase();

// Path to the MCP server script
const serverPath = path.join(__dirname, 'wordpress-mcp-server.js');

// Add the site configuration
config.mcpServers[siteId] = {
  command: 'node',
  args: [serverPath, SITE_URL]
};

// Create config directory if it doesn't exist
const configDir = path.dirname(configPath);
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Write the updated config
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log(`✅ Successfully added ${SITE_NAME} to Claude Desktop!`);
console.log(`   Site ID: ${siteId}`);
console.log(`   Site URL: ${SITE_URL}`);
console.log('');
console.log('📝 Next steps:');
console.log('   1. Restart Claude Desktop');
console.log('   2. You can now ask Claude about your WordPress site:');
console.log(`      - "What services does ${SITE_NAME} offer?"`);
console.log(`      - "Search ${SITE_NAME} for articles about [topic]"`);
console.log(`      - "What's the contact information for ${SITE_NAME}?"`);
console.log('');
console.log('🗑️  To remove this site later, edit:');
console.log(`   ${configPath}`);