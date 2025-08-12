#!/usr/bin/env node
/**
 * MCP Server Command
 * Entry point for serving WordPress MCP sites
 */

const path = require('path');
const { spawn } = require('child_process');

// Get the site URL from command line
const siteUrl = process.argv[2];

if (!siteUrl) {
  console.error('Usage: mcp-serve <site-url>');
  console.error('Example: mcp-serve https://example.com');
  process.exit(1);
}

// Path to the actual server
const serverPath = path.join(__dirname, '..', 'bin', 'wordpress-mcp-server');

// Spawn the server with the site URL
const server = spawn('node', [serverPath, siteUrl], {
  stdio: 'inherit'
});

// Handle exit
server.on('exit', (code) => {
  process.exit(code);
});